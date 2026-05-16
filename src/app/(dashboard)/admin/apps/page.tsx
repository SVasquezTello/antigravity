'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Plus, 
  Search, 
  Settings2, 
  Trash2, 
  Save, 
  Code2, 
  Sparkles, 
  Layout, 
  Zap,
  ChevronRight,
  ExternalLink,
  Loader2,
  X,
  Eye,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/ToastProvider'

export default function MicroAppManagerPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name_es: '',
    name_en: '',
    slug: '',
    description_es: '',
    description_en: '',
    prompt_template: '',
    form_schema: [] as any[],
    autofill_presets: [] as any[],
    icon: 'Sparkles',
    price_credits: 1,
    is_active: true
  })

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    const { data } = await supabase
      .from('micro_apps')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setApps(data)
    setLoading(false)
  }

  const handleOpenModal = (app: any = null) => {
    if (app) {
      setEditingApp(app)
      setFormData({
        name_es: app.name_es || '',
        name_en: app.name_en || '',
        slug: app.slug || '',
        description_es: app.description_es || '',
        description_en: app.description_en || '',
        prompt_template: app.prompt_template || '',
        form_schema: app.form_schema || [],
        autofill_presets: app.autofill_presets || [],
        icon: app.icon || 'Sparkles',
        price_credits: app.price_credits || 1,
        is_active: app.is_active ?? true
      })
    } else {
      setEditingApp(null)
      setFormData({
        name_es: '',
        name_en: '',
        slug: '',
        description_es: '',
        description_en: '',
        prompt_template: '',
        form_schema: [],
        autofill_presets: [],
        icon: 'Sparkles',
        price_credits: 1,
        is_active: true
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    }

    let error
    if (editingApp) {
      const { error: err } = await supabase
        .from('micro_apps')
        .update(payload)
        .eq('id', editingApp.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from('micro_apps')
        .insert([{ ...payload, id: undefined }])
      error = err
    }

    if (!error) {
      toast({ title: editingApp ? 'App Updated' : 'App Created', type: 'success' })
      setIsModalOpen(false)
      fetchApps()
    } else {
      toast({ title: 'Error saving app', type: 'error' })
      console.error(error)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app? This cannot be undone.')) return
    
    const { error } = await supabase.from('micro_apps').delete().eq('id', id)
    if (!error) {
      toast({ title: 'App Deleted', type: 'success' })
      fetchApps()
    }
  }

  const filteredApps = apps.filter(a => 
    a.name_es.toLowerCase().includes(search.toLowerCase()) || 
    a.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 p-4">
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Code2 className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core Engineering</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              Solution <span className="text-primary italic">Architect</span>
            </h1>
            <p className="text-white/40 text-sm max-w-2xl font-medium">
               Gestiona el catálogo global de micro-aplicaciones. Define prompts de IA, estructuras de datos y lógica de negocio para todos los partners.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
             <Plus className="w-4 h-4" /> Crear Nueva App
          </button>
       </header>

       {/* Filters */}
       <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center border-white/5">
          <div className="relative flex-1 w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
             <input 
               type="text" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Buscar por nombre o slug..."
               className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
             />
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-3 bg-white/5 rounded-xl text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/5">
                {apps.length} Total Apps
             </div>
          </div>
       </GlassCard>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
             {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <GlassCard key={i} className="h-48 animate-pulse bg-white/5" />
                ))
             ) : (
                filteredApps.map((app) => (
                  <motion.div 
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                     <GlassCard className="p-6 h-full flex flex-col justify-between group border-white/5 hover:border-primary/40 transition-all">
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                 <Layout className="w-5 h-5" />
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => handleOpenModal(app)} className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-white hover:bg-white/10 transition-all">
                                    <Settings2 className="w-4 h-4" />
                                 </button>
                                 <button onClick={() => handleDelete(app.id)} className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                           <div>
                              <h3 className="text-lg font-black text-white uppercase tracking-tight truncate">{language === 'es' ? app.name_es : app.name_en}</h3>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{app.slug}</p>
                           </div>
                           <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                              {language === 'es' ? app.description_es : app.description_en}
                           </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-primary" />
                              <span className="text-[10px] font-black text-white/20 uppercase">{app.price_credits} Credits</span>
                           </div>
                           <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${app.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {app.is_active ? 'Active' : 'Inactive'}
                           </span>
                        </div>
                     </GlassCard>
                  </motion.div>
                ))
             )}
          </AnimatePresence>
       </div>

       {/* Modal Editor */}
       <AnimatePresence>
          {isModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                   <div className="p-8 md:p-12 space-y-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                      <header className="flex justify-between items-center">
                         <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                               {editingApp ? 'Editar' : 'Nueva'} <span className="text-primary italic">Solución</span>
                            </h2>
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest mt-1">Configuración técnica del motor de IA</p>
                         </div>
                         <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full text-white/20 hover:text-white transition-all">
                            <X className="w-6 h-6" />
                         </button>
                      </header>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {/* Col 1: Identity */}
                         <div className="space-y-8">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">App Slug (Unique ID)</label>
                               <input 
                                 type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none font-mono text-sm" 
                               />
                            </div>
                            <div className="space-y-4">
                               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Localization (ES / EN)</p>
                               <div className="grid grid-cols-2 gap-4">
                                  <input 
                                    type="text" placeholder="Nombre (ES)" value={formData.name_es} onChange={e => setFormData({...formData, name_es: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none" 
                                  />
                                  <input 
                                    type="text" placeholder="Name (EN)" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none" 
                                  />
                               </div>
                               <div className="grid grid-cols-1 gap-4">
                                  <textarea 
                                    placeholder="Descripción (ES)" rows={3} value={formData.description_es} onChange={e => setFormData({...formData, description_es: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none resize-none" 
                                  />
                                  <textarea 
                                    placeholder="Description (EN)" rows={3} value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none resize-none" 
                                  />
                               </div>
                            </div>
                         </div>

                         {/* Col 2: Engineering */}
                         <div className="space-y-8">
                            <div className="space-y-2">
                               <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                     <Sparkles className="w-3 h-3 text-primary" /> System Prompt Template
                                  </label>
                                  <span className="text-[8px] font-black text-primary uppercase">Engine: Gemini 1.5 Pro</span>
                               </div>
                               <textarea 
                                 rows={12} value={formData.prompt_template} onChange={e => setFormData({...formData, prompt_template: e.target.value})}
                                 placeholder="You are an expert in... {{input_1}} will be provided..."
                                 className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none font-mono text-xs leading-relaxed" 
                               />
                               <p className="text-[9px] text-white/20 italic">Usa {'{{variable}}'} para inyectar los inputs del usuario.</p>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Form Schema (JSON)</label>
                               <textarea 
                                 rows={5} value={JSON.stringify(formData.form_schema, null, 2)} 
                                 onChange={e => {
                                    try { setFormData({...formData, form_schema: JSON.parse(e.target.value)}) } catch(e) {}
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] text-white outline-none font-mono" 
                               />
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Autofill Presets (JSON)</label>
                               <textarea 
                                 rows={3} value={JSON.stringify(formData.autofill_presets, null, 2)} 
                                 onChange={e => {
                                    try { setFormData({...formData, autofill_presets: JSON.parse(e.target.value)}) } catch(e) {}
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] text-white outline-none font-mono" 
                               />
                            </div>
                         </div>
                      </div>

                      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Pricing</span>
                               <input 
                                 type="number" value={formData.price_credits} onChange={e => setFormData({...formData, price_credits: parseInt(e.target.value)})}
                                 className="w-20 bg-transparent text-xl font-black text-white outline-none" 
                               />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                               <input 
                                 type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})}
                                 className="w-5 h-5 rounded-lg bg-white/5 border-white/10 text-primary focus:ring-primary" 
                               />
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">Public App</span>
                            </label>
                         </div>
                         <div className="flex gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Descartar</button>
                            <button 
                              onClick={handleSave} disabled={saving}
                              className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:invert transition-all disabled:opacity-50"
                            >
                               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                               {editingApp ? 'Actualizar Sistema' : 'Publicar Solución'}
                            </button>
                         </div>
                      </footer>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  )
}
