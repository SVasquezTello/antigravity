'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  User, 
  Settings, 
  BellRing, 
  ShieldCheck, 
  Smartphone,
  Save,
  Loader2,
  Mail
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfileSettingsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [prefs, setPrefs] = useState({
    system: true,
    marketing: false,
    security: true,
    email_summary: true
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        setProfile(data)
        if (data?.notification_settings) setPrefs(data.notification_settings)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleSave = async () => {
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('users').update({ notification_settings: prefs }).eq('id', user!.id)
    toast({ title: 'Preferences Saved', type: 'success' })
    setIsSaving(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <User className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">User Environment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Profile <span className="text-primary italic">& Security</span>
          </h1>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Profile
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
         <div className="space-y-8">
            {/* Notification Preferences (13.3) */}
            <GlassCard className="p-10 space-y-8 border-primary/10">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <BellRing className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">Notification Channels</h3>
               </div>
               
               <div className="space-y-6">
                  {[
                    { key: 'system', label: 'System Alerts', desc: 'Quota warnings, plan renewals, and staff actions.', icon: Smartphone },
                    { key: 'security', label: 'Security Activity', desc: 'Login notifications and critical system logs.', icon: ShieldCheck },
                    { key: 'marketing', label: 'Product Updates', desc: 'New micro-apps and exclusive ecosystem news.', icon: Sparkles },
                    { key: 'email_summary', label: 'Email Recap', desc: 'Weekly usage and billing summary.', icon: Mail }
                  ].map((p: any) => (
                    <div key={p.key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer" onClick={() => setPrefs({...prefs, [p.key]: !prefs[p.key as keyof typeof prefs]})}>
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${prefs[p.key as keyof typeof prefs] ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'}`}>
                             <p.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm">{p.label}</p>
                             <p className="text-[10px] text-white/30 uppercase font-black">{p.desc}</p>
                          </div>
                       </div>
                       <div className={`w-12 h-6 rounded-full p-1 transition-all ${prefs[p.key as keyof typeof prefs] ? 'bg-primary' : 'bg-white/10'}`}>
                          <motion.div 
                            animate={{ x: prefs[p.key as keyof typeof prefs] ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-md"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         <aside className="space-y-6">
            <GlassCard className="p-8 text-center space-y-4">
               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center mx-auto text-white text-2xl font-black shadow-2xl">
                  {profile?.email?.[0].toUpperCase()}
               </div>
               <div>
                  <p className="text-white font-bold">{profile?.email}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">{profile?.role}</p>
               </div>
            </GlassCard>
         </aside>
      </div>
    </div>
  )
}
