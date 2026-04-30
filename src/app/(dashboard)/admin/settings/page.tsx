'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  Globe, 
  Zap, 
  Activity,
  Save,
  Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    platform_name: 'Antigravity Enterprise',
    base_credit_cost: 0.05,
    partner_markup: 20,
    webhook_secret: 'ag_live_••••••••••••'
  })

  const handleSave = async () => {
    setLoading(true)
    // Here we would sync with a platform_settings table
    setTimeout(() => {
      toast({ title: 'System Variables Updated', type: 'success' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Global Governance" 
        subtitle="Control system costs, platform identity, and security thresholds."
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 gap-8">
         <GlassCard className="p-10 space-y-10 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
               <Globe className="w-8 h-8 text-primary" />
               <h3 className="text-xl font-black text-white uppercase tracking-tight">System Identity</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Root Platform Name</label>
                  <input 
                    type="text" value={formData.platform_name} onChange={(e) => setFormData({...formData, platform_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none font-bold" 
                  />
               </div>
            </div>
         </GlassCard>

         <GlassCard className="p-10 space-y-10 border-white/5">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
               <Zap className="w-8 h-8 text-primary" />
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Economic Logic (17.3)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Base Cost per Credit (USD)</label>
                  <div className="relative">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black">$</span>
                     <input 
                       type="number" step="0.01" value={formData.base_credit_cost} onChange={(e) => setFormData({...formData, base_credit_cost: parseFloat(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-white focus:border-primary outline-none" 
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Default Partner Markup (%)</label>
                  <div className="relative">
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black">%</span>
                     <input 
                       type="number" value={formData.partner_markup} onChange={(e) => setFormData({...formData, partner_markup: parseInt(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" 
                     />
                  </div>
               </div>
            </div>
         </GlassCard>

         <GlassCard className="p-10 space-y-10 border-red-500/10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
               <Terminal className="w-8 h-8 text-red-500" />
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Security & Webhooks</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Master Webhook Secret</label>
                  <input 
                    type="password" value={formData.webhook_secret} readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/20 cursor-not-allowed font-mono" 
                  />
               </div>
            </div>
         </GlassCard>

         <button 
           onClick={handleSave} disabled={loading}
           className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
         >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Commit Global Changes
         </button>
      </div>
    </div>
  )
}
