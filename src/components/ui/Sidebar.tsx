import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { createClient } from '@/utils/supabase/client'
import { 
  ChevronsLeft, 
  ChevronsRight, 
  LayoutDashboard, 
  X, 
  Sparkles,
  LayoutGrid,
  CreditCard,
  Shield,
  Search,
  PenTool,
  Mail,
  Video,
  FileText,
  Users,
  Radio
} from 'lucide-react'

const ICON_COMPONENTS: Record<string, any> = {
  LayoutDashboard,
  LayoutGrid,
  CreditCard,
  Shield,
  Search,
  PenTool,
  Mail,
  Video,
  FileText,
  Users
}
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useTranslation()
  const pathname = usePathname()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        if (data?.role === 'admin') {
          setIsAdmin(true)
        }
      }
    }
    fetchRole()
  }, [supabase])

  const getIcon = (iconName: string, isActive: boolean) => {
    const IconComponent = ICON_COMPONENTS[iconName] || Sparkles
    
    return (
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`p-1.5 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'
      }`}>
        <IconComponent className="w-4 h-4 shrink-0" />
      </motion.div>
    )
  }

  const navItemClass = (path: string, isActive: boolean, isChild?: boolean) => {
    let base = "flex items-center gap-3 rounded-xl transition-all group relative overflow-hidden "
    if (isChild) {
      base += collapsed ? "justify-center px-2 py-2 ml-0 pl-2 text-xs " : "ml-4 pl-4 py-2 text-xs border-l border-white/10 "
    } else {
      base += "px-3 py-2.5 "
    }
    
    if (isActive) {
      return base + "bg-white/5 text-white border border-white/10 shadow-[inset_0_0_20px_rgba(124,58,237,0.1)] "
    }
    return base + "text-white/50 hover:text-white hover:bg-white/5"
  }

  const DesktopSidebar = (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col shrink-0 h-full border-r border-white/5 bg-white/5 backdrop-blur-3xl relative z-40"
    >
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/5 shrink-0`}>
        <motion.div 
          layout
          className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"
        >
          <span className="text-white font-bold text-sm">M</span>
        </motion.div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg ml-3 tracking-tight gradient-text truncate"
            >
              MicroApps Hub
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-hide">
        <div className="flex flex-col gap-1 px-3">
          <Link href="/dashboard" className={navItemClass('/dashboard', pathname === '/dashboard')}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {language === 'en' ? 'Dashboard' : 'Panel de Control'}
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
              >
                {language === 'en' ? 'Dashboard' : 'Panel de Control'}
              </motion.div>
            )}
          </Link>

          <Link href="/apps" className={navItemClass('/apps', pathname.startsWith('/apps'))}>
            {getIcon('LayoutGrid', pathname.startsWith('/apps'))}
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Micro Apps
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
              >
                Micro Apps
              </motion.div>
            )}
          </Link>

          <Link href="/plans" className={navItemClass('/plans', pathname.startsWith('/plans'))}>
            {getIcon('CreditCard', pathname.startsWith('/plans'))}
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {language === 'en' ? 'Plans' : 'Planes'}
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
              >
                {language === 'en' ? 'Plans' : 'Planes'}
              </motion.div>
            )}
          </Link>
        </div>
      </div>

      <div className={`p-4 border-t border-white/5 flex flex-col gap-2 shrink-0`}>
        {isAdmin && (
          <>
            <Link href="/admin" className={navItemClass('/admin', pathname === '/admin')}>
              <Shield className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Admin
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
                >
                  Admin
                </motion.div>
              )}
            </Link>

            <Link href="/admin/webhooks" className={navItemClass('/admin/webhooks', pathname.startsWith('/admin/webhooks'), true)}>
              <Radio className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Webhooks
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
                >
                  Webhooks
                </motion.div>
              )}
            </Link>

            <Link href="/admin/email" className={navItemClass('/admin/email', pathname.startsWith('/admin/email'), true)}>
              <Mail className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Email
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-2 py-1 bg-base-300 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-xl"
                >
                  Email
                </motion.div>
              )}
            </Link>
          </>
        )}
        
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            title={language === 'en' ? 'Toggle Sidebar' : 'Alternar Barra'}
          >
            {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  )

  const MobileSidebar = (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-base-200/95 backdrop-blur-3xl border-r border-white/10 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="font-bold text-lg tracking-tight gradient-text">MicroApps Hub</span>
                </div>
                <button onClick={onCloseMobile} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 px-3">
                <div className="flex flex-col gap-1">
                  <Link onClick={onCloseMobile} href="/dashboard" className={navItemClass('/dashboard', pathname === '/dashboard')}>
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{language === 'en' ? 'Dashboard' : 'Panel de Control'}</span>
                  </Link>

                  <Link onClick={onCloseMobile} href="/apps" className={navItemClass('/apps', pathname.startsWith('/apps'))}>
                    <LayoutGrid className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">Micro Apps</span>
                  </Link>

                  <Link onClick={onCloseMobile} href="/plans" className={navItemClass('/plans', pathname.startsWith('/plans'))}>
                    <CreditCard className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{language === 'en' ? 'Plans' : 'Planes'}</span>
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 flex flex-col gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <Link onClick={onCloseMobile} href="/admin" className={navItemClass('/admin', pathname === '/admin')}>
                      <Shield className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                    <Link onClick={onCloseMobile} href="/admin/webhooks" className={navItemClass('/admin/webhooks', pathname.startsWith('/admin/webhooks'), true)}>
                      <Radio className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">Webhooks</span>
                    </Link>
                    <Link onClick={onCloseMobile} href="/admin/email" className={navItemClass('/admin/email', pathname.startsWith('/admin/email'), true)}>
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">Email</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  )
}
