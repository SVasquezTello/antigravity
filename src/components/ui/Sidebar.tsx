'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { Languages, ChevronsLeft, ChevronsRight, LayoutDashboard, LayoutGrid, X } from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useTranslation()

  const DesktopSidebar = (
    <aside 
      className={`hidden lg:flex flex-col shrink-0 h-full border-r border-white/5 bg-white/5 backdrop-blur-3xl transition-all duration-300 relative z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/5 shrink-0`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg ml-3 tracking-tight gradient-text truncate">MicroApps</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-hide">
        <div className="flex flex-col gap-1 px-3">
          {!collapsed && (
            <h4 className="px-3 text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Micro Apps' : 'Micro Apps'}
            </h4>
          )}
          
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 transition-colors group relative">
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{language === 'en' ? 'Dashboard' : 'Panel de Control'}</span>}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10 shadow-xl">
                {language === 'en' ? 'Dashboard' : 'Panel de Control'}
              </div>
            )}
          </Link>

          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base-content/70 hover:text-white hover:bg-white/5 transition-colors group relative cursor-not-allowed">
            <Languages className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{language === 'en' ? 'Micro App #1' : 'Micro App #1'}</span>}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10 shadow-xl">
                 {language === 'en' ? 'Micro App #1' : 'Micro App #1'}
              </div>
            )}
          </Link>
          
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base-content/70 hover:text-white hover:bg-white/5 transition-colors group relative cursor-not-allowed">
            <LayoutGrid className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{language === 'en' ? 'Micro App #2' : 'Micro App #2'}</span>}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10 shadow-xl">
                 {language === 'en' ? 'Micro App #2' : 'Micro App #2'}
              </div>
            )}
          </Link>
        </div>
      </div>

      <div className={`p-4 border-t border-white/5 flex ${collapsed ? 'justify-center' : 'justify-end'} shrink-0`}>
        <button 
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-base-content/50 hover:text-white hover:bg-white/10 transition-colors"
          title={language === 'en' ? 'Toggle Sidebar' : 'Alternar Barra'}
        >
          {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  )

  const MobileSidebar = (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      />
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-200/95 backdrop-blur-3xl border-r border-white/10 flex flex-col transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">MicroApps</span>
          </div>
          <button onClick={onCloseMobile} className="p-2 text-base-content/60 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 px-3">
          <div className="flex flex-col gap-1">
            <h4 className="px-3 text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Micro Apps' : 'Micro Apps'}
            </h4>
            
            <Link onClick={onCloseMobile} href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{language === 'en' ? 'Dashboard' : 'Panel de Control'}</span>
            </Link>

            <Link onClick={onCloseMobile} href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base-content/70 hover:text-white hover:bg-white/5 transition-colors">
              <Languages className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{language === 'en' ? 'Micro App #1' : 'Micro App #1'}</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  )
}
