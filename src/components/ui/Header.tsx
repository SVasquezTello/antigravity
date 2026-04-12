'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Search, Bell, Menu, User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onToggleMobileSidebar: () => void
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useTranslation()
  const supabase = createClient()
  
  const [userName, setUserName] = useState<string>('')
  const [userInitials, setUserInitials] = useState<string>('U')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Breadcrumbs Logic
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter((p: string) => p)
    if (parts.length === 0) return <span className="text-white font-black text-[11px] uppercase tracking-widest">Portal</span>
    
    return parts.map((part: string, i: number) => {
      const isLast = i === parts.length - 1
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
      return (
        <React.Fragment key={part}>
          <span className={`transition-colors text-[11px] uppercase tracking-widest ${isLast ? 'text-white font-black' : 'text-white/30 font-bold'}`}>
            {label}
          </span>
          {!isLast && <div className="w-1 h-1 rounded-full bg-white/10 mx-1" />}
        </React.Fragment>
      )
    })
  }

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
    <header className="shrink-0 h-16 relative z-30 border-b border-white/5 bg-[#050014]/50 backdrop-blur-3xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6 flex-1">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden p-2 text-base-content/80 hover:text-white transition-colors"
          onClick={onToggleMobileSidebar}
        >
          <Menu className="w-6 h-6" />
        </motion.button>
        
        {/* Breadcrumbs & Status */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm transition-all hover:bg-white/10"
          >
             {getBreadcrumbs()}
          </motion.div>
          
          <div className="h-4 w-px bg-white/10 mx-2" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/5 border border-green-500/10 group"
          >
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80 group-hover:text-green-400 transition-colors">
                Gemini AI Live
             </span>
          </motion.div>
        </div>

        {/* Portable Search */}
        <div className="md:hidden sm:flex relative items-center max-w-sm w-full group">
          <Search className="w-4 h-4 absolute left-3 text-base-content/50 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={language === 'en' ? 'Search...' : 'Buscar...'} 
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 focus:border-primary/50 rounded-full py-1.5 pl-10 pr-12 text-sm text-white focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center">
           <LanguageSwitcher />
        </div>

        <div className="relative" ref={notificationsRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-base-content/80 hover:text-white transition-all shadow-lg"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent-pink rounded-full ring-2 ring-[#050014]"></span>
          </motion.button>
          
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-3 w-80 bg-base-200 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-white/5">
                  <h3 className="text-sm font-semibold">{language === 'en' ? 'Notifications' : 'Notificaciones'}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  <div className="p-3 bg-white/5 rounded-xl text-sm mb-1 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white flex items-center gap-2 text-xs">
                          <Sparkles className="w-3 h-3 text-primary" />
                          {language === 'en' ? 'System Update' : 'Actualización'}
                      </span>
                      <span className="text-[10px] text-base-content/40">Now</span>
                    </div>
                    <p className="text-base-content/70 text-[11px] leading-relaxed">
                      Welcome to the improved MicroApps Hub Portal v2.1.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={dropdownRef}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-1 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group active:scale-95"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-blue rounded-full blur opacity-25 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-xs font-black shadow-xl ring-2 ring-white/10">
                  {userInitials}
                </div>
            </div>
            <ChevronDown className={`hidden sm:block w-4 h-4 text-base-content/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-3 w-56 bg-base-200/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 origin-top-right"
              >
                <div className="px-4 py-4 border-b border-white/10 bg-white/5">
                  <p className="text-sm text-white font-bold truncate leading-none mb-1">{userName}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary/80 font-black">{language === 'en' ? 'Premium Member' : 'Miembro Premium'}</p>
                </div>
                <div className="p-1">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-base-content/80 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all">
                    <User className="w-4 h-4" /> {language === 'en' ? 'Profile' : 'Perfil'}
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-base-content/80 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all">
                    <Settings className="w-4 h-4" /> {language === 'en' ? 'Settings' : 'Configuración'}
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-300 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
