import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

export async function getSmtpTransport(partnerId?: string) {
  if (partnerId) {
    const { data: partner } = await supabaseAdmin
      .from('partners')
      .select('custom_smtp_settings')
      .eq('id', partnerId)
      .single()

    if (partner?.custom_smtp_settings?.host) {
      return {
        transport: nodemailer.createTransport({
          host: partner.custom_smtp_settings.host,
          port: Number(partner.custom_smtp_settings.port),
          auth: {
            user: partner.custom_smtp_settings.user,
            pass: partner.custom_smtp_settings.pass
          }
        }),
        fromEmail: partner.custom_smtp_settings.user,
        fromName: partner.name // We might need to select name too
      }
    }
  }

  const { data: settings } = await supabaseAdmin
    .from('smtp_settings')
    .select('*')
    .limit(1)
    .single()

  if (!settings || !settings.is_verified) {
    return null
  }

  return {
    transport: nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      auth: {
        user: settings.username,
        pass: settings.password
      }
    }),
    fromEmail: settings.from_email,
    fromName: settings.from_name
  }
}

export function buildEmailTemplate(options: {
  title: string
  greeting: string
  bodyLines: string[]
  ctaText?: string
  ctaUrl?: string
  footerText?: string
  branding?: {
    logoUrl?: string
    primaryColor?: string
    partnerName?: string
  }
}): string {
  const { title, greeting, bodyLines, ctaText, ctaUrl, footerText, branding } = options
  const primaryColor = branding?.primaryColor || '#7c3aed'
  const partnerName = branding?.partnerName || 'MICRO-APPS PORTAL'

  const bodyHtml = bodyLines.map(line => `<p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">${line}</p>`).join('')

  const buttonHtml = ctaText && ctaUrl 
    ? `
      <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
          <td align="center" bgcolor="${primaryColor}" style="border-radius: 8px;">
            <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; background: ${primaryColor};">
              ${ctaText}
            </a>
          </td>
        </tr>
      </table>
    `
    : ''

  const footerHtml = footerText 
    ? `<div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);"><p style="color: #64748b; font-size: 12px; margin: 0; text-align: center;">${footerText}</p></div>`
    : ''

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f0a1e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f0a1e; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #1a1a2e; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden;">
            
            <!-- Logo Section -->
            <tr>
              <td align="center" style="padding: 32px 24px 0 24px;">
                ${branding?.logoUrl 
                  ? `<img src="${branding.logoUrl}" alt="${partnerName}" style="height: 40px; width: auto;">`
                  : `<div style="background: ${primaryColor}; border-radius: 12px; padding: 8px 20px; display: inline-block;">
                      <span style="color: #ffffff; font-weight: bold; font-size: 14px; letter-spacing: 1px;">✦ ${partnerName}</span>
                    </div>`
                }
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 32px 40px;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0 0 24px 0;">${title}</h1>
                <p style="color: #ffffff; font-size: 16px; font-weight: 500; margin: 0 0 16px 0;">${greeting}</p>
                ${bodyHtml}
                ${buttonHtml}
                ${footerHtml}
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  partnerId?: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const config = await getSmtpTransport(options.partnerId)
    
    if (!config) {
      return { success: false, message: 'SMTP not configured or not verified' }
    }

    const { transport, fromEmail, fromName } = config
    const from = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail

    const info = await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html
    })

    return { success: true, message: info.response }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return { success: false, message: error.message || 'Unknown error' }
  }
}

export async function sendWelcomeEmail(options: {
  to: string
  firstName: string
  planName: string
  password?: string
  loginUrl: string
  partnerId?: string
}): Promise<{ success: boolean; message: string }> {
  let branding = undefined
  
  if (options.partnerId) {
    const { data: partner } = await supabaseAdmin
      .from('partners')
      .select('name, logo_url, primary_color')
      .eq('id', options.partnerId)
      .single()
    
    if (partner) {
      branding = {
        partnerName: partner.name,
        logoUrl: partner.logo_url,
        primaryColor: partner.primary_color
      }
    }
  }

  const bodyLines = [
    `Tu plan <strong>${options.planName}</strong> ha sido activado exitosamente.`
  ]

  if (options.password) {
    bodyLines.push('Tus credenciales de acceso son:')
    bodyLines.push(`<strong>Email:</strong> ${options.to}<br><strong>Contraseña:</strong> ${options.password}`)
  }

  bodyLines.push('Ya puedes acceder a todas las herramientas de IA incluidas en tu plan.')

  const html = buildEmailTemplate({
    title: `¡Bienvenido a ${branding?.partnerName || 'Micro-Apps Portal'}!`,
    greeting: `Hola ${options.firstName},`,
    bodyLines,
    ctaText: 'Acceder al Portal',
    ctaUrl: options.loginUrl,
    footerText: `Este email fue enviado automáticamente por ${branding?.partnerName || 'Antigravity'}.`,
    branding
  })

  return sendEmail({
    to: options.to,
    subject: `¡Bienvenido a ${branding?.partnerName || 'Micro-Apps Portal'}! Tu acceso está listo`,
    html,
    partnerId: options.partnerId
  })
}
