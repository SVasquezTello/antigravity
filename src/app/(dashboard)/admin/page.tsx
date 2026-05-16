import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';
import { AdminStats } from '@/components/admin/AdminStats';
import { RecentActivity } from '@/components/admin/RecentActivity';

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
    .select('id, email, first_name, last_name, role, workspace_id, created_at')
    .order('created_at', { ascending: false });

  // Fetch user status (for plans)
  const { data: userStatuses } = await supabase
    .from('user_status')
    .select('user_id, current_plan_id');

  // Map user status to users
  const usersWithPlans = users?.map(u => ({
    ...u,
    plan_id: userStatuses?.find(s => s.user_id === u.id)?.current_plan_id
  }));

  // Fetch all offers (plans)
  const { data: plans, error: plansError } = await supabase
    .from('offers')
    .select('id, name, slug')
    .order('created_at', { ascending: true });

  // Fetch all apps
  const { data: apps, error: appsError } = await supabase
    .from('micro_apps')
    .select('id, name_en, name_es, slug')
    .order('created_at', { ascending: true });

  // Fetch all overrides
  const { data: overrides, error: overridesError } = await supabase
    .from('user_app_overrides')
    .select('user_id, app_id');

  // Stats Calculations
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: totalUsersWithPlan } = await supabase.from('user_status').select('*', { count: 'exact', head: true }).not('current_plan_id', 'is', null);
  const { count: totalExecutions } = await supabase.from('app_executions').select('*', { count: 'exact', head: true });
  const { data: logs } = await supabase.from('webhook_logs').select('normalized_payload').eq('status', 'processed');
  const simulatedRevenue = logs?.reduce((acc: number, log: any) => acc + (Number(log.normalized_payload?.amount) || 0), 0) || 0;

  // Recent Activity Data
  const { data: recentUsers } = await supabase.from('users').select('id, first_name, created_at').order('created_at', { ascending: false }).limit(5);
  const { data: recentPayments } = await supabase.from('webhook_logs').select('id, normalized_payload, created_at').eq('status', 'processed').order('created_at', { ascending: false }).limit(5);
  const { data: recentExecutions } = await supabase.from('app_executions').select('id, created_at, users(first_name), micro_apps(name_en, name_es)').order('created_at', { ascending: false }).limit(5);

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

      {/* Analytics Layer */}
      <AdminStats 
        totalUsers={totalUsers || 0}
        totalUsersWithPlan={totalUsersWithPlan || 0}
        totalExecutions={totalExecutions || 0}
        simulatedRevenue={simulatedRevenue}
      />

      {/* Recent Activity Layer */}
      <RecentActivity 
        recentUsers={recentUsers || []}
        recentPayments={recentPayments || []}
        recentExecutions={recentExecutions || []}
      />

      <div className="glass-panel p-6">
        <UsersTable 
          users={usersWithPlans || []} 
          plans={plans || []} 
          apps={apps || []} 
          initialOverrides={overrides || []} 
        />
      </div>
    </div>
  );
}
