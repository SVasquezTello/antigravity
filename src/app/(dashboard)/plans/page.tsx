'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { Check, Zap, Sparkles, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PlansPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = React.useMemo(() => createClient(), [])
  
  const [plans, setPlans] = useState<any[]>([])
  const [userPlanId, setUserPlanId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradingId, setUpgradingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      const { data: plansData } = await supabase.from('plans').select('*').order('sort_order', { ascending: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase.from('users').select('plan_id').eq('id', user.id).single()
        setUserPlanId(userData?.plan_id)
      }
      if (plansData) setPlans(plansData)
      setLoading(false)
    }
    fetchPlans()
  }, [supabase])

  const handleUpgrade = async (planId: string, planName: string) => {
    setUpgradingId(planId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('users').update({ 
        plan_id: planId,
        plan_assigned_at: new Date().toISOString(),
        plan_source: 'manual_upgrade'
      }).eq('id', user.id)

      if (error) throw error
      
      setUserPlanId(planId)
      toast({ 
        title: language === 'en' ? `Welcome to ${planName}!` : `¡Bienvenido al plan ${planName}!`,
        type: 'success' 
      })
    } catch (e: any) {
      toast({ title: e.message, type: 'error' })
    }
    setUpgradingId(null)
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading plans...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
        >
          <Sparkles className="w-4 h-4" />
          {language === 'en' ? 'Pricing & Plans' : 'Planes y Precios'}
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
          {language === 'en' ? 'Choose Your' : 'Elige tu'} <br/>
          <span className="text-primary italic">Intelligence</span> Level
        </h1>
        <p className="text-white/40 font-medium">
          {language === 'en' ? 'Unlock full potential with our premium tiers. No hidden fees, cancel anytime.' : 'Desbloquea todo el potencial con nuestros niveles premium. Sin cargos ocultos.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => {
          const isCurrent = userPlanId === plan.id
          const isPro = plan.slug === 'professional'
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {isPro && (
                <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-xl shadow-primary/40">
                    Most Popular
                  </span>
                </div>
              )}
              
              <GlassCard className={`p-8 h-full flex flex-col relative transition-all duration-500 hover:translate-y-[-10px] ${isPro ? 'border-primary shadow-[0_30px_100px_rgba(124,58,237,0.2)] bg-primary/5' : 'border-white/5'}`}>
                <div className="mb-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">
                    {language === 'en' ? plan.name_en : plan.name_es}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${plan.price_monthly}</span>
                    <span className="text-white/30 text-sm font-bold uppercase tracking-widest">/ {language === 'en' ? 'mo' : 'mes'}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  {(language === 'en' ? plan.items_en : plan.items_es).map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-white/70 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.id, language === 'en' ? plan.name_en : plan.name_es)}
                  disabled={isCurrent || upgradingId !== null}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                    isCurrent 
                      ? 'bg-white/5 text-white/30 cursor-default border border-white/10' 
                      : (isPro ? 'bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20' : 'bg-white text-black hover:bg-white/90')
                  }`}
                >
                  {upgradingId === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : isCurrent ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  {isCurrent ? (language === 'en' ? 'Current Plan' : 'Plan Actual') : (language === 'en' ? 'Upgrade' : 'Seleccionar Plan')}
                </button>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <footer className="text-center">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          All plans include 256-bit encryption & 99.9% uptime
        </p>
      </footer>
    </div>
  )
}
