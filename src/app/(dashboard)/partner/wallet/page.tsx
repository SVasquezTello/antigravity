'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  History,
  TrendingUp,
  Zap,
  Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PartnerWalletPage() {
  const { language } = useTranslation()
  const supabase = createClient()
  const [partner, setPartner] = useState<any>(null)
  const [txs, setTxs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user.id).single()
      if (userData?.partner_id) {
        const { data: pData } = await supabase.from('partners').select('*').eq('id', userData.partner_id).single()
        setPartner(pData)

        const { data: tData } = await supabase
          .from('partner_transactions')
          .select('*')
          .eq('partner_id', userData.partner_id)
          .order('created_at', { ascending: false })
        if (tData) setTxs(tData)
      }
      setLoading(false)
    }
    fetchWallet()
  }, [supabase])

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading wallet...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Wallet className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Financial Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Partner <span className="text-primary italic">Wallet</span>
          </h1>
        </div>
        <button className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <T es="Recargar Saldo" en="Add Funds" />
        </button>
      </header>

      {/* --- Main Balance Display --- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
         <GlassCard className="p-12 relative overflow-hidden flex flex-col justify-between border-primary/20 bg-primary/5">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
            <div className="relative z-10 space-y-8">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Available Balance</p>
               <h2 className="text-6xl md:text-8xl font-black text-white leading-none">
                 <span className="text-white/40 text-4xl">$</span>{partner?.wallet_balance || '0.00'}
               </h2>
               <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60">
                     <TrendingUp className="w-4 h-4 text-green-500" />
                     +12.5% vs Last Month
                  </div>
               </div>
            </div>
         </GlassCard>

         <div className="space-y-6">
            <GlassCard className="p-8 space-y-4 border-white/10">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Credit Consumption</p>
               <div className="flex justify-between items-end">
                  <h3 className="text-3xl font-black text-white">4,200</h3>
                  <span className="text-xs text-white/20 font-bold mb-1">Items Generated</span>
               </div>
               <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-primary" />
               </div>
            </GlassCard>
            <GlassCard className="p-8 space-y-4 border-white/10 bg-white/[0.02]">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Pricing Tier</p>
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-white font-black text-lg">VIP Partner</p>
                     <p className="text-[10px] text-white/30">0.02$ / Per Exec</p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* --- Transaction History --- */}
      <section className="space-y-6">
         <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-white/30" />
            <h3 className="text-sm font-black text-white/30 uppercase tracking-widest">Transaction History</h3>
         </div>
         
         <GlassCard className="p-0 overflow-hidden border-white/5">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/5">
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Type</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Description</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {txs.length === 0 ? (
                    <tr>
                       <td colSpan={4} className="p-20 text-center text-[10px] font-black text-white/10 uppercase tracking-widest">No data available</td>
                    </tr>
                  ) : txs.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-all group">
                       <td className="p-6 text-xs text-white/40">{new Date(t.created_at).toLocaleString()}</td>
                       <td className="p-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            t.type === 'topup' ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-red-500/20 bg-red-500/5 text-red-500'
                          }`}>
                            {t.type === 'topup' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                            {t.type}
                          </div>
                       </td>
                       <td className="p-6 text-sm text-white/60 font-medium">{t.description}</td>
                       <td className={`p-6 text-right font-black text-sm ${t.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                          {t.amount > 0 ? '+' : ''}${Math.abs(t.amount)}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </GlassCard>
      </section>
    </div>
  )
}
