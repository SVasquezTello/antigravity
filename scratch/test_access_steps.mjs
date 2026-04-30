import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testAccess(userId) {
  console.log(`Testing access for user ${userId}...`)
  
  // 1. Check role
  const { data: roleData, error: rError } = await supabase.from('users').select('role').eq('id', userId).single();
  console.log('Role:', roleData, rError);

  if (roleData?.role === 'admin' || roleData?.role === 'super_admin') {
    const { data: allApps, error: aError } = await supabase.from('micro_apps').select('slug');
    console.log('Admin detected. Total apps found:', allApps?.length, aError);
    return;
  }

  // 2. Get user's plan_id
  const { data: user, error: uError } = await supabase.from('users').select('plan_id').eq('id', userId).single();
  console.log('User Plan ID:', user?.plan_id, uError);

  const appIds = new Set();

  if (user?.plan_id) {
    const { data: planApps, error: paError } = await supabase.from('plan_apps').select('app_id').eq('plan_id', user.plan_id);
    console.log(`Apps in plan ${user.plan_id}:`, planApps?.length, paError);
    planApps?.forEach(row => appIds.add(row.app_id));
  }

  const { data: overrides, error: oError } = await supabase.from('user_app_overrides').select('app_id').eq('user_id', userId);
  console.log('Overrides:', overrides?.length, oError);
  overrides?.forEach(row => appIds.add(row.app_id));

  if (appIds.size > 0) {
    const { data: apps, error: maError } = await supabase.from('micro_apps').select('slug').in('id', Array.from(appIds));
    console.log('Final accessible apps count:', apps?.length, maError);
  } else {
    console.log('No apps found for this user.');
  }
}

const targetUser = 'f5b8cbde-5471-4da5-8e5c-fbbcfdbd4773'
testAccess(targetUser)
