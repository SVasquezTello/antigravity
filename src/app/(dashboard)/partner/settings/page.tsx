'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import {
   Settings,
   Palette,
   Mail,
   CreditCard,
   Building2,
   Database,
   Save,
   Loader2,
   Zap,
   Image as ImageIcon,
   Send,
   CheckCircle2,
   Monitor,
   Smartphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandingLab } from '@/components/branding/BrandingLab'

export default function PartnerSettingsHub() {
   const { toast } = useToast()
   const supabase = createClient()
   const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'mobile'>('general')
   const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [partnerData, setPartnerData] = useState<any>(null)
   const [testEmail, setTestEmail] = useState('')

   useEffect(() => {
      fetchPartner()
   }, [])

   const fetchPartner = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user?.id).single()

      if (userData?.partner_id) {
         const { data } = await supabase.from('partners').select('*').eq('id', userData.partner_id).single()
         setPartnerData(data)
         setTestEmail(user?.email || '')
      }
      setLoading(false)
   }

   const handleTestSmtp = async () => {
      if (!partnerData.custom_smtp_settings?.host || !partnerData.custom_smtp_settings?.user || !testEmail) {
         toast({ title: 'Please fill all SMTP fields', type: 'error' })
         return
      }

      setSaving(true)
      try {
         const res = await fetch('/api/partner/test-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               ...partnerData.custom_smtp_settings,
               test_recipient: testEmail
            })
         })
         const data = await res.json()
         if (data.success) {
            toast({ title: 'SMTP Verified & Saved', type: 'success' })
         } else {
            toast({ title: data.message || 'Verification failed', type: 'error' })
         }
      } catch (err) {
         toast({ title: 'Connection error', type: 'error' })
      } finally {
         setSaving(false)
      }
   }

   const handleUpdate = async (patch: any) => {
      setSaving(true)
      const { error } = await supabase.from('partners').update(patch).eq('id', partnerData.id)
      if (!error) {
         toast({ title: 'Configuration Synchronized', type: 'success' })
         setPartnerData({ ...partnerData, ...patch })
      }
      setSaving(false)
   }

   if (loading) return <div className="p-8 animate-pulse text-white/20 uppercase tracking-widest font-black">Syncing Business Data...</div>

   const tabs = [
      { id: 'general', label: 'General', icon: Building2 },
      { id: 'branding', label: 'Branding', icon: Palette },
      { id: 'mobile', label: 'Mobile & PWA', icon: Zap },
      { id: 'email', label: 'Email SMTP', icon: Mail },
      { id: 'billing', label: 'Platform Billing', icon: CreditCard }
   ]

   return (
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
         <PageHeader
            title="Business Console"
            subtitle="Manage your agency infrastructure, white-label assets and platform billing."
            icon={Settings}
         />

         <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
            {/* Sidebar Tabs (17.2) */}
            <aside className="space-y-2">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20 border border-primary/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                     <tab.icon className="w-4 h-4" />
                     {tab.label}
                  </button>
               ))}
            </aside>

            <main>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* --- Settings Panel --- */}
            <div className="xl:col-span-7 space-y-8">
               <AnimatePresence mode="wait">
                  {activeTab === 'general' && (
                     <motion.div key="general" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <GlassCard className="p-10 space-y-12 border-white/5">
                            <div className="space-y-8">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Agency Name</label>
                                     <input 
                                        type="text" defaultValue={partnerData.name} 
                                        onBlur={(e) => handleUpdate({ name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" 
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Support Email</label>
                                     <input 
                                        type="email" defaultValue={partnerData.support_email} 
                                        onBlur={(e) => handleUpdate({ support_email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" 
                                     />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Custom Domain (PWA)</label>
                                  <input 
                                     type="text" defaultValue={partnerData.custom_domain} 
                                     onBlur={(e) => handleUpdate({ custom_domain: e.target.value })}
                                     placeholder="app.youragency.com"
                                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" 
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Quick Onboarding Link</label>
                                  <div className="relative group">
                                     <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                     <input 
                                        type="text" readOnly value={`${window.location.origin}/join/p/${partnerData.slug}`} 
                                        className="w-full bg-primary/5 border border-primary/20 rounded-2xl pl-14 pr-6 py-4 text-white/60 text-xs font-mono cursor-pointer hover:bg-primary/10 transition-all"
                                        onClick={(e) => {
                                           navigator.clipboard.writeText((e.target as HTMLInputElement).value)
                                           toast({ title: 'Link Copied', description: 'Share this link with your new clients.', type: 'success' })
                                        }}
                                     />
                                  </div>
                                  <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1 italic">Click to copy and share with clients</p>
                               </div>
                            </div>
                        </GlassCard>
                     </motion.div>
                  )}

                  {activeTab === 'branding' && (
                     <motion.div key="branding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="space-y-8">
                           <GlassCard className="p-10 space-y-8 border-white/5">
                              <div className="flex items-center gap-8">
                                 <div className="w-32 h-32 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                    {partnerData.logo_url ? <img src={partnerData.logo_url} className="w-full h-full object-contain p-4" /> : <ImageIcon className="w-8 h-8 text-white/10" />}
                                 </div>
                                 <div className="flex-1 space-y-4">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Logo Repository URL</label>
                                    <input
                                       type="text" defaultValue={partnerData.logo_url}
                                       onBlur={(e) => handleUpdate({ logo_url: e.target.value })}
                                       placeholder="https://yourdomain.com/logo.png"
                                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none"
                                    />
                                 </div>
                              </div>
                           </GlassCard>

                           <BrandingLab
                              initialConfig={{
                                 primaryColor: partnerData.primary_color,
                                 ...partnerData.branding_config
                              }}
                              onConfigChange={(config) => {
                                 const { primaryColor, ...rest } = config;
                                 handleUpdate({
                                    primary_color: primaryColor,
                                    branding_config: rest
                                 });
                              }}
                           />
                        </div>
                     </motion.div>
                  )}

                  {/* --- MOBILE & PWA TAB --- */}
                {activeTab === 'mobile' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                     <GlassCard className="p-10 space-y-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32" /></div>
                        <div className="space-y-4 relative z-10">
                           <h3 className="text-xl font-black text-white uppercase tracking-tight">Mobile & Native Infrastructure</h3>
                           <p className="text-white/40 text-xs font-medium">Control how your agency appears on mobile devices, including PWA installation and Native App wrappers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                           <div className="space-y-6">
                              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Unified Branding API</h4>
                                 <p className="text-[10px] text-white/40 leading-relaxed">Use this endpoint to fetch your identity tokens in native mobile apps (Swift/Kotlin).</p>
                                 <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
                                    <code className="text-[9px] text-white/60">/api/branding?slug={partnerData.slug}</code>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Native App Icon (1024x1024)</label>
                                 <input 
                                   type="text" 
                                   placeholder="https://domain.com/app-icon.png"
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" 
                                 />
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-4">
                                 <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">PWA Optimized</h4>
                                 </div>
                                 <p className="text-[10px] text-white/40 leading-relaxed">Your portal is ready to be installed as a standalone app. Your clients can "Add to Home Screen" to get a native-like experience with your logo.</p>
                                 <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[8px] rounded-xl transition-all border border-white/5">
                                    Preview Mobile Install
                                 </button>
                              </div>
                           </div>
                        </div>
                     </GlassCard>
                  </motion.div>
                )}

                {/* --- BILLING TAB --- */}
                  {activeTab === 'billing' && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <GlassCard className="p-10 space-y-8 border-white/5">
                           <h3 className="text-xl font-black text-white uppercase tracking-tight">Financial Agreement</h3>
                           <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                              <p className="text-xs font-bold text-white/60">Current Credit Wholesale Rate:</p>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-4xl font-black text-primary">$0.05</span>
                                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">per credit unit</span>
                              </div>
                           </div>
                           <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all">Update Payment Method</button>
                        </GlassCard>
                     </motion.div>
                  )}

                  {/* --- EMAIL TAB --- */}
                  {activeTab === 'email' && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <GlassCard className="p-10 space-y-8 border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-5"><Mail className="w-32 h-32" /></div>
                           <div className="space-y-2 relative z-10">
                              <h3 className="text-xl font-black text-white uppercase tracking-tight">White-Label Communications</h3>
                              <p className="text-white/40 text-xs font-medium">Configure your own SMTP server to send emails from your domain instead of Antigravity.</p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">SMTP Host</label>
                                 <input
                                    type="text"
                                    defaultValue={partnerData.custom_smtp_settings?.host}
                                    onBlur={(e) => handleUpdate({ custom_smtp_settings: { ...partnerData.custom_smtp_settings, host: e.target.value } })}
                                    placeholder="smtp.gmail.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">SMTP Port</label>
                                 <input
                                    type="text"
                                    defaultValue={partnerData.custom_smtp_settings?.port}
                                    onBlur={(e) => handleUpdate({ custom_smtp_settings: { ...partnerData.custom_smtp_settings, port: e.target.value } })}
                                    placeholder="587"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">SMTP User</label>
                                 <input
                                    type="text"
                                    defaultValue={partnerData.custom_smtp_settings?.user}
                                    onBlur={(e) => handleUpdate({ custom_smtp_settings: { ...partnerData.custom_smtp_settings, user: e.target.value } })}
                                    placeholder="notifications@youragency.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">SMTP Password</label>
                                 <input
                                    type="password"
                                    defaultValue={partnerData.custom_smtp_settings?.pass}
                                    onBlur={(e) => handleUpdate({ custom_smtp_settings: { ...partnerData.custom_smtp_settings, pass: e.target.value } })}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none"
                                 />
                              </div>
                           </div>
                        </GlassCard>
                     </motion.div>
                  )}
                  </AnimatePresence>
               </div>
            </div>
         </main>
      </div>

         {saving && (
            <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-widest">Broadcasting Changes...</span>
            </div>
         )}
      </div>
   )
}
