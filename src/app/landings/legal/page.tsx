'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Shield, Scale, 
  Clock, Target, ChevronDown, FileText, 
  Gavel, Briefcase, Lock
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function LegalLanding() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Corporativo ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Navegación ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#02040a]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-black text-black shadow-lg">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-slate-400 italic">Legal</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl">Iniciar Prueba</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Scale className="w-4 h-4" /> Infraestructura de IA para Despachos Jurídicos
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-slate-100"
            >
              Precisión Legal. <span className="text-slate-500 italic">Velocidad de IA.</span> Ventaja Competitiva.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Transforma tu firma con análisis automatizado de contratos, redacción de litigios y auditorías de cumplimiento impulsadas por IA.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-slate-200 transition-all">
                Modernizar mi Firma
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Ver Soluciones
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/legal-pro.png" 
              alt="Legal AI Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Puntos de Dolor ── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">La Carga de la Abogacía Tradicional</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight uppercase">No dejes que las <span className="italic text-white/20">horas facturables</span> limiten tu crecimiento</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Fatiga Documental', desc: 'Revisar cientos de páginas buscando una sola cláusula es un desperdicio de talento senior.' },
              { icon: Gavel, title: 'Riesgo de Litigio', desc: 'Una redacción inconsistente genera vacíos legales evitables y responsabilidad ante el cliente.' },
              { icon: Briefcase, title: 'Estancamiento Operativo', desc: 'La investigación manual impide que tu firma asuma casos más complejos y de alto valor.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-slate-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-slate-700 mb-6 group-hover:text-slate-400 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Soluciones ── */}
      <section id="features" className="py-32 px-6 relative z-10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <GlassCard className="p-8 border-slate-700/30 bg-slate-800/10">
                     <Lock className="w-8 h-8 text-slate-400 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Auditoría de Contratos</p>
                     <p className="text-[10px] text-slate-500 font-black uppercase mt-2">Identifica vacíos legales en segundos</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-white/5">
                     <FileText className="w-8 h-8 text-white/20 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">IA de Redacción</p>
                     <p className="text-[10px] text-white/30 font-black uppercase mt-2">Preparación profesional de litigios</p>
                  </GlassCard>
               </div>
               <div className="space-y-4">
                  <GlassCard className="p-8 border-white/5">
                     <Target className="w-8 h-8 text-white/20 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Bot de Estrategia</p>
                     <p className="text-[10px] text-white/30 font-black uppercase mt-2">Predicción de resultados basada en datos</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-blue-900/20 bg-blue-900/5">
                     <Shield className="w-8 h-8 text-blue-500 mb-4" />
                     <p className="font-bold italic text-lg uppercase tracking-tight">Compliance 24/7</p>
                     <p className="text-[10px] text-blue-400 font-black uppercase mt-2">Controles regulatorios automatizados</p>
                  </GlassCard>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Jurisprudencia Algorítmica</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
              El Asistente <span className="italic text-white/40">Soberano</span> <br />para el Abogado Moderno
            </h3>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Aprovecha modelos legales entrenados a medida para aumentar la inteligencia de tu firma. Antigravity Legal se encarga del trabajo pesado para que tú te centres en ganar.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Revisión Automatizada de Contratos',
                'Análisis de Evidencia Pre-juicio',
                'Monitoreo de RGPD y Cumplimiento',
                'Optimización de Estructuras Societarias',
                'Gestión de Portafolios de Propiedad Intelectual',
                'Redacción Legal Bilingüe'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-slate-700/20 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-slate-600/10 blur-[80px] rounded-full group-hover:bg-slate-600/20 transition-all duration-700" />
            
            <div className="space-y-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                Potencia tu <span className="text-slate-500 italic">Asesoría</span> <br />con <span className="text-slate-500 italic">Hyper-Velocidad</span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto font-medium">
                El sistema operativo de IA más avanzado para despachos de abogados modernos. Reserva tu despliegue hoy.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-lg bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-200 transition-all">
                Lanzar mi Firma
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Solicitar Demo
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center bg-[#02040a]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-black font-black shadow-lg">A</div>
              <span className="text-white font-black uppercase tracking-widest text-lg">Antigravity <span className="text-slate-500 italic">Legal</span></span>
           </div>
           <nav className="flex flex-wrap justify-center gap-10 text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Avisos Legales</Link>
              <Link href="#" className="hover:text-white transition-colors">Seguridad</Link>
           </nav>
           <p className="text-white/10 font-medium text-xs">© 2026 Antigravity Systems Inc. Edición Legal.</p>
        </div>
      </footer>
    </div>
  )
}
