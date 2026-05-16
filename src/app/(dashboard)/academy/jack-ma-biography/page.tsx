'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, ShoppingCart, Globe, 
  TrendingUp, AlertTriangle, ChevronLeft, ArrowUpRight, Scale
} from 'lucide-react'
import Link from 'next/link'

export default function JackMaMasterclassPage() {
  const chapters = [
    {
      icon: TrendingUp,
      title: 'Capítulo 1: El Arte del Rechazo Constante',
      time: '14 mins',
      content: 'Cómo sobrevivir a 10 rechazos de Harvard, fallar los exámenes universitarios y ser rechazado por la policía y KFC. Jack Ma usó el fracaso como filtro para construir una resiliencia inquebrantable, una lección vital para cualquier emprendedor.'
    },
    {
      icon: Globe,
      title: 'Capítulo 2: La Primera Búsqueda (1995)',
      time: '18 mins',
      content: 'El viaje a Estados Unidos donde conoció el Internet por primera vez buscando "Cerveza". Descubrir que China no existía en la red fue el catalizador para "China Page", su primer fracaso digital antes del gran éxito.'
    },
    {
      icon: ShoppingCart,
      title: 'Capítulo 3: El Imperio desde un Apartamento',
      time: '25 mins',
      content: 'Fundando Alibaba en 1999 con 17 amigos. Cómo venció a gigantes como eBay en China creando Taobao y el sistema de pagos Alipay, entendiendo la cultura local mucho mejor que los colosos de Silicon Valley.'
    },
    {
      icon: AlertTriangle,
      title: 'Capítulo 4: Excentricidad, Polémicas y Caída',
      time: '22 mins',
      content: 'Desde disfrazarse de Michael Jackson para sus empleados, hasta sus comentarios defendiendo la censura y la represión, y su posterior desaparición del ojo público en 2020. Una lección sobre el riesgo político en los negocios.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
      </Link>

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShoppingCart className="w-4 h-4" /> E-commerce y Resiliencia
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          El Fenómeno Jack Ma: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600 italic">De Rechazado a Gigante Digital</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          La historia del fundador de Alibaba no es la del clásico programador genio de Silicon Valley. Es la historia de un profesor de inglés que entendió las necesidades de las masas y revolucionó el comercio global y el dropshipping.
        </p>
      </header>

      {/* Video Placeholder */}
      <GlassCard className="relative aspect-video flex items-center justify-center border-orange-500/20 bg-black overflow-hidden group cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
          alt="Alibaba Global Trade" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale sepia-[.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center backdrop-blur-xl border border-orange-500/50 group-hover:scale-110 transition-transform duration-500">
            <PlayCircle className="w-10 h-10 text-orange-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-lg">Reproducir Documental</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-black tracking-tight text-white mb-4">El Vendedor que Venció a eBay</h3>
            <p className="text-white/60 mb-8">
              A diferencia de Elon Musk o Mark Zuckerberg, Jack Ma no sabía programar. Su genialidad radicaba en la <strong>Visión de Mercado y el Liderazgo Carismático</strong>. En este análisis veremos cómo logró crear un ecosistema masivo B2B (Alibaba) y B2C (Taobao) que hoy es la columna vertebral del comercio electrónico mundial.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 hover:border-orange-500/30 transition-all flex gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                  <chapter.icon className="w-6 h-6 text-white/40 group-hover:text-orange-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{chapter.title}</h4>
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
          <GlassCard className="p-6 border-orange-500/20 bg-gradient-to-b from-orange-950/20 to-black space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-orange-500">Recursos de Comercio</h4>
            
            <ul className="space-y-4">
              {[
                'Plantilla de Negociación B2B',
                'Evaluador de Proveedores Chinos',
                'Guion de Culturización de Ventas',
                'Estructura de Marketplace'
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> {r}
                </li>
              ))}
            </ul>

            <Link href="/apps/jackma-sourcing-ai" className="w-full py-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-600/20 mt-6">
               <ArrowUpRight className="w-4 h-4" /> Lanzar Sourcing AI
            </Link>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 opacity-50 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Notas del Autor</h4>
             </div>
             <p className="text-xs text-white/40 leading-relaxed">Las declaraciones de Ma sobre la censura (2014) y la piratería nos recuerdan que el pragmatismo extremo empresarial a menudo choca con la ética occidental.</p>
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
