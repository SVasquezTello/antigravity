import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function bootstrap() {
  console.log('🚀 Bootstrapping Platform Data...')
  
  // 1. Create Default Partner
  const { data: partner, error: pError } = await supabase.from('partners').upsert({
    name: 'Antigravity Hub',
    slug: 'antigravity',
    primary_color: '#7C3AED'
  }, { onConflict: 'slug' }).select('id').single()
  
  if (pError) {
    console.error('Error creating partner:', pError.message)
    return
  }
  
  const partnerId = partner.id
  console.log(`✅ Partner created/updated: ${partnerId}`)
  
  // 2. Create/Get Default Client (Workspace)
  const { data: existingClient } = await supabase.from('clients')
    .select('id')
    .eq('name', 'Main Workspace')
    .eq('partner_id', partnerId)
    .single()

  let clientId
  if (existingClient) {
    clientId = existingClient.id
    await supabase.from('clients').update({
      credits: 1000,
      plan_type: 'professional'
    }).eq('id', clientId)
    console.log(`✅ Client updated: ${clientId}`)
  } else {
    const { data: newClient, error: cError } = await supabase.from('clients').insert({
      name: 'Main Workspace',
      partner_id: partnerId,
      credits: 1000,
      plan_type: 'professional'
    }).select('id').single()
    
    if (cError) {
      console.error('Error creating client:', cError.message)
      return
    }
    clientId = newClient.id
    console.log(`✅ Client created: ${clientId}`)
  }
  console.log(`✅ Client created: ${clientId}`)
  
  // 3. Link Users to Partner and Client
  const { data: users } = await supabase.from('users').select('id, email')
  console.log(`Linking ${users?.length} users...`)
  
  for (const user of (users || [])) {
    const { error: uError } = await supabase.from('users').update({
      partner_id: partnerId,
      client_id: clientId,
      role: user.email === 'gavanzadavid@gmail.com' ? 'admin' : 'user'
    }).eq('id', user.id)
    
    if (uError) {
      console.error(`Error updating user ${user.email}:`, uError.message)
    } else {
      console.log(`✅ Linked ${user.email} to Partner/Client and set role.`)
    }
  }
  
  console.log('\n✅ Bootstrap complete. The app should now load correctly.')
}

bootstrap()
