'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  ShieldCheck, 
  RefreshCw, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal,
  Zap,
  Loader2,
  Play
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminMaintenancePage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [isRunning, setIsRunning] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const handleRunMaintenance = async () => {
    setIsRunning(true)
    const { data, error } = await supabase.rpc('run_platform_maintenance')
    
    if (!error) {
      setLastResult(data)
      toast({ title: 'Maintenance Success', type: 'success' })
    } else {
      toast({ title: 'Maintenance Failed', type: 'error' })
    }
    setIsRunning(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Infrastructure Care" 
        subtitle="Manage autonomous system cleanup, subscription policing, and partner health checks."
        icon={ShieldCheck}
        actions={
          <button 
            onClick={handleRunMaintenance} disabled={isRunning}
            className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Force Full Cycle
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Job Cards (21.1 - 21.4) */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Autonomous Protocols</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <GlassCard className="p-8 space-y-6 border-white/5">
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><RefreshCw className="w-6 h-6" /></div>
                     <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Active</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase">Subscription Policing (21.1)</h4>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest italic pt-1">Revokes access for expired leases.</p>
                  </div>
               </GlassCard>

               <GlassCard className="p-8 space-y-6 border-white/5">
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500"><Trash2 className="w-6 h-6" /></div>
                     <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Active</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase">Skeleton Cleanup (21.3)</h4>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest italic pt-1">Flushes orphaned checkout sessions.</p>
                  </div>
               </GlassCard>

               <GlassCard className="p-8 space-y-6 border-white/5">
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500"><AlertTriangle className="w-6 h-6" /></div>
                     <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Active</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase">Partner Monitor (21.4)</h4>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest italic pt-1">Sends low-balance alerts to network.</p>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Run Result Console */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 px-2">Last Transmission</h3>
            <GlassCard className="p-8 space-y-6 h-full min-h-[300px] bg-[#050014] border-primary/20">
               {lastResult ? (
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 text-green-500">
                       <CheckCircle2 className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Protocol Success</span>
                    </div>
                    <div className="space-y-4 font-mono text-[10px]">
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/20">Expired Subs</span>
                          <span className="text-white">{lastResult.subscriptions?.expired_processed || 0}</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/20">Cleaned Skeletons</span>
                          <span className="text-white">{lastResult.cleanup?.skeletons_removed || 0}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-white/20">Partner Alerts</span>
                          <span className="text-white">{lastResult.partners?.partner_alerts_sent || 0}</span>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                       <p className="text-[8px] text-white/10 uppercase tracking-widest">Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
                    <Terminal className="w-12 h-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Standby Mode</p>
                 </div>
               )}
            </GlassCard>
         </div>
      </div>
    </div>
  )
}
