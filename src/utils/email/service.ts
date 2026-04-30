import nodemailer from 'nodemailer'
import { createClient } from '@/utils/supabase/server'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const supabase = await createClient()
  
  // 1. Obtener configuración SMTP (Priorizando la del sistema si no hay personalizada)
  const { data: smtp } = await supabase
    .from('smtp_settings')
    .select('*')
    .eq('is_active', true)
    .single()

  if (!smtp) {
    console.error('No se encontró configuración SMTP activa.')
    return { error: 'SMTP not configured' }
  }

  // 2. Configurar el transportista
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure, 
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })

  // 3. Enviar el correo
  try {
    const info = await transporter.sendMail({
      from: `"${smtp.from_name}" <${smtp.from_email}>`,
      to,
      subject,
      html,
    })
    console.log('Email enviado: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { error }
  }
}

// 4. Plantilla de Bienvenida Estilizada
export const getWelcomeTemplate = (name: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
  <div style="background: #7c3aed; padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">¡Bienvenido a Antigravity!</h1>
  </div>
  <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 24px 24px;">
    <p>Hola <strong>${name}</strong>,</p>
    <p>Estamos emocionados de tenerte en el portal de Micro-Apps más avanzado del mercado.</p>
    <p>Tu cuenta ha sido configurada con éxito y ya puedes empezar a potenciar tu negocio con IA.</p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://antigravity.ia/dashboard" style="background: #7c3aed; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">Entrar al Dashboard</a>
    </div>
    <p style="color: #64748b; font-size: 12px; margin-top: 40px;">Este es un correo automático, por favor no respondas.</p>
  </div>
</div>
`
