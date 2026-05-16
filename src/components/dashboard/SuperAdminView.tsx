'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Building2, 
  Users, 
  Wallet, 
  Activity, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Package
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardChart } from '@/components/ui/DashboardChart'

export function SuperAdminView() {
  const supabase = React.useMemo(() => createClient(), [])
  const [stats, setStats] = useState({
    partners: 0,
    clients: 0,
    revenue: 0,
    credits: 0
  })

  useEffect(() => {
    const fetchGlobalStats = async () => {
      // 15.1 Métricas reales de plataforma
      const { count: pCount } = await supabase.from('partners').select('*', { count: 'exact', head: true })
      const { count: cCount } = await supabase.from('workspaces').select('*', { count: 'exact', head: true })
      const { data: creditsData } = await supabase.from('workspaces').select('credits')
      
      const totalCredits = creditsData?.reduce((acc, curr) => acc + (curr.credits || 0), 0) || 0
      
      setStats({
        partners: pCount || 0,
        clients: cCount || 0,
        revenue: 12450, // Placeholder while payment records populate
        credits: totalCredits
      })
    }
    fetchGlobalStats()
  }, [supabase])

  const kpis = [
    { label: 'Active Partners', value: stats.partners, icon: Building2, color: 'text-primary' },
    { label: 'Total Clients', value: stats.clients, icon: Users, color: 'text-blue-500' },
    { label: 'Global Liquidity', value: `$${stats.revenue}`, icon: Wallet, color: 'text-green-500' },
    { label: 'Credits in Circulation', value: stats.credits, icon: Zap, color: 'text-amber-500' }
  ]

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure Overview</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
          Platform <span className="text-primary italic">Status</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-8 space-y-6 border-glow hover:bg-white/[0.02] transition-all group overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-primary/5 transition-all duration-700" />
              <div className="flex justify-between items-start relative z-10">
                 <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${kpi.color} group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 shadow-2xl`}>
                    <kpi.icon className="w-7 h-7" />
                 </div>
                 <div className="text-[10px] font-black text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full tracking-tighter shadow-inner">+12%</div>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-white italic tracking-tighter text-shimmer">{kpi.value}</h3>
                   <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">LIVE</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Growth Analytics</h3>
            <DashboardChart data={[]} />
         </div>
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Rapid Deployment</h3>
            <div className="space-y-4">
               {[
                 { label: 'Onboard Partner', icon: Building2, link: '/admin/partners' },
                 { label: 'System Broadcast', icon: Activity, link: '/admin/broadcasts' },
                 { label: 'Audit Assets', icon: ShieldCheck, link: '/admin/audit' }
               ].map((action, i) => (
                 <a key={i} href={action.link} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary/10 hover:border-primary/40 transition-all group">
                    <div className="flex items-center gap-4">
                       <action.icon className="w-5 h-5 text-primary" />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{action.label}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                 </a>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
