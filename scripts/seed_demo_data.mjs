import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

const USERS = [
  'f5b8cbde-5471-4da5-8e5c-fbbcfdbd4773', // gavanzadavid@gmail.com
  'c27f6987-dbfb-4e5c-bb97-1c2ec5102ad5'  // demo_vl7xc@gmail.com
]

async function run() {
  console.log('📊 Populating Demo Content (Historical Executions)...')

  const { data: apps } = await supabase.from('micro_apps').select('id, slug').limit(20)
  if (!apps) return

  const executions = []
  const now = new Date()

  for (const userId of USERS) {
    console.log(`Generating data for user: ${userId}`)
    
    // Create 45-60 executions per user
    const count = 45 + Math.floor(Math.random() * 15)
    
    for (let i = 0; i < count; i++) {
      const app = apps[Math.floor(Math.random() * apps.length)]
      const date = new Date(now)
      // Spread over last 90 days
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))
      
      executions.push({
        user_id: userId,
        app_id: app.id,
        inputs: { demo: true, seeded: true },
        result: "Demo analysis complete. Seeding high quality content for commercial launch.",
        status: 'completed',
        created_at: date.toISOString()
      })
    }
  }

  const { error } = await supabase.from('app_executions').insert(executions)

  if (error) {
    console.error('Error seeding executions:', error.message)
  } else {
    console.log(`✅ Successfully seeded ${executions.length} historical executions.`)
  }
}

run()
