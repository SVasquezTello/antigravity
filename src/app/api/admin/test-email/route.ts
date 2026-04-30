import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer'
import { buildEmailTemplate } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { host, port, username, password, from_email, from_name, test_recipient } = body

    if (!host || !port || !username || !from_email || !test_recipient) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    let passwordToUse = password
    if (!passwordToUse) {
      const { data: existingSettings } = await supabaseAdmin
        .from('smtp_settings')
        .select('password')
        .limit(1)
        .single()
      passwordToUse = existingSettings?.password || ''
    }

    const cleanPassword = passwordToUse.replace(/\\s+/g, '')

    const transport = nodemailer.createTransport({
      host,
      port: Number(port),
      auth: {
        user: username,
        pass: cleanPassword
      }
    })

    const html = buildEmailTemplate({
      title: '✅ Test Email',
      greeting: 'Hola Admin,',
      bodyLines: ['Tu configuración SMTP está funcionando correctamente.', 'Ahora los correos de bienvenida se enviarán a los nuevos usuarios.'],
      footerText: 'Este email fue enviado automáticamente. Si tienes preguntas, contacta al administrador.'
    })

    const fromString = from_name ? `"${from_name}" <${from_email}>` : from_email

    const info = await transport.sendMail({
      from: fromString,
      to: test_recipient,
      subject: '✅ Test Email — SMTP Configuration Working',
      html
    })

    const { data: existing } = await supabaseAdmin
      .from('smtp_settings')
      .select('id')
      .limit(1)
      .maybeSingle()

    const newSettings = {
      host,
      port: Number(port),
      username,
      password: cleanPassword, // Overwrite only with clean password
      from_email,
      from_name,
      is_verified: true,
      verified_at: new Date().toISOString()
    }

    if (existing) {
      await supabaseAdmin.from('smtp_settings').update(newSettings).eq('id', existing.id)
    } else {
      await supabaseAdmin.from('smtp_settings').insert(newSettings)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent and settings saved', 
      smtp_response: info.response 
    })

  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Error occurred while testing SMTP',
      error_code: error.code || 'UNKNOWN'
    }, { status: 400 })
  }
}
