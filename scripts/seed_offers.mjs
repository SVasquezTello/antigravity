import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seed() {
  console.log('🌟 Seeding Offers...')

  const offers = [
    {
      name: 'Professional',
      slug: 'professional',
      type: 'client_plan'
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      type: 'client_plan'
    }
  ]

  for (const offer of offers) {
    const { error } = await supabase.from('offers').upsert(offer, { onConflict: 'slug' })
    if (error) console.error(`Error seeding ${offer.slug}:`, error.message)
    else console.log(`✅ Offer ${offer.slug} seeded.`)
  }
}

seed()
