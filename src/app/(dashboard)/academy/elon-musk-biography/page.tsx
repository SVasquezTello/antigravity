'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Rocket, Brain, 
  Swords, AlertTriangle, ChevronLeft, ArrowUpRight, Globe
} from 'lucide-react'
import Link from 'next/link'

export default function ElonMuskMasterclassPage() {
  const chapters = [
    {
      icon: Swords,
      title: 'Capítulo 1: La Forja en el Fuego (Infancia y Resiliencia)',
      time: '18 mins',
      content: 'Un análisis de los primeros años en Sudáfrica. Cómo el abuso físico en los campamentos y el maltrato psicológico de su padre forjaron una tolerancia extrema al dolor y al riesgo. La lección del "golpe en la nariz" y cómo esto moldeó su agresividad corporativa.'
    },
    {
      icon: Rocket,
      title: 'Capítulo 2: De PayPal a Marte (Visión vs Megalomanía)',
      time: '24 mins',
      content: 'El despido como CEO de PayPal y su renacimiento con SpaceX y Tesla. Discutimos la ética de su ética laboral "Hardcore", donde se exige dormir en la fábrica y establecer metas imposibles para presionar al equipo. ¿Es necesario el maltrato para lograr la genialidad?'
    },
    {
      icon: Globe,
      title: 'Capítulo 3: El Control de la Información (X y la Libertad de Expresión)',
      time: '20 mins',
      content: 'La compra de Twitter (X) por 44 billones de dólares. ¿Fue un acto heroico para salvar la plaza pública digital o un movimiento estratégico para evitar ser cancelado? Analizamos el péndulo de la censura y la guerra de ideas.'
    },
    {
      icon: Brain,
      title: 'Capítulo 4: Neuralink, IA y el Peligro Transhumanista',
      time: '22 mins',
      content: 'La paradoja de Musk: Advertir sobre el fin de la humanidad por culpa de la Inteligencia Artificial, mientras construye chips cerebrales (Neuralink) y redes neuronales masivas. Un análisis crítico sobre los límites de la ética tecnológica y el complejo de salvador.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Rocket className="w-4 h-4" /> Análisis Biográfico y Ético
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Método Musk: <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-white italic">Genio, Trauma y Ambición</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Basado en la biografía de Walter Isaacson. Un viaje profundo a la psicología de Elon Musk. Extraemos sus modelos mentales (First Principles) mientras mantenemos una mirada crítica sobre su estilo de liderazgo, su moralidad y sus promesas mesiánicas.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-zinc-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="SpaceX Rocket" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">Admiración con Cautela</h3>
            <p className="text-white/60 mb-8">
              Esta clase maestra no es una adoración ciega al hombre más rico del mundo. Es una disección estratégica. Aprenderemos cómo Musk utiliza <strong>"First Principles Thinking"</strong> para disrumpir industrias enteras (como rechazar los cohetes rusos para construir SpaceX), pero también analizaremos los costos humanos de su ética laboral implacable.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-zinc-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-zinc-500/10 group-hover:text-white transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-white" />
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
          <GlassCard className="p-6 border-zinc-500/20 bg-gradient-to-b from-zinc-900/50 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Recursos y Modelos Mentales</h4>
            
            <ul className="space-y-4">
              {[
                'Plantilla First Principles',
                'Framework de Timeboxing (5 min)',
                'Plantilla "Hardcore" Goal Setting',
                'Auditoría Ética de Liderazgo'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps" className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/10 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Aplicar First Principles AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-orange-500/20 bg-orange-500/5 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">Advertencia de Liderazgo</h4>
             </div>
             <p className="text-xs text-white/50 leading-relaxed">
               En este módulo enseñamos la eficiencia de Musk, pero rechazamos explícitamente el abuso verbal y la cultura del "burnout" extremo detallada en la biografía de Isaacson.
             </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
