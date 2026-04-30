'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  PieChart, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Activity,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardChart } from '@/components/ui/DashboardChart'

export default function AdminIntelligenceHub() {
  const supabase = createClient()
  const [metrics, setMetrics] = useState({
    mrr: 0,
    churn: 0,
    credits: { sold: 0, consumed: 0, revenue: 0 },
    partners: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntelligence = async () => {
      setLoading(true)
      const { data: mrr } = await supabase.rpc('get_platform_mrr')
      const { data: churn } = await supabase.rpc('get_platform_churn_rate')
      const { data: econ } = await supabase.rpc('get_credit_economics')
      const { data: leaderboard } = await supabase.rpc('get_partner_performance_leaderboard')
      
      setMetrics({
        mrr: mrr || 0,
        churn: churn || 0,
        credits: econ?.[0] || { sold: 0, consumed: 0, revenue: 0 },
        partners: leaderboard || []
      })
      setLoading(false)
    }
    fetchIntelligence()
  }, [])

  const mainKpis = [
    { label: 'Estimated MRR', value: `$${metrics.mrr}`, trend: '+14%', icon: DollarSign, color: 'text-green-500' },
    { label: '30d Churn Rate', value: `${metrics.churn.toFixed(2)}%`, trend: '-0.5%', icon: Target, color: 'text-red-500' },
    { label: 'Credit Margin', value: `$${(metrics.credits.revenue * 0.4).toFixed(0)}`, trend: '+8%', icon: Zap, color: 'text-amber-500' },
    { label: 'Active Network', value: metrics.partners.length, trend: '+2', icon: Activity, color: 'text-primary' }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Admin Intelligence" 
        subtitle="Strategic financial oversight, network growth trends and economic efficiency audits."
        icon={BarChart3}
      />

      {/* --- Global KPIs (27.1 - 27.3) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {mainKpis.map((kpi, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
             <GlassCard className="p-8 space-y-6 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${kpi.color} shadow-xl shadow-black/20`}>
                      <kpi.icon className="w-6 h-6" />
                   </div>
                   <div className={`text-[10px] font-black px-2 py-1 rounded ${kpi.trend.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{kpi.trend}</div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{kpi.label}</p>
                   <h3 className="text-3xl font-black text-white italic">{kpi.value}</h3>
                </div>
             </GlassCard>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Revenue Graph (27.1) */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Revenue Growth (LTM)</h3>
            <DashboardChart data={[]} />
         </div>

         {/* Partner Leaderboard (27.5) */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Top Performance Partners</h3>
            <div className="space-y-4">
               {metrics.partners.slice(0, 5).map((p, i) => (
                 <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <GlassCard className="p-5 flex items-center justify-between border-white/5 bg-white/[0.02] hover:bg-primary/5 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-primary text-xs italic">#{i+1}</div>
                          <div>
                             <p className="text-xs font-black text-white uppercase tracking-tight">{p.partner_name}</p>
                             <p className="text-[9px] font-bold text-white/20 uppercase">{p.client_count} Workspaces</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-green-500">${p.total_revenue.toLocaleString()}</p>
                          <p className="text-[9px] font-black text-white/10 uppercase">LIFETIME</p>
                       </div>
                    </GlassCard>
                 </motion.div>
               ))}
               {metrics.partners.length === 0 && <p className="text-center p-10 text-[10px] uppercase font-black text-white/10 italic tracking-widest">No commercial data yet</p>}
            </div>
         </div>
      </div>

      {/* Credit Economics (27.4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <GlassCard className="p-10 space-y-8 bg-linear-to-br from-amber-500/10 to-transparent border-amber-500/20">
            <div className="flex items-center gap-3 text-amber-500">
               <Zap className="w-5 h-5" />
               <h4 className="text-xs font-black uppercase tracking-widest">Token Economics</h4>
            </div>
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Efficiency Rate</span>
                  <span className="text-xl font-black text-white italic">74%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[74%] h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                     <p className="text-[8px] font-black text-white/20 uppercase">Units Sold</p>
                     <p className="text-lg font-black text-white">{metrics.credits.sold.toLocaleString()}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-white/20 uppercase">Units Burned</p>
                     <p className="text-lg font-black text-white">{metrics.credits.consumed.toLocaleString()}</p>
                  </div>
               </div>
            </div>
         </GlassCard>
      </div>
    </div>
  )
}
