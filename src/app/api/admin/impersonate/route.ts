import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * 22.1 - Secure Admin Impersonation API
 * Handles session switching and audit logging
 */
export async function POST(req: Request) {
  const supabase = createClient()
  const { targetUserId, action } = await req.json()

  // 1. Security Check: Must be admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminData } = await supabase.from('users').select('role').eq('id', user?.id).single()

  if (!adminData || (adminData.role !== 'admin' && adminData.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
  }

  const cookieStore = await cookies()

  if (action === 'start') {
    // 2. Start Impersonation
    // We set a secure cookie with the target user ID
    cookieStore.set('impersonated_user_id', targetUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour limit
      path: '/'
    })

    // 3. Audit Log (Piso 12)
    await supabase.from('impersonation_logs').insert([{
      admin_id: user?.id,
      target_user_id: targetUserId,
      reason: 'Support Request'
    }])

    return NextResponse.json({ success: true, message: 'Impersonation active' })
  }

  if (action === 'stop') {
    cookieStore.delete('impersonated_user_id')
    return NextResponse.json({ success: true, message: 'Returned to admin view' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
