'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Flag, 
  Settings2, 
  Activity, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight,
  Plus,
  Users,
  Percent,
  Search,
  Code
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminFeatureFlagsPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [flags, setFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    setLoading(true)
    const { data } = await supabase.from('feature_flags').select('*').order('key', { ascending: true })
    if (data) setFlags(data)
    setLoading(false)
  }

  const toggleFlag = async (id: string, current: boolean) => {
    const { error } = await supabase.from('feature_flags').update({ is_enabled: !current }).eq('id', id)
    if (!error) {
       toast({ title: `Feature Flag ${current ? 'Disabled' : 'Enabled'}`, type: 'success' })
       fetchFlags()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Feature Governance" 
        subtitle="Manage gradual feature deployment, beta access and system-wide toggles."
        icon={Flag}
        actions={
          <button className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Flag
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {loading ? (
            <div className="col-span-full p-20 text-center text-white/20 font-black uppercase tracking-widest animate-pulse">Syncing Feature States...</div>
         ) : (
           flags.map((flag, i) => (
             <motion.div key={flag.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className={`p-8 space-y-6 relative overflow-hidden group border-white/5 ${flag.is_enabled ? 'bg-primary/5 border-primary/20' : ''}`}>
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{flag.key}</h3>
                            {flag.is_enabled && <Activity className="w-4 h-4 text-green-500 animate-pulse" />}
                         </div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{flag.description}</p>
                      </div>
                      <button onClick={() => toggleFlag(flag.id, flag.is_enabled)}>
                         {flag.is_enabled ? <ToggleRight className="w-10 h-10 text-primary" /> : <ToggleLeft className="w-10 h-10 text-white/10" />}
                      </button>
                   </div>

                   <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase">Reach</p>
                         <div className="flex items-center gap-1 text-[10px] font-black text-white">
                            <Percent className="w-3 h-3 text-primary" /> {flag.rules?.percentage || 100}%
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase">Roles</p>
                         <div className="flex items-center gap-1 text-[10px] font-black text-white">
                            <Users className="w-3 h-3 text-primary" /> {flag.rules?.roles?.length || 'ALL'}
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase">Last Edit</p>
                         <div className="flex items-center gap-1 text-[10px] font-black text-white">
                            <Code className="w-3 h-3 text-primary" /> {new Date(flag.updated_at).toLocaleDateString()}
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white hover:text-black transition-all">Edit Target Rules</button>
                </GlassCard>
             </motion.div>
           ))
         )}
      </div>

      <GlassCard className="p-10 space-y-6 border-dashed border-white/10 opacity-60">
         <div className="flex items-center gap-3 text-white/40">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-black uppercase tracking-widest italic">Safety Protocol</h4>
         </div>
         <p className="text-xs text-white/20 leading-relaxed uppercase font-bold">Use feature flags to isolate new logic. A global kill-switch is better than a platform-wide outage.</p>
      </GlassCard>
    </div>
  )
}
