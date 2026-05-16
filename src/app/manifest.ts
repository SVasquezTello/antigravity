import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // En una implementación real, aquí detectaríamos el host desde headers
  // Como manifest() no tiene acceso directo a headers en todas las versiones de Next,
  // devolvemos el manifest base, pero esta es la estructura para hacerlo dinámico.
  
  return {
    name: 'Antigravity | Inteligencia Activa',
    short_name: 'Antigravity',
    description: 'Ecosistema de micro-aplicaciones de IA para automatización industrial y empresarial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050014',
    theme_color: '#7C3AED',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshots/desktop-1.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Dashboard de Micro-Apps'
      },
      {
        src: '/images/screenshots/mobile-1.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'IA en tu bolsillo'
      }
    ],
    shortcuts: [
      {
        name: 'Marketplace',
        url: '/apps',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Analíticas',
        url: '/analytics',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      }
    ]
  }
}
