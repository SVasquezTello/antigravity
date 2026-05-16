'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { sendEmail, getWelcomeTemplate } from '@/utils/email/service'

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log("LOGIN ACTION ENVIRONMENT CHECK:");
    console.log("URL:", supabaseUrl);
    console.log("KEY:", supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'UNDEFINED');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // 2.2 Rastreo de IP y Último Login
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    
    if (data.user) {
      // 1. Obtener datos actuales para ver si es su primer login
      const { data: profile } = await supabase.from('users').select('last_login, first_name').eq('id', data.user.id).single()

      // 2. Si es el primer login, enviar Bienvenida
      if (!profile?.last_login) {
        const welcomeHtml = getWelcomeTemplate(profile?.first_name || data.user.email?.split('@')[0] || 'User')
        
        // Tareas en segundo plano (No bloquean el login)
        const runBackgroundTasks = async () => {
          try {
            await sendEmail({
              to: data.user.email!,
              subject: '🚀 ¡Bienvenido a Antigravity!',
              html: welcomeHtml
            })

            await supabase.rpc('create_notification', {
              p_user_id: data.user.id,
              p_title_es: '🚀 Bienvenido a bordo',
              p_title_en: '🚀 Welcome aboard',
              p_type: 'success',
              p_link: '/dashboard'
            })
          } catch (e) {
            console.error("Error in background tasks:", e)
          }
        }
        
        runBackgroundTasks()
      }

      // 3. Registrar el login actual en segundo plano
      const trackLogin = async () => {
        try {
          await supabase.rpc('track_login', { 
            p_user_id: data.user.id, 
            p_ip: ip 
          })
        } catch (e) {
          console.error("Error tracking login:", e)
        }
      }
      
      trackLogin()
    }

    return { success: true }
  } catch (err: any) {
    console.error("Login action error:", err)
    return { error: err.message || "An unexpected error occurred during login." }
  }
}
