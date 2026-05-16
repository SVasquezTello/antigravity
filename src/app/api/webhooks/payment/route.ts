import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

// Helper to generate an 8-character alphanumeric password
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(req: Request) {
  try {
    // Note: Payment processors send webhooks as unauthenticated POSTs.
    // We check the custom header if WEBHOOK_SECRET is set in the environment.
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = req.headers.get('x-webhook-secret')
      if (authHeader !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 })
      }
    }

    const payload = await req.json()
    const { event, customer, plan, source, transaction_id, amount, currency } = payload

    // 1. Validate required fields
    if (!event || !customer?.email || !customer?.first_name || !customer?.last_name || !plan || !source || !transaction_id) {
      return NextResponse.json({ error: 'Missing required fields in payload' }, { status: 400 })
    }

    // 2. Validate plan slug exists
    const { data: planData, error: planError } = await supabaseAdmin
      .from('offers')
      .select('id, slug, name')
      .eq('slug', plan)
      .single()

    if (planError || !planData) {
      // Log as failed
      await supabaseAdmin.from('webhook_logs').insert({
        source,
        event_type: event,
        raw_payload: payload,
        normalized_payload: payload,
        status: 'failed',
        error_message: `Plan slug not found: ${plan}`
      })
      return NextResponse.json({ error: `Plan slug not found: ${plan}` }, { status: 400 })
    }

    const planId = planData.id

    if (event === 'payment.completed') {
      // 3. Check if user exists by email
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single()

      let userId = existingUser?.id
      let isNewUser = false
      let generatedPassword = ''

      if (userId) {
        // 4a. User exists: update plan
        // 4a. User exists: update status
        const { data: userData } = await supabaseAdmin.from('users').select('workspace_id').eq('id', userId).single()
        if (userData?.workspace_id) {
          await supabaseAdmin
            .from('user_status')
            .upsert({
              user_id: userId,
              workspace_id: userData.workspace_id,
              current_plan_id: planId,
              status: 'active',
              updated_at: new Date().toISOString()
            })
          
          await supabaseAdmin.from('subscriptions').insert({
            workspace_id: userData.workspace_id,
            user_id: userId,
            offer_id: planId,
            status: 'active',
            external_subscription_id: transaction_id,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      } else {
        // 4b. User does not exist: create user via auth admin API
        generatedPassword = generatePassword()
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customer.email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            first_name: customer.first_name,
            last_name: customer.last_name
          }
        })

        if (createError || !newUser.user) {
          await supabaseAdmin.from('webhook_logs').insert({
            source,
            event_type: event,
            raw_payload: payload,
            normalized_payload: payload,
            status: 'failed',
            error_message: `Error creating user: ${createError?.message}`
          })
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        userId = newUser.user.id
        isNewUser = true

        // Update the public.users record created by trigger
        // Link user to workspace and update status (workspace will be created by trigger or manual logic)
        // For simplicity in this webhook, we'll try to find or create a workspace
        let workspaceId;
        const { data: existingW } = await supabaseAdmin.from('workspaces').select('id').eq('name', `${customer.first_name}'s Workspace`).single()
        if (existingW) {
          workspaceId = existingW.id
        } else {
          const { data: newW } = await supabaseAdmin.from('workspaces').insert({
            name: `${customer.first_name}'s Workspace`,
            status: 'active'
          }).select('id').single()
          workspaceId = newW?.id
        }

        if (workspaceId) {
          await supabaseAdmin
            .from('users')
            .update({
              workspace_id: workspaceId,
              role: 'client'
            })
            .eq('id', userId)

          await supabaseAdmin
            .from('user_status')
            .upsert({
              user_id: userId,
              workspace_id: workspaceId,
              current_plan_id: planId,
              status: 'active',
              updated_at: new Date().toISOString()
            })
        }
      }

      // 5. Log the transaction in webhook_logs as processed
      await supabaseAdmin.from('webhook_logs').insert({
        source,
        event_type: event,
        raw_payload: payload,
        normalized_payload: payload,
        user_id: userId,
        plan_id: planId,
        status: 'processed'
      })

      // 5.5 Send Welcome Email
      let emailSent = false
      try {
        const { sendWelcomeEmail } = await import('@/lib/email')
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        
        const emailRes = await sendWelcomeEmail({
          to: customer.email,
          firstName: customer.first_name,
          planName: planData.name || planData.slug,
          password: isNewUser ? generatedPassword : undefined,
          loginUrl: siteUrl
        })
        emailSent = emailRes.success
      } catch(e) {
        console.error('Failed to send welcome email:', e)
      }

      // 6. Return success
      return NextResponse.json({
        success: true,
        user_id: userId,
        plan_assigned: plan,
        is_new_user: isNewUser,
        email_sent: emailSent,
        ...(isNewUser && { generated_password: generatedPassword })
      }, { status: 200 })

    } else if (event === 'subscription.cancelled') {
      // 1. Find user by email
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single()

      if (!existingUser) {
        // Log as ignored if user not found
        await supabaseAdmin.from('webhook_logs').insert({
          source,
          event_type: event,
          raw_payload: payload,
          normalized_payload: payload,
          status: 'ignored',
          error_message: 'User not found during cancellation'
        })
        return NextResponse.json({ success: true, message: 'Idempotent ignore: user not found' }, { status: 200 })
      }

      // 2. Clear plan
      // 2. Clear status
      await supabaseAdmin
        .from('user_status')
        .update({
          current_plan_id: null,
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', existingUser.id)

      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', existingUser.id)
        .eq('status', 'active')

      // 3. Log
      await supabaseAdmin.from('webhook_logs').insert({
        source,
        event_type: event,
        raw_payload: payload,
        normalized_payload: payload,
        user_id: existingUser.id,
        status: 'processed'
      })

      // 4. Return success
      return NextResponse.json({
        success: true,
        user_id: existingUser.id,
        plan_removed: true
      }, { status: 200 })
    }

    return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 })

  } catch (err: any) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
