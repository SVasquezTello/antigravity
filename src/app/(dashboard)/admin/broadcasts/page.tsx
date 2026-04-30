'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Megaphone, 
  Users, 
  Clock, 
  Send, 
  Target, 
  Trash2, 
  Calendar, 
  Loader2,
  Globe,
  Radio,
  Tag as TagIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminBroadcastPage() {
  const { toast } = useToast()
  const supabase = createClient()
  
  const [broadcasts, setBroadcasts] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')
  const [tagId, setTagId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: bData } = await supabase.from('broadcasts').select('*').order('created_at', { descending: true })
    const { data: tData } = await supabase.from('tags').select('*').order('name', { ascending: true })
    if (bData) setBroadcasts(bData)
    if (tData) setTags(tData)
    setLoading(false)
  }

  const handleSend = async () => {
    if (!title || !message) return
    setIsSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('broadcasts').insert([{
      sender_id: user?.id,
      title,
      message,
      target_audience: audience,
      target_tag_id: audience === 'tag_specific' ? tagId : null,
      scheduled_at: new Date().toISOString()
    }])

    if (!error) {
      toast({ title: 'Broadcast Dispatched', type: 'success' })
      setTitle(''); setMessage('')
      fetchData()
    }
    setIsSending(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Syncing Radio Frequencies...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest">Master Communication Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Mass <span className="text-primary italic">Broadcasts</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10">
         {/* --- Dispatcher Panel --- */}
         <div className="space-y-8">
            <GlassCard className="p-10 space-y-8 border-primary/10">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Announcement Title</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-white/10 focus:border-primary outline-none" 
                    placeholder="Emergency Maintenance or News Update..." 
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Message Content</label>
                  <textarea 
                    rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-primary outline-none text-sm resize-none" 
                    placeholder="Draft your global notification here..."
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Target Audience (13.3)</label>
                     <select 
                       value={audience} onChange={(e) => setAudience(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none"
                     >
                        <option value="all">Global (All Users)</option>
                        <option value="partners_only">Partners Only</option>
                        <option value="clients_only">End Clients Only</option>
                        <option value="tag_specific">Specific Tag Holders</option>
                     </select>
                  </div>
                  {audience === 'tag_specific' && (
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Select Access Key</label>
                        <select 
                          value={tagId || ''} onChange={(e) => setTagId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none"
                        >
                           <option value="">Select a Tag</option>
                           {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                     </div>
                  )}
               </div>

               <button 
                  onClick={handleSend} disabled={isSending}
                  className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
               >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Dispatch Broadcast Now
               </button>
            </GlassCard>
         </div>

         {/* --- History Sidebar --- */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Transmission Log</h3>
            <div className="space-y-4">
               {broadcasts.length === 0 ? (
                 <div className="p-10 text-center text-white/10 text-xs italic">No prior transmissions recorded.</div>
               ) : (
                 broadcasts.map(b => (
                   <GlassCard key={b.id} className="p-6 space-y-4 border-white/5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{b.target_audience}</span>
                         </div>
                         <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Just Now
                         </p>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase">{b.title}</h4>
                      <p className="text-[10px] text-white/30 line-clamp-2 italic leading-relaxed">{b.message}</p>
                   </GlassCard>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
