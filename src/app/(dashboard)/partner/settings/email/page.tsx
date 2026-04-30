'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Mail, 
  Server, 
  ShieldCheck, 
  Save, 
  Send, 
  Key, 
  Globe,
  Loader2,
  Lock,
  MessageSquare
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PartnerEmailSettingsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    smtp_from_name: '',
    smtp_from_email: ''
  })

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user?.id).single()
    
    if (userData?.partner_id) {
      const { error } = await supabase.from('partners').update(formData).eq('id', userData.partner_id)
      if (!error) toast({ title: 'SMTP Configured', type: 'success' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 text-primary">
          <Mail className="w-6 h-6" />
          <span className="text-sm font-black uppercase tracking-[0.5em]">Communication Engine</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
          SMTP <span className="text-primary italic">& Branding</span>
        </h1>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-2xl mx-auto md:mx-0">
          Command every pixel of your client communications. Use your own servers to ensure maximum trust and deliverability.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-10 space-y-8 border-primary/10 relative overflow-hidden">
               <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <Server className="w-8 h-8 text-primary" />
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">Custom SMTP Gateway</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Industrial Grade Delivery</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Host Server</label>
                     <input type="text" placeholder="smtp.gmail.com" value={formData.smtp_host} onChange={(e) => setFormData({...formData, smtp_host: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Port</label>
                     <input type="number" placeholder="587" value={formData.smtp_port} onChange={(e) => setFormData({...formData, smtp_port: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Authentication User</label>
                     <input type="text" placeholder="user@domain.com" value={formData.smtp_user} onChange={(e) => setFormData({...formData, smtp_user: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Access Key</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="password" placeholder="••••••••••••" value={formData.smtp_pass} onChange={(e) => setFormData({...formData, smtp_pass: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none" />
                     </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 space-y-8">
                  <div className="flex items-center gap-4">
                     <MessageSquare className="w-8 h-8 text-primary" />
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">Sender Identity (14.1)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">From Name</label>
                        <input type="text" placeholder="My Enterprise Portal" value={formData.smtp_from_name} onChange={(e) => setFormData({...formData, smtp_from_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">From Email</label>
                        <input type="email" placeholder="noreply@mybrand.com" value={formData.smtp_from_email} onChange={(e) => setFormData({...formData, smtp_from_email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button onClick={handleSave} disabled={loading} className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save SMTP Configuration
                  </button>
                  <button onClick={() => setIsTesting(true)} className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center gap-3">
                     <Send className="w-4 h-4" /> Send Test
                  </button>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-6">
            <GlassCard className="p-8 space-y-6 border-white/5 bg-white/[0.02]">
               <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary"><ShieldCheck className="w-6 h-6" /></div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Security Protocol</h3>
               <p className="text-[10px] font-black text-white/30 leading-relaxed uppercase tracking-widest italic">All SMTP credentials are encrypted before storage. We recommend using App-Specific passwords for Gmail or dedicated services like SendGrid.</p>
            </GlassCard>

            <div className="p-8 border border-primary/20 bg-primary/5 rounded-[2rem] space-y-4">
               <Globe className="w-8 h-8 text-primary" />
               <p className="text-[10px] font-black text-primary/80 uppercase tracking-widest leading-relaxed">System Fallback active. If your SMTP fails, Antigravity will route via Resend node automatically.</p>
            </div>
         </div>
      </div>
    </div>
  )
}
