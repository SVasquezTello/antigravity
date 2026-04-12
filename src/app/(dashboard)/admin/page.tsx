import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if current user is admin
  const { data: roleData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleData?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, plan_id, created_at')
    .order('created_at', { ascending: false });

  // Fetch all plans
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('id, name_en, name_es, slug')
    .order('sort_order', { ascending: true });

  // Fetch all apps
  const { data: apps, error: appsError } = await supabase
    .from('micro_apps')
    .select('id, name_en, name_es, slug')
    .order('created_at', { ascending: true });

  // Fetch all overrides
  const { data: overrides, error: overridesError } = await supabase
    .from('user_app_overrides')
    .select('user_id, app_id');

  if (usersError || plansError || appsError || overridesError) {
    console.error('Error fetching admin data:', usersError || plansError || appsError || overridesError);
    return <div className="p-8 text-red-500">Error loading admin dashboard.</div>;
  }

  return (
    <div className="min-h-full p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-white/60">Manage users, roles, and subscriptions.</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <UsersTable 
          users={users || []} 
          plans={plans || []} 
          apps={apps || []} 
          initialOverrides={overrides || []} 
        />
      </div>
    </div>
  );
}
