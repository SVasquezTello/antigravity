'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Search, Bell, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onToggleMobileSidebar: () => void
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const router = useRouter()
  const { language } = useTranslation()
  const supabase = createClient()
  
  const [userName, setUserName] = useState<string>('')
  const [userInitials, setUserInitials] = useState<string>('U')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.email ? user.email.split('@')[0] : 'User'
        setUserName(name)
        setUserInitials(name.substring(0, 2).toUpperCase())
      }
    })

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <header className="shrink-0 h-16 relative z-30 border-b border-white/5 bg-base-100/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden p-2 text-base-content/80 hover:text-white transition-colors"
          onClick={onToggleMobileSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex relative items-center max-w-sm w-full group">
          <Search className="w-4 h-4 absolute left-3 text-base-content/50 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'en' ? 'Search...' : 'Buscar...'} 
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 focus:border-primary/50 rounded-full py-1.5 pl-10 pr-12 text-sm text-white placeholder-white/40 focus:outline-none transition-all"
          />
          <div className="absolute right-3 hidden lg:flex items-center pointer-events-none">
            <span className="text-xs text-base-content/40 font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/5">⌘K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <LanguageSwitcher />

        <div className="relative" ref={notificationsRef}>
          <button 
            className="relative p-2 rounded-full hover:bg-white/10 text-base-content/80 hover:text-white transition-colors"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full ring-2 ring-base-100"></span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-base-200 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-white/5">
                <h3 className="text-sm font-semibold">{language === 'en' ? 'Notifications' : 'Notificaciones'}</h3>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                <div className="p-3 bg-white/5 rounded-xl text-sm mb-1 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white">{language === 'en' ? 'System Update' : 'Actualización del Sistema'}</span>
                    <span className="text-xs text-base-content/40">2h</span>
                  </div>
                  <p className="text-base-content/70 text-xs">
                    {language === 'en' ? 'Miro-Apps Portal v2.0 is now live with glassmorphism UI.' : 'Miro-Apps Portal v2.0 está activo con interfaz glassmorphism.'}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 text-center border-t border-white/5 mt-1">
                <button className="text-xs text-primary hover:text-accent-pink transition-colors">
                  {language === 'en' ? 'View All' : 'Ver Todas'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
              {userInitials}
            </div>
            <ChevronDown className={`w-4 h-4 text-base-content/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0A0520] border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm text-white font-medium truncate">{userName}</p>
                <p className="text-xs text-base-content/60 truncate">{language === 'en' ? 'Administrator' : 'Administrador'}</p>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-4 py-2 text-sm text-base-content/80 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> {language === 'en' ? 'Profile' : 'Perfil'}
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-base-content/80 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                  <Settings className="w-4 h-4" /> {language === 'en' ? 'Settings' : 'Configuración'}
                </button>
                <div className="h-px bg-white/10 my-1 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
