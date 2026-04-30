import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { UserDetailClient } from '@/components/admin/UserDetailClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Verify admin
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const { data: roleData } = await supabase
    .from('users')
    .select('role')
    .eq('id', currentUser.id)
    .single()
  
  if (roleData?.role !== 'admin') redirect('/dashboard')

  // Fetch the target user details
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
    
  if (!user) redirect('/admin')

  // Fetch plan
  let plan = null
  let planAppsCount = 0
  if (user.plan_id) {
    const { data: p } = await supabase.from('plans').select('*').eq('id', user.plan_id).single()
    plan = p
    const { count } = await supabase.from('plan_apps').select('*', { count: 'exact', head: true }).eq('plan_id', user.plan_id)
    planAppsCount = count || 0
  }

  const { count: totalAppsCount } = await supabase.from('micro_apps').select('*', { count: 'exact', head: true })
  const { count: totalExecutions } = await supabase.from('app_executions').select('*', { count: 'exact', head: true }).eq('user_id', id)

  // Fetch executions
  const { data: executions } = await supabase
    .from('app_executions')
    .select('*, micro_apps(name_en, name_es)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch payments
  const { data: payments } = await supabase
    .from('webhook_logs')
    .select('id, source, event_type, status, created_at, normalized_payload')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <UserDetailClient 
      user={user} 
      plan={plan} 
      executions={executions || []} 
      payments={payments || []} 
      planAppsCount={planAppsCount}
      totalAppsCount={totalAppsCount || 0}
      totalExecutions={totalExecutions || 0}
    />
  )
}
