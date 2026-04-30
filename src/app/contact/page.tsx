'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Send, 
  Mail, 
  Building2, 
  User, 
  MessageSquare, 
  Loader2,
  Globe,
  CheckCircle,
  Phone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PublicContactPage() {
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    industry: 'Marketing',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.from('leads').insert([formData])
      if (error) throw error
      setSubmitted(true)
      toast({ title: 'Message Sent!', description: 'Our consultants will reach out shortly.', type: 'success' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30">
      <div className="mesh-gradient opacity-30" />
      
      {/* --- Public Header --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050014]/50 backdrop-blur-xl px-6 py-5">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase group flex items-center gap-2">
               ANTI<span className="text-primary group-hover:text-white transition-colors">GRAVITY</span>
            </Link>
            <div className="hidden md:flex gap-10 items-center">
               <Link href="/help" className="text-xs font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">Support</Link>
               <Link href="/plans" className="text-xs font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">Plans</Link>
               <Link href="/login" className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-2xl">Client Portal</Link>
            </div>
         </div>
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-20 items-center">
           <div className="space-y-10">
              <div className="space-y-6">
                 <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                    Let's scale <br/> your <span className="text-primary italic">Vision.</span>
                 </h1>
                 <div className="w-20 h-2 bg-primary rounded-full" />
              </div>
              
              <p className="text-white/40 text-xl font-medium max-w-lg leading-relaxed">
                 Connect with our enterprise experts to integrate state-of-the-art AI infrastructure into your existing ecosystem.
              </p>

              <div className="space-y-6">
                 {[
                    { label: 'General Inquiry', value: 'hello@antigravity.ia', icon: Mail },
                    { label: 'Enterprise Support', value: '+1 (800) ANTIGRAVITY', icon: Phone },
                    { label: 'Global HQ', value: 'Silicon Valley, CA', icon: Globe }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/40 transition-all">
                          <item.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                          <p className="text-lg font-bold text-white uppercase">{item.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative">
              <AnimatePresence mode="wait">
                 {!submitted ? (
                   <motion.div 
                     key="form"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.05 }}
                   >
                      <GlassCard className="p-10 space-y-8 border-primary/20 shadow-[0_40px_120px_rgba(124,58,237,0.15)] relative z-10">
                         <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Full Name</label>
                               <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                  <input 
                                    required
                                    type="text" 
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/10" 
                                    placeholder="Enter your name" 
                                  />
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Business Email</label>
                               <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                  <input 
                                    required
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/10" 
                                    placeholder="Email address" 
                                  />
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Company</label>
                                  <input 
                                    type="text" 
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none text-sm" 
                                    placeholder="Business Name" 
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Industry</label>
                                  <select 
                                    value={formData.industry}
                                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none text-sm appearance-none"
                                  >
                                     <option>Marketing</option>
                                     <option>Dental</option>
                                     <option>Real Estate</option>
                                     <option>Software</option>
                                  </select>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Message</label>
                               <textarea 
                                 required
                                 rows={4}
                                 value={formData.message}
                                 onChange={(e) => setFormData({...formData, message: e.target.value})}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none text-sm resize-none" 
                                 placeholder="How can we help?"
                               />
                            </div>

                            <button 
                              disabled={loading}
                              className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                               Submit Inquiry
                            </button>
                         </form>
                      </GlassCard>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="success"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                   >
                      <GlassCard className="p-16 text-center space-y-8 border-green-500/20 bg-green-500/[0.02]">
                         <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500 shadow-2xl shadow-green-500/10">
                            <CheckCircle className="w-12 h-12" />
                         </div>
                         <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Transmission <br/>Successful</h2>
                            <p className="text-white/40 text-sm font-medium">Your inquiry is being routed to the correct department.</p>
                         </div>
                         <button onClick={() => setSubmitted(false)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Send another message</button>
                      </GlassCard>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  )
}
