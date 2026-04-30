'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Zap, Users, 
  MessageSquare, BarChart3, Clock, ShieldCheck,
  ChevronDown, Building2, Sparkles, Target
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function RealEstateLanding() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-pink/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-primary italic">PropTech</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Target className="w-4 h-4" /> Solución Exclusiva para Inmobiliarias
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Recupera clientes fríos y <span className="text-primary italic">cierra más ventas</span> sin perseguir leads
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Automatiza seguimiento, propuestas y captación comercial para inmobiliarias con Inteligencia Artificial.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                Quiero más cierres
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/real-estate.png" 
              alt="Real Estate AI Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Problema (Dolor) ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">¿Te suena familiar?</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">El costo de <span className="italic text-white/30">no automatizar</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Leads que no responden', desc: 'Inviertes en marketing y portales, pero el 80% de los contactos se enfrían por falta de respuesta inmediata.' },
              { icon: Clock, title: 'Seguimiento manual agotador', desc: 'Tu equipo pierde horas escribiendo correos y mensajes que podrían ser automáticos y personalizados.' },
              { icon: BarChart3, title: 'Pérdida de oportunidades', desc: 'Sin un sistema que detecte el interés real, las mejores ventas se pierden entre carpetas de Excel.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-red-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-red-500/50 mb-6 group-hover:text-red-500 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solución ── */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <div className="h-48 bg-primary/10 rounded-3xl border border-primary/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">IA Predictiva</p>
                     <p className="text-[10px] text-primary font-black uppercase">Filtra compradores reales</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Seguimiento 24/7</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Nunca dejes de responder</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Propuestas Pro</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Generadas en segundos</p>
                  </div>
                  <div className="h-48 bg-primary/20 rounded-3xl border border-primary/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Captación</p>
                     <p className="text-[10px] text-primary font-black uppercase">Encuentra más dueños</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">La Solución Directa</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Transformamos tu agencia en una <span className="italic text-white/40">máquina de ventas</span>
            </h3>
            <p className="text-white/40 text-lg">
              No es solo un CRM. Es un ecosistema de micro-apps inteligentes que trabajan mientras duermes, clasificando leads y agendando visitas.
            </p>
            <ul className="space-y-4">
              {[
                'Respuestas automáticas por WhatsApp y Email',
                'Calificación automática de presupuestos y zonas',
                'Reportes de rendimiento en tiempo real',
                'Marca blanca para tu agencia inmobiliaria'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Resultados que <span className="text-primary italic">puedes medir</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '+45%', label: 'Conversión de leads' },
              { val: '-60%', label: 'Tiempo de gestión' },
              { val: '24/7', label: 'Disponibilidad' },
              { val: '+30%', label: 'Captaciones nuevas' }
            ].map((b, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-primary">{b.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/40 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                ¿Listo para dejar de <span className="text-primary italic">perseguir</span> <br />y empezar a <span className="text-primary italic">cerrar</span>?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Únete a las agencias que ya están dominando su mercado local con Antigravity.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:invert transition-all">
                Empezar Ahora
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Hablar con un experto
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Necesito conocimientos técnicos?', a: 'Para nada. Antigravity está diseñado para que cualquier agente pueda usarlo desde el primer minuto.' },
              { q: '¿Se integra con mi CRM actual?', a: 'Sí, nos integramos con los principales CRMs del mercado para que no pierdas tus datos.' },
              { q: '¿Es solo para agencias grandes?', a: 'No. Tenemos planes que se adaptan desde agentes independientes hasta grandes franquicias.' }
            ].map((f, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-sm uppercase tracking-wider list-none">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <p className="pt-4 text-white/40 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity Real Estate © 2026</span>
           </div>
           <nav className="flex gap-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
              <Link href="/terms" className="hover:text-primary transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
              <Link href="/legal" className="hover:text-primary transition-colors">Legal</Link>
           </nav>
        </div>
      </footer>
    </div>
  )
}
