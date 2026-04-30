/**
 * 29.2 - OPERATION: NUKE ALL
 * Resets the entire platform to a factory-pure state while preserving schema.
 * WARNING: Destructive operation.
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function nukeAll() {
  console.log('🚀 Initiating Platform Reset Protocol...')

  const tables = [
    'audit_logs',
    'system_logs',
    'transactions',
    'app_executions',
    'subscriptions',
    'user_status',
    'team_invites',
    'notifications',
    'client_memberships',
    'clients',
    'partners',
    'users' // Be careful with auth synchronization
  ]

  for (const table of tables) {
    console.log(`🧹 Purging [${table}]...`)
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000') // Trick to delete all
    if (error) console.error(`❌ Error purging ${table}:`, error.message)
  }

  console.log('✨ Platform sanitized. Ready for Fresh Takeoff.')
}

nukeAll()
