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
    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('id, name')
      .eq('slug', planSlug)
      .single()

    if (plan) {
      // 2. Update user plan
      await supabaseAdmin
        .from('users')
        .update({
          plan_id: plan.id,
          plan_assigned_at: new Date().toISOString(),
          plan_source: 'stripe_payment'
        })
        .eq('id', userId)

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
          planName: plan.name,
          loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login`
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
