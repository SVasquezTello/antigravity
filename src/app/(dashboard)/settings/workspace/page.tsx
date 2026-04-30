'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Building2, 
  CreditCard, 
  Zap, 
  Settings, 
  Save, 
  Loader2,
  Globe,
  BellRing
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function WorkspaceSettingsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [workspace, setWorkspace] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [name, setName] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    const fetchWorkspace = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase.from('users').select('client_id').eq('id', user.id).single()
        if (userData?.client_id) {
          const { data } = await supabase.from('clients').select('*, partners(name)').eq('id', userData.client_id).single()
          if (data) {
            setWorkspace(data)
            setName(data.name)
          }
        }
      }
      setLoading(false)
    }
    fetchWorkspace()
  }, [supabase])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from('clients').update({ name }).eq('id', workspace.id)
      if (error) throw error
      toast({ title: language === 'en' ? 'Workspace updated' : 'Workspace actualizado', type: 'success' })
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setIsSaving(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading workspace...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Client Console</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Workspace <span className="text-primary italic">Settings</span>
          </h1>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {language === 'en' ? 'Save Changes' : 'Guardar Cambios'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Sidebar Stats */}
         <div className="space-y-6">
            <GlassCard className="p-6 space-y-4">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Credits</p>
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${workspace?.credits > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                     <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-black text-white">{workspace?.credits || 0}</h3>
               </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Managed By</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <Settings className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-white uppercase tracking-tighter truncate">{workspace?.partners?.name || 'System'}</p>
               </div>
            </GlassCard>
         </div>

         {/* Main Form */}
         <div className="md:col-span-2 space-y-8">
            <GlassCard className="p-8 space-y-8">
               <h3 className="text-xl font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">General Information</h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Workspace Name</label>
                     <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all font-medium"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Workspace ID (Static)</label>
                     <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white/30 font-mono text-xs">
                        {workspace?.id}
                     </div>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="p-8 space-y-8">
               <h3 className="text-xl font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Preferences</h3>
               
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <BellRing className="w-5 h-5 text-primary" />
                     <span className="text-sm text-white font-medium">System Notifications</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled} 
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-5 h-5 accent-primary" 
                  />
               </div>

               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <Globe className="w-5 h-5 text-primary" />
                     <span className="text-sm text-white font-medium">Default Language</span>
                  </div>
                  <span className="text-xs font-black text-white/30 uppercase tracking-widest">Automatic</span>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  )
}
