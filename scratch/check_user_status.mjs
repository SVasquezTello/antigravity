import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserStatus() {
  const email = 'gavanzadavid@gmail.com';
  console.log(`Checking status for ${email}...`);
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*, plans(*)')
    .eq('email', email)
    .single();
    
  if (error) {
    console.error('Error fetching user:', error);
    return;
  }
  
  console.log('--- USER DATA ---');
  console.log('ID:', user.id);
  console.log('Role:', user.role);
  console.log('Plan:', user.plans?.name);
  console.log('Plan ID:', user.plan_id);
}

checkUserStatus();
