'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, GraduationCap, Users, 
  BookOpen, BarChart3, Clock, Sparkles, Target, 
  ChevronDown, School, Cpu
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function EducationLanding() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-blue-500 italic">EduTech</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <School className="w-4 h-4" /> Solución para Academias y Centros Educativos
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Llena más matrículas sin depender solo de <span className="text-blue-500 italic">publicidad</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Escale su academia con captación automatizada y seguimiento inteligente de alumnos potenciales.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/register" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all">
                Quiero más alumnos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
            <img 
              src="/images/landings/education.png" 
              alt="Education AI Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* ── El Problema (Dolor) ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">El cuello de botella de tu crecimiento</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">Matrículas vacías por <span className="italic text-white/30">procesos lentos</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Costo de adquisición alto', desc: 'Gastas en Facebook/Google Ads pero los prospectos no se convierten en alumnos inscritos.' },
              { icon: Clock, title: 'Abandono en inscripción', desc: 'El proceso es tan manual que los alumnos pierden el interés antes de realizar el pago.' },
              { icon: Users, title: 'Gestión manual saturada', desc: 'Tu equipo administrativo pierde el tiempo en tareas repetitivas en lugar de cerrar ventas.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-blue-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-blue-500/50 mb-6 group-hover:text-blue-500 transition-colors" />
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
                  <div className="h-48 bg-blue-600/10 rounded-3xl border border-blue-600/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Nutrición de Leads</p>
                     <p className="text-[10px] text-blue-400 font-black uppercase">Convierte interesados en alumnos</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Asistente IA 24/7</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Resuelve dudas al instante</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Matrícula Digital</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Proceso en 3 clics</p>
                  </div>
                  <div className="h-48 bg-emerald-600/20 rounded-3xl border border-emerald-600/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Retención</p>
                     <p className="text-[10px] text-emerald-400 font-black uppercase">Reduce la deserción</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Solución Directa</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Inscripciones en piloto <span className="italic text-white/40">automático</span>
            </h3>
            <p className="text-white/40 text-lg">
              Sistemas de pre-calificación y nutrición de leads diseñados específicamente para el sector educativo. Deja que la IA haga el trabajo pesado de seguimiento.
            </p>
            <ul className="space-y-4">
              {[
                'Respuestas automáticas a consultas por WhatsApp',
                'Calificación de prospectos según perfil y presupuesto',
                'Envío de recordatorios de pago y próximas clases',
                'Reportes de ROI por campaña publicitaria'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> {item}
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
              <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Ecosistema Especializado</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Micro-Apps <span className="text-blue-500 italic">Educativas</span>
              </h3>
              <p className="text-white/40 text-lg">
                Herramientas quirúrgicas de IA diseñadas para creadores de cursos, mentores y academias online.
              </p>
            </div>
            <Link href="/join" className="text-[10px] font-black uppercase tracking-widest px-8 py-4 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all">
              Ver Catálogo Completo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Syllabus Architect',
                desc: 'Diseña temarios estructurados y pedagógicos para tus cursos en segundos.',
                icon: BookOpen,
                color: 'bg-blue-500/20'
              },
              {
                name: 'QuizGen Pro',
                desc: 'Genera cuestionarios de opción múltiple instantáneos para evaluar a tus alumnos.',
                icon: Target,
                color: 'bg-indigo-500/20'
              },
              {
                name: 'Course Sales Copy',
                desc: 'Redacta páginas de ventas de alta conversión para lanzar tus info-productos.',
                icon: Sparkles,
                color: 'bg-emerald-500/20'
              },
              {
                name: 'Webinar Closer',
                desc: 'Crea el guion perfecto para tu clase gratuita que termine en ventas (Russell Brunson style).',
                icon: BarChart3,
                color: 'bg-amber-500/20'
              },
              {
                name: 'Student Retention',
                desc: 'Automatiza correos para mantener a tus alumnos motivados y reducir la deserción.',
                icon: Users,
                color: 'bg-purple-500/20'
              },
              {
                name: 'AI Funnel Hacker',
                desc: 'Clona embudos millonarios con IA usando el método Output-Context-Voice de Russell Brunson.',
                icon: Cpu,
                color: 'bg-emerald-600/20'
              }
            ].map((app, i) => (
              <GlassCard key={i} className="p-8 group hover:border-blue-500/50 transition-all">
                <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-black mb-2">{app.name}</h4>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{app.desc}</p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Professional Suite</span>
                  <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Caso de Estudio DotCom Secrets ── */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-black/40">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Masterclass Exclusiva</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">
              La Ciencia de los <span className="italic text-white/40">Embudos Educativos</span>
            </h3>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Basado en las estrategias de Russell Brunson y DotCom Secrets. Convierte tu conocimiento en un imperio digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { step: '01', title: 'La Escalera de Valor', desc: 'Deja de vender un solo curso. Crea un ecosistema (Lead Magnet -> Frontend -> High Ticket) para maximizar el LTV del alumno.' },
                { step: '02', title: 'El "Perfect Webinar"', desc: 'Vende sin parecer un vendedor usando la estructura ganadora: Historia de Origen + El Gran Secreto + Value Stack.' },
                { step: '03', title: 'Páginas de Alta Conversión', desc: 'Reemplaza tu aburrida página web por un "Sales Funnel" diseñado psicológicamente para guiar al clic.' },
                { step: '04', title: 'Tráfico & Retención', desc: 'No necesitas más alumnos, necesitas que los que tienes compren más y no abandonen. (Upsells & Secuencias).' }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/30 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-all shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <GlassCard className="p-10 border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-black relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <Target className="w-12 h-12 text-blue-500" />
                <h4 className="text-2xl font-black uppercase tracking-tight">DotCom Secrets Academy</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  ¿Quieres implementar esta metodología en tu academia? Nuestra plataforma incluye un <strong>Curso Privado Completo</strong> sobre Embudos de Venta Educativos que te enseñará a estructurar tu oferta, crear tu webinar perfecto y redactar tu copy de ventas.
                </p>
                <div className="pt-4 flex flex-col gap-3">
                  <span className="inline-flex items-center w-fit gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" /> Curso Incluido
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-24 px-6 bg-blue-900/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Impacto Real en <span className="text-blue-500 italic">tu Institución</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '+50%', label: 'Tasa de Matrícula' },
              { val: '-70%', label: 'Trabajo Manual' },
              { val: '3X', label: 'ROI en Ads' },
              { val: '100%', label: 'Disponibilidad' }
            ].map((b, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-blue-500">{b.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-blue-500/20 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/40 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                ¿Listo para <span className="text-blue-500 italic">llenar</span> <br />tu próxima <span className="text-blue-500 italic">cohorte</span>?
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                No pierdas ni un solo alumno más por falta de seguimiento. Activa tu ecosistema hoy.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:invert transition-all">
                Empezar Ahora
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Ver Demo
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
              { q: '¿Se adapta a cualquier tipo de curso?', a: 'Sí. Ya sean cursos cortos, diplomados o carreras universitarias, el sistema de nutrición es totalmente flexible.' },
              { q: '¿Puedo integrar mi pasarela de pago?', a: 'Por supuesto. Antigravity se integra con Stripe, PayPal y procesadores locales para cerrar la venta al instante.' },
              { q: '¿Cómo ayuda a la retención?', a: 'Automatizamos recordatorios, encuestas de satisfacción y avisos de clases para que el alumno siempre se sienta acompañado.' }
            ].map((f, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-sm uppercase tracking-wider list-none">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-blue-500 group-open:rotate-180 transition-transform" />
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
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity EduTech © 2026</span>
           </div>
           <nav className="flex gap-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
              <Link href="/terms" className="hover:text-blue-500 transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacidad</Link>
              <Link href="/legal" className="hover:text-blue-500 transition-colors">Legal</Link>
           </nav>
        </div>
      </footer>
    </div>
  )
}
