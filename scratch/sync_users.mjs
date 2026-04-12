import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function syncUsers() {
  console.log('Checking Auth Users...')
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Auth Error:', authError)
    return
  }

  console.log(`Found ${users.length} users in Auth.`)

  for (const user of users) {
    console.log(`Checking user: ${user.email} (${user.id})`)
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!publicUser) {
      console.log(`User ${user.email} not in public.users. Inserting...`)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: 'user'
        })
      if (insertError) console.error('Insert Error:', insertError)
      else console.log('Successfully inserted.')
    } else {
      console.log('User already exists in public.users.')
    }
  }
}

syncUsers()
