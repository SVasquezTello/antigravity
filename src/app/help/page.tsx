'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Globe 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PublicHelpCenter() {
  const { language } = useTranslation()
  const [search, setSearch] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: language === 'en' ? 'What is Antigravity?' : '¿Qué es Antigravity?',
      a: language === 'en' 
        ? 'Antigravity is an enterprise-grade AI infrastructure that allows you to deploy and monetize micro-apps at scale.' 
        : 'Antigravity es una infraestructura de IA de grado empresarial que te permite desplegar y monetizar micro-apps a escala.',
      cat: 'General'
    },
    {
      q: language === 'en' ? 'How do credits work?' : '¿Cómo funcionan los créditos?',
      a: language === 'en'
        ? 'Credits are the currency of the platform. Each AI execution has a fixed cost. We use a FEFO (First-Expire-First-Out) system.'
        : 'Los créditos son la moneda de la plataforma. Cada ejecución de IA tiene un coste fijo. Usamos un sistema FEFO para gestionar su caducidad.',
      cat: 'Billing'
    },
    {
      q: language === 'en' ? 'Can I use my own white label?' : '¿Puedo usar mi propia marca blanca?',
      a: language === 'en'
        ? 'Yes! Our Partner Pro suite allows you to use your own logos, colors, and SMTP for all client communications.'
        : '¡Sí! Nuestra Pro Suite para Partners te permite usar tus logos, colores y SMTP propio para todas las comunicaciones.',
      cat: 'Partner'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050014] text-white">
      <div className="mesh-gradient opacity-20" />
      
      {/* --- Public Header --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050014]/50 backdrop-blur-xl px-6 py-4">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase">Anti<span className="text-primary">gravity</span></Link>
            <div className="flex gap-8 items-center">
               <Link href="/plans" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Pricing</Link>
               <Link href="/login" className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all hover:text-white shadow-lg shadow-primary/10">Member Login</Link>
            </div>
         </div>
      </nav>

      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
           <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              How can we <br/><span className="text-primary italic">Support you?</span>
           </h1>
           <div className="relative max-w-2xl mx-auto pt-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-2xl"
              />
           </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Getting Started', icon: BookOpen, color: 'text-blue-500' },
             { title: 'Billing & Plans', icon: Zap, color: 'text-amber-500' },
             { title: 'Legal & Privacy', icon: ShieldCheck, color: 'text-green-500' }
           ].map((card, i) => (
             <GlassCard key={i} className="p-8 text-center space-y-4 hover:border-primary/40 transition-all cursor-pointer group">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto ${card.color} group-hover:scale-110 transition-transform`}>
                   <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">{card.title}</h3>
             </GlassCard>
           ))}
        </section>

        <section className="space-y-4">
           <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/20 text-center mb-10">Popular Questions</h2>
           <div className="space-y-4">
              {faqs.map((faq, i) => (
                <GlassCard key={i} className="p-0 border-white/5 overflow-hidden">
                   <button 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className="w-full p-6 flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                   >
                      <div className="flex gap-4 items-center">
                         <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded">{faq.cat}</span>
                         <span className="text-white font-bold text-left">{faq.q}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${activeFaq === i ? 'rotate-180 text-primary' : ''}`} />
                   </button>
                   <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                           <div className="p-6 pt-0 text-white/60 text-sm leading-relaxed border-t border-white/5">
                              {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </GlassCard>
              ))}
           </div>
        </section>

        <footer className="text-center pt-20">
           <GlassCard className="p-10 bg-primary/5 border-primary/20 max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
                 <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Still have questions?</h3>
              <p className="text-white/40 text-sm">Our expert team is ready to help you scale your AI business.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                 Contact Sales Support
              </Link>
           </GlassCard>
        </footer>
      </main>
    </div>
  )
}
