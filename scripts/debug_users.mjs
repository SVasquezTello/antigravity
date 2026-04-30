import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: users, error } = await supabase.from('users').select('id, email, plan_id, role')
  if (error) {
    console.error('Error fetching users:', error)
    return
  }
  console.log('Users in DB:', JSON.stringify(users, null, 2))
  
  const { data: plans } = await supabase.from('plans').select('id, slug')
  console.log('Plans in DB:', JSON.stringify(plans, null, 2))
}

check()
