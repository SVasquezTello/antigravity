import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase admin client for accessing SMTP settings
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // The instruction said SUPABASE_SECRET_KEY, but local env has SUPABASE_SERVICE_ROLE_KEY. I will use process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function getSmtpTransport() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey!);

  const { data: settings, error } = await supabase
    .from('smtp_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !settings || !settings.is_verified) {
    return null;
  }

  const transport = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.port === 465,
    auth: {
      user: settings.username,
      pass: settings.password,
    },
  });

  return transport;
}

export function buildEmailTemplate(options: {
  title: string;
  greeting: string;
  bodyLines: string[];
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}): string {
  const { title, greeting, bodyLines, ctaText, ctaUrl, footerText } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f0a1e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f0a1e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e; border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 16px; overflow: hidden; max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 40px 30px;">
              
              <!-- Logo Badge -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #7c3aed, #6d28d9, #ec4899); border-radius: 12px; padding: 8px 20px;">
                    <span style="color: #ffffff; font-weight: bold; font-size: 14px; letter-spacing: 1px;">✦ MICRO-APPS PORTAL</span>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0 0 30px 0;">
                ${title}
              </h1>

              <!-- Content -->
              <div style="text-align: left; color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6;">
                <p style="margin: 0 0 20px 0;">${greeting}</p>
                
                ${bodyLines.map(line => `<p style="margin: 0 0 20px 0;">${line}</p>`).join('')}
                
                <!-- CTA -->
                ${ctaText && ctaUrl ? `
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                  <tr>
                    <td align="center">
                      <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(to right, #7c3aed, #ec4899); color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 12px; text-align: center;">
                        ${ctaText}
                      </a>
                    </td>
                  </tr>
                </table>
                ` : ''}
              </div>

            </td>
          </tr>
          
          <!-- Footer -->
          ${footerText ? `
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: rgba(255, 255, 255, 0.02); border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0; color: rgba(255, 255, 255, 0.4); font-size: 12px; text-align: center;">
                ${footerText}
              </p>
            </td>
          </tr>
          ` : ''}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const transport = await getSmtpTransport();
    
    if (!transport) {
      return { success: false, message: 'SMTP not configured or unverified' };
    }

    const { data: settings } = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey!)
      .from('smtp_settings')
      .select('from_email, from_name')
      .single();

    if (!settings) {
      return { success: false, message: 'Sender details not found' };
    }

    const info = await transport.sendMail({
      from: `"${settings.from_name}" <${settings.from_email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true, message: `Message sent: ${info.messageId}` };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function sendWelcomeEmail(options: {
  to: string;
  firstName: string;
  planName: string;
  password?: string;
  loginUrl: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const bodyLines = [
      `Tu plan <strong>${options.planName}</strong> ha sido activado exitosamente.`,
    ];

    if (options.password) {
      bodyLines.push(`Tus credenciales de acceso son:<br/>Email: <strong>${options.to}</strong><br/>Contraseña: <strong>${options.password}</strong>`);
    }

    bodyLines.push("Ya puedes acceder a todas las herramientas de IA incluidas en tu plan.");

    const html = buildEmailTemplate({
      title: "¡Bienvenido a Micro-Apps Portal!",
      greeting: `Hola ${options.firstName || 'usuario'},`,
      bodyLines,
      ctaText: "Acceder al Portal",
      ctaUrl: options.loginUrl,
      footerText: "Este email fue enviado automáticamente. Si tienes preguntas, contacta al administrador.",
    });

    return await sendEmail({
      to: options.to,
      subject: "¡Bienvenido a Micro-Apps Portal! Tu acceso está listo",
      html,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Welcome email generation error:", err);
    return { success: false, message: err.message };
  }
}
