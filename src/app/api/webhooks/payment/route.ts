import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
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
      .from('plans')
      .select('id, slug, name_es')
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
        await supabaseAdmin
          .from('users')
          .update({
            plan_id: planId,
            plan_assigned_at: new Date().toISOString(),
            plan_source: source
          })
          .eq('id', userId)
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
        await supabaseAdmin
          .from('users')
          .update({
            plan_id: planId,
            plan_assigned_at: new Date().toISOString(),
            plan_source: source
          })
          .eq('id', userId)
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
          planName: planData.name_es || planData.slug,
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
      await supabaseAdmin
        .from('users')
        .update({
          plan_id: null,
          plan_assigned_at: new Date().toISOString(),
          plan_source: source
        })
        .eq('id', existingUser.id)

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
