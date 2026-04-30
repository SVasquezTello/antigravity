'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCheck, 
  Filter, 
  Zap, 
  ShieldAlert, 
  Megaphone,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationHubPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [notifs, setNotifs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifs()
  }, [])

  const fetchNotifs = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.rpc('get_user_notifications', { p_user_id: user.id })
      if (data) setNotifs(data)
    }
    setLoading(false)
  }

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    if (!error) {
       toast({ title: 'Inbox Cleared', type: 'success' })
       fetchNotifs()
    }
  }

  const filtered = notifs.filter(n => filter === 'all' || n.type === filter)
  const unreadCount = notifs.filter(n => !n.is_read).length

  if (loading) return <div className="p-8 animate-pulse text-white/20">Syncing Alarms...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Bell className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Unified Alert Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Activity <span className="text-primary italic">Feed</span>
          </h1>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={markAllRead}
             className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-primary transition-all flex items-center gap-2"
           >
              <CheckCheck className="w-4 h-4" /> Mark all read
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
         <main className="space-y-6">
            {/* Filters (13.1) */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
               {['all', 'billing', 'security', 'announcement', 'system'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>

            <div className="space-y-4">
               {filtered.length === 0 ? (
                 <GlassCard className="p-20 text-center space-y-4 border-dashed border-white/10">
                    <p className="text-white/20 font-black uppercase tracking-widest">Your inbox is pristine</p>
                 </GlassCard>
               ) : (
                 <AnimatePresence>
                    {filtered.map((n, i) => (
                      <motion.div 
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                         <GlassCard className={`p-6 flex items-center justify-between border-white/5 group transition-all ${!n.is_read ? 'bg-primary/5 hover:border-primary/40' : 'hover:bg-white/[0.02]'}`}>
                            <div className="flex gap-6 items-center">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                                 n.type === 'billing' ? 'bg-amber-500/10 text-amber-500' : 
                                 n.type === 'security' ? 'bg-red-500/10 text-red-500' : 
                                 n.type === 'announcement' ? 'bg-purple-500/10 text-purple-500' : 'bg-primary/10 text-primary'
                               }`}>
                                  {n.type === 'billing' ? <Zap className="w-5 h-5" /> : 
                                   n.type === 'security' ? <ShieldAlert className="w-5 h-5" /> : 
                                   n.type === 'announcement' ? <Megaphone className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{n.title}</h4>
                                  <p className="text-xs text-white/40 leading-relaxed max-w-xl">{n.message}</p>
                                  <div className="flex items-center gap-3 pt-2 text-[8px] font-black uppercase tracking-widest text-white/10">
                                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 HOURS AGO</span>
                                     {!n.is_read && <span className="text-primary group-hover:animate-pulse">● Unread</span>}
                                  </div>
                               </div>
                            </div>
                            <button className="p-3 text-white/5 hover:text-red-500 transition-colors group-hover:text-white/10"><Trash2 className="w-4 h-4" /></button>
                         </GlassCard>
                      </motion.div>
                    ))}
                 </AnimatePresence>
               )}
            </div>
         </main>

         <aside className="space-y-6">
            <GlassCard className="p-8 space-y-6 border-primary/10 h-fit">
               <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4">Feed Analytics</h3>
               <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-2xl space-y-1 border border-white/5">
                     <p className="text-[9px] font-black text-white/20 uppercase">Total Messages</p>
                     <p className="text-2xl font-black text-white italic">{notifs.length}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-2xl space-y-1 border border-primary/20">
                     <p className="text-[9px] font-black text-primary/40 uppercase">Pending Review</p>
                     <p className="text-2xl font-black text-primary italic">{unreadCount}</p>
                  </div>
               </div>
            </GlassCard>

            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
               <Megaphone className="w-8 h-8 text-white/20 mx-auto mb-4" />
               <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed italic">Silence is a luxury, information is a tool.</p>
            </div>
         </aside>
      </div>
    </div>
  )
}
