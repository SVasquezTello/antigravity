import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listPlans() {
  const { data: plans, error } = await supabase.from('plans').select('*');
  if (error) {
    console.error('Error fetching plans:', error);
    return;
  }
  console.log('--- PLANS IN DB ---');
  plans.forEach(p => {
    console.log(`- ${p.name} (id: ${p.id}, slug: ${p.slug})`);
  });
}

listPlans();
