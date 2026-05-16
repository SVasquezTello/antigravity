'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Brain, VolumeX, 
  Sprout, Users, ChevronLeft, ArrowUpRight, Target
} from 'lucide-react'
import Link from 'next/link'

export default function WealthInSilenceMasterclassPage() {
  const chapters = [
    {
      icon: VolumeX,
      title: 'Capítulo 1: El Ruido como Ladrón de Riqueza',
      time: '14 mins',
      content: 'Por qué la pobreza se queda con quienes hablan mucho y hacen poco. La trampa moderna de buscar validación en redes sociales antes de tener resultados reales. El silencio como escudo contra las distracciones.'
    },
    {
      icon: Sprout,
      title: 'Capítulo 2: Inversión Invisible (Conocimiento)',
      time: '18 mins',
      content: 'El dinero puede perderse, el conocimiento no. Cómo reinvertir tus primeros ingresos en habilidades en lugar de pasivos. Ver la educación no como un gasto, sino como la semilla de la libertad financiera.'
    },
    {
      icon: Users,
      title: 'Capítulo 3: Auditoría del Entorno',
      time: '20 mins',
      content: 'La pobreza mental es contagiosa. Por qué rodearte de personas que se quejan garantiza tu fracaso. La importancia de elegir con quién caminas y buscar alianzas con creadores silenciosos.'
    },
    {
      icon: Target,
      title: 'Capítulo 4: Paciencia y el Largo Plazo',
      time: '16 mins',
      content: 'El error de buscar dinero rápido. Lo que se levanta rápido, se cae rápido. Cómo sembrar proyectos a 10 años vista trabajando duro en la oscuridad hasta que el éxito sea innegable.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Brain className="w-4 h-4" /> Mindset y Estoicismo
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Poder del Silencio: <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 italic">Construyendo Riqueza en la Sombra</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Una clase magistral sobre la psicología de la creación de valor. Olvida el "hustle culture" ruidoso. Descubre cómo el trabajo profundo, la paciencia y el aislamiento estratégico son los verdaderos arquitectos de la libertad financiera.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-zinc-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Focus / Silence" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-zinc-500/20 flex items-center justify-center backdrop-blur-xl border border-zinc-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-zinc-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Sesión de Mindset</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">La Pobreza se Alimenta del Ruido</h3>
            <p className="text-white/60 mb-8">
              Vivimos en una era donde la validación ocurre antes que los resultados. Publicamos cada pequeño avance buscando aplausos. Este módulo te enseñará a <strong>desconectar el ego de la ecuación</strong>, auditar tu entorno y construir activos de forma silenciosa e implacable.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-zinc-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-zinc-500/10 group-hover:text-zinc-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-zinc-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-zinc-300 transition-colors">{chapter.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{chapter.time}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {chapter.content}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-zinc-500/20 bg-gradient-to-b from-zinc-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Recursos de Enfoque</h4>
            
            <ul className="space-y-4">
              {[
                'Protocolo de Aislamiento Estratégico',
                'Matriz de Auditoría Social',
                'Plan de Reinversión de Habilidades',
                'Rastreador de Trabajo Profundo'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/stoic-focus-ai" className="w-full py-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Auditor de Silencio AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Ley Fundamental</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Los mejores movimientos financieros son invisibles para el mundo hasta que se vuelven imposibles de ignorar."</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
