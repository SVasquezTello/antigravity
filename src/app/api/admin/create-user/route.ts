import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: Request) {
  try {
    // 1. Check if the user is an admin
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

    // 2. Extract payload
    const body = await req.json();
    const { email, first_name, last_name, plan_id } = body;

    if (!email || !first_name || !last_name) {
       return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Initialize Admin Supabase
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey!);

    // Check if user exists
    let { data: existingUser } = await adminSupabase.from('users').select('id').eq('email', email).maybeSingle();
    
    let isNewUser = false;
    let newUserId = existingUser?.id;
    let rawPassword = '';

    if (!newUserId) {
        // Create user
        rawPassword = generatePassword();
        const { data: authUser, error: createError } = await adminSupabase.auth.admin.createUser({
          email,
          password: rawPassword,
          email_confirm: true,
          user_metadata: { first_name, last_name }
        });

        if (createError || !authUser.user) {
           return NextResponse.json({ success: false, message: createError?.message || 'Error creating auth user' }, { status: 500 });
        }
        newUserId = authUser.user.id;
        isNewUser = true;
    }

    // Update the plan
    if (plan_id) {
        await adminSupabase.from('users').update({
            plan_id,
            plan_assigned_at: new Date().toISOString(),
            plan_source: 'admin'
        }).eq('id', newUserId);
    }

    // Get Plan name
    let planName = 'No Plan';
    if (plan_id) {
        const { data: planData } = await adminSupabase.from('plans').select('slug, name_es').eq('id', plan_id).single();
        if (planData) planName = planData.name_es || planData.slug;
    }

    // Sending Email
    let emailSent = false;
    try {
        const { sendWelcomeEmail } = await import('@/lib/email');
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        
        const emailRes = await sendWelcomeEmail({
          to: email,
          firstName: first_name,
          planName: planName,
          password: isNewUser ? rawPassword : undefined,
          loginUrl: siteUrl
        });
        emailSent = emailRes.success;
    } catch(e) {
        console.error("Welcome email generation error:", e);
    }

    return NextResponse.json({
        success: true,
        user_id: newUserId,
        is_new_user: isNewUser,
        email_sent: emailSent,
        ...(isNewUser && { generated_password: rawPassword })
    });

  } catch(err: any) {
    console.error('Create User Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
