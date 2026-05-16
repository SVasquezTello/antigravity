import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const { userId, planSlug } = session.metadata

    console.log(`💰 Pago exitoso de ${userId} para el plan ${planSlug}`)

    // 1. Get plan_id from slug
    const { data: offer } = await supabaseAdmin
      .from('offers')
      .select('id, name')
      .eq('slug', planSlug)
      .single()

    if (offer) {
      // 2. Get user current workspace
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('workspace_id')
        .eq('id', userId)
        .single()

      if (userData?.workspace_id) {
        // 3. Update or Insert User Status
        await supabaseAdmin
          .from('user_status')
          .upsert({
            user_id: userId,
            workspace_id: userData.workspace_id,
            current_plan_id: offer.id,
            status: 'active',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

        // 4. Record Subscription
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            workspace_id: userData.workspace_id,
            user_id: userId,
            offer_id: offer.id,
            status: 'active',
            external_subscription_id: session.subscription || session.id,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      // 3. Get user details to send email
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, first_name')
        .eq('id', userId)
        .single()

      if (user) {
        // 4. Send Welcome Email
        await sendWelcomeEmail({
          to: user.email,
          firstName: user.first_name || 'Emprendedor',
          planName: offer.name,
          loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login`
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
