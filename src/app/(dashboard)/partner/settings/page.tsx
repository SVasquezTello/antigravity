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
  Image as ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandingLab } from '@/components/branding/BrandingLab'

export default function PartnerSettingsHub() {
  const { toast } = useToast()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [partnerData, setPartnerData] = useState<any>(null)

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
    }
    setLoading(false)
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
            <AnimatePresence mode="wait">
               {/* --- GENERAL TAB --- */}
               {activeTab === 'general' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <GlassCard className="p-10 space-y-8 border-white/5">
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Enterprise Identity</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Agency Brand Name</label>
                             <input 
                               type="text" defaultValue={partnerData.name} 
                               onBlur={(e) => handleUpdate({ name: e.target.value })}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Contact Email</label>
                             <input type="text" value={partnerData.email} disabled className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/30 cursor-not-allowed" />
                          </div>
                       </div>
                    </GlassCard>
                 </motion.div>
               )}

               {/* --- BRANDING TAB (25.2) --- */}
               {activeTab === 'branding' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="space-y-10">
                       <GlassCard className="p-10 space-y-6 border-white/5">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity Assets</h3>
                          <div className="flex flex-col md:flex-row gap-10 items-start">
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
                          initialColor={partnerData.primary_color} 
                          onColorChange={(color) => handleUpdate({ primary_color: color })} 
                       />
                    </div>
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
            </AnimatePresence>
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
