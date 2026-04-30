import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { planSlug, currency = 'usd' } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
    }

    // Prepare metadata to identify the user after payment
    const metadata = {
      userId: user.id,
      planSlug: planSlug,
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Antigravity ${planSlug.toUpperCase()} Plan`,
              description: 'Acceso total al ecosistema de micro-apps para Academias.',
            },
            unit_amount: planSlug === 'enterprise' ? 12700 : 4700, // $127.00 or $47.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Or 'subscription' if you prefer recurring
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/plans?canceled=true`,
      customer_email: user.email,
      metadata: metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
