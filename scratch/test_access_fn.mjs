import { getUserAccessibleApps } from '../src/lib/access.ts'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Mock environment for the lib
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testAccess() {
  const userId = 'f5b8cbde-5471-4da5-8e5c-fbbcfdbd4773'
  console.log(`Testing access for user ${userId}...`)
  
  try {
    const apps = await getUserAccessibleApps(userId)
    console.log(`Found ${apps.length} accessible apps.`)
    if (apps.length > 0) {
      console.log('Sample slugs:', apps.slice(0, 5))
    }
  } catch (err) {
    console.error('Access test failed:', err)
  }
}

testAccess()
