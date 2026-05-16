'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayCircle, BrainCircuit, Rocket, Target, 
  Crown, Activity, Radio, Coins, TrendingUp, Gem, Sparkles
} from 'lucide-react'
import Link from 'next/link'

// Base de datos de Titanes
const titanCategories = [
  {
    title: "Tecnología e Innovación",
    icon: Rocket,
    color: "from-blue-400 to-cyan-500",
    modules: [
      {
        slug: "steve-jobs-biography",
        name: "Steve Jobs",
        subtitle: "Minimalismo y Diseño",
        image: "https://images.unsplash.com/photo-1531297172868-944ce3e52248?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Diseño"
      },
      {
        slug: "elon-musk-biography",
        name: "Elon Musk",
        subtitle: "Primeros Principios",
        image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Ingeniería"
      },
      {
        slug: "larry-page-biography",
        name: "Larry Page",
        subtitle: "10X Moonshots",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Escalamiento"
      },
      {
        slug: "sergey-brin-biography",
        name: "Sergey Brin",
        subtitle: "Adquisición de Talento",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Talento (M&A)"
      },
      {
        slug: "bill-gates-biography",
        name: "Bill Gates",
        subtitle: "Urgencia y Monopolio",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Software"
      }
    ]
  },
  {
    title: "Estrategia B2B y Operaciones",
    icon: Target,
    color: "from-emerald-400 to-teal-500",
    modules: [
      {
        slug: "amancio-ortega-biography",
        name: "Amancio Ortega",
        subtitle: "Fast Fashion e Integración",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Supply Chain"
      },
      {
        slug: "carlos-slim-biography",
        name: "Carlos Slim",
        subtitle: "Monopolios y Crisis",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Mercado Masivo"
      },
      {
        slug: "jack-ma-biography",
        name: "Jack Ma",
        subtitle: "B2B Ecommerce",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "China / B2B"
      },
      {
        slug: "the-outsiders-ceos",
        name: "The Outsiders",
        subtitle: "CEOs no convencionales",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Wall Street"
      }
    ]
  },
  {
    title: "Marketing, Lujo y Propiedad Intelectual",
    icon: Gem,
    color: "from-amber-400 to-rose-500",
    modules: [
      {
        slug: "bernard-arnault-biography",
        name: "Bernard Arnault",
        subtitle: "La Ingeniería del Deseo",
        image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "LVMH / Lujo"
      },
      {
        slug: "taylor-swift-biography",
        name: "Taylor Swift",
        subtitle: "Eras y Propiedad Intelectual",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "IP / Fandom"
      },
      {
        slug: "richard-branson-biography",
        name: "Richard Branson",
        subtitle: "Asimetría y PR Stunts",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Riesgo Asimétrico"
      },
      {
        slug: "dotcom-secrets",
        name: "Russell Brunson",
        subtitle: "DotCom Secrets",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Funnels"
      }
    ]
  },
  {
    title: "Marca Personal y Alto Rendimiento",
    icon: Crown,
    color: "from-purple-400 to-indigo-500",
    modules: [
      {
        slug: "cristiano-ronaldo-biography",
        name: "Cristiano Ronaldo",
        subtitle: "Disciplina Extrema",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Performance"
      },
      {
        slug: "oprah-winfrey-biography",
        name: "Oprah Winfrey",
        subtitle: "Empatía y Kingmaking",
        image: "https://images.unsplash.com/photo-1598555231223-f2220f81d114?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Medios"
      },
      {
        slug: "wealth-in-silence",
        name: "Wealth In Silence",
        subtitle: "El Constructor Silencioso",
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Filosofía"
      },
      {
        slug: "propaganda-playbook",
        name: "Edward Bernays",
        subtitle: "Ingeniería del Consentimiento",
        image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Propaganda"
      }
    ]
  }
]

export default function AcademyDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Hero Section */}
      <header className="relative space-y-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl -z-10" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4" /> Antigravity Academias
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight max-w-4xl">
          El currículum corporativo <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 italic">más letal del planeta.</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl font-medium">
          Deja de leer libros teóricos. Hemos codificado el cerebro, la historia y la estrategia de los Titanes que construyeron las empresas más dominantes de la historia humana. Elige tu mentor.
        </p>
      </header>

      {/* Categories */}
      <div className="space-y-16">
        {titanCategories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <category.icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r ${category.color} stroke-[url(#gradient-${idx})]`} />
              <svg width="0" height="0">
                <linearGradient id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={category.color.includes('blue') ? '#60A5FA' : category.color.includes('emerald') ? '#34D399' : category.color.includes('amber') ? '#FBBF24' : '#C084FC'} />
                  <stop offset="100%" stopColor={category.color.includes('cyan') ? '#06B6D4' : category.color.includes('teal') ? '#14B8A6' : category.color.includes('rose') ? '#F43F5E' : '#818CF8'} />
                </linearGradient>
              </svg>
              <h2 className="text-2xl font-black tracking-tight text-white">{category.title}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.modules.map((mod, midx) => (
                <Link href={`/academy/${mod.slug}`} key={midx}>
                  <GlassCard className="group h-full overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                      <img 
                        src={mod.image} 
                        alt={mod.name}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <PlayCircle className="w-6 h-6 text-white" />
                         </div>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/80">
                          {mod.tag}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-1 bg-gradient-to-b from-transparent to-white/[0.02]">
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-colors">
                        {mod.name}
                      </h3>
                      <p className="text-xs text-white/50 font-medium">
                        {mod.subtitle}
                      </p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  )
}
