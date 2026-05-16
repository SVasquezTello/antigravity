'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle2, Zap, ShoppingBag, 
  TrendingUp, Globe2, Target,
  ChevronDown, LayoutDashboard, Sparkles, Video
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function DropshippingLanding() {
  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* ── Fondo Mesh Pro ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center font-black">A</div>
            <span className="font-black uppercase tracking-widest text-sm hidden sm:inline-block">Antigravity <span className="text-green-500 italic">E-com</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">Empezar Ahora</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-4 h-4" /> Oferta de Lanzamiento Exclusiva
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
            >
              Consigue <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-500 to-emerald-600">GRATIS</span> una Tienda de Shopify creada por IA en minutos
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/50 font-medium max-w-xl mx-auto lg:mx-0"
            >
              Una tienda Shopify totalmente optimizada con productos ganadores, páginas de productos listos para vender y cursos privados de dropshipping.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/register" className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-green-500 text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-green-500/30 hover:scale-105 hover:bg-green-400 transition-all">
                Reclamar mi tienda
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80" 
              alt="E-commerce Dashboard"
              className="relative z-10 rounded-[2.5rem] border border-white/10 shadow-2xl opacity-90 object-cover h-[600px] w-full"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Problema (Dolor) ── */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em]">¿Por qué fracasa el 90%?</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">El costo de empezar <span className="italic text-white/30">desde cero</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Productos equivocados', desc: 'Gastar cientos de dólares en Facebook Ads probando productos que nadie quiere comprar.' },
              { icon: LayoutDashboard, title: 'Tiendas poco confiables', desc: 'Diseños amateur y descripciones pobres que asustan a los clientes en los primeros 3 segundos.' },
              { icon: Video, title: 'Anuncios ignorados', desc: 'Guiones aburridos que hacen que la audiencia haga scroll sin hacer clic en tu tienda.' }
            ].map((p, i) => (
              <GlassCard key={i} className="p-10 border-white/5 hover:border-green-500/30 transition-all group">
                <p.icon className="w-10 h-10 text-red-500/50 mb-6 group-hover:text-red-500 transition-colors" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solución Ecosistema ── */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <div className="h-48 bg-green-500/10 rounded-3xl border border-green-500/20 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">CopyKiller E-com</p>
                     <p className="text-[10px] text-green-400 font-black uppercase">Descripciones que venden</p>
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">ViralAd Scripts</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Guiones para TikTok & FB</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">SEO Pro</p>
                     <p className="text-[10px] text-white/30 font-black uppercase">Posicionamiento Orgánico</p>
                  </div>
                  <div className="h-48 bg-primary/20 rounded-3xl border border-primary/30 p-6 flex flex-col justify-end">
                     <p className="font-bold italic">Supplier Nego</p>
                     <p className="text-[10px] text-primary font-black uppercase">Proveedores Chinos</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em]">Todo en uno</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Tu imperio e-commerce, <span className="italic text-white/40">acelerado por IA</span>
            </h3>
            <p className="text-white/40 text-lg">
              No solo te entregamos la tienda. Te damos un ecosistema de aplicaciones de Inteligencia Artificial para operar y escalar tu negocio sin contratar agencias.
            </p>
            <ul className="space-y-4">
              {[
                'Encuentra productos ganadores en tendencia',
                'Analiza debilidades de la competencia al instante',
                'Optimiza toda tu tienda para SEO automáticamente',
                'Acceso a nuestros cursos privados exclusivos'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Caso de Estudio Mark Tilbury ── */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-black/40">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em]">Caso de Estudio</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">
              El Método de <span className="italic text-white/40">7 Días</span>
            </h3>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Inspirado en el exitoso reto de dropshipping de Mark Tilbury. Construye, lanza y vende sin tocar inventario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { step: '01', title: 'Encontrar Nicho Rentable', desc: 'Usar IA para detectar tendencias de consumo inmediatas (ej. Mascotas).' },
                { step: '02', title: 'Construir la Tienda', desc: 'Generar la estructura de Shopify en un clic sin código.' },
                { step: '03', title: 'Importar Productos', desc: 'Importar desde AutoDS productos ganadores comprobados.' },
                { step: '04', title: 'Lanzar Anuncios UGC', desc: 'Utilizar avatares de IA para crear videos de TikTok/Meta que conviertan.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/30 group-hover:text-green-500 group-hover:border-green-500/50 transition-all shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <GlassCard className="p-10 border-green-500/20 bg-gradient-to-br from-green-950/20 to-black relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <Target className="w-12 h-12 text-green-500" />
                <h4 className="text-2xl font-black uppercase tracking-tight">Simulador Tilbury</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  ¿Quieres replicar este mismo reto? Nuestra plataforma incluye una nueva micro-app <strong>Tilbury Challenge Simulator</strong> que te guía paso a paso, generándote el nicho, nombres de tienda, y guiones de anuncios exactos para que logres tu primera venta.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Incluido en tu cuenta
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-24 px-6 bg-green-500/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Resultados listos para <span className="text-green-500 italic">escalar</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '24h', label: 'Lanzamiento' },
              { val: '100%', label: 'Optimizado' },
              { val: '+40%', label: 'Conversión' },
              { val: '0', label: 'Experiencia previa' }
            ].map((b, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-green-500">{b.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 md:p-20 text-center space-y-10 border-green-500/20 relative overflow-hidden group bg-gradient-to-br from-black to-green-950/20">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/20 blur-[80px] rounded-full group-hover:bg-green-500/40 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                Empieza tu viaje de dropshipping como <span className="text-green-500 italic">Mark Tilbury</span> hoy mismo
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                No pierdas tiempo diseñando o buscando qué vender. Obtén tu tienda optimizada con productos ganadores y empieza a facturar de inmediato.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-xl hover:invert transition-all">
                Obtener mi tienda GRATIS
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 font-black">A</div>
              <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Antigravity E-commerce © 2026</span>
           </div>
        </div>
      </footer>
    </div>
  )
}
