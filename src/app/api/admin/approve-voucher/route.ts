import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { voucherId } = await request.json()

    // 1. Get voucher details
    const { data: voucher, error: vErr } = await supabaseAdmin
      .from('payment_vouchers')
      .select('*')
      .eq('id', voucherId)
      .single()

    if (vErr || !voucher) throw new Error('Voucher no encontrado')

    // 2. Approve voucher
    await supabaseAdmin
      .from('payment_vouchers')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', voucherId)

    // 3. Get user's workspace_id
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('workspace_id')
      .eq('id', voucher.user_id)
      .single()

    // 4. Update user_status (Bypassing RLS)
    await supabaseAdmin
      .from('user_status')
      .upsert({
        user_id: voucher.user_id,
        current_plan_id: voucher.plan_id,
        workspace_id: user?.workspace_id,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    // 5. Record Subscription (Consistent with Stripe webhook)
    if (user?.workspace_id) {
       await supabaseAdmin
         .from('subscriptions')
         .insert({
           workspace_id: user.workspace_id,
           user_id: voucher.user_id,
           offer_id: voucher.plan_id,
           status: 'active',
           current_period_start: new Date().toISOString(),
           current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
         })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
