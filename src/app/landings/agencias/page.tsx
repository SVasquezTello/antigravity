'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Zap, Sparkles, 
  Target, Rocket, Layers, BarChart3, 
  Megaphone, Users, Globe, Play
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function AgencyLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo de Gradiente Dinámico ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* ── Navegación ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-primary italic">Agency</span></span>
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
               <Link href="#solutions" className="hover:text-white transition-colors">Soluciones</Link>
               <Link href="#roi" className="hover:text-white transition-colors">ROI</Link>
               <Link href="#pricing" className="hover:text-white transition-colors">Precios</Link>
            </nav>
            <Link href="/register" className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Escalar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-48 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Rocket className="w-4 h-4" /> El Futuro de la Producción Creativa
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase"
            >
              Escala tu <span className="text-primary">Agencia</span> <br /> <span className="italic text-white/20">sin</span> aumentar costos operativos.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Deja de desperdiciar horas facturables en documentos de alcance y presentaciones. Automatiza tu estrategia creativa con el Agency Hub de Antigravity.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/register" className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-primary hover:text-white transition-all duration-500 overflow-hidden">
              <span className="relative z-10">Empezar a Escalar Gratis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <button className="flex items-center gap-4 px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
              <Play className="w-5 h-5 fill-current" /> Ver Demo
            </button>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative pt-20 max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
            <img 
              src="/images/landings/agency-hub.png" 
              alt="Agency AI Hub Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-20 grayscale"
          >
             <div className="font-black text-2xl tracking-tighter">FORBES</div>
             <div className="font-black text-2xl tracking-tighter">ADWEEK</div>
             <div className="font-black text-2xl tracking-tighter">WIRED</div>
             <div className="font-black text-2xl tracking-tighter">TECHCRUNCH</div>
          </motion.div>
        </div>
      </header>

      {/* ── Feature Grid ── */}
      <section id="solutions" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">El Toolkit de la Agencia</h2>
              <p className="text-4xl md:text-6xl font-black tracking-tight uppercase">Verticales de IA <br /><span className="text-white/20 italic">de Alto Rendimiento</span></p>
            </div>
            <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">
              Cada herramienta está entrenada con frameworks de alta conversión para asegurar un resultado de nivel profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: 'Constructor de SOW', desc: 'Genera documentos de alcance y alcances técnicos en menos de 60 segundos con 95% de precisión.', accent: 'bg-blue-500' },
              { icon: Megaphone, title: 'Estratega de Pitch', desc: 'Crea narrativas persuasivas y propuestas de valor que cierran clientes corporativos.', accent: 'bg-purple-500' },
              { icon: BarChart3, title: 'Automatizador de Briefs', desc: 'Convierte llamadas vagas en briefs creativos perfectos para tu equipo de producción.', accent: 'bg-pink-500' },
              { icon: Users, title: 'Nutrición de Clientes', desc: 'Comunicación automatizada de alto nivel que mantiene a los clientes felices y la retención alta.', accent: 'bg-primary' },
              { icon: Globe, title: 'IA de Escala de Ads', desc: 'Genera copys de anuncios multicanal y direcciones creativas basadas en tendencias actuales.', accent: 'bg-emerald-500' },
              { icon: Target, title: 'Predictor de ROI', desc: 'Pronostica el impacto de la campaña antes de gastar un solo euro en compra de medios.', accent: 'bg-amber-500' }
            ].map((item, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-white/20 transition-all duration-500 group relative">
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.accent} opacity-[0.03] blur-[60px] rounded-full group-hover:opacity-[0.1] transition-all`} />
                <item.icon className="w-12 h-12 text-white/20 mb-8 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-wider leading-none">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  Activar Solución <ArrowRight className="w-3 h-3" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Comparison ── */}
      <section id="roi" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">La Matemática del Crecimiento</h2>
              <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                20x Más <span className="italic text-white/40">Producción</span> <br /> 0x Más <span className="italic text-white/40">Contratación</span>
              </h3>
              <p className="text-white/40 text-xl font-medium leading-relaxed">
                Antigravity no reemplaza a tus creativos; elimina la fricción que les impide ser creativos.
              </p>
              
              <div className="space-y-6">
                 {[
                   { label: 'Tiempo en Alcances (SOW)', before: '8h', after: '4min', color: 'bg-primary' },
                   { label: 'Preparación de Briefs', before: '4h', after: '2min', color: 'bg-purple-500' },
                   { label: 'Lógica de Presentación', before: '12h', after: '15min', color: 'bg-blue-500' }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                         <span>{stat.label}</span>
                         <span className="text-white"><span className="text-primary">{stat.after}</span> vs {stat.before}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} whileInView={{ width: '10%' }} transition={{ duration: 1, delay: i * 0.1 }}
                           className={`h-full ${stat.color} shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]`} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
              <GlassCard className="p-12 space-y-8 relative z-10 border-white/10 bg-white/[0.03]">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-black text-2xl">98%</div>
                    <p className="text-sm font-bold uppercase tracking-widest leading-tight">Incremento en <br /><span className="text-primary italic">Eficiencia Facturable</span></p>
                 </div>
                 <div className="space-y-6">
                    <p className="text-white/30 italic text-lg leading-relaxed">
                      "Desde que implementamos Antigravity, hemos escalado de 12 a 45 proyectos concurrentes sin añadir un solo project manager. Es esencialmente un multiplicador de fuerza para la inteligencia de mi equipo."
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-primary to-purple-600" />
                       <div>
                          <p className="font-black uppercase text-xs">Marcus Sterling</p>
                          <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">CEO, Sterling Media House</p>
                       </div>
                    </div>
                 </div>
              </GlassCard>
           </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-24 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white shadow-lg">A</div>
              <span className="text-white font-black uppercase tracking-widest text-sm">Antigravity <span className="text-primary italic">Agency</span></span>
           </div>
           <nav className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
              <Link href="#" className="hover:text-white transition-colors">Frameworks</Link>
              <Link href="#" className="hover:text-white transition-colors">Casos de Éxito</Link>
              <Link href="#" className="hover:text-white transition-colors">Estado</Link>
              <Link href="#" className="hover:text-white transition-colors">Legal</Link>
           </nav>
           <p className="text-white/10 font-medium text-[10px] uppercase tracking-[0.1em]">© 2026 Antigravity Systems. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
