'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Search,
  Building2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSubscriptionsPage() {
  const supabase = createClient()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('subscriptions')
      .select(`
        *,
        workspaces:workspace_id(name),
        users:user_id(email),
        partners:partner_id(name),
        offers:offer_id(name_es)
      `)
      .order('created_at', { ascending: false })
    if (data) setSubscriptions(data)
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      trialing: 'bg-primary/10 text-primary border-primary/20',
      past_due: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      canceled: 'bg-white/5 text-white/40 border-white/10',
      expired: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.canceled}`}>
        {status}
      </span>
    )
  }

  const filteredSubs = subscriptions.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter
    const matchesSearch = !search || 
      (s.workspaces?.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (s.users?.email || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <PageHeader 
        title="Subscription Engine" 
        subtitle="Master registry of all recurrences, trials, and billing lifecycles across the platform."
        icon={CreditCard}
      />

      {/* --- Filter Bar (19.4) --- */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by workspace or email..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none text-sm" 
            />
         </div>
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {['all', 'active', 'trialing', 'past_due', 'canceled'].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
         </div>
      </div>

      <div className="space-y-4">
         {loading ? (
            <div className="p-8 animate-pulse text-white/20 uppercase tracking-widest font-black">Scanning Financial Records...</div>
         ) : filteredSubs.length === 0 ? (
            <GlassCard className="p-20 text-center space-y-4 border-dashed border-white/10">
               <p className="text-white/20 font-black uppercase tracking-widest italic">No matching subscriptions found</p>
            </GlassCard>
         ) : (
           filteredSubs.map((sub, i) => (
             <motion.div key={sub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/[0.02] border-white/5 transition-all group">
                   <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-all">
                         <Building2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                         <h4 className="text-sm font-black text-white uppercase tracking-tight">{sub.workspaces?.name || 'Unknown Workspace'}</h4>
                         <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{sub.users?.email}</p>
                      </div>
                      <div className="hidden lg:block border-l border-white/5 h-8 ml-4" />
                      <div className="space-y-1 text-center md:text-left">
                         <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Plan & Partner</p>
                         <p className="text-xs font-bold text-white uppercase italic">{sub.offers?.name_es}</p>
                         <p className="text-[9px] font-black text-primary/60 uppercase">{sub.partners?.name || 'Direct Client'}</p>
                      </div>
                      <div className="hidden lg:block border-l border-white/5 h-8 ml-4" />
                      <div className="space-y-1 text-center md:text-left">
                         <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Period Ends</p>
                         <p className="text-xs font-bold text-white uppercase flex items-center justify-center md:justify-start gap-2">
                           <Calendar className="w-3 h-3 text-white/20" /> {new Date(sub.current_period_end).toLocaleDateString()}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 shrink-0">
                      {sub.cancel_at_period_end && <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Scheduled to End</span>}
                      {getStatusBadge(sub.status)}
                      <button className="p-3 text-white/5 hover:text-white transition-colors group-hover:text-white/20">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                </GlassCard>
             </motion.div>
           ))
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="p-8 border-primary/20 bg-primary/5">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Active Now</p>
            <h3 className="text-3xl font-black text-white italic">{subscriptions.filter(s => s.status === 'active').length} <span className="text-white/20 text-xl font-normal not-italic">RECURRING</span></h3>
         </GlassCard>
      </div>
    </div>
  )
}
