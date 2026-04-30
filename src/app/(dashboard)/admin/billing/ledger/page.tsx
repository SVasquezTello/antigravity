'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Search, 
  Filter, 
  ExternalLink, 
  CreditCard, 
  FileText,
  Clock,
  Zap,
  Building2,
  Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLedgerPage() {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('transactions')
      .select(`
        *,
        workspaces:workspace_id(name),
        users:user_id(email),
        partners:partner_id(name)
      `)
      .order('created_at', { ascending: false })
    if (data) setTransactions(data)
    setLoading(false)
  }

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'payment': return 'text-green-500 bg-green-500/10'
      case 'refund': return 'text-red-500 bg-red-500/10'
      case 'manual_adjustment': return 'text-amber-500 bg-amber-500/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  const filtered = transactions.filter(t => {
    const matchesFilter = filterType === 'all' || t.type === filterType
    const matchesSearch = !search || 
      (t.workspaces?.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (t.users?.email || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalVolume = transactions.reduce((acc, curr) => curr.type === 'payment' ? acc + parseFloat(curr.amount) : acc, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <PageHeader 
        title="Financial Ledger" 
        subtitle="Official audit trail of every monetary movement, credit grant, and refund on the platform."
        icon={BarChart2}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <GlassCard className="p-8 border-green-500/20 bg-green-500/5">
            <DollarSign className="w-8 h-8 text-green-500 mb-4" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Volume</p>
            <h3 className="text-3xl font-black text-white italic">${totalVolume.toFixed(2)}</h3>
         </GlassCard>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by workspace or user..." 
              className="w-full bg-transparent pl-12 pr-6 py-2 text-white focus:outline-none text-sm font-medium" 
            />
         </div>
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['all', 'payment', 'refund', 'credit_grant', 'manual_adjustment'].map(f => (
              <button 
                key={f} onClick={() => setFilterType(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filterType === f ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/5 text-white/20 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
         </div>
      </div>

      <div className="space-y-4">
         {loading ? (
            <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Opening Secure Ledger...</div>
         ) : filtered.length === 0 ? (
            <div className="p-20 text-center text-white/10 italic">No transactions found for this selection.</div>
         ) : (
           filtered.map((t, i) => (
             <motion.div key={t.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-6 flex flex-col lg:flex-row items-center gap-8 border-white/5 hover:bg-white/[0.02] transition-all group">
                   <div className="flex items-center gap-6 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getTypeStyle(t.type)}`}>
                         {t.type === 'payment' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{t.type}</h4>
                            <span className="text-[10px] font-bold text-white/20 px-2 py-0.5 rounded bg-white/5">{t.status}</span>
                         </div>
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-2">
                           <Building2 className="w-3 h-3" /> {t.workspaces?.name || 'Injected'} / {t.users?.email || 'System'}
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-12 shrink-0">
                      <div className="text-right space-y-1">
                         <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Financial Power</p>
                         <h4 className={`text-xl font-black italic ${t.amount < 0 ? 'text-red-500' : 'text-white'}`}>
                            {t.amount > 0 ? '+' : ''}{t.amount} <span className="text-xs font-normal not-italic opacity-30">{t.currency}</span>
                         </h4>
                         {t.credits_awarded > 0 && <p className="text-[9px] font-black text-primary uppercase">+{t.credits_awarded} Credits</p>}
                      </div>
                      <div className="text-right space-y-1 hidden sm:block">
                         <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Timestamp</p>
                         <p className="text-[10px] font-bold text-white/40 uppercase flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                         {t.receipt_url && (
                           <a href={t.receipt_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white hover:bg-primary transition-all">
                              <FileText className="w-4 h-4" />
                           </a>
                         )}
                         <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                            <Search className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </GlassCard>
             </motion.div>
           ))
         )}
      </div>
    </div>
  )
}
