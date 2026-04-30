'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Package, 
  Plus, 
  Zap, 
  Tag, 
  DollarSign, 
  ChevronRight, 
  Layout,
  Save,
  Loader2,
  Trash2,
  Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminOffersPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Editor State
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState('client_plan')
  const [description, setDescription] = useState('')
  const [prices, setPrices] = useState<any[]>([{ type: 'monthly', amount: 0, currency: 'USD' }])
  const [grants, setGrants] = useState<any>({ credits: 0, tags: [] })
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    setLoading(true)
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false })
    if (data) setOffers(data)
    setLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const offerData = {
      name, slug, type, description, features, prices, grants
    }

    try {
      if (id) {
        await supabase.from('offers').update(offerData).eq('id', id)
      } else {
        await supabase.from('offers').insert([offerData])
      }
      toast({ title: 'Oferta guardada', type: 'success' })
      fetchOffers()
      resetForm()
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setIsSaving(false)
  }

  const resetForm = () => {
    setId(null)
    setName('')
    setSlug('')
    setType('client_plan')
    setDescription('')
    setPrices([{ type: 'monthly', amount: 0, currency: 'USD' }])
    setGrants({ credits: 0, tags: [] })
    setFeatures([])
  }

  const addPrice = () => setPrices([...prices, { type: 'annual', amount: 0, currency: 'USD' }])
  const updatePrice = (idx: number, field: string, value: any) => {
    const newPrices = [...prices]
    newPrices[idx] = { ...newPrices[idx], [field]: value }
    setPrices(newPrices)
  }

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature])
      setNewFeature('')
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading Offers...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Package className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Inventory Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Commercial <span className="text-primary italic">Offers</span>
          </h1>
        </div>
        {!id && (
           <p className="text-white/20 text-xs font-black uppercase tracking-widest animate-pulse">Drafting Mode Active</p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
         {/* --- Editor Section --- */}
         <div className="space-y-8">
            <GlassCard className="p-10 space-y-8 border-primary/10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Offer Name</label>
                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" placeholder="Professional XL" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Slug (URL)</label>
                     <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" placeholder="professional-xl" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Offer Type</label>
                     <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none appearance-none">
                        <option value="client_plan">Client Plan</option>
                        <option value="partner_plan">Partner Plan</option>
                        <option value="credit_topup">Credit Top-up</option>
                        <option value="product">Physical/Digital Product</option>
                        <option value="service">Service/Consulting</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Description</label>
                     <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none" placeholder="Best for scale..." />
                  </div>
               </div>

               {/* Prices (7.3) */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xs font-black text-white uppercase tracking-widest">Normalized Pricing</h3>
                     <button onClick={addPrice} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-primary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                     {prices.map((p, idx) => (
                       <div key={idx} className="flex gap-4 items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <select value={p.type} onChange={(e) => updatePrice(idx, 'type', e.target.value)} className="bg-transparent text-white text-xs font-bold focus:outline-none">
                             <option value="monthly">Monthly</option>
                             <option value="annual">Annual</option>
                             <option value="weekly">Weekly</option>
                             <option value="onetime">One-Time</option>
                          </select>
                          <div className="flex-1 flex items-center gap-2">
                             <DollarSign className="w-3 h-3 text-white/20" />
                             <input type="number" value={p.amount} onChange={(e) => updatePrice(idx, 'amount', e.target.value)} className="w-full bg-transparent text-white text-sm font-black focus:outline-none" />
                          </div>
                          <input type="text" value={p.stripe_id} onChange={(e) => updatePrice(idx, 'stripe_id', e.target.value)} className="w-32 bg-white/5 rounded px-2 py-1 text-[10px] text-white/20 font-mono" placeholder="Stripe ID" />
                          <button onClick={() => setPrices(prices.filter((_, i) => i !== idx))} className="text-red-500/40 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Features */}
               <div className="space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Key Features</h3>
                  <div className="flex gap-2">
                     <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" placeholder="Daily support..." />
                     <button onClick={addFeature} className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {features.map((f, i) => (
                       <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60 flex items-center gap-2">
                          {f} <button onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-400">×</button>
                       </span>
                     ))}
                  </div>
               </div>

               <button onClick={handleSave} disabled={isSaving} className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Product Offer
               </button>
            </GlassCard>
         </div>

         {/* --- List Section --- */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/20">
               <Layout className="w-5 h-5" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Active Inventory</h3>
            </div>
            <div className="space-y-4">
               {offers.map(o => (
                  <GlassCard 
                    key={o.id} 
                    onClick={() => {
                       setId(o.id)
                       setName(o.name)
                       setSlug(o.slug)
                       setType(o.type)
                       setDescription(o.description)
                       setPrices(o.prices)
                       setFeatures(o.features || [])
                       setGrants(o.grants)
                    }}
                    className={`p-6 cursor-pointer group transition-all ${id === o.id ? 'border-primary bg-primary/5' : 'hover:border-white/20'}`}
                  >
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <p className="text-[10px] text-primary font-black uppercase tracking-widest">{o.type.replace('_', ' ')}</p>
                           <h4 className="text-white font-bold">{o.name}</h4>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-white/20 group-hover:text-primary transition-all ${id === o.id ? 'rotate-90 text-primary' : ''}`} />
                     </div>
                     <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex gap-2">
                           <span className="text-[10px] font-bold text-white/20">{o.prices.length} Prices</span>
                           <span className="text-[10px] font-bold text-white/20">{o.features?.length || 0} Benefits</span>
                        </div>
                        <span className="text-sm font-black text-white italic">${o.prices[0]?.amount}</span>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
