'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Search, Bell, Menu, User, Settings, LogOut, ChevronDown, Sparkles, Zap, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface HeaderProps {
  onToggleMobileSidebar: () => void
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { language, t } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  
  const [userName, setUserName] = useState<string>('')
  const [userInitials, setUserInitials] = useState<string>('U')
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [isLight, setIsLight] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.is_read).length
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const [partner, setPartner] = useState<any>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // User Profile
      const name = user.email ? user.email.split('@')[0] : 'User'
      setUserName(name)
      setUserInitials(name.substring(0, 2).toUpperCase())

      try {
        const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (userData) {
          if (userData.avatar_url) setUserAvatarUrl(userData.avatar_url)
          
          // Fetch Branding (16.1)
          if ('partner_id' in userData && userData.partner_id) {
            const { data: pData } = await supabase.from('partners').select('*').eq('id', userData.partner_id).single()
            setPartner(pData)
          }

          if (userData.workspace_id) {
            const { data: clientData } = await supabase.from('workspaces').select('credits').eq('id', userData.workspace_id).single()
            setBalance(clientData?.credits || 0)
          }
        } else if (userError) {
          console.warn('Header: Failed to fetch user profile', userError.message)
        }
      } catch (e) {
        console.warn('Header: Exception in user profile fetch', e)
      }

      // Initial Notifs
      try {
        const { data: notifData, error: notifError } = await supabase.rpc('get_user_notifications', { p_user_id: user.id })
        if (notifData) setNotifications(notifData)
        if (notifError) console.warn('Header: Notifications RPC failed', notifError.message)
      } catch (e) {
        console.warn('Header: Notifications exception', e)
      }
    }

    fetchData()

    // Realtime Notifications
    const channel = supabase.channel('header_notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
         fetchData()
      })
      .subscribe()

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false)
    }

    // Theme Init (25.1)
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'light') {
      setIsLight(true)
      document.documentElement.classList.add('light')
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const toggleTheme = () => {
    const next = !isLight
    setIsLight(next)
    if (next) {
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      
      if (!error) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      }
    } catch (e) {
      console.warn('Header: Failed to mark notification as read', e)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <header className="shrink-0 h-20 relative z-30 border-b border-white/5 bg-transparent flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6 flex-1">
        <button onClick={onToggleMobileSidebar} className="lg:hidden p-2 text-white/30 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center flex-1 max-w-md">
           <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder={t('common.search') || 'Buscar Micro-Apps...'}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.06] focus:border-primary/30 transition-all"
              />
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        {/* Credits Badge */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
            balance < 50 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
            balance < 150 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
            'bg-green-500/10 border-green-500/20 text-green-500'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${balance < 50 ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">{balance} {t('common.credits')}</span>
        </motion.div>

        {/* Theme Toggle (25.1) */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-white/30 hover:text-white transition-all overflow-hidden"
        >
           <motion.div
             initial={false}
             animate={{ rotate: isLight ? 180 : 0, scale: isLight ? 1.1 : 1 }}
             transition={{ type: 'spring', stiffness: 200 }}
           >
             {isLight ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
           </motion.div>
        </button>

        {/* Notifications Dropdown (13.1) */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-white/30 hover:text-white transition-all relative group"
          >
            <Bell className="w-5 h-5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary text-[8px] text-white font-black rounded-full flex items-center justify-center border-2 border-[#050014]"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-[#0A001E]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('common.recent_alerts')}</span>
                  <Link href="/notifications" onClick={() => setNotificationsOpen(false)} className="text-[10px] font-black text-primary uppercase hover:underline">{t('common.view_hub')}</Link>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                      <Bell className="w-8 h-8 text-white/5 mx-auto" />
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{t('common.all_clear')}</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer ${!n.is_read ? 'bg-primary/5' : ''}`}
                      >
                         <div className="flex gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                             n.type === 'billing' ? 'bg-amber-500/10 text-amber-500' : 
                             n.type === 'security' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                           }`}>
                             <Bell className="w-5 h-5" />
                           </div>
                           <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                               {!n.is_read && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                             </div>
                             <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2">{n.message}</p>
                             <p className="text-[8px] font-black text-white/10 uppercase tracking-widest pt-1">{t('common.just_now')}</p>
                           </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LanguageSwitcher />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 overflow-hidden">
               {userAvatarUrl ? <img src={userAvatarUrl} className="w-full h-full object-cover" /> : userInitials}
            </div>
            <span className="hidden sm:block text-xs font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-widest">{userName}</span>
            <ChevronDown className={`w-4 h-4 text-white/20 group-hover:text-white transition-all ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-4 w-56 bg-[#0A001E]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                   <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                      <User className="w-4 h-4" /> {t('common.profile')}
                   </Link>
                   <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                      <Settings className="w-4 h-4" /> {t('common.settings')}
                   </Link>
                   <div className="h-px bg-white/5 mx-2 my-2" />
                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all text-xs font-bold uppercase tracking-widest">
                      <LogOut className="w-4 h-4" /> {t('common.logout')}
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
