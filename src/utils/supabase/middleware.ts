import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzgabbgclbkcsbjkyklv.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTg5ODcsImV4cCI6MjA5MDM5NDk4N30.SwH3DhGoVmeujanWf0iJXGhtPG0AaPk7EudcLwMID1o'

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const host = request.headers.get('host') || ''
    
    // Multi-tenant Subdomain Detection (2.5)
    let subdomain = null
    const parts = host.split('.')
    if (parts.length >= 2) {
      // Local: tesla.localhost:3000 (parts=['tesla', 'localhost:3000'])
      // Prod: tesla.antigravity.io (parts=['tesla', 'antigravity', 'io'])
      const firstPart = parts[0]
      if (
        firstPart !== 'www' && 
        firstPart !== 'antigravity' && 
        firstPart !== 'antigravity-ia' && 
        firstPart !== 'localhost:3000'
      ) {
        subdomain = firstPart
      }
    }

    const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password')
    const isPublicRoute = path === '/' || path.startsWith('/landings') || path.startsWith('/api') || path.startsWith('/_next') || path.match(/\.(png|jpg|jpeg|gif|svg|ico|json|js)$/)
    
    // Redirect logic for subdomains
    if (subdomain && path === '/') {
      // Rewrite root of subdomain to the partner storefront
      const url = request.nextUrl.clone()
      url.pathname = `/${subdomain}`
      return NextResponse.rewrite(url)
    }

    if (!user && !isAuthRoute && !path.startsWith('/auth') && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    if (user) {
      // 1. Fetch user role and hierarchy
      const { data: userData } = await supabase
        .from('users')
        .select('role, workspace_id, must_change_password')
        .eq('id', user.id)
        .single()

      const role = userData?.role || 'client'
      const mustChangePassword = userData?.must_change_password || false

      // 2. Auth Route Redirection
      if (isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // 3. Forced Password Change (2.4)
      if (mustChangePassword && path !== '/update-password' && !path.startsWith('/auth')) {
        const url = request.nextUrl.clone()
        url.pathname = '/update-password'
        return NextResponse.redirect(url)
      }

      // 4. Hierarchical Path Gating
      // Super Admin only routes
      if (path.startsWith('/admin') && role !== 'super_admin' && role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // Partner only routes
      if (path.startsWith('/partner') && !['super_admin', 'admin', 'partner'].includes(role)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } catch (e) {
    console.error('Middleware Supabase error:', e)
  }

  return supabaseResponse
}
