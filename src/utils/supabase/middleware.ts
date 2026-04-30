import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password')
  
  if (!user && !isAuthRoute && !path.startsWith('/auth') && path !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (user) {
    // 1. Fetch user role and hierarchy
    const { data: userData } = await supabase
      .from('users')
      .select('role, client_id, must_change_password')
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
    
    // Management routes restricted for Staff (optional logic)
    // if (path.startsWith('/management') && role === 'staff') { ... }
  }

  return supabaseResponse
}
