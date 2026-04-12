import { createClient } from '@/utils/supabase/server'
import { PlansClient } from '@/components/plans/PlansClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PlansPage() {
  const supabase = await createClient()
  
  // Fetch logged in user
  const { data: { user } } = await supabase.auth.getUser()
  
  let currentPlanSlug = null
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('plan_id')
      .eq('id', user.id)
      .single()
      
    if (userData?.plan_id) {
      const { data: planData } = await supabase
        .from('plans')
        .select('slug')
        .eq('id', userData.plan_id)
        .single()
      if (planData) {
        currentPlanSlug = planData.slug
      }
    }
  }

  // Fetch plans
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order', { ascending: true })

  return <PlansClient plans={plans || []} currentPlanSlug={currentPlanSlug} />
}
