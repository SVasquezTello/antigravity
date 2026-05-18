import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUser() {
  const email = 'gavanzadavid@gmail.com'
  console.log(`Checking user: ${email}...`)
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error fetching users:', error)
    return
  }
  
  const targetUser = users.find(u => u.email === email)
  
  if (!targetUser) {
    console.log(`❌ User ${email} does NOT exist in Supabase Auth!`)
    console.log('Total registered users:', users.map(u => u.email))
    return
  }
  
  console.log(`✅ User ${email} EXISTS!`)
  console.log({
    id: targetUser.id,
    email: targetUser.email,
    email_confirmed_at: targetUser.email_confirmed_at,
    last_sign_in_at: targetUser.last_sign_in_at,
    created_at: targetUser.created_at,
    user_metadata: targetUser.user_metadata
  })
  
  if (!targetUser.email_confirmed_at) {
    console.log('⚠️ Email is NOT confirmed! Confirming now...')
    const { data, error: confirmError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true }
    )
    if (confirmError) {
      console.error('Failed to confirm email:', confirmError)
    } else {
      console.log('🎉 Email successfully confirmed manually via Service Role!')
    }
  }
}

checkUser()
