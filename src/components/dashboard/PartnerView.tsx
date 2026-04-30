'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Users, 
  Wallet, 
  BarChart3, 
  Zap, 
  Plus, 
  Settings, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layout
} from 'lucide-react'
import { motion } from 'framer-motion'

export function PartnerView() {
  const supabase = React.useMemo(() => createClient(), [])
  const [stats, setStats] = useState({
    clients: 0,
    wallet: 0,
    usage: 0
  })

  useEffect(() => {
    const fetchPartnerData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user?.id).single()
      
      if (!userError && userData && 'partner_id' in userData && userData.partner_id) {
        const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('partner_id', userData.partner_id)
        const { data: partnerData } = await supabase.from('partners').select('credits').eq('id', userData.partner_id).single()
        
        setStats({
          clients: count || 0,
          wallet: partnerData?.credits || 0,
          usage: 2450 // Credits consumed by their clients this month
        })
      } else if (userError) {
        console.warn('PartnerView: Could not fetch user partner context.', userError.message)
      }
    }
    fetchPartnerData()
  }, [supabase])

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 text-primary">
            <Layout className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Business Console</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Partner <span className="text-primary italic">Workspace</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <a href="/partner/clients" className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Onboard Client</a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="p-10 space-y-6 border-primary/20 bg-primary/5">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10"><Wallet className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Wholesale Balance</p>
               <h3 className="text-4xl font-black text-white italic">{stats.wallet} <span className="text-white/20 text-xl font-normal not-italic">CR</span></h3>
            </div>
            <a href="/partner/wallet" className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-2 transition-transform">Auto-Topup Settings <ChevronRight className="w-3 h-3" /></a>
         </GlassCard>

         <GlassCard className="p-10 space-y-6 border-white/5 bg-white/[0.02]">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Users className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Managed Workspaces</p>
               <h3 className="text-4xl font-black text-white italic">{stats.clients} <span className="text-white/20 text-xl font-normal not-italic">PORTFOLIO</span></h3>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden p-0.5"><div className="w-[60%] h-full bg-blue-500 rounded-full" /></div>
         </GlassCard>

         <GlassCard className="p-10 space-y-6 border-white/5 bg-white/[0.02]">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><TrendingUp className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Network Consumption</p>
               <h3 className="text-4xl font-black text-white italic">{stats.usage} <span className="text-white/20 text-xl font-normal not-italic">MONTHLY</span></h3>
            </div>
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">+ 4.5% Profit Margin</p>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <GlassCard className="p-8 space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4">Real-Time Activity</h3>
            <div className="space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:bg-primary/10 transition-all"><Zap className="w-5 h-5" /></div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase group-hover:text-primary transition-colors">Client Execution</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Workspace: #812 - 2 mins ago</p>
                       </div>
                    </div>
                    <span className="text-[9px] font-black text-primary italic">0.05 CR</span>
                 </div>
               ))}
            </div>
         </GlassCard>

         <div className="space-y-6">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4 px-2">Partner Toolbox</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Branding Editor', icon: Settings, link: '/partner/settings' },
                 { label: 'Client Support', icon: Users, link: '/partner/clients' },
                 { label: 'Finances', icon: Wallet, link: '/partner/wallet' },
                 { label: 'Apps Market', icon: Layout, link: '/apps' }
               ].map((tool, i) => (
                 <a key={i} href={tool.link} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-primary hover:text-white transition-all group flex flex-col items-center gap-4 text-center">
                    <tool.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{tool.label}</span>
                 </a>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
