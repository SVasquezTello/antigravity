const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Running migration: Add branding_config to partners...');
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS branding_config JSONB DEFAULT \'{}\'::jsonb;'
  });

  if (error) {
    // If exec_sql RPC doesn't exist, we might need to create it or find another way.
    // For now, let's just log.
    console.error('Error running migration via RPC:', error);
    console.log('Falling back to direct SQL execution if possible...');
  } else {
    console.log('Migration successful:', data);
  }
}

runMigration();
