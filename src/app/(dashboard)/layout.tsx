'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'
import { Header } from '@/components/ui/Header'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslation } from '@/hooks/useTranslation'
import { createClient } from '@/utils/supabase/client'
import { ImpersonationBanner } from '@/components/ui/ImpersonationBanner'
import { Globe, Code2 } from 'lucide-react'
import { OnboardingModal } from '@/components/ui/OnboardingModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language } = useTranslation()
  const [partner, setPartner] = useState<any>(null)

  const supabase = React.useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (userData && 'partner_id' in userData && userData.partner_id) {
          const { data: pData } = await supabase.from('partners').select('*').eq('id', userData.partner_id).single()
          setPartner(pData)
        }
      } catch (err) {
        console.error('DashboardLayout: Branding fetch error', err)
      }
    }
    fetchBranding()
  }, [supabase])

  return (
    <div 
      className="fixed inset-0 w-full h-dvh flex overflow-hidden z-0 bg-base-100"
      style={{ '--partner-primary': partner?.primary_color } as any}
    >
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 z-10">
        <Header onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto w-full p-0 relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Top-left purple→pink→orange orb (hero orb) */}
            <div 
              className="absolute -top-40 -left-72 w-[900px] h-[900px] rounded-full blur-[80px]"
              style={{
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(5, 162, 194, 0.14) 25%, rgba(249, 115, 22, 0.07) 50%, transparent 75%)'
              }}
            />
            {/* Top-right pink orb */}
            <div 
              className="absolute -top-16 -right-10 w-[420px] h-[420px] rounded-full blur-[40px]"
              style={{
                background: 'radial-gradient(circle, rgba(5, 162, 194, 0.18) 0%, rgba(5, 162, 194, 0.05) 45%, transparent 70%)'
              }}
            />
            {/* Bottom-right blue orb */}
            <div 
              className="absolute -bottom-28 -right-20 w-[550px] h-[550px] rounded-full blur-[40px]"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 70%)'
              }}
            />
          </div>
          <div className="relative z-10 w-full min-h-full flex flex-col p-4 sm:p-6 lg:p-8">
            <ToastProvider>
              <ImpersonationBanner />
              <div className="flex-1 w-full">
                <OnboardingModal />
                {children}
              </div>
              
              <footer className="w-full pt-20 pb-4 mt-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                     {/* Branding */}
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          {partner?.logo_url ? (
                            <img src={partner.logo_url} alt="Logo" className="w-4 h-4 object-contain" />
                          ) : (
                            <span className="text-white font-bold text-[10px]">{partner?.name?.charAt(0) || 'M'}</span>
                          )}
                        </div>
                        <span className="font-bold text-sm tracking-tight gradient-text">
                           {partner?.name || 'MicroApps Hub'}
                        </span>
                     </div>
                    {/* Confianza / Privacidad */}
                    <div className="h-px w-8 md:h-4 md:w-px bg-white/10" />
                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                       <a href="#" className="hover:text-white transition-colors">{language === 'en' ? 'Privacy' : 'Privacidad'}</a>
                       <a href="#" className="hover:text-white transition-colors">{language === 'en' ? 'Terms' : 'Términos'}</a>
                       <a href="#" className="hover:text-white transition-colors">{language === 'en' ? 'Support' : 'Soporte'}</a>
                    </div>
                  </div>
                  
                  {/* Claridad & Redes */}
                  <div className="flex flex-col items-center md:items-end gap-3 text-slate-500">
                    <div className="flex items-center gap-3">

                      <a href="#" className="hover:text-primary transition-colors hover:scale-110 active:scale-95">
                        <Code2 className="w-4 h-4" />
                      </a>
                      <a href="#" className="hover:text-primary transition-colors hover:scale-110 active:scale-95">
                        <Globe className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[11px]">
                        © 2026 {partner?.name || 'Antigravity Systems'}. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {language === 'en' ? 'Built with 🩵 and Gemini 1.5 Pro' : 'Construido con 🩵 y Gemini 1.5 Pro'}
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </ToastProvider>
          </div>
          {/* Floating Language Switcher for Guaranteed Visibility */}
          <div className="fixed bottom-6 right-6 z-50">
            <LanguageSwitcher />
          </div>
        </main>
      </div>
    </div>
  )
}
