'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Heart, Sparkles, 
  Clock, Target, ChevronDown, Activity, 
  Stethoscope, Thermometer, UserCheck, TrendingUp
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function HealthLanding() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ── Navegación ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#020617]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-black text-white shadow-lg shadow-pink-600/20">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-pink-500 italic">Health</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-xl shadow-white/5">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Activity className="w-4 h-4" /> IA para Centros de Salud y Bienestar
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
            >
              Más pacientes. <span className="text-pink-500 italic">Menos burocracia.</span> Control total.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Automatiza la agenda de tu clínica, el seguimiento de pacientes y tu marketing con los agentes de IA especializados de Antigravity.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-pink-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-pink-600/30 hover:scale-105 transition-all">
                Escalar mi Clínica
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#solutions" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Explorar Soluciones
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-pink-600/20 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/health-care.png" 
              alt="Health AI Management Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Puntos de Dolor ── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-pink-400 uppercase tracking-[0.4em]">El Costo de la Ineficiencia</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight uppercase">Los procesos manuales están <span className="italic text-white/30">destruyendo tus márgenes</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Pérdidas por No-Show', desc: 'Los huecos vacíos por falta de confirmación cuestan miles de euros en ingresos perdidos cada mes.' },
              { icon: UserCheck, title: 'Agotamiento del Staff', desc: 'Tus mejores especialistas pierden el 30% de su tiempo en tareas administrativas en lugar de atender pacientes.' },
              { icon: Target, title: 'Fuga de Pacientes', desc: 'La falta de seguimiento personalizado hace que los pacientes elijan a la competencia para su próximo tratamiento.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-pink-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-pink-500/50 mb-6 group-hover:text-pink-500 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Soluciones ── */}
      <section id="solutions" className="py-32 px-6 relative z-10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <GlassCard className="p-8 border-pink-500/10 bg-pink-500/5">
                    <Thermometer className="w-8 h-8 text-pink-500 mb-4" />
                    <p className="font-bold italic text-lg uppercase tracking-tight">Triaje Inteligente</p>
                    <p className="text-[10px] text-pink-400 font-black uppercase mt-2">Pre-Diagnóstico Instantáneo</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-white/5">
                    <Clock className="w-8 h-8 text-white/20 mb-4" />
                    <p className="font-bold italic text-lg uppercase tracking-tight">Agenda Predictiva</p>
                    <p className="text-[10px] text-white/30 font-black uppercase mt-2">Citas sin fricción</p>
                  </GlassCard>
               </div>
               <div className="space-y-4">
                  <GlassCard className="p-8 border-white/5">
                    <Stethoscope className="w-8 h-8 text-white/20 mb-4" />
                    <p className="font-bold italic text-lg uppercase tracking-tight">Bot Post-Consulta</p>
                    <p className="text-[10px] text-white/30 font-black uppercase mt-2">Agente de Soporte 24/7</p>
                  </GlassCard>
                  <GlassCard className="p-8 border-emerald-500/10 bg-emerald-500/5">
                    <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
                    <p className="font-bold italic text-lg uppercase tracking-tight">Motor de Fidelidad</p>
                    <p className="text-[10px] text-emerald-400 font-black uppercase mt-2">Ingresos Recurrentes</p>
                  </GlassCard>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-pink-400 uppercase tracking-[0.4em]">Inteligencia Integrada</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
              El <span className="italic text-white/40">Futuro</span> de la <br />Gestión Sanitaria
            </h3>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Deja de actuar como administrativo y empieza a actuar como CEO. Antigravity Health proporciona la infraestructura para dirigir un centro de bienestar de clase mundial con el mínimo esfuerzo.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Recordatorios de Citas Automáticos',
                'Generador de Planes de Tratamiento',
                'Alertas de Stock e Inventario por IA',
                'Análisis de Historial de Pacientes',
                'Embudos de Marketing para Clínicas',
                'Asistente de Facturación de Seguros'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-pink-500/20 relative overflow-hidden group shadow-2xl shadow-pink-600/5">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-600/20 blur-[80px] rounded-full group-hover:bg-pink-600/40 transition-all duration-700" />
            
            <div className="space-y-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                ¿Listo para <span className="text-pink-500 italic">Elevar</span> <br />la experiencia de tus <span className="text-pink-500 italic">pacientes</span>?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto font-medium">
                Únete a más de 200 clínicas que han hecho la transición a Antigravity y han visto un aumento del 40% en reservas recurrentes.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                Iniciar Prueba Gratuita
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Hablar con Ventas
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
              <span className="text-white font-black uppercase tracking-widest text-lg">Antigravity <span className="text-pink-500 italic">Health</span></span>
           </div>
           <nav className="flex flex-wrap justify-center gap-10 text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">
              <Link href="#" className="hover:text-pink-500 transition-colors">Plataforma</Link>
              <Link href="#" className="hover:text-pink-500 transition-colors">Precios</Link>
              <Link href="#" className="hover:text-pink-500 transition-colors">Casos de Éxito</Link>
              <Link href="#" className="hover:text-pink-500 transition-colors">Privacidad</Link>
           </nav>
           <p className="text-white/10 font-medium text-xs">© 2026 Antigravity Systems Inc. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
