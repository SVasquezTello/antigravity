'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Zap, 
  Sparkles, 
  Clock, 
  LayoutGrid, 
  ChevronRight, 
  Rocket, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  UserCheck,
  DollarSign,
  TrendingUp as ProfitIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { useI18n } from '@/components/i18n-provider'

export function ClientView() {
  const { lang, t } = useI18n()
  const supabase = React.useMemo(() => createClient(), [])
  const [stats, setStats] = useState({
    credits: 0,
    apps: 269,
    history: 0,
    savedDollars: 0
  })

  useEffect(() => {
    const fetchClientData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch executions
      const { count: executions } = await supabase.from('app_executions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      
      // Fetch total apps
      const { count: totalApps } = await supabase.from('micro_apps').select('*', { count: 'exact', head: true })

      // Calculate ROI: Each generation saves roughly $45 in expert time
      const totalExecutions = executions || 0
      const saved = totalExecutions * 45

      setStats(prev => ({
        ...prev,
        apps: totalApps || 346,
        history: totalExecutions,
        savedDollars: saved
      }))
    }
    fetchClientData()
  }, [supabase])

  const quickStats = [
    { label: lang === 'es' ? 'Créditos de Inteligencia' : 'Intelligence Credits', value: lang === 'es' ? 'Ilimitados' : 'Unlimited', icon: Zap, color: 'text-amber-500' },
    { label: lang === 'es' ? 'Ecosistemas Activos' : 'Active Ecosystems', value: stats.apps, icon: LayoutGrid, color: 'text-primary' },
    { label: lang === 'es' ? 'Reportes Forjados' : 'Total Forged Reports', value: stats.history, icon: Activity, color: 'text-blue-500' }
  ]

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Workspace</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Ready to <br/><span className="text-primary italic">Automate?</span>
          </h1>
        </div>
        <Link href="/apps" className="group px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:invert transition-all active:scale-95 shadow-2xl">
           Explore Marketplace
           <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </header>

      {/* --- ROI PANEL (The Money View) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <GlassCard className="lg:col-span-2 p-10 bg-linear-to-br from-primary/10 to-transparent border-glow relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                        <DollarSign className="w-6 h-6" />
                     </div>
                     <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">{lang === 'es' ? 'Impacto Financiero ROI' : 'Financial Impact ROI'}</h3>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-8xl font-black italic tracking-tighter text-shimmer leading-none">
                        ${stats.savedDollars.toLocaleString()}
                     </h4>
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-2">{lang === 'es' ? 'Ahorros Operativos Netos' : 'Net Operational Savings'}</p>
                  </div>
                  <p className="text-white/30 text-xs leading-relaxed max-w-sm font-medium">
                     Antigravity escala tu productividad sin aumentar tu equipo. Cada reporte generado representa una reducción directa en costos operativos.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-8 md:border-l md:border-white/5 md:pl-10">
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Hours Saved</p>
                     <h5 className="text-4xl font-black text-white italic tracking-tighter">{stats.history * 2}h</h5>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-primary" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Efficiency</p>
                     <h5 className="text-4xl font-black text-white italic tracking-tighter">842%</h5>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-accent-pink" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Quality Score</p>
                     <h5 className="text-4xl font-black text-white italic tracking-tighter">9.8</h5>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '98%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-accent-blue" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Projected Annual</p>
                     <h5 className="text-3xl font-black text-white italic tracking-tighter text-shimmer">${(stats.savedDollars * 12).toLocaleString()}</h5>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-white/20" />
                     </div>
                  </div>
               </div>
            </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-8">
           {quickStats.map((stat, i) => (
             <GlassCard key={i} className="p-8 flex items-center justify-between border-glow transition-all group">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{stat.label}</p>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 shadow-inner`}>
                  <stat.icon className="w-7 h-7" />
                </div>
             </GlassCard>
           ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
         <div className="space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4 px-2">Frequent Solutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { name: 'AI Copywriter', desc: 'Convert visitors into buyers.', icon: Sparkles, slug: 'linkedin-gen' },
                 { name: 'Real Estate Closer', desc: 'Seal the deal with emotion.', icon: Rocket, slug: 'brief-propiedad-pro' }
               ].map((app, i) => (
                 <Link href={`/apps/${app.slug}`} key={i}>
                  <GlassCard className="p-8 flex items-center justify-between group hover:bg-primary/5 cursor-pointer border-white/5">
                      <div className="flex gap-6 items-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-all shadow-inner"><app.icon className="w-7 h-7" /></div>
                        <div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{app.name}</h4>
                            <p className="text-xs text-white/30">{app.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </GlassCard>
                 </Link>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4 px-2">System Status</h3>
            <GlassCard className="p-8 space-y-6 bg-linear-to-br from-primary/20 to-transparent border-primary/20">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 animate-pulse"><UserCheck className="w-5 h-5" /></div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">{lang === 'es' ? 'Plan Activo' : 'Plan Active'}</p>
                     <p className="text-sm font-bold text-white uppercase italic">{lang === 'es' ? 'Professional Ilimitado' : 'Professional Unlimited'}</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                     <span>Platform Capacity</span>
                     <span>98%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="w-[98%] h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  )
}
