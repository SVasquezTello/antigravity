import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Use service role key if available, otherwise it won't work for admin updates
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function makeAdmin() {
  console.log('--- Antigravity Superuser Script ---')
  
  // 1. Get the first user (usually the developer)
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email, role')
    .order('created_at', { ascending: true })
    .limit(1)

  if (userError || !users || users.length === 0) {
    console.error('Error fetching users. Make sure you have registered at least once in the app.', userError)
    return
  }

  const targetUser = users[0]
  console.log(`Found user: ${targetUser.email} (ID: ${targetUser.id})`)

  // 2. Fetch Professional Plan ID
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('slug', 'professional')
    .single()

  if (planError || !plan) {
    console.error('Error: "professional" plan not found. Run seed-apps.mjs first.', planError)
    return
  }

  // 3. Update user to ADMIN and assign PROFESSIONAL plan
  console.log('Promoting to ADMIN and assigning PROFESSIONAL plan...')
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      role: 'admin',
      plan_id: plan.id,
      plan_assigned_at: new Date().toISOString(),
      plan_source: 'manual_override'
    })
    .eq('id', targetUser.id)

  if (updateError) {
    console.error('Update failed. This might be due to RLS if using ANON KEY. Try using SUPABASE_SERVICE_ROLE_KEY.', updateError)
  } else {
    console.log('SUCCESS! You are now an ADMIN with the PROFESSIONAL plan.')
    console.log('Please refresh your browser and log in again if necessary.')
  }
}

makeAdmin()
