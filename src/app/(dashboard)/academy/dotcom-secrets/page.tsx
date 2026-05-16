'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, BookOpen, Target, CheckCircle2, 
  Search, Presentation, Users, Filter, ChevronLeft, Lock, ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default function DotComSecretsCoursePage() {
  const steps = [
    {
      icon: Filter,
      title: 'Módulo 1: El Fin de las Páginas Web',
      time: '12 mins',
      content: 'Tener una página web bonita ya no funciona. Necesitas un "Embudo de Ventas" (Sales Funnel). Un embudo es una serie de pasos estratégicos que toma a un visitante frío y lo guía de la mano hasta que compra tu curso. El objetivo no es vender un producto, sino maximizar el Valor del Cliente (LTV).'
    },
    {
      icon: ArrowUpRight,
      title: 'Módulo 2: La Escalera de Valor',
      time: '18 mins',
      content: 'No puedes vender un curso de $1,000 a un desconocido. Debes ofrecer un "Cebo Irresistible" (Lead Magnet) gratuito para capturar su correo. Luego, ofreces un curso introductorio (Upsell) y, a medida que ganan confianza, los subes por tu Escalera de Valor hacia tus mentorías o bootcamps más caros.'
    },
    {
      icon: Presentation,
      title: 'Módulo 3: El Perfect Webinar',
      time: '25 mins',
      content: 'La forma más efectiva de vender educación online es a través de presentaciones o Masterclasses. Debes usar el guion del "Perfect Webinar": 1) Gancho de 5 minutos. 2) Tu historia de origen. 3) Revelar el Gran Secreto. 4) El Pitch Final con "Value Stack" (Apilamiento de Valor). Puedes usar nuestra app Webinar Closer para generar este guion.'
    },
    {
      icon: Target,
      title: 'Módulo 4: Tráfico y Retención',
      time: '20 mins',
      content: 'El tráfico (SEO, Ads, Redes Sociales) solo es útil si tu embudo convierte. Una vez que el alumno entra, la retención es clave. Debes usar secuencias de correos automatizados y programas de continuidad (suscripciones mensuales) para mantener el compromiso del alumno y multiplicar tus ingresos recurrentes.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <BookOpen className="w-4 h-4" /> Masterclass Academias
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          Embudos de Venta: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 italic">DotCom Secrets</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Aprende la ciencia exacta de los Embudos de Ventas (Funnelology) de Russell Brunson para escalar tu Academia o negocio de Cursos Online a seis cifras.
        </p>
      </header>

      {/* Video Placeholder / Header Image */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-blue-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Course Cover" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Masterclass</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">La Ciencia de la Persuasión</h3>
            <p className="text-white/60 mb-8">
              En este curso condensamos los mayores aprendizajes del libro <strong>DotCom Secrets</strong>. Descubrirás por qué tu página web tradicional está matando tus ventas y cómo estructurar una escalera de valor (Value Ladder) que transforme prospectos fríos en estudiantes leales.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-blue-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                  <step.icon className="w-6 h-6 text-white/40 group-hover:text-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{step.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{step.time}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.content}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-500">Recursos de IA</h4>
            
            <ul className="space-y-4">
              {[
                'Guion Perfect Webinar',
                'Páginas de Ventas IA',
                'Estructura Upsell / Downsell',
                'Secuencias de Retención',
                'AI Funnel Hacker (O-C-V)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/acad-webinar-script" className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20 mt-6">
               <Presentation className="w-4 h-4" /> Generar Mi Webinar
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Módulo Avanzado</h4>
                <Lock className="w-4 h-4 text-white/40" />
             </div>
             <p className="text-xs text-white/40 leading-relaxed">Traffic Secrets: Cómo inundar tu embudo con tráfico infinito. Se desbloquea al lanzar tu primer curso.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
