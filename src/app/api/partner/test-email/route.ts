import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer'
import { buildEmailTemplate } from '@/lib/email'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a partner
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role, partner_id')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'partner' || !userData.partner_id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { host, port, username, password, test_recipient } = body

    if (!host || !port || !username || !test_recipient) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const { data: partner } = await supabaseAdmin
      .from('partners')
      .select('*')
      .eq('id', userData.partner_id)
      .single()

    const transport = nodemailer.createTransport({
      host,
      port: Number(port),
      auth: {
        user: username,
        pass: password
      }
    })

    const html = buildEmailTemplate({
      title: '✅ Partner SMTP Verified',
      greeting: `Hola ${partner.name},`,
      bodyLines: [
        'Tu configuración de SMTP personalizado ha sido verificada exitosamente.',
        'A partir de ahora, tus clientes recibirán notificaciones desde tu propio servidor.'
      ],
      branding: {
        partnerName: partner.name,
        logoUrl: partner.logo_url,
        primaryColor: partner.primary_color
      }
    })

    const info = await transport.sendMail({
      from: `"${partner.name}" <${username}>`,
      to: test_recipient,
      subject: `✅ ${partner.name} — SMTP Configuration Working`,
      html
    })

    // Update partner settings
    await supabaseAdmin
      .from('partners')
      .update({
        custom_smtp_settings: {
          host,
          port,
          user: username,
          pass: password
        }
      })
      .eq('id', partner.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent and settings saved', 
      smtp_response: info.response 
    })

  } catch (error: any) {
    console.error('Partner test email error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Error occurred while testing SMTP',
      error_code: error.code || 'UNKNOWN'
    }, { status: 400 })
  }
}
