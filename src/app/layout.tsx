import { I18nProvider } from '@/components/i18n-provider'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: 'Antigravity | Inteligencia Activa para Empresas',
    template: '%s | Antigravity'
  },
  description: 'El primer ecosistema de micro-aplicaciones de IA diseñado para automatizar verticales de negocio y maximizar el ROI operativo.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Antigravity',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  verification: {
    google: 'KZUUEuS02QNY4ry-3QcOMrtWsHXkLFdyNbTZdrbcgp8',
  }
}

import { DynamicThemeProvider } from '@/components/DynamicThemeProvider'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { NotificationPrompt } from '@/components/ui/NotificationPrompt'
import { ReviewPrompt } from '@/components/ui/ReviewPrompt'

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen relative selection:bg-primary/30 selection:text-white`} suppressHydrationWarning>
        <div className="mesh-gradient" />
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="glow-orb w-[800px] h-[800px] bg-primary/10 top-[-300px] left-[-300px] animate-pulse-subtle"></div>
          <div className="glow-orb w-[600px] h-[600px] bg-accent-pink/5 bottom-[-200px] right-[-200px] animate-pulse-subtle delay-2000"></div>
          <div className="absolute inset-0 noise-texture opacity-25 mix-blend-overlay"></div>
        </div>

        <DynamicThemeProvider>
          <I18nProvider>
            <CommandPalette />
            <NotificationPrompt />
            <ReviewPrompt />
            {children}
          </I18nProvider>
        </DynamicThemeProvider>

        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
