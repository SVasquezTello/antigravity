import { createClient as createSupabaseClient } from '@supabase/supabase-js';

interface PlanAppRow {
  micro_apps: { slug: string } | null;
}

export async function getUserAccessibleApps(userId: string): Promise<string[]> {
  // By default, try to get the admin key to bypass RLS.
  let adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!adminKey) {
    console.warn("⚠️ SUPABASE_SECRET_KEY no encontrado. Usando la clave anónima como respaldo. Algunas funciones de Admin pueden fallar.");
    adminKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    adminKey!
  );

  // Get user's plan_id
  const { data: user } = await supabase
    .from('users')
    .select('plan_id')
    .eq('id', userId)
    .single();

  const appIds = new Set<string>();

  // Get apps from plan (without relationship schema)
  if (user?.plan_id) {
    const { data: planApps } = await supabase
      .from('plan_apps')
      .select('app_id')
      .eq('plan_id', user.plan_id);

    planApps?.forEach((row: any) => {
      if (row.app_id) appIds.add(row.app_id);
    });
  }

  // Get apps from individual overrides (without relationship schema)
  const { data: overrides } = await supabase
    .from('user_app_overrides')
    .select('app_id')
    .eq('user_id', userId);

  overrides?.forEach((row: any) => {
    if (row.app_id) appIds.add(row.app_id);
  });

  if (appIds.size === 0) return [];

  // Match IDs to slugs
  const { data: apps } = await supabase
    .from('micro_apps')
    .select('slug')
    .in('id', Array.from(appIds));

  return (apps || []).map(a => a.slug);
}
