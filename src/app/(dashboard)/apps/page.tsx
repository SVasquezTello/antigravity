'use client'

import React, { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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

  const categories = ['all', 'RRHH', 'Finanzas', 'Marketing', 'Inmobiliaria', 'Agencias', 'Coaching', 'Salud', 'Retail', 'Beauty', 'Manufacturing', 'Education', 'Legal']
  
  const filteredApps = apps.filter(app => {
    const appName = language === 'en' ? app.name_en : app.name_es
    const matchSearch = appName?.toLowerCase().includes(search.toLowerCase())
    
    // Virtual Category Mapping
    let appCategory = 'other'
    const slug = app.slug?.toLowerCase() || ''
    
    if (slug.includes('talent') || slug.includes('rrhh') || slug.includes('seleccio') || slug.includes('empleado')) appCategory = 'RRHH'
    if (slug.includes('decide') || slug.includes('pulse') || slug.includes('finanz') || slug.includes('coti') || slug.includes('fiscal') || slug.includes('contador') || slug.includes('roi') || slug.includes('impacto')) appCategory = 'Finanzas'
    if (slug.includes('marketing') || slug.includes('ads') || slug.includes('post') || slug.includes('seo') || slug.includes('copy') || slug.includes('brand') || slug.includes('viral')) appCategory = 'Marketing'
    if (slug.includes('inmo') || slug.includes('propiedad') || slug.includes('casa') || slug.includes('home') || slug.includes('realestate')) appCategory = 'Inmobiliaria'
    if (slug.includes('agency') || slug.includes('scope') || slug.includes('brief') || slug.includes('pitch')) appCategory = 'Agencias'
    if (slug.includes('expert') || slug.includes('coach') || slug.includes('mentoria') || slug.includes('roadmap') || slug.includes('workshop') || slug.includes('session')) appCategory = 'Coaching'
    if (slug.includes('dental') || slug.includes('spa') || slug.includes('medico') || slug.includes('salud') || slug.includes('odontolog')) appCategory = 'Salud'
    if (slug.includes('retail') || slug.includes('venta') || slug.includes('tienda') || slug.includes('inventario') || slug.includes('retail')) appCategory = 'Retail'
    if (slug.includes('belleza') || slug.includes('estetic') || slug.includes('beauty') || slug.includes('salon')) appCategory = 'Beauty'
    if (slug.includes('manufactura') || slug.includes('produccion') || slug.includes('fabrica') || slug.includes('factory')) appCategory = 'Manufacturing'
    if (slug.includes('educacion') || slug.includes('academy') || slug.includes('curso') || slug.includes('estudiante') || slug.includes('edu')) appCategory = 'Education'
    if (slug.includes('legal') || slug.includes('contrato') || slug.includes('law') || slug.includes('gavel') || slug.includes('audit')) appCategory = 'Legal'

    const matchCategory = category === 'all' || appCategory === category
    return matchSearch && matchCategory
  })

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 p-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-primary"
          >
             <Zap className="w-6 h-6" />
             <span className="text-sm font-bold uppercase tracking-widest">{t('sidebar.solutions')} Marketplace</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
          >
             Market <span className="text-primary italic">{t('common.apps')}</span>
          </motion.h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('sidebar.find_solution')} 
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-white/20"
              />
           </div>
        </div>
      </header>

      {/* Category Switcher */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
         {categories.map((cat, idx) => (
           <motion.button 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: idx * 0.05 }}
             key={cat} 
             onClick={() => setCategory(cat)}
             className={`px-8 py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${category === cat ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 text-white/20 hover:text-white/40'}`}
           >
             {cat}
           </motion.button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <GlassCard key={i} className="p-8 h-[320px] space-y-6">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="w-12 h-4" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
              <div className="pt-4">
                <Skeleton className="w-full h-12 rounded-2xl" />
              </div>
            </GlassCard>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => {
              const isLocked = !accessibleAppIds.has(app.id)
              const name = language === 'en' ? app.name_en : app.name_es
              const description = language === 'en' ? app.description_en : app.description_es
              
              return (
                <motion.div 
                  key={app.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard className={`p-8 h-full flex flex-col justify-between group relative overflow-hidden transition-all duration-500 ${isLocked ? 'grayscale opacity-60' : 'hover:border-primary/40 hover:bg-primary/[0.02]'}`}>
                     <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLocked ? 'bg-white/5 text-white/10' : 'bg-primary/10 text-primary shadow-lg shadow-primary/10 group-hover:scale-110'}`}>
                              <Sparkles className="w-6 h-6" />
                           </div>
                           <div className="flex gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">4.8</span>
                           </div>
                        </div>
    
                        <div className="space-y-2">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{name}</h3>
                           <p className="text-xs text-white/30 font-medium leading-relaxed line-clamp-2">{description}</p>
                        </div>
    
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                           <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> {t('sidebar.premium_tool')}</span>
                           <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> AI Powered</span>
                        </div>
                     </div>
    
                     <div className="mt-8">
                        {isLocked ? (
                          <Link href="/pricing" className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                             <Lock className="w-4 h-4" /> {t('sidebar.upgrade_to_unlock')}
                          </Link>
                        ) : (
                          <Link href={`/apps/${app.slug}`} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:invert transition-all active:scale-95 shadow-xl">
                             {t('sidebar.launch_solution')}
                             <ArrowRight className="w-4 h-4" />
                          </Link>
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
