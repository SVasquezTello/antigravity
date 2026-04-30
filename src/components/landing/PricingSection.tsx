'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { Check, Zap, Sparkles, ChevronRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function PricingSection() {
  const { language } = useTranslation()
  const supabase = createClient()
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'annual'

  useEffect(() => {
    const fetchOffers = async () => {
      // Try to fetch from 'offers' first (New Architecture)
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('type', 'client_plan')
        .eq('visibility', 'public')
        .eq('status', 'active')
        .order('id', { ascending: true })

      if (offersData && offersData.length > 0) {
        setOffers(offersData)
      } else {
        // Fallback to 'plans' (Legacy Architecture)
        console.warn('PricingSection: Falling back to "plans" table.')
        const { data: plansData } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (plansData) {
          // Map plans to offer structure
          const mapped = plansData.map(plan => ({
            id: plan.id,
            slug: plan.slug,
            name: language === 'es' ? plan.name_es : plan.name_en,
            description: language === 'es' ? plan.description_es : plan.description_en,
            features: language === 'es' ? plan.items_es : plan.items_en,
            prices: [
              { type: 'monthly', amount: plan.price_monthly },
              { type: 'annual', amount: Math.round(plan.price_monthly * 10) } // Approximation for annual
            ],
            grants: { credits: plan.generations_limit }
          }))
          setOffers(mapped)
        }
      }
      setLoading(false)
    }
    fetchOffers()
  }, [supabase, language])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) return <div className="py-20 text-center animate-pulse text-white/20">Loading amazing plans...</div>

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Choose your <span className="text-primary italic">Power.</span>
           </h2>
           <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
              Simple, transparent pricing for teams of all sizes. Scalable AI infrastructure at your fingertips.
           </p>

           {/* Toggle (7.7) */}
           <div className="flex items-center justify-center gap-6 pt-10">
              <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-white/20'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-16 h-8 bg-white/5 border border-white/10 rounded-full p-1 relative group cursor-pointer"
              >
                 <motion.div 
                   animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                   className="w-6 h-6 bg-primary rounded-full shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform"
                 />
              </button>
              <div className="flex items-center gap-2">
                 <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${billingCycle === 'annual' ? 'text-white' : 'text-white/20'}`}>Annual</span>
                 <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-black rounded-full border border-green-500/20 animate-pulse">SAVE 20%</span>
              </div>
           </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {offers.map((offer) => {
             const price = offer.prices.find((p: any) => p.type === billingCycle) || offer.prices[0]
             const isPro = offer.slug === 'professional' || offer.slug === 'pro'
             
             return (
               <motion.div key={offer.id} variants={item}>
                  <GlassCard className={`h-full p-10 flex flex-col justify-between border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden ${isPro ? 'bg-primary/5 ring-2 ring-primary/20' : ''}`}>
                     {isPro && <div className="absolute top-10 -right-12 rotate-45 bg-primary text-white text-[10px] font-black px-12 py-1 shadow-xl">MOST POPULAR</div>}
                     
                     <div className="space-y-8 relative z-10">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-white uppercase tracking-tight">{offer.name}</h3>
                           <p className="text-white/40 text-sm font-medium">{offer.description}</p>
                        </div>

                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black text-white uppercase tracking-tighter">${price?.amount}</span>
                           <span className="text-white/20 text-xs font-bold uppercase tracking-widest">/ {billingCycle === 'annual' ? 'Year' : 'Month'}</span>
                        </div>

                        <div className="space-y-4">
                           {offer.features?.map((feat: string, i: number) => (
                             <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                   <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-xs text-white/50 font-medium group-hover:text-white/80 transition-colors">{feat}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="mt-12 space-y-4">
                        <Link href={`/register?plan=${offer.slug}&cycle=${billingCycle}`} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${isPro ? 'bg-primary text-white shadow-primary/20 hover:scale-105' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                           Get Started
                           <ChevronRight className="w-4 h-4" />
                        </Link>
                        <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-widest">{offer.grants?.credits || 0} AI Credits Included</p>
                     </div>
                  </GlassCard>
               </motion.div>
             )
          })}
        </motion.div>

        {/* --- WHY ANTIGRAVITY / VALUE PROP --- */}
        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight italic">Instant ROI</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                 Every tool is designed to save at least 2 hours of expert labor. Most users see a full return on investment within the first 48 hours of use.
              </p>
           </div>
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                 <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight italic">280+ Specialized Tools</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                 From Real Estate to Healthcare, we have built the world\'s largest library of industry-specific AI agents. No generic prompts, only results.
              </p>
           </div>
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                 <Check className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight italic">Enterprise Security</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                 Your data is yours. We use bank-grade encryption and Supabase Auth to ensure your corporate intelligence stays private and protected.
              </p>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-10">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Secure Stripe Payments & 14-Day Money Back Guarantee</span>
           </div>
        </div>
      </div>
    </section>
  )
}
