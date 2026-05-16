'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, Music, Gem, 
  Repeat, Mic2, ChevronLeft, ArrowUpRight, Crown
} from 'lucide-react'
import Link from 'next/link'

export default function TaylorSwiftMasterclassPage() {
  const chapters = [
    {
      icon: Crown,
      title: 'Capítulo 1: El ADN Financiero',
      time: '12 mins',
      content: 'Taylor no es solo una artista, es una CEO criada por corredores de bolsa. Su nombre fue elegido para ser andrógino en el mundo corporativo. La lección de aplicar rigor analítico y financiero a una industria creativa.'
    },
    {
      icon: Repeat,
      title: 'Capítulo 2: La Estrategia de las "Eras"',
      time: '18 mins',
      content: 'Cómo evitar la obsolescencia. Taylor es la "princesa de la paradoja", capaz de pasar del Country al Pop, y del Indie al Dubstep. Dominar el arte de destruir tu marca antigua para renacer en una nueva "Era" antes de que el público se aburra.'
    },
    {
      icon: Mic2,
      title: 'Capítulo 3: Copywriting Emocional',
      time: '15 mins',
      content: 'Sus canciones no son solo música, son Masterclasses de Copywriting. El uso de detalles híper-específicos, nombres reales y narrativas de venganza o vulnerabilidad para crear un vínculo parasocial indestructible con su audiencia.'
    },
    {
      icon: Gem,
      title: 'Capítulo 4: Propiedad Intelectual (Taylor\'s Version)',
      time: '20 mins',
      content: 'La jugada maestra de los negocios modernos. Cómo regrabar todo su catálogo tras perder los derechos originales le enseñó al mundo que el verdadero poder no está en ser famoso, sino en poseer el código fuente de tu trabajo.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Music className="w-4 h-4" /> Propiedad y Re-invención
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Modelo Swift: <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500 italic">Eras, Copywriting y Propiedad Intelectual</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Cómo la hija de dos corredores de bolsa de Merrill Lynch se convirtió en la mayor genio del marketing y la propiedad intelectual de nuestra generación, construyendo un imperio billonario a través de la reinvención constante.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-rose-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Concert / Pop Star" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center backdrop-blur-xl border border-rose-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-rose-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Análisis de Branding</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">La Paradoja Controlada</h3>
            <p className="text-white/60 mb-8">
              En el mundo de los negocios, la mayoría teme cambiar de nicho por miedo a perder clientes. Taylor Swift domina la transición. De cantar con banjos a dominar el Pop global. ¿El secreto? Ella no cambia de esencia, cambia de "Era". Construye un universo estético, sonoro y narrativo nuevo, exprime todo su valor, y luego lo destruye intencionalmente para renacer en el siguiente antes de que el mercado la vuelva obsoleta.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-rose-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-rose-500/10 group-hover:text-rose-400 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-rose-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-rose-500/20 bg-gradient-to-b from-rose-900/40 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-rose-400">Recursos de Branding</h4>
            
            <ul className="space-y-4">
              {[
                'Matriz de "Eras" (Re-invención)',
                'Framework de Copywriting Emocional',
                'Guía de Protección de IP (Taylor\'s Version)',
                'Auditoría de Lealtad (Fandom Cult)'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/swift-brand-ai" className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rose-900/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Diseñador de "Eras" Comerciales
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Regla de la Paradoja</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">"Sé la buena chica dulce, pero escribe coros furiosos de denuncia. La tensión entre dos opuestos es lo que mantiene la atención del mundo atrapada."</p>
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
