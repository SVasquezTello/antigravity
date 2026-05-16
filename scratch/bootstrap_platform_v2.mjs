import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function bootstrap() {
  console.log('🚀 Final Bootstrap...')
  
  // 1. Get or Create Partner
  let partnerId;
  const { data: existingP } = await supabase.from('partners').select('id').eq('slug', 'antigravity').single()
  if (existingP) {
    partnerId = existingP.id
  } else {
    const { data: newP } = await supabase.from('partners').insert({
      name: 'Antigravity Hub',
      slug: 'antigravity',
      primary_color: '#7C3AED'
    }).select('id').single()
    partnerId = newP?.id
  }
  
  if (!partnerId) {
    console.error('Failed to get/create partner')
    return
  }
  
  // 2. Get or Create Workspace
  let workspaceId;
  const { data: existingC } = await supabase.from('workspaces').select('id').eq('name', 'Main Workspace').single()
  if (existingC) {
    workspaceId = existingC.id
  } else {
    const { data: newC } = await supabase.from('workspaces').insert({
      name: 'Main Workspace',
      partner_id: partnerId,
      credits: 1000
    }).select('id').single()
    workspaceId = newC?.id
  }
  
  // 3. Link Users
  const { data: users } = await supabase.from('users').select('id, email')
  for (const user of (users || [])) {
    await supabase.from('users').update({
      partner_id: partnerId,
      workspace_id: workspaceId,
      role: user.email === 'gavanzadavid@gmail.com' ? 'admin' : 'client'
    }).eq('id', user.id)
    console.log(`✅ Linked ${user.email}`)
  }
  
  console.log('DONE')
}

bootstrap()
