'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Check, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PartnerPricingPage() {
  const params = useParams()
  const { language } = useTranslation()
  const supabase = createClient()
  
  const [partner, setPartner] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Partner Branding (23.3)
      const { data: pData } = await supabase.from('partners').select('*').eq('slug', params.partnerSlug).single()
      if (pData) setPartner(pData)

      // 2. Fetch Public Plans
      const { data: oData } = await supabase.from('offers').select('*').eq('visibility', 'public').eq('is_active', true).order('price_monthly', { ascending: true })
      if (oData) setPlans(oData)
      
      setLoading(false)
    }
    fetchData()
  }, [params.partnerSlug])

  const brandColor = partner?.primary_color || '#7C3AED'

  if (loading) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/20 uppercase tracking-[0.5em] font-black">Aligning Branded Assets...</div>

  if (!partner) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/40 uppercase font-black">Partner Gateway Not Found</div>

  return (
    <div className="min-h-screen bg-[#050014] pb-40">
      {/* Dynamic Branding Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[150px]" style={{ backgroundColor: brandColor }} />
      </div>

      {/* Partner Header (23.3) */}
      <nav className="w-full h-24 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center px-6 md:px-20 justify-between relative z-20">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
               {partner.logo_url ? <img src={partner.logo_url} className="w-full h-full object-contain p-2" /> : <Building2 className="w-5 h-5 text-white/20" />}
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">{partner.name}</span>
         </div>
         <div className="hidden md:flex items-center gap-6">
            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Solutions</span>
            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Resources</span>
            <Link href="/login" className="px-6 py-2 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Sign In</Link>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 space-y-32 relative z-10">
         <header className="text-center space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
               Empower <br/>Your <span style={{ color: brandColor }} className="italic">Business</span>
            </h1>
            <p className="max-w-2xl mx-auto text-white/40 text-lg font-medium leading-relaxed uppercase tracking-widest italic">
               Premium AI Infrastructure powered by {partner.name}.
            </p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                 <GlassCard className="p-12 h-full flex flex-col space-y-10 border-white/5 hover:bg-white/[0.02] transition-all">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white uppercase italic">{plan.name_es}</h3>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{plan.slug}</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black text-white italic">${Math.round(plan.price_monthly)}</span>
                       <span className="text-xs font-black text-white/20 uppercase">/ month</span>
                    </div>

                    <div className="flex-1 space-y-6">
                       <p className="text-[10px] font-black text-white/10 uppercase tracking-widest border-b border-white/5 pb-2">Included Systems</p>
                       <div className="space-y-4">
                          {[1,2,3,4].map(f => (
                            <div key={f} className="flex items-center gap-3">
                               <Check className="w-3.5 h-3.5" style={{ color: brandColor }} />
                               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Enterprise Access Node {f}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <button 
                       className="w-full py-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.03] active:scale-95"
                       style={{ backgroundColor: brandColor, boxShadow: `0 10px 40px -10px ${brandColor}66` }}
                    >
                       Secure Access <ChevronRight className="w-4 h-4 inline ml-2" />
                    </button>
                 </GlassCard>
              </motion.div>
            ))}
         </div>

         <footer className="text-center pt-20 border-t border-white/5">
            <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
               <ShieldCheck className="w-4 h-4 text-white/20" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Enterprise Encrypted Checkout by Antigravity Protocol</p>
            </div>
         </footer>
      </div>
    </div>
  )
}
