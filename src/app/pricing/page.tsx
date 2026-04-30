'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Check, 
  Zap, 
  Shield, 
  Rocket, 
  Star, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Layout
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PublicPricingPage() {
  const { language } = useTranslation()
  const supabase = createClient()
  const [plans, setPlans] = useState<any[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('visibility', 'public')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })
      if (data) setPlans(data)
      setLoading(false)
    }
    fetchPlans()
  }, [])

  return (
    <div className="min-h-screen bg-[#050014] pt-20 pb-40 px-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-pink/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <header className="text-center space-y-8 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
             <Zap className="w-4 h-4 text-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Scale your intelligence</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
            Ready to <br/><span className="text-primary italic">Ascend?</span>
          </motion.h1>
          
          {/* Toggle (23.2) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4">
             <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-white/20'}`}>Monthly</span>
             <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative flex items-center"
             >
                <motion.div 
                  animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                  className="w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/30" 
                />
             </button>
             <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-white/20'}`}>Yearly (Save 20%)</span>
          </motion.div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => <div key={i} className="h-[600px] rounded-[3rem] bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {plans.map((plan, i) => {
                const price = billingCycle === 'monthly' ? plan.price_monthly : (plan.price_monthly * 12 * 0.8) / 12
                const isPro = plan.slug?.includes('pro')

                return (
                  <motion.div 
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-10 md:p-14 h-full flex flex-col relative overflow-hidden group ${isPro ? 'border-primary/40 bg-primary/5' : 'border-white/5'}`}>
                       {isPro && <div className="absolute top-10 right-[-40px] rotate-45 bg-primary text-white px-12 py-1 text-[10px] font-black uppercase tracking-widest shadow-xl">Most Popular</div>}
                       
                       <div className="space-y-10 flex-1">
                          <div className="space-y-3">
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">{plan.name_es}</h3>
                             <p className="text-xs font-bold text-white/30 uppercase tracking-widest line-clamp-2">{plan.description_es || 'Unlock full potential with our premium suite.'}</p>
                          </div>

                          <div className="flex items-baseline gap-2">
                             <span className="text-6xl font-black text-white italic tracking-tighter">${Math.round(price)}</span>
                             <span className="text-xs font-black text-white/20 uppercase">/ user / month</span>
                          </div>

                          <div className="space-y-6">
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Core Features</p>
                             <div className="space-y-4">
                                {['Advanced AI Models', 'Priority Support', 'Custom Workspaces', 'Dynamic Templates'].map((feat, j) => (
                                  <div key={j} className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-primary" />
                                     </div>
                                     <span className="text-xs font-bold text-white/70">{feat}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
                          <Link href={`/register?plan=${plan.slug}`} className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl ${isPro ? 'bg-primary text-white shadow-primary/30 hover:scale-[1.03]' : 'bg-white text-black hover:bg-white/90'}`}>
                             Get Started <ChevronRight className="w-4 h-4" />
                          </Link>
                          <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest">No credit card required for trial</p>
                       </div>
                    </GlassCard>
                  </motion.div>
                )
             })}
          </div>
        )}

        <footer className="pt-20 text-center">
           <GlassCard className="p-14 border-white/5 bg-transparent inline-flex flex-col items-center gap-8 max-w-4xl rounded-[3rem]">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-primary shadow-2xl"><Shield className="w-10 h-10" /></div>
              <div className="space-y-4">
                 <h4 className="text-2xl font-black text-white uppercase italic italic">Enterprise Scale?</h4>
                 <p className="text-white/40 text-sm font-medium leading-relaxed max-w-2xl">Deploy Antigravity across your entire organization with SOC2 compliance, custom SLAs and priority engineering support.</p>
              </div>
              <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white transition-all">Contact Sales Architecture</button>
           </GlassCard>
        </footer>
      </div>
    </div>
  )
}
