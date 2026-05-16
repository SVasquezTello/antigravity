import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function sync() {
  console.log('🔄 Sincronizando datos de Planes a Ofertas...')

  try {
    // 1. Migrar Planes -> Ofertas (asegurar que existan todos)
    const { data: plans, error: pError } = await supabase.from('plans').select('*')
    if (pError) throw pError;

    for (const plan of plans || []) {
      const { error: oError } = await supabase.from('offers').upsert({
        slug: plan.slug,
        name: plan.name_es,
        type: 'client_plan',
        description: plan.description_es,
        prices: [{ type: 'monthly', amount: plan.price_monthly, currency: 'USD' }]
      }, { onConflict: 'slug' })
      if (oError) console.error(`Error upserting offer ${plan.slug}:`, oError.message)
    }
    console.log('✅ Ofertas actualizadas con datos de planes antiguos.')

    // 2. Migrar Mapeos (Plan_Apps -> Offer_Apps)
    const { data: offers, error: offError } = await supabase.from('offers').select('id, slug')
    const { data: planApps, error: paError } = await supabase.from('plan_apps').select('app_id, plan_id')
    const { data: oldPlans, error: opError } = await supabase.from('plans').select('id, slug')

    if (offError || paError || opError) throw new Error('Error fetching mapping data');

    const offerMap = Object.fromEntries(offers.map(o => [o.slug, o.id]))
    const planToSlug = Object.fromEntries(oldPlans.map(p => [p.id, p.slug]))

    console.log(`Linking apps to ${offers.length} offers...`)
    
    let count = 0
    for (const pa of planApps || []) {
      const slug = planToSlug[pa.plan_id]
      const offerId = offerMap[slug]
      if (offerId) {
        const { error: linkError } = await supabase.from('offer_apps').upsert({ 
          offer_id: offerId, 
          app_id: pa.app_id 
        }, { onConflict: 'offer_id,app_id' })
        
        if (!linkError) count++
      }
    }
    console.log(`✅ ${count} vínculos de apps migrados a Offer_Apps.`)

    // 3. Vincular al usuario demo a la oferta Enterprise si no tiene status
    const DEMO_USER = 'c27f6987-dbfb-4e5c-bb97-1c2ec5102ad5' // demo_vl7xc@gmail.com
    const { data: entOffer } = await supabase.from('offers').select('id').eq('slug', 'enterprise').single()
    const { data: workspace } = await supabase.from('workspaces').select('id').limit(1).single()

    if (entOffer && workspace) {
      const { error: sError } = await supabase.from('user_status').upsert({
        user_id: DEMO_USER,
        workspace_id: workspace.id,
        current_plan_id: entOffer.id,
        status: 'active'
      })
      if (!sError) console.log('✅ Usuario Demo vinculado a la Oferta Enterprise.')
      else console.error('Error vinculando usuario demo:', sError.message)
    }

  } catch (err) {
    console.error('❌ Error crítico en la sincronización:', err.message)
  }
}

sync()
