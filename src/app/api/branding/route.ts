import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const host = req.headers.get('host') || ''
    const slug = searchParams.get('slug')
    
    let partnerSlug = slug
    
    // If no slug provided, try to detect from subdomain
    if (!partnerSlug) {
      const parts = host.split('.')
      if (parts.length >= 2) {
        const firstPart = parts[0]
        if (firstPart !== 'www' && firstPart !== 'antigravity' && firstPart !== 'localhost:3000') {
          partnerSlug = firstPart
        }
      }
    }

    if (!partnerSlug) {
      return NextResponse.json({ 
        success: false, 
        message: 'No partner identity detected' 
      }, { status: 400 })
    }

    const { data: partner, error } = await supabaseAdmin
      .from('partners')
      .select('id, name, slug, logo_url, primary_color, branding_config, custom_domain')
      .eq('slug', partnerSlug)
      .single()

    if (error || !partner) {
      return NextResponse.json({ 
        success: false, 
        message: 'Partner not found' 
      }, { status: 404 })
    }

    // Response tailored for both Web and Native Mobile wrappers
    return NextResponse.json({
      success: true,
      identity: {
        name: partner.name,
        slug: partner.slug,
        logo: partner.logo_url,
        theme: {
          primary: partner.primary_color,
          radius: partner.branding_config?.radius || '1.5rem',
          mode: partner.branding_config?.mode || 'dark'
        },
        metadata: {
          pwa_ready: true,
          native_support: true,
          custom_domain: partner.custom_domain
        }
      }
    })

  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      message: err.message 
    }, { status: 500 })
  }
}
