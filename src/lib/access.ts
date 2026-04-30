import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function getUserAccessibleApps(userId: string): Promise<string[]> {
  // Use service role key if available to bypass RLS
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  
  if (!adminKey) {
    console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY not found in environment.");
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    adminKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. Check if user is Admin or Super Admin
    const { data: roleData, error: roleError } = await supabase
      .from('users')
      .select('role, plan_id')
      .eq('id', userId)
      .single();

    if (roleError) {
      console.error("Access: Error fetching user role:", roleError);
      return [];
    }

    if (roleData?.role === 'admin' || roleData?.role === 'super_admin') {
      const { data: allApps } = await supabase.from('micro_apps').select('slug');
      return (allApps || []).map((a: any) => a.slug);
    }

    const appIds = new Set<string>();

    // 2. Get apps from plan
    if (roleData?.plan_id) {
      const { data: planApps, error: planError } = await supabase
        .from('plan_apps')
        .select('app_id')
        .eq('plan_id', roleData.plan_id);

      if (planError) console.error("Access: Error fetching plan apps:", planError);
      planApps?.forEach((row: any) => {
        if (row.app_id) appIds.add(row.app_id);
      });
    }

    // 3. Get apps from individual overrides
    const { data: overrides, error: overrideError } = await supabase
      .from('user_app_overrides')
      .select('app_id')
      .eq('user_id', userId);

    if (overrideError) console.error("Access: Error fetching overrides:", overrideError);
    overrides?.forEach((row: any) => {
      if (row.app_id) appIds.add(row.app_id);
    });

    if (appIds.size === 0) return [];

    // 4. Match IDs to slugs
    const { data: apps, error: appError } = await supabase
      .from('micro_apps')
      .select('slug')
      .in('id', Array.from(appIds));

    if (appError) console.error("Access: Error fetching app slugs:", appError);
    
    const slugs = (apps || []).map((a: any) => a.slug);
    return slugs;
  } catch (err) {
    console.error("Access: Unexpected error in getUserAccessibleApps:", err);
    return [];
  }
}
