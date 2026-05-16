'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { Check, Zap, Sparkles, ShieldCheck, Loader2, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { BankTransferModal } from '@/components/billing/BankTransferModal'

export default function PlansPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = React.useMemo(() => createClient(), [])
  
  const [plans, setPlans] = useState<any[]>([])
  const [userPlanId, setUserPlanId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradingId, setUpgradingId] = useState<string | null>(null)
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      const { data: offersData } = await supabase.from('offers').select('*').order('created_at', { ascending: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase.from('user_status').select('current_plan_id').eq('user_id', user.id).single()
        setUserPlanId(userData?.current_plan_id)
      }
      if (offersData) setPlans(offersData)
      setLoading(false)
    }
    fetchPlans()
  }, [supabase])

  const handleUpgrade = async (plan: any) => {
    if (typeof (window as any).Culqi === 'undefined') {
      toast({ title: 'Error cargando pasarela de pago', type: 'error' })
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUpgradingId(plan.id)

    const Culqi = (window as any).Culqi
    Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_PLACEHOLDER'
    
    Culqi.settings({
      title: 'Antigravity Premium',
      currency: 'PEN',
      description: `Plan ${plan.name}`,
      amount: Math.round(plan.prices[0]?.amount * 100)
    })

    Culqi.options({
      lang: 'auto',
      installments: true,
      paymentMethods: {
        tarjeta: true,
        yape: true,
        billetera: true,
        bancaMobile: true,
        agente: true,
        cuotealo: false
      }
    })

    Culqi.open()

    // Escuchar el evento de token generado por Culqi
    window.addEventListener('message', async (event) => {
      if (event.data === 'checkout_closed') {
        setUpgradingId(null)
      }
    })

    // Definir la función global que Culqi llamará al terminar el pago
    ;(window as any).culqi = async () => {
      if (Culqi.token) {
        const token = Culqi.token.id
        try {
          const response = await fetch('/api/billing/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              planId: plan.id,
              amount: plan.prices[0]?.amount,
              email: user.email
            })
          })

          const result = await response.json()

          if (result.success) {
            setUserPlanId(plan.id)
            toast({ 
              title: language === 'en' ? `Welcome to ${plan.name}!` : `¡Bienvenido al plan ${plan.name}!`,
              type: 'success' 
            })
          } else {
            throw new Error(result.error)
          }
        } catch (e: any) {
          toast({ title: e.message, type: 'error' })
        } finally {
          setUpgradingId(null)
          Culqi.close()
        }
      } else {
        console.error(Culqi.error)
        toast({ title: Culqi.error.user_message, type: 'error' })
        setUpgradingId(null)
      }
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading plans...</div>

  return (
    <>
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
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">${plan.prices[0]?.amount || 0}</span>
                      <span className="text-white/30 text-sm font-bold uppercase tracking-widest">/ {language === 'en' ? 'mo' : 'mes'}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-10">
                    {plan.features.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-white/70 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan)}
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

                  {!isCurrent && (
                    <button 
                      onClick={() => { setSelectedPlan(plan); setShowBankModal(true); }}
                      className="mt-4 w-full py-3 border border-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white/30 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-3 h-3" /> Pagar por Transferencia o Yape
                    </button>
                  )}
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

      <BankTransferModal 
        isOpen={showBankModal} 
        onClose={() => setShowBankModal(false)} 
        plan={selectedPlan} 
      />
    </>
  )
}

