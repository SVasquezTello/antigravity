'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { Input } from '@/components/ui/Input'
import { Shield, Sparkles, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'

interface PlansClientProps {
  plans: any[]
  currentPlanSlug: string | null
}

const FIRST_NAMES = ['Carlos', 'Ana', 'Luis', 'María', 'Pedro', 'Sofía', 'Jorge', 'Laura', 'Andrés', 'Valentina']
const LAST_NAMES = ['García', 'López', 'Martínez', 'Rodríguez', 'Hernández', 'Pérez', 'González', 'Sánchez', 'Torres', 'Ramírez']

export function PlansClient({ plans, currentPlanSlug }: PlansClientProps) {
  const { language } = useTranslation()
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Demo buyer data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  const openModal = (plan: any) => {
    if (currentPlanSlug === plan.slug) {
      toast({ 
        title: language === 'en' ? 'You already have this plan active' : 'Ya tienes este plan activo', 
        type: 'success' 
      })
      return
    }

    const rFName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const rLName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const rEmail = `demo_${Math.random().toString(36).substring(2,7)}@gmail.com`

    setFormData({
      first_name: rFName,
      last_name: rLName,
      email: rEmail
    })

    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPlan(null)
  }

  const handleConfirm = async () => {
    if (!selectedPlan) return
    setLoading(true)

    const payload = {
      event: 'payment.completed',
      customer: {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      },
      plan: selectedPlan.slug,
      source: 'self-service',
      transaction_id: `self_${Math.random().toString(36).substring(2,10)}`,
      amount: selectedPlan.price_monthly,
      currency: 'USD'
    }

    try {
      const res = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (res.ok) {
        toast({ 
          title: language === 'en' ? `Plan activated! Welcome to the ${selectedPlan.name_en} plan` : `¡Plan activado! Bienvenido al plan ${selectedPlan.name_es}`, 
          type: 'success' 
        })
        if (data.is_new_user && data.generated_password) {
          toast({
            title: language === 'en' ? `Password: ${data.generated_password}` : `Contraseña: ${data.generated_password}`,
            type: 'success'
          })
        }
        closeModal()
        // Reload page to reflect new plan
        window.location.reload()
      } else {
        toast({ title: data.error || 'Payment simulation failed', type: 'error' })
      }
    } catch (err) {
      toast({ title: 'Error confirming payment', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-12 animate-entrance px-6">
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-10">
        <h1 className="text-4xl md:text-5xl font-black text-white px-2">
          {language === 'en' ? 'Level up in' : 'Subir de nivel en'} <span className="gradient-text">Antigravity</span>
        </h1>
        <p className="text-white/50 text-lg">
          {language === 'en' 
            ? 'Unlock the absolute power of Gemini AI and all professional applications.' 
            : 'Desbloquea el poder absoluto de Gemini AI y todas las aplicaciones profesionales.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {plans?.map((plan) => (
          <GlassCard key={plan.id} className="p-8 flex flex-col relative overflow-hidden group">
            {currentPlanSlug === plan.slug && (
              <div className="absolute top-0 right-0 p-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg z-20">
                {language === 'en' ? 'Current Plan' : 'Plan Actual'}
              </div>
            )}
            {plan.slug === 'professional' && currentPlanSlug !== 'professional' && (
              <div className="absolute top-0 right-0 p-2 bg-gradient-to-r from-primary to-accent-pink text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg z-20">
                {language === 'en' ? 'Most Popular' : 'Más popular'}
              </div>
            )}
            <div className="relative z-10 flex flex-col h-full space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white">{language === 'en' ? plan.name_en : plan.name_es}</h3>
                <p className="text-sm text-white/50 mt-2 min-h-[40px]">{language === 'en' ? plan.description_en : plan.description_es}</p>
              </div>

              <div className="py-4 border-y border-white/5">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">${plan.price_monthly}</span>
                  <span className="text-white/30 text-sm mb-2">{language === 'en' ? '/mo' : '/mes'}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {(language === 'en' ? plan.items_en : plan.items_es)?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => openModal(plan)}
                className="w-full py-4 mt-6 rounded-xl font-bold transition-all text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20"
              >
                {language === 'en' ? 'Instant Access' : 'Acceso Instantáneo'}
              </button>
            </div>
            
            {plan.slug === 'professional' && (
               <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:animate-shine z-0" />
            )}
          </GlassCard>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors">
          {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
        </Link>
      </div>

      {/* Checkout Modal */}
      {isModalOpen && selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full max-w-md bg-[#050014] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-amber-500/20 w-full text-center py-2 text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
               🧪 {language === 'en' ? 'DEMO MODE — Payment Simulation' : 'MODO DEMO — Simulación de pago'}
            </div>
            
            <button 
              onClick={closeModal}
              className="absolute top-12 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full z-10"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-white/50">{language === 'en' ? 'Plan' : 'Plan'}</p>
                <h3 className="text-2xl font-black text-white">
                  {language === 'en' ? selectedPlan.name_en : selectedPlan.name_es} — ${selectedPlan.price_monthly}.00{language === 'en' ? '/mo' : '/mes'}
                </h3>
              </div>

              {/* Fake Credit Card */}
              <div className="relative w-full h-40 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/10 p-5 shadow-inner overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-white/10 rounded-md" />
                  <span className="text-white/20 font-bold italic">VISA</span>
                </div>
                <div>
                  <div className="text-white text-lg font-mono tracking-widest mb-2">
                    4242 4242 4242 4242
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                    <span>{formData.first_name} {formData.last_name || 'Card Holder'}</span>
                    <span>{String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/{String(new Date().getFullYear() + 2).slice(2)} • {Math.floor(Math.random() * 900) + 100}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/50 uppercase">{language === 'en' ? 'First Name' : 'Nombre'}</label>
                    <Input 
                      placeholder={language === 'en' ? 'First Name' : 'Nombre'}
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/50 uppercase">{language === 'en' ? 'Last Name' : 'Apellido'}</label>
                    <Input 
                      placeholder={language === 'en' ? 'Last Name' : 'Apellido'}
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/50 uppercase">{language === 'en' ? 'Email' : 'Correo electrónico'}</label>
                  <Input 
                    placeholder={language === 'en' ? 'Email' : 'Correo electrónico'}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <GlowButton 
                variant="primary" 
                className="w-full"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    {language === 'en' ? 'Processing...' : 'Procesando...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🔒 {language === 'en' ? 'Confirm Payment' : 'Confirmar Pago'}
                  </span>
                )}
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
