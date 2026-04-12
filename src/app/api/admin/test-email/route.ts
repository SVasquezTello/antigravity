import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { buildEmailTemplate } from '@/lib/email';
import { createClient as createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const serverSupabase = await createServerClient();
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await serverSupabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { host, port, username, password, from_email, from_name, test_recipient } = body;

    const cleanPassword = password ? password.replace(/\s+/g, '') : '';

    let smtpPass = cleanPassword;

    // Use admin client for settings
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey!);

    if (!smtpPass) {
       // if password wasn't provided, use the existing one
       const { data: existing } = await adminSupabase.from('smtp_settings').select('password').maybeSingle();
       if (existing && existing.password) {
         smtpPass = existing.password;
       } else {
         return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 });
       }
    }

    const transport = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user: username,
        pass: smtpPass,
      },
    });

    const html = buildEmailTemplate({
      title: "✅ Protocolo SMTP Verificado",
      greeting: "¡Hola Administrador!",
      bodyLines: ["Tu configuración de correo electrónico está funcionando a la perfección en el portal Antigravity."],
      footerText: "Prueba de configuración SMTP"
    });

    try {
      const info = await transport.sendMail({
        from: \`"\${from_name}" <\${from_email}>\`,
        to: test_recipient,
        subject: "✅ Test Email — SMTP Configuration Working",
        html: html,
      });

      // Email sent successfully! Save to DB
      const { data: existingSettings } = await adminSupabase.from('smtp_settings').select('id').maybeSingle();

      const newSettings = {
        host,
        port: Number(port),
        username,
        password: smtpPass,
        from_email,
        from_name,
        is_verified: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingSettings?.id) {
        await adminSupabase.from('smtp_settings').update(newSettings).eq('id', existingSettings.id);
      } else {
        await adminSupabase.from('smtp_settings').insert(newSettings);
      }

      return NextResponse.json({ 
        success: true, 
        message: "Email sent and settings saved", 
        smtp_response: info.response 
      });

    } catch (smtpError: any) {
      console.error("SMTP Test Error:", smtpError);
      return NextResponse.json({ 
        success: false, 
        message: smtpError.message || "Unknown SMTP Error",
        error_code: smtpError.code 
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error("Test Email API Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
