'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Building2, 
  Search, 
  Plus, 
  TrendingUp, 
  Wallet, 
  Users, 
  MoreVertical,
  ShieldAlert,
  Loader2,
  PieChart as PieIcon,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function GlobalPartnersPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from('partners')
        .select(`
          *,
          users(count)
        `)
        .order('created_at', { ascending: false })
      if (data) setPartners(data)
      setLoading(false)
    }
    fetchPartners()
  }, [supabase])

  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading Ecosystem...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldAlert className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Global Ecosystem Control</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Partner <span className="text-primary italic">Networks</span>
          </h1>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'New Partner' : 'Nuevo Partner'}
        </button>
      </header>

      {/* --- Global Snapshot --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <GlassCard className="p-6 bg-primary/5 border-primary/20">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-primary/10 text-primary"><Activity className="w-6 h-6" /></div>
               <span className="text-xs font-bold text-green-500">+4 Para hoy</span>
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Active Clients</p>
            <h3 className="text-3xl font-black text-white">1,240</h3>
         </GlassCard>
         <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-white/5 text-white/40"><Wallet className="w-6 h-6" /></div>
               <span className="text-xs font-bold text-white/20">Global Credits</span>
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Circulating Liquidity</p>
            <h3 className="text-3xl font-black text-white">$45,200.00</h3>
         </GlassCard>
         <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-white/5 text-white/40"><Users className="w-6 h-6" /></div>
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Active Partners</p>
            <h3 className="text-3xl font-black text-white">{partners.length}</h3>
         </GlassCard>
      </div>

      {/* --- Partners List --- */}
      <GlassCard className="p-0 overflow-hidden border-white/5">
         <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Network Directory</h3>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
               <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter partners..." 
                  className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white"
               />
            </div>
         </div>
         <table className="w-full text-left">
            <thead>
               <tr className="bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Partner Entity</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Workspaces</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Wallet</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Settings</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {filteredPartners.map(p => (
                 <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary" style={{ color: p.primary_color }}>
                             <Building2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{p.name}</p>
                             <p className="text-[10px] text-white/30 font-mono italic">Created {new Date(p.created_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6 text-center font-bold text-white/60 text-sm">
                       {p.workspaces_count || 15}
                    </td>
                    <td className="p-6 text-center">
                       <span className="font-mono font-black text-xs text-primary">${p.wallet_balance || '0.00'}</span>
                    </td>
                    <td className="p-6 text-center">
                       <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase border border-green-500/20">Active</span>
                    </td>
                    <td className="p-6 text-right">
                       <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </GlassCard>

      <footer className="flex justify-center text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">
         Total Partners In Sync: {partners.length}
      </footer>
    </div>
  )
}
