'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Dna, Briefcase, 
  Search, Users, ChevronLeft, ArrowUpRight, DollarSign
} from 'lucide-react'
import Link from 'next/link'

export default function SergeyBrinMasterclassPage() {
  const chapters = [
    {
      icon: Search,
      title: 'Capítulo 1: El Algoritmo de la Relevancia',
      time: '15 mins',
      content: 'Cómo Sergey Brin y Larry Page transformaron un proyecto de tesis en Stanford en un motor de búsqueda que ordenaba la web por relevancia, superando el rechazo inicial de la universidad a financiar el proyecto.'
    },
    {
      icon: DollarSign,
      title: 'Capítulo 2: El Salario de 1 Dólar',
      time: '10 mins',
      content: 'Al salir a bolsa, los fundadores redujeron su salario a 1 dólar anual, vinculando todo su patrimonio a las acciones de la empresa. Una lección brutal de alineación de incentivos para atraer inversores.'
    },
    {
      icon: Briefcase,
      title: 'Capítulo 3: La Estrategia "Acqui-hire"',
      time: '18 mins',
      content: 'Google inventó el concepto de "Adquisición-Contratación" (Acqui-hire): comprar empresas no por sus ingresos, sino para absorber su talento (Ej: Android por $130M, YouTube por $1.6B).'
    },
    {
      icon: Dna,
      title: 'Capítulo 4: Crisis Personal y Google X',
      time: '22 mins',
      content: 'Tras descubrir su predisposición genética al Parkinson (vía 23andMe), Sergey no entró en pánico; cambió su dieta, financió investigación y fundó Google X para acelerar tecnologías de impacto global (Google Glass, Waymo).'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Dna className="w-4 h-4" /> Talento y Datos
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Método Sergey Brin: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">Datos, Talento y Supervivencia</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          La otra mitad del cerebro de Google. Aprende cómo el análisis matemático de datos masivos puede resolver desde problemas de búsqueda en internet hasta la cura de enfermedades genéticas, y la estrategia de "comprar talento".
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-blue-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Data / Genetics" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Caso de Estudio</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">Comprar Cerebros, No Empresas</h3>
            <p className="text-white/60 mb-8">
              Una de las innovaciones empresariales más grandes de Sergey Brin fue la estrategia de <strong>Acqui-hire (Adquisición-Contratación)</strong>. Mientras otras empresas intentaban reclutar ingenieros top uno por uno, Google simplemente compraba la pequeña startup en la que trabajaban para absorber el talento de golpe.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-blue-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-blue-500/20 bg-gradient-to-b from-blue-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Recursos de Talento</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de Evaluación Acqui-hire',
                'Estructura de Alineación de Incentivos',
                'Algoritmo de Filtrado de Talento',
                'Protocolo Google X (Innovación Rápida)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/brin-acquihire-ai" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Estratega Acqui-hire AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Karma Empresarial</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"La tecnología no debería complicar la vida... el éxito inaudito de Google está en la simplicidad de presentar productos pensando en las personas."</p>
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
