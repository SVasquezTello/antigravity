import { createClient } from '@/utils/supabase/server'
import { WebhooksClient } from '@/components/admin/WebhooksClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function WebhooksPage() {
  const supabase = await createClient()

  // Fetch all active plans
  const { data: plans } = await supabase
    .from('plans')
    .select('id, slug, name_en, name_es, price_monthly')
    .order('price_monthly', { ascending: true })

  // Fetch last 20 webhook logs
  const { data: logs } = await supabase
    .from('webhook_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return <WebhooksClient plans={plans || []} initialLogs={logs || []} />
}
