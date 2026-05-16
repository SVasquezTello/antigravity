'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Leaf, Calendar, 
  Camera, BarChart3, Clock, Sparkles, Droplets, 
  ChevronDown, ShieldCheck, Wallet
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function GreenHomeLanding() {
  return (
    <div className="min-h-screen bg-[#020503] text-white selection:bg-emerald-500/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#020503]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-emerald-500 italic">Home & Garden</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Leaf className="w-4 h-4" /> Inteligencia Artificial para el Cuidado del Hogar
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Digitaliza tu pasión por los <span className="text-emerald-500 italic">Jardines</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              La plataforma definitiva para profesionales del paisaje y entusiastas del hogar inteligente.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-600/30 hover:scale-105 transition-all">
                Ver Planes de Lanzamiento
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-emerald-600/20 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/greenhome-pro.png" 
              alt="GreenHome Pro Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Problemas del Sector ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em]">¿Por qué necesitas GreenHome Pro?</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">De la agenda de papel a la <span className="italic text-white/30">eficiencia total</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: 'Agenda Desordenada', desc: 'Olvida las citas perdidas. Sincroniza mantenimientos y riegos automáticamente.' },
              { icon: Camera, title: 'Falta de Evidencia', desc: 'Muestra el progreso real con nuestra galería de Antes y Después compartible con clientes.' },
              { icon: Wallet, title: 'Cobros Manuales', desc: 'Automatiza tus facturas y recibe pagos online sin perseguir a nadie.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-emerald-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-emerald-500/50 mb-6 group-hover:text-emerald-500 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funciones IA ── */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <div className="h-48 bg-emerald-600/10 rounded-3xl border border-emerald-600/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Diagnóstico IA</p>
                     <p className="text-[10px] text-emerald-500 font-black uppercase">Identifica plagas con una foto</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Riego Smart</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Alertas según el clima real</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Cotizador</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Presupuestos en segundos</p>
                  </div>
                  <div className="h-48 bg-primary/20 rounded-3xl border border-primary/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">CRM Hogar</p>
                     <p className="text-[10px] text-primary font-black uppercase">Historial por cada vivienda</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em]">Tecnología de Vanguardia</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Tus plantas hablan, <span className="italic text-white/40">nosotros las traducimos</span>
            </h3>
            <p className="text-white/40 text-lg">
              Integramos modelos de visión por computadora para que puedas ofrecer un servicio de mantenimiento preventivo único en el mercado.
            </p>
            <ul className="space-y-4">
              {[
                'Escaneo de hojas mediante IA para detección de enfermedades',
                'Agenda inteligente sincronizada con Google Calendar',
                'Galería de proyectos compartible con un clic',
                'Módulo de pagos integrado con Stripe y pasarelas locales'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Planes de Precios ── */}
      <section className="py-24 px-6 bg-emerald-900/5">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Planes que <span className="text-emerald-500 italic">hacen crecer</span> tu negocio</h2>
            <p className="text-white/40 max-w-2xl mx-auto">Selecciona la potencia que necesitas para escalar hoy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Básico */}
            <GlassCard className="p-12 border-white/10 relative overflow-hidden flex flex-col">
              <div className="mb-8">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4">Plan Básico</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">S/39</span>
                  <span className="text-white/20 font-bold uppercase text-[10px]">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {['1 Usuario', 'Agenda Simple', 'Hasta 30 Clientes', 'Branding Básico', 'Soporte vía Email'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Empezar Básico
              </Link>
            </GlassCard>

            {/* Premium */}
            <GlassCard className="p-12 border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Recomendado</div>
              <div className="mb-8">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Plan Premium</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">S/129</span>
                  <span className="text-white/20 font-bold uppercase text-[10px]">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {[
                  'Usuarios Ilimitados', 
                  'IA de Diagnóstico Premium', 
                  'WhatsApp Integrado', 
                  'Reportes Automáticos', 
                  'Dominio Personalizado',
                  'Automatización de Pagos'
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full py-4 rounded-xl bg-emerald-600 text-white text-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-all">
                Adquirir Premium
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-600/20 blur-[80px] rounded-full group-hover:bg-emerald-600/40 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                ¿Listo para <span className="text-emerald-500 italic">transformar</span> <br />tu servicio?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Únete a la nueva era del mantenimiento inteligente del hogar.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:invert transition-all">
                Empezar Ahora
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Agendar Demo
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity Home & Garden © 2026</span>
           </div>
           <nav className="flex gap-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
              <Link href="/terms" className="hover:text-emerald-500 transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacidad</Link>
              <Link href="/legal" className="hover:text-emerald-500 transition-colors">Legal</Link>
           </nav>
        </div>
      </footer>
    </div>
  )
}
