import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY non encontrada en .env.local')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2025-01-27-ac', // Using a stable version for 2026
  typescript: true,
})

export const PLAN_PRICES = {
  professional: {
    usd: 'price_pro_usd_id', // Replace with real IDs
    pen: 'price_pro_pen_id'
  },
  enterprise: {
    usd: 'price_ent_usd_id',
    pen: 'price_ent_pen_id'
  }
}
