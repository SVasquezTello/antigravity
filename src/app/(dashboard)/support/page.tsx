'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  LifeBuoy, 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SupportPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  
  // New Ticket State
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setTickets(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTickets()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('tickets').insert({
        user_id: user?.id,
        subject,
        description,
        priority,
        status: 'open'
      })

      if (error) throw error
      
      toast({ title: language === 'en' ? 'Ticket created' : 'Ticket creado', type: 'success' })
      setSubject('')
      setDescription('')
      setShowNew(false)
      fetchTickets()
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <LifeBuoy className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Customer <span className="text-primary italic">Support</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setShowNew(!showNew)}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-primary/20"
        >
          {showNew ? <Search className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showNew ? (language === 'en' ? 'View My Tickets' : 'Ver mis Tickets') : (language === 'en' ? 'Create Ticket' : 'Crear Ticket')}
        </button>
      </header>

      {showNew ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-8 max-w-2xl mx-auto">
             <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
                {language === 'en' ? 'How can we help you?' : '¿Cómo podemos ayudarte?'}
             </h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Subject</label>
                   <input 
                      type="text" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all"
                      placeholder={language === 'en' ? 'Short summary of the issue' : 'Resumen del problema'}
                   />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Priority</label>
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all"
                      >
                         <option value="low">Low</option>
                         <option value="medium">Medium</option>
                         <option value="high">High</option>
                         <option value="urgent">Urgent</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Category</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all"
                      >
                         <option>Technical Issue</option>
                         <option>Billing</option>
                         <option>Feature Request</option>
                         <option>General Inquiry</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Description</label>
                   <textarea 
                      rows={5}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all"
                      placeholder={language === 'en' ? 'Describe your problem in detail...' : 'Describe tu problema en detalle...'}
                   />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                  {language === 'en' ? 'Open Ticket' : 'Abrir Ticket'}
                </button>
             </form>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="space-y-6">
           {loading ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
             </div>
           ) : tickets.length === 0 ? (
             <GlassCard className="p-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/20">
                   <LifeBuoy className="w-10 h-10" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-widest">No active tickets</h3>
                   <p className="text-white/30 text-sm mt-2">Create your first support ticket to get help.</p>
                </div>
             </GlassCard>
           ) : (
             <div className="grid grid-cols-1 gap-4">
                {tickets.map((t, idx) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <GlassCard className="p-6 flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl border ${
                            t.status === 'open' ? 'bg-primary/10 border-primary/20 text-primary' : 
                            t.status === 'closed' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                          }`}>
                             {t.status === 'open' ? <MessageSquare className="w-6 h-6" /> : t.status === 'closed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-white group-hover:text-primary transition-all">{t.subject}</h3>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                   t.priority === 'urgent' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/10 text-white/30'
                                }`}>
                                   {t.priority}
                                </span>
                             </div>
                             <p className="text-xs text-white/40 truncate max-w-sm">{t.description}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="hidden md:block text-right">
                             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Last Update</p>
                             <p className="text-xs text-white/60">{new Date(t.updated_at).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                       </div>
                    </GlassCard>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  )
}
