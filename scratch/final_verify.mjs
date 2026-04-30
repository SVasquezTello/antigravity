import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function finalVerify() {
  console.log('--- FINAL SYSTEM VERIFICATION ---')
  
  const { data: { user } } = await supabase.auth.admin.listUsers()
  const testUser = user ? user[0] : null

  if (testUser) {
    console.log(`Testing with user: ${testUser.email}`)
    const { data, error } = await supabase.rpc('get_user_notifications', { p_user_id: testUser.id })
    if (error) {
      console.log('❌ Notifications RPC Error:', error.message)
    } else {
      console.log('✅ Notifications RPC: OK (Returned ' + (data?.length || 0) + ' items)')
    }
  } else {
    console.log('⚠️ No users found to test RPC.')
  }

  // Check Tables again
  const tables = ['offers', 'workspaces', 'subscriptions', 'notifications', 'broadcasts']
  for (const table of tables) {
     const { error } = await supabase.from(table).select('count', { count: 'exact', head: true })
     console.log(`${table.toUpperCase()} Table:`, error ? `❌ Error: ${error.message}` : '✅ OK')
  }
}

finalVerify()
