'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  CreditCard, 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  Database,
  ShieldCheck,
  Plus,
  Radio,
  ExternalLink,
  Code
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminProcessorsPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [processors, setProcessors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase.from('payment_processors').select('*').order('name', { ascending: true })
    if (data) setProcessors(data)
    setLoading(false)
  }

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from('payment_processors').update({ is_active: !current }).eq('id', id)
    if (!error) {
       toast({ title: `Processor ${current ? 'Suspended' : 'Activated'}`, type: 'success' })
       fetchData()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Payment Adapters" 
        subtitle="Manage global bridge connections to financial networks. Enable Stripe, PayPal or local gateways."
        icon={CreditCard}
        actions={
          <button className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Register Adapter
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {processors.map((proc, i) => (
           <motion.div key={proc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
             <GlassCard className="p-8 space-y-6 relative overflow-hidden group">
                <div className="flex justify-between items-center relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                   </div>
                   <button onClick={() => toggleStatus(proc.id, proc.is_active)} className="transition-all">
                      {proc.is_active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-white/10" />}
                   </button>
                </div>

                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">{proc.name}</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{proc.adapter_key}</p>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/30">Config Schema (18.2)</span>
                      <span className="text-primary flex items-center gap-1"><Code className="w-3 h-3" /> {proc.config_schema?.length || 0} Fields</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {proc.config_schema?.map((f: any) => (
                        <span key={f.name} className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-white/40 uppercase border border-white/5 italic">{f.label}</span>
                      ))}
                   </div>
                </div>

                <button className="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 rounded-xl hover:bg-white hover:text-black transition-all">Configure Adapter</button>
             </GlassCard>
           </motion.div>
         ))}

         {/* Add New Placeholder */}
         <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-primary/20 transition-all opacity-40 hover:opacity-100">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-all"><Plus className="w-6 h-6" /></div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Connect Local Gateway</p>
         </div>
      </div>

      <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4 max-w-2xl">
         <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-black uppercase tracking-widest italic">Security Note</h4>
         </div>
         <p className="text-xs text-white/50 leading-relaxed">Adapters handle the logic for signature verification, webhooks, and idempotency. Ensure your backend environment has the necessary SDKs for each registered adapter.</p>
      </div>
    </div>
  )
}
