'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from './GlassCard'
import { 
  Zap, 
  Target, 
  Sparkles, 
  Rocket, 
  ChevronRight, 
  CheckCircle2,
  ShieldCheck,
  Cpu
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const { language, t } = useTranslation()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('antigravity_onboarding_complete')
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 1500)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('antigravity_onboarding_complete', 'true')
    setIsOpen(false)
  }

  const steps = [
    {
      title: language === 'es' ? 'Bienvenido a la Élite' : 'Welcome to the Elite',
      desc: language === 'es' ? 'Has desbloqueado el motor de automatización más potente del mercado.' : 'You have unlocked the most powerful automation engine on the market.',
      icon: ShieldCheck,
      color: 'text-primary'
    },
    {
      title: language === 'es' ? 'Poder de Micro-Apps' : 'Micro-Apps Power',
      desc: language === 'es' ? 'Cada herramienta está diseñada para resolver un problema crítico de tu industria en segundos.' : 'Each tool is designed to solve a critical industry problem in seconds.',
      icon: Cpu,
      color: 'text-blue-500'
    },
    {
      title: language === 'es' ? 'IA de Grado Militar' : 'Military Grade AI',
      desc: language === 'es' ? 'Tus datos son procesados con la mayor seguridad y precisión algorítmica disponible.' : 'Your data is processed with the highest security and algorithmic precision available.',
      icon: Sparkles,
      color: 'text-amber-500'
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-xl w-full"
        >
          <GlassCard className="p-10 border-glow bg-linear-to-br from-white/[0.05] to-transparent relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/20">
                       <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Protocolo de Activación</span>
                 </div>
                 <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-primary' : 'w-2 bg-white/10'}`} />
                    ))}
                 </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="space-y-4">
                      <div className={`w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center ${steps[step-1].color}`}>
                        {React.createElement(steps[step-1].icon, { className: 'w-8 h-8' })}
                      </div>
                      <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{steps[step-1].title}</h2>
                      <p className="text-white/40 text-sm font-medium leading-relaxed">{steps[step-1].desc}</p>
                   </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-6">
                 {step < 3 ? (
                   <button 
                     onClick={() => setStep(step + 1)}
                     className="w-full py-5 bg-white text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl"
                   >
                      Siguiente Nivel
                      <ChevronRight className="w-5 h-5" />
                   </button>
                 ) : (
                   <button 
                     onClick={handleComplete}
                     className="w-full py-5 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-primary/40 shimmer-btn"
                   >
                      Activar Consola
                      <Rocket className="w-5 h-5" />
                   </button>
                 )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
