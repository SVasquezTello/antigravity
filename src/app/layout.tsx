import { I18nProvider } from '@/components/i18n-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MicroApps Hub',
  description: 'Premium MicroApps Hub',
}

import { DynamicThemeProvider } from '@/components/DynamicThemeProvider'

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
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay"></div>
        </div>

        <DynamicThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </DynamicThemeProvider>
      </body>
    </html>
  )
}
