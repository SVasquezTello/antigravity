'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Zap, 
  Plus, 
  Settings2, 
  LineChart, 
  Activity, 
  Code2, 
  Save, 
  Trash2, 
  Loader2,
  Globe,
  Tag as TagIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminAppsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Editor State
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [credits, setCredits] = useState(1)
  const [category, setCategory] = useState('Marketing')
  const [tagRequired, setTagRequired] = useState('')

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    setLoading(true)
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (data) setApps(data)
    setLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const appData = {
      name, slug, webhook_url: webhookUrl, cost_credits: credits, category, tag_required: tagRequired
    }
    try {
      if (id) {
        await supabase.from('applications').update(appData).eq('id', id)
      } else {
        await supabase.from('applications').insert([appData])
      }
      toast({ title: 'Application Deployed', type: 'success' })
      fetchApps()
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setIsSaving(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading App Inventory...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Zap className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Global Software Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Marketplace <span className="text-primary italic">Engine</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
         {/* --- App Editor --- */}
         <div className="space-y-8">
            <GlassCard className="p-10 space-y-8 border-primary/10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Display Name</label>
                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" placeholder="AI Bio Writer" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Identifier Slug</label>
                     <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm" placeholder="ai_bio_writer" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">n8n Production Webhook URL (11.1)</label>
                  <div className="relative">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                     <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-primary outline-none" placeholder="https://n8n.domain.com/webhook/..." />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Credit Cost</label>
                     <input type="number" value={credits} onChange={(e) => setCredits(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Category</label>
                     <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none">
                        <option>Marketing</option>
                        <option>RRHH</option>
                        <option>Legal</option>
                        <option>Finanzas</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Required Tag (10.1)</label>
                     <input type="text" value={tagRequired} onChange={(e) => setTagRequired(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-[10px]" placeholder="access_elite_plan" />
                  </div>
               </div>

               <button onClick={handleSave} disabled={isSaving} className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Tool to Market
               </button>
            </GlassCard>
         </div>

         {/* --- App Sidebar Stats --- */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/20">
               <Activity className="w-5 h-5" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Tool Inventory</h3>
            </div>
            <div className="space-y-4">
               {apps.map(app => (
                 <GlassCard 
                  key={app.id} 
                  onClick={() => {
                    setId(app.id)
                    setName(app.name)
                    setSlug(app.slug)
                    setWebhookUrl(app.webhook_url)
                    setCredits(app.cost_credits)
                    setCategory(app.category)
                    setTagRequired(app.tag_required || '')
                  }}
                  className={`p-6 cursor-pointer group transition-all ${id === app.id ? 'border-primary bg-primary/5' : 'hover:border-white/10'}`}
                 >
                    <div className="flex justify-between items-center">
                       <div>
                          <h4 className="text-white font-bold">{app.name}</h4>
                          <p className="text-[10px] text-white/20 font-mono italic">{app.slug}</p>
                       </div>
                       <ChevronRight className={`w-5 h-5 transition-transform ${id === app.id ? 'rotate-90 text-primary' : 'text-white/10 group-hover:text-primary/40'}`} />
                    </div>
                 </GlassCard>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}
