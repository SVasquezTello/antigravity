'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'
import { Header } from '@/components/ui/Header'
import { ToastProvider } from '@/components/ui/ToastProvider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="fixed inset-0 w-full h-dvh flex overflow-hidden z-0 bg-base-100">
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
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.14) 25%, rgba(249, 115, 22, 0.07) 50%, transparent 75%)'
              }}
            />
            {/* Top-right pink orb */}
            <div 
              className="absolute -top-16 -right-10 w-[420px] h-[420px] rounded-full blur-[40px]"
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0.05) 45%, transparent 70%)'
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
          <div className="relative z-10 w-full h-full p-4 sm:p-6 lg:p-8">
            <ToastProvider>
              {children}
            </ToastProvider>
          </div>
        </main>
      </div>
    </div>
  )
}
