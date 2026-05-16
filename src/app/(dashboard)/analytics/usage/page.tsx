'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  History, 
  Zap, 
  BarChart3, 
  ArrowRight,
  ChevronRight,
  Activity,
  Calendar,
  Clock,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function UsageHistoryPage() {
  const { language } = useTranslation()
  const supabase = createClient()
  
  const [logs, setLogs] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase.from('users').select('workspace_id').eq('id', user.id).single()
        if (userData?.workspace_id) {
          // Fetch Logs
          const { data: logData } = await supabase
            .from('usage_logs')
            .select('*')
            .eq('workspace_id', userData.workspace_id)
            .order('created_at', { ascending: false })
            .limit(50)
          if (logData) setLogs(logData)

          // Fetch Active Batches (FEFO Status)
          const { data: batchData } = await supabase
            .from('credit_batches')
            .select('*')
            .eq('workspace_id', userData.workspace_id)
            .gt('remaining_amount', 0)
            .order('expires_at', { ascending: true })
          if (batchData) setBatches(batchData)
        }
      }
      setLoading(false)
    }
    fetchUsage()
  }, [supabase])

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading credit ledger...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <History className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-widest">Credit Ledger</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          Consumption <span className="text-primary italic">& FEFO History</span>
        </h1>
      </header>

      {/* --- Active Batches (The Engine) --- */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
               <Zap className="w-4 h-4" /> Active Credit Batches
            </h3>
            <span className="text-[10px] text-primary font-black uppercase">Next to expire first</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((batch, idx) => (
              <GlassCard key={batch.id} className="p-6 border-white/5 bg-white/[0.01]">
                 <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase border border-primary/20">
                       {batch.type}
                    </span>
                    <Clock className={`w-4 h-4 ${idx === 0 ? 'text-amber-500 animate-pulse' : 'text-white/10'}`} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-3xl font-black text-white">{batch.remaining_amount}</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Credits Remaining</p>
                 </div>
                 <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] text-white/20 uppercase font-black">Expires at:</p>
                    <p className="text-xs text-white font-medium">{batch.expires_at ? new Date(batch.expires_at).toLocaleDateString() : 'Never'}</p>
                 </div>
              </GlassCard>
            ))}
         </div>
      </section>

      {/* --- Detailed Logs --- */}
      <section className="space-y-6 text-white">
         <div className="flex items-center gap-2 text-white/30">
            <Activity className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-widest">Usage Records (9.3)</h3>
         </div>
         <GlassCard className="p-0 overflow-hidden border-white/5">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/5">
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Timestamp</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Operation</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Source Batch</th>
                     <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Debit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {logs.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-[10px] font-black text-white/10 uppercase italic">Silence in the ledger</td></tr>
                  ) : logs.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-all">
                       <td className="p-6 text-[11px] text-white/40 font-mono">
                          {new Date(tx.created_at).toLocaleString()}
                       </td>
                       <td className="p-6">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-white uppercase tracking-tighter">AI App Execution</span>
                             <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Price Tier: T2 Applied</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className="text-[10px] font-mono text-white/30">{tx.batch_id?.substring(0, 8)}...</span>
                       </td>
                       <td className="p-6 text-right font-black text-red-500/80">-{tx.amount}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </GlassCard>
      </section>
    </div>
  )
}
