import { I18nProvider } from '@/components/i18n-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Micro-Apps Portal',
  description: 'Premium Micro-Apps Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen relative overflow-x-hidden`}>
        {/* Background elements */}
        <div className="fixed inset-0 z-[-1] bg-base-100">
          <div className="glow-orb w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-200px]"></div>
          <div className="glow-orb w-[500px] h-[500px] bg-accent-pink/10 bottom-[-100px] right-[-100px] animation-delay-2000"></div>
          <div className="glow-orb w-[400px] h-[400px] bg-accent-blue/15 top-[40%] left-[60%] animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
