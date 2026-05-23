'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Search, 
  Zap, 
  Star, 
  Lock, 
  Sparkles, 
  Clock,
  ArrowRight,
  ExternalLink,
  Loader2,
  MessageSquare,
  TrendingUp,
  ClipboardCheck,
  BarChart3,
  Activity,
  Users,
  Layout,
  Rocket,
  Shield,
  Briefcase,
  GraduationCap,
  Scale,
  Heart,
  ShoppingCart,
  Scissors,
  Factory,
  Home,
  Leaf,
  Wrench,
  Target,
  Sprout,
  ShieldCheck,
  Flame,
  BookOpen,
  Settings,
  Grid,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const IconMap: Record<string, any> = {
  MessageSquare,
  TrendingUp,
  ClipboardCheck,
  BarChart3,
  Activity,
  Sparkles,
  Rocket,
  Users,
  Layout,
  Shield,
  Briefcase,
  GraduationCap,
  Scale,
  Heart,
  ShoppingCart,
  Scissors,
  Leaf,
  Wrench,
  Sprout,
  ShieldCheck,
  Home,
  Factory,
  BookOpen,
  Settings,
  Grid,
  Flame,
  AlertCircle,
  Calendar,
  Search
}

export default function AppMarketplacePage() {
  const { language, t } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  
  const [apps, setApps] = useState<any[]>([])
  const [accessibleAppIds, setAccessibleAppIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        // 1. Fetch User Data (Plan and Role)
        const { data: userData } = await supabase
          .from('users')
          .select('plan_id, role')
          .eq('id', user.id)
          .single()

        const userIsAdmin = userData?.role === 'admin' || userData?.role === 'super_admin'
        setIsAdmin(userIsAdmin)

        // 2. Fetch Apps from micro_apps
        const { data: appData, error: appError } = await supabase
          .from('micro_apps')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (appData) setApps(appData)
        if (appError) console.error('Marketplace: Apps fetch error', appError.message)

        // 3. Determine Accessible Apps
        const accessibleIds = new Set<string>()
        
        if (userIsAdmin) {
          // Admins see everything as unlocked
          appData?.forEach((app: any) => accessibleIds.add(app.id))
        } else {
          // Fetch apps from user's plan
          if (userData?.plan_id) {
            const { data: planApps } = await supabase
              .from('plan_apps')
              .select('app_id')
              .eq('plan_id', userData.plan_id)
            
            planApps?.forEach((pa: any) => accessibleIds.add(pa.app_id))
          }
          
          // Fetch individual overrides
          const { data: overrides } = await supabase
            .from('user_app_overrides')
            .select('app_id')
            .eq('user_id', user.id)
          
          overrides?.forEach((ov: any) => accessibleIds.add(ov.app_id))
          
          // DEMO FALLBACK: If user has no plan and no overrides, unlock everything for commercial launch showcase
          if (accessibleIds.size === 0) {
            appData?.forEach(app => accessibleIds.add(app.id))
          }
        }
        
        setAccessibleAppIds(accessibleIds)
      } catch (e) {
        console.error('Marketplace: General data fetch error', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  const categories = language === 'es' 
    ? [
        { id: 'all', label: 'Todas', icon: Layout },
        { id: 'Manufacturing', label: 'Manufactura', icon: Factory },
        { id: 'Marketing', label: 'Marketing', icon: Target },
        { id: 'Legal', label: 'Legal', icon: Scale },
        { id: 'RRHH', label: 'RRHH', icon: Users },
        { id: 'Finanzas', label: 'Finanzas', icon: BarChart3 },
        { id: 'Inmobiliaria', label: 'Inmobiliaria', icon: Home },
        { id: 'Hogar y Jardín', label: 'Hogar y Jardín', icon: Leaf },
        { id: 'Agencias', label: 'Agencias', icon: Briefcase },
        { id: 'Education', label: 'Educación', icon: GraduationCap }
      ]
    : [
        { id: 'all', label: 'All', icon: Layout },
        { id: 'Manufacturing', label: 'Manufacturing', icon: Factory },
        { id: 'Marketing', label: 'Marketing', icon: Target },
        { id: 'Legal', label: 'Legal', icon: Scale },
        { id: 'RRHH', label: 'RRHH', icon: Users },
        { id: 'Finanzas', label: 'Finance', icon: BarChart3 },
        { id: 'Inmobiliaria', label: 'Real Estate', icon: Home },
        { id: 'Hogar y Jardín', label: 'Home & Garden', icon: Leaf },
        { id: 'Agencies', label: 'Agencies', icon: Briefcase },
        { id: 'Education', label: 'Education', icon: GraduationCap }
      ]
  
  const filteredApps = apps.filter(app => {
    const appName = language === 'en' ? app.name_en : app.name_es
    const matchSearch = appName?.toLowerCase().includes(search.toLowerCase())
    
    // Virtual Category Mapping
    let appCategory = 'other'
    const slug = app.slug?.toLowerCase() || ''
    
    if (slug.includes('talent') || slug.includes('rrhh') || slug.includes('seleccio') || slug.includes('empleado')) appCategory = 'RRHH'
    if (slug.includes('decide') || slug.includes('pulse') || slug.includes('finanz') || slug.includes('coti') || slug.includes('fiscal') || slug.includes('contador') || slug.includes('roi') || slug.includes('impacto')) appCategory = 'Finanzas'
    if (slug.includes('marketing') || slug.includes('ads') || slug.includes('post') || slug.includes('seo') || slug.includes('copy') || slug.includes('brand') || slug.includes('viral')) appCategory = 'Marketing'
    if (slug.includes('greenhome') || slug.includes('fixcasa') || slug.includes('decospace') || slug.includes('huertosmart') || slug.includes('cleanmaster') || slug.includes('jardin') || slug.includes('limpieza') || slug.includes('garden')) appCategory = 'Hogar y Jardín'
    if (slug.includes('inmo') || slug.includes('propiedad') || (slug.includes('home') && !slug.includes('greenhome')) || slug.includes('realestate')) appCategory = 'Inmobiliaria'
    if (slug.includes('agency') || slug.includes('scope') || slug.includes('brief') || slug.includes('pitch')) appCategory = 'Agencias'
    if (slug.includes('expert') || slug.includes('coach') || slug.includes('mentoria') || slug.includes('roadmap') || slug.includes('workshop') || slug.includes('session')) appCategory = 'Coaching'
    if (slug.includes('dental') || slug.includes('spa') || slug.includes('medico') || slug.includes('salud') || slug.includes('odontolog')) appCategory = 'Salud'
    if (slug.includes('retail') || slug.includes('venta') || slug.includes('tienda') || slug.includes('inventario') || slug.includes('retail')) appCategory = 'Retail'
    if (slug.includes('belleza') || slug.includes('estetic') || slug.includes('beauty') || slug.includes('salon')) appCategory = 'Beauty'
    if (slug.includes('manufactura') || slug.includes('produccion') || slug.includes('fabrica') || slug.includes('factory') || slug.includes('quality') || slug.includes('lean') || slug.includes('maint')) appCategory = 'Manufacturing'
    if (slug.includes('educacion') || slug.includes('academy') || slug.includes('curso') || slug.includes('estudiante') || slug.includes('edu')) appCategory = 'Education'
    if (slug.includes('legal') || slug.includes('contrato') || slug.includes('law') || slug.includes('gavel') || slug.includes('audit')) {
       // Only map to Legal if it doesn't match Manufacturing (Industrial Audits)
       if (appCategory !== 'Manufacturing') appCategory = 'Legal'
    }

    const matchCategory = category === 'all' || appCategory === category
    return matchSearch && matchCategory
  })

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 p-4">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
          >
             <Zap className="w-4 h-4 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('sidebar.solutions')} Marketplace</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8]"
          >
             Market <br/><span className="text-shimmer italic">{t('common.apps')}</span>
          </motion.h1>
          <p className="text-white/30 text-sm max-w-md font-medium leading-relaxed">
             Despliega inteligencia especializada en segundos. Cada micro-app es un motor de crecimiento para tu industria.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('sidebar.find_solution') || 'Buscar solución...'} 
                className="relative w-full sm:w-80 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/20"
              />
           </div>
        </div>
      </header>

      {/* Category Switcher */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
         {categories.map((cat, idx) => (
           <motion.button 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: idx * 0.05 }}
             key={cat.id} 
             onClick={() => setCategory(cat.id)}
             className={`px-10 py-4 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-3 ${category === cat.id ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105' : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white/60 hover:bg-white/[0.05]'}`}
           >
             <cat.icon className={`w-4 h-4 ${category === cat.id ? 'animate-pulse' : ''}`} />
             {cat.label}
           </motion.button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <GlassCard key={i} className="p-10 h-[380px] space-y-6">
              <div className="flex justify-between">
                <Skeleton className="w-16 h-16 rounded-3xl" />
                <Skeleton className="w-16 h-4" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-3/4 h-10" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
              <div className="pt-8">
                <Skeleton className="w-full h-16 rounded-3xl" />
              </div>
            </GlassCard>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => {
              const isLocked = !accessibleAppIds.has(app.id)
              const name = language === 'en' ? app.name_en : app.name_es
              const description = language === 'en' ? app.description_en : app.description_es
              const AppIcon = IconMap[app.icon] || Sparkles
              
              // Dynamic category glow color
              let glowClass = 'group-hover:border-primary/50'
              let iconBg = 'bg-primary/10 text-primary border-primary/20'
              const slug = app.slug?.toLowerCase() || ''
              
              if (slug.includes('greenhome') || slug.includes('jardin')) {
                glowClass = 'group-hover:border-emerald-500/50'
                iconBg = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              } else if (slug.includes('manufactura') || slug.includes('factory')) {
                glowClass = 'group-hover:border-amber-500/50'
                iconBg = 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }

              return (
                <motion.div 
                  key={app.id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <GlassCard className={`p-10 h-full flex flex-col justify-between group relative overflow-hidden transition-all duration-700 border-glow ${isLocked ? 'grayscale opacity-40' : `hover:bg-white/[0.02] hover:-translate-y-3 ${glowClass}`}`}>
                     {/* Dynamic Light Aura */}
                     {!isLocked && <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${iconBg.split(' ')[0]}`} />}
                     
                     <div className="space-y-8 relative z-10">
                        <div className="flex justify-between items-start">
                           <div className={`w-16 h-16 rounded-[2rem] border flex items-center justify-center transition-all duration-700 ${isLocked ? 'bg-white/5 border-white/10 text-white/10' : `${iconBg} shadow-2xl group-hover:scale-110 group-hover:rotate-6`}`}>
                              <AppIcon className="w-8 h-8" />
                           </div>
                           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="text-[10px] text-white/40 font-black uppercase tracking-tighter">4.9</span>
                           </div>
                        </div>
    
                        <div className="space-y-3">
                           <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-shimmer transition-all">{name}</h3>
                           <p className="text-xs text-white/30 font-medium leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors">{description}</p>
                        </div>
    
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 border border-primary/10">
                              <Zap className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Premium</span>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                              <Sparkles className="w-3 h-3 text-white/40" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">AI Ready</span>
                           </div>
                        </div>
                     </div>
    
                     <div className="mt-10 flex flex-col gap-4 relative z-10">
                        {isLocked ? (
                          <Link href="/pricing" className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                             <Lock className="w-4 h-4" /> {t('sidebar.upgrade_to_unlock')}
                          </Link>
                        ) : (
                          <>
                            <Link href={`/apps/${app.slug}`} className="w-full py-5 bg-white text-black rounded-3xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl shimmer-btn">
                               {t('sidebar.launch_solution')}
                               <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href={`/showcase/${app.slug}`} target="_blank" className="w-full py-3 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white/40 transition-all">
                               <ExternalLink className="w-4 h-4" /> Showcase Page
                            </Link>
                          </>
                        )}
                     </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredApps.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
              <Sparkles className="w-10 h-10" />
           </div>
           <p className="text-white/20 font-black uppercase tracking-widest text-xs">
             {t('sidebar.no_solutions')}
           </p>
        </div>
      )}
    </div>
  )
}
