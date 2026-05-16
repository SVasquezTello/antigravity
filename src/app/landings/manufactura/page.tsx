'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Factory, Users, 
  Settings, BarChart3, Clock, Sparkles, Zap, 
  ChevronDown, Cpu, ShieldCheck, Target
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function ManufacturingLanding() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-emerald-500/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-emerald-500 italic">Manufacturing</span></span>
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Cpu className="w-4 h-4" /> Inteligencia Operativa para la Industria 4.0
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Optimiza tu producción y reduce <span className="text-emerald-500 italic">tiempos</span> de inactividad
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Control total de inventarios, mantenimiento predictivo y monitoreo de planta con Inteligencia Artificial.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-600/30 hover:scale-105 transition-all">
                Quiero optimizar mi planta
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
              src="/images/landings/manufacturing.png" 
              alt="Manufacturing AI Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── El Problema (Dolor) ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em]">¿Tu planta tiene fugas de eficiencia?</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">El costo de la <span className="italic text-white/30">incertidumbre operativa</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Tiempos de inactividad', desc: 'Las paradas no planificadas cuestan miles de dólares por hora. Si no lo previenes, lo pagas.' },
              { icon: Settings, title: 'Errores de suministro', desc: 'Faltantes de stock o exceso de inventario muerto que estrangulan el flujo de caja de la fábrica.' },
              { icon: BarChart3, title: 'Falta de visibilidad', desc: 'Tomar decisiones con datos de ayer es el camino más rápido para perder competitividad hoy.' }
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

      {/* ── La Solución ── */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <div className="h-48 bg-emerald-600/10 rounded-3xl border border-emerald-600/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Mantenimiento</p>
                     <p className="text-[10px] text-emerald-400 font-black uppercase">Predictivo y proactivo</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Stock Inteligente</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Optimización JIT con IA</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Planta Digital</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Monitoreo en tiempo real</p>
                  </div>
                  <div className="h-48 bg-blue-600/20 rounded-3xl border border-blue-600/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Calidad</p>
                     <p className="text-[10px] text-blue-400 font-black uppercase">Reducción de mermas</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em]">Solución Directa</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Control absoluto, <span className="italic text-white/40">rendimiento máximo</span>
            </h3>
            <p className="text-white/40 text-lg">
              Ecosistema de monitoreo inteligente y gestión de recursos optimizada para la industria moderna. Datos que se convierten en rentabilidad.
            </p>
            <ul className="space-y-4">
              {[
                'Detección temprana de fallos en maquinaria',
                'Optimización de rutas y tiempos de entrega',
                'Gestión automatizada de órdenes de compra',
                'Dashboard centralizado de KPIs de producción'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Micro-Apps Section ── */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em]">Ecosistema Especializado</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Micro-Apps <span className="text-emerald-500 italic">Premium</span>
              </h3>
              <p className="text-white/40 text-lg">
                Herramientas quirúrgicas diseñadas para resolver puntos críticos en la cadena de producción.
              </p>
            </div>
            <Link href="/join" className="text-[10px] font-black uppercase tracking-widest px-8 py-4 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all">
              Ver Catálogo Completo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Industrial Quality Auditor',
                desc: 'Analiza métricas de producción y detecta desviaciones críticas en tiempo real.',
                icon: ShieldCheck,
                color: 'bg-emerald-500/20'
              },
              {
                name: 'Predictive Maint Planner',
                desc: 'Predicción inteligente de fallos mecánicos basada en telemetría de sensores.',
                icon: Settings,
                color: 'bg-blue-500/20'
              },
              {
                name: 'Lean Six Sigma Coach',
                desc: 'Optimización de procesos DMAIC para reducir el desperdicio en toda la planta.',
                icon: Target,
                color: 'bg-purple-500/20'
              },
              {
                name: 'Factory ROI Analyzer',
                desc: 'Cálculo instantáneo del retorno de inversión en mejoras de maquinaria.',
                icon: BarChart3,
                color: 'bg-amber-500/20'
              },
              {
                name: 'Supply Chain Optimizer',
                desc: 'Gestión inteligente de inventarios Just-In-Time para evitar cuellos de botella.',
                icon: Zap,
                color: 'bg-red-500/20'
              }
            ].map((app, i) => (
              <GlassCard key={i} className="p-8 group hover:border-emerald-500/50 transition-all">
                <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-black mb-2">{app.name}</h4>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{app.desc}</p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Professional Suite</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-24 px-6 bg-emerald-900/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Impacto en <span className="text-emerald-500 italic">tu Operación</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '-40%', label: 'Tiempo de inactividad' },
              { val: '+20%', label: 'Productividad neta' },
              { val: '15%', label: 'Ahorro en energía' },
              { val: '99%', label: 'Precisión de Stock' }
            ].map((b, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-emerald-500">{b.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{b.label}</p>
              </div>
            ))}
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
                ¿Listo para la <span className="text-emerald-500 italic">Transformación</span> <br />Industrial?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                No dejes que tu competencia te gane por tecnología. Digitaliza tu planta hoy mismo.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:invert transition-all">
                Empezar Ahora
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Ver Ficha Técnica
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
              { q: '¿Se integra con mi ERP?', a: 'Sí. Nos integramos con SAP, Oracle y sistemas locales para que la información fluya sin fricciones.' },
              { q: '¿Qué hardware necesito?', a: 'Antigravity es puramente software, pero podemos conectarnos a tus PLCs y sensores existentes mediante protocolos industriales estándar.' },
              { q: '¿Cuánto tiempo tarda en verse el ROI?', a: 'La mayoría de las plantas ven una reducción significativa en desperdicios y tiempos muertos en los primeros 3 a 6 meses.' }
            ].map((f, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-sm uppercase tracking-wider list-none">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-emerald-500 group-open:rotate-180 transition-transform" />
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
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity Manufacturing © 2026</span>
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
