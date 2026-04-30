'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Bed, Users, 
  Palmtree, BarChart3, Clock, Sparkles, MapPin, 
  ChevronDown, ConciergeBell
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function HotelLanding() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-amber-500/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-black text-white">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-amber-500 italic">Hospitality</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <ConciergeBell className="w-4 h-4" /> Inteligencia Artificial para el Sector Hotelero
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Aumenta tus reservas directas sin depender de las <span className="text-amber-500 italic">OTAs</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Automatiza la atención al huésped, gestión de reservas y fidelización con IA de clase mundial.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-amber-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-amber-600/30 hover:scale-105 transition-all">
                Quiero más reservas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-amber-600/20 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/hotel.png" 
              alt="Hotel AI Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── El Problema (Dolor) ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">¿Tu margen se escapa en comisiones?</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">El costo invisible de <span className="italic text-white/30">perder el contacto</span> directo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Comisiones altas de OTAs', desc: 'Regalar hasta el 20% de cada reserva a plataformas externas porque no captas al cliente en tu web.' },
              { icon: Clock, title: 'Recepción saturada', desc: 'Tu equipo pierde horas respondiendo las mismas 10 preguntas sobre horarios, wifi y servicios.' },
              { icon: Users, title: 'Falta de fidelización', desc: 'Si no tienes el dato directo del huésped, es imposible que vuelva sin pasar otra vez por Booking.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-amber-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-amber-500/50 mb-6 group-hover:text-amber-500 transition-colors" />
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
                  <div className="h-48 bg-amber-600/10 rounded-3xl border border-amber-600/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Reserva Directa</p>
                     <p className="text-[10px] text-amber-500 font-black uppercase">Cierra ventas sin comisiones</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Conserje IA</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Atención 24/7 en cualquier idioma</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Upselling</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Vende extras automáticamente</p>
                  </div>
                  <div className="h-48 bg-primary/20 rounded-3xl border border-primary/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Fidelización</p>
                     <p className="text-[10px] text-primary font-black uppercase">Haz que vuelvan a tu hotel</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">Solución Directa</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Atención 5 estrellas, <span className="italic text-white/40">gestión 100% digital</span>
            </h3>
            <p className="text-white/40 text-lg">
              Asistente inteligente de reservas y conserjería virtual que libera a tu personal y maximiza tus ingresos directos.
            </p>
            <ul className="space-y-4">
              {[
                'Gestión de reservas directas por WhatsApp y Web',
                'Resolución instantánea de dudas frecuentes',
                'Venta sugerida de servicios (Spa, Restaurante, Tours)',
                'Check-in automático y encuestas de satisfacción'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-24 px-6 bg-amber-900/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Impacto en <span className="text-amber-500 italic">tu Rentabilidad</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '+25%', label: 'Reservas Directas' },
              { val: '-50%', label: 'Carga en Recepción' },
              { val: '15%', label: 'Más en Upselling' },
              { val: '4.9', label: 'Satisfacción Promedio' }
            ].map((b, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-amber-500">{b.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-amber-500/20 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-600/20 blur-[80px] rounded-full group-hover:bg-amber-600/40 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                ¿Listo para <span className="text-amber-500 italic">liberarte</span> <br />de las comisiones?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Recupera el control de tus huéspedes y aumenta tu margen de beneficio hoy mismo.
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

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Habla varios idiomas?', a: 'Sí. Nuestra IA atiende en más de 50 idiomas con fluidez natural, perfecto para hoteles con público internacional.' },
              { q: '¿Se conecta con mi PMS?', a: 'Sí, nos integramos con los principales PMS para sincronizar disponibilidad y reservas en tiempo real.' },
              { q: '¿Puede gestionar pedidos al cuarto?', a: 'Por supuesto. El conserje virtual puede procesar pedidos de Room Service y solicitudes de limpieza directamente.' }
            ].map((f, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-sm uppercase tracking-wider list-none">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-amber-500 group-open:rotate-180 transition-transform" />
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
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity Hospitality © 2026</span>
           </div>
           <nav className="flex gap-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
              <Link href="/terms" className="hover:text-amber-500 transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacidad</Link>
              <Link href="/legal" className="hover:text-amber-500 transition-colors">Legal</Link>
           </nav>
        </div>
      </footer>
    </div>
  )
}
