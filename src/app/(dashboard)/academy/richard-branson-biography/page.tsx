'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, PlaneTakeoff, Megaphone, 
  ShieldAlert, Palmtree, ChevronLeft, ArrowUpRight, Zap
} from 'lucide-react'
import Link from 'next/link'

export default function RichardBransonMasterclassPage() {
  const chapters = [
    {
      icon: Palmtree,
      title: 'Capítulo 1: La Oferta Absurda (Necker Island)',
      time: '12 mins',
      content: 'Cómo Branson consiguió una isla de 3 millones de libras por solo 180,000. La lección de no tener miedo al rechazo, usar la audacia para conseguir trato preferencial y negociar con vendedores urgidos de liquidez.'
    },
    {
      icon: ShieldAlert,
      title: 'Capítulo 2: Riesgo Asimétrico (Virgin Atlantic)',
      time: '18 mins',
      content: 'El secreto detrás de su locura: Branson no es un amante del riesgo ciego. Para lanzar su aerolínea, arrendó el avión por solo 1 año, limitando su pérdida máxima. Si fallaba, devolvía el avión y Virgin Records seguía a salvo.'
    },
    {
      icon: Megaphone,
      title: 'Capítulo 3: PR Stunts y Marketing Extremo',
      time: '15 mins',
      content: 'Cruzar el Atlántico en lancha y el Pacífico en Globo (casi muriendo incendiado a 40,000 pies). Cómo Branson usa su propia vida y excentricidad como valla publicitaria gratuita para sus más de 300 empresas.'
    },
    {
      icon: Zap,
      title: 'Capítulo 4: Diversión como Modelo de Negocio',
      time: '20 mins',
      content: 'La regla de oro de Virgin: "Diversión, Desafío y Negocios". Si un sector es aburrido (como volar o los bancos), Virgin entra a irrumpir con cultura corporativa relajada, excelente servicio al cliente y marca irreverente.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <PlaneTakeoff className="w-4 h-4" /> Riesgo y Relaciones Públicas
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Imperio Virgin: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 italic">Audacia, Locura y Riesgo Calculado</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Basado en el libro "Perdiendo la Virginidad". Aprende la filosofía de Richard Branson: cómo usar tu propia marca personal para publicidad masiva y cómo proteger tus ganancias mientras asumes proyectos aparentemente imposibles.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-red-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Aviation / Virgin" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center backdrop-blur-xl border border-red-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Branding</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El CEO como Valla Publicitaria</h3>
            <p className="text-white/60 mb-8">
              Mientras los CEOs tradicionales gastan millones en agencias de publicidad, Richard Branson entendió que <strong>hacer algo absurdo o peligroso</strong> atrae toda la cobertura mediática del mundo gratis. Desde disfrazarse de azafata hasta cruzar el Pacífico en globo aerostático, Branson convirtió la irreverencia en el activo más valioso de la marca Virgin.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-red-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-red-500/20 bg-gradient-to-b from-red-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Recursos de Branding</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Riesgo Asimétrico',
                'Protocolo de PR Stunts',
                'Auditoría de Cultura de Marca',
                'Framework "Diversión & Negocios"'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/branson-pr-ai" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Generador de PR Stunts
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de Riesgo</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Protege la desventaja (downside). Si arriendo un Jumbo Jet por 1 año y falla, pierdo 1 año de arriendo, pero no quiebro mi disquera. Riesgo limitado, potencial ilimitado."</p>
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
