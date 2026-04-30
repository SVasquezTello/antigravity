'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Key, 
  Layers, 
  Plus, 
  Trash2, 
  Settings, 
  Search, 
  Hash, 
  ShieldCheck, 
  Check,
  ChevronRight,
  Package,
  Loader2,
  Tag as TagIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminTagsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState('tags') // 'tags', 'bundles'
  const [tags, setTags] = useState<any[]>([])
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Editor State
  const [isSaving, setIsSaving] = useState(false)
  const [tagName, setTagName] = useState('')
  const [tagSlug, setTagSlug] = useState('')
  const [tagColor, setTagColor] = useState('#7C3AED')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: tData } = await supabase.from('tags').select('*').order('name', { ascending: true })
    const { data: bData } = await supabase.from('tag_bundles').select('*').order('name', { ascending: true })
    if (tData) setTags(tData)
    if (bData) setBundles(bData)
    setLoading(false)
  }

  const handleCreateTag = async () => {
    setIsSaving(true)
    const { error } = await supabase.from('tags').insert([{ name: tagName, slug: tagSlug, color: tagColor }])
    if (!error) {
      toast({ title: 'Tag Created', type: 'success' })
      setTagName(''); setTagSlug('')
      fetchData()
    }
    setIsSaving(false)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading Access Keys...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Key className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Access Control System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Tags <span className="text-primary italic">& Bundles</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
         <main className="space-y-8">
            <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5 w-fit">
               <button onClick={() => setActiveTab('tags')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'tags' ? 'bg-primary text-white' : 'text-white/20 hover:text-white'}`}>Tags Library</button>
               <button onClick={() => setActiveTab('bundles')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'bundles' ? 'bg-primary text-white' : 'text-white/20 hover:text-white'}`}>Access Bundles</button>
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'tags' && (
                 <motion.div key="tags" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <GlassCard className="p-8 flex flex-col md:flex-row gap-6 items-end border-primary/10">
                       <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Tag Identity</label>
                          <input type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Marketing Elite" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none" />
                       </div>
                       <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Unique Slug</label>
                          <input type="text" value={tagSlug} onChange={(e) => setTagSlug(e.target.value)} placeholder="access_mkt_elite" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none font-mono" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Color</label>
                          <input type="color" value={tagColor} onChange={(e) => setTagColor(e.target.value)} className="w-14 h-[46px] bg-white/5 border border-white/10 rounded-xl cursor-pointer" />
                       </div>
                       <button onClick={handleCreateTag} disabled={isSaving} className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 flex items-center gap-2">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
                       </button>
                    </GlassCard>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {tags.map(tag => (
                         <GlassCard key={tag.id} className="p-4 flex items-center justify-between group hover:border-primary/40 transition-all border-white/5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                                  <Hash className="w-4 h-4" />
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-white mb-0.5">{tag.name}</p>
                                  <p className="text-[9px] text-white/20 font-mono italic">{tag.slug}</p>
                               </div>
                            </div>
                            <button className="text-white/5 group-hover:text-red-500/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </GlassCard>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'bundles' && (
                 <motion.div key="bundles" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {bundles.map(bundle => (
                         <GlassCard key={bundle.id} className="p-8 space-y-4 hover:border-primary/40 transition-all border-white/5">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary"><Package className="w-6 h-6" /></div>
                               <h3 className="text-lg font-black text-white uppercase tracking-tight">{bundle.name}</h3>
                            </div>
                            <p className="text-xs text-white/30">{bundle.description || 'No description provided'}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                               {bundle.tag_ids.map((tid: string) => {
                                 const tag = tags.find(t => t.id === tid)
                                 return tag ? (
                                   <span key={tid} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/10">{tag.name}</span>
                                 ) : null
                               })}
                            </div>
                         </GlassCard>
                       ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </main>

         <aside className="space-y-6">
            <GlassCard className="p-8 space-y-6">
               <h3 className="text-xs font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-4">Ecosystem Stats</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-white/30 uppercase">Active Keys</span>
                     <span className="text-lg font-black text-primary italic">{tags.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-white/30 uppercase">Ready Bundles</span>
                     <span className="text-lg font-black text-white italic">{bundles.length}</span>
                  </div>
               </div>
            </GlassCard>

            <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 flex items-center gap-4">
               <ShieldCheck className="w-8 h-8 text-primary" />
               <p className="text-[10px] font-bold text-primary/80 uppercase leading-relaxed">System-wide access is strictly gated by Tag UID validation.</p>
            </div>
         </aside>
      </div>
    </div>
  )
}
