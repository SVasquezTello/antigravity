'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  History, 
  Search, 
  Terminal, 
  User, 
  Activity, 
  Globe,
  Database,
  Filter,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuditLogsPage() {
  const { language } = useTranslation()
  const supabase = createClient()
  
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select(`
          *,
          users (email, first_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (data) setLogs(data)
      setLoading(false)
    }
    fetchLogs()
  }, [supabase])

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.users?.email?.toLowerCase().includes(search.toLowerCase())
  )

  const getActionColor = (action: string) => {
    if (action.includes('EXECUTION')) return 'text-primary'
    if (action.includes('LOGIN')) return 'text-blue-400'
    if (action.includes('PLAN')) return 'text-accent-warm'
    if (action.includes('INVITE')) return 'text-green-400'
    return 'text-white/40'
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <History className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">System Logs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Security <span className="text-primary italic">Audit</span>
          </h1>
        </div>
      </header>

      {/* --- Filters & Search --- */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
               type="text" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by action, email or target..."
               className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
            />
         </div>
         <button className="px-6 py-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/5">
            <Filter className="w-4 h-4" /> Filter
         </button>
      </GlassCard>

      {loading ? (
        <div className="flex items-center justify-center h-64">
           <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredLogs.map((log, idx) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.02 }}
              >
                <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-6 border-white/5 hover:bg-white/[0.03] transition-all group">
                   <div className="flex items-center gap-6 flex-1">
                      <div className={`p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${getActionColor(log.action)}`}>
                         {log.action.includes('LOGIN') ? <Terminal className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                         <div>
                            <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">Action</p>
                            <p className={`text-xs font-black uppercase tracking-wider ${getActionColor(log.action)}`}>{log.action}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">User</p>
                            <div className="flex items-center gap-2">
                               <User className="w-3 h-3 text-white/40" />
                               <span className="text-xs text-white/70 font-medium">{log.users?.email || 'Anonymous'}</span>
                            </div>
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">IP Address</p>
                            <div className="flex items-center gap-2">
                               <Globe className="w-3 h-3 text-white/40" />
                               <span className="text-xs text-white/40 font-mono italic">{log.ip_address || 'Internal'}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 text-right">
                      <div className="hidden lg:block">
                         <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-1">Timestamp</p>
                         <p className="text-xs text-white/40 font-medium">{new Date(log.created_at).toLocaleString()}</p>
                      </div>
                      <button className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-primary transition-colors">
                         <Database className="w-4 h-4" />
                      </button>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
