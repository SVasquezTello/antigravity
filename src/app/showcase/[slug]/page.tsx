'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Check, 
  Zap, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Users,
  Smartphone,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AppShowcasePage() {
  const params = useParams()
  const supabase = createClient()
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApp = async () => {
      const { data } = await supabase
        .from('micro_apps')
        .select('*')
        .eq('slug', params.slug)
        .single()
      setApp(data)
      setLoading(false)
    }
    fetchApp()
  }, [params.slug])

  if (loading) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/20 uppercase tracking-[0.5em] font-black italic">Loading Experience...</div>
  if (!app) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/40 uppercase font-black italic">Solution Not Found</div>

  const name = app.name_es || app.name_en
  const description = app.description_es || app.description_en

  // Dynamic Plans based on App Portfolio
  const getAppSpecs = (slug: string) => {
    const specs: Record<string, any> = {
      'tech-support-ai': { basic: 29, premium: 99, features: ['1 Agente', '200 Chats IA', 'WhatsApp', 'Knowledge Base'] },
      'dataflow-analytics': { basic: 39, premium: 149, features: ['3 Dashboards', 'Reportes Simples', '2 Usuarios', 'Exportación PDF'] },
      'smart-quote-pro': { basic: 25, premium: 89, features: ['50 Cotizaciones', 'PDF Básico', '1 Usuario', 'Firma Digital'] },
      'nex-booking': { basic: 19, premium: 79, features: ['1 Sucursal', 'Agenda Simple', '100 Reservas', 'WhatsApp'] },
      'edutech-smart': { basic: 49, premium: 199, features: ['50 Alumnos', 'Cursos Básicos', 'Reportes Simples', 'IA Apoyo'] },
      'quickfood-delivery': { basic: 39, premium: 149, features: ['1 Restaurante', '100 Pedidos', 'Panel Básico', 'WhatsApp'] },
      'market-express': { basic: 49, premium: 199, features: ['300 Productos', '1 Tienda', 'Delivery Local', 'Inventario'] },
      'farmago-delivery': { basic: 59, premium: 249, features: ['1 Farmacia', '200 Pedidos', 'Gestión Recetas', 'Alertas'] },
      'laundry-fast': { basic: 29, premium: 99, features: ['100 Órdenes', '1 Local', 'Agenda Simple', 'Recojo/Entrega'] },
      'multidelivery-pro': { basic: 99, premium: 399, features: ['5 Negocios', '5 Repartidores', 'Comisión Básica', 'Marketplace'] }
    }
    return specs[slug] || { basic: 29, premium: 99, features: ['Acceso Básico', 'Soporte', 'Panel Admin'] }
  }

  const specs = getAppSpecs(params.slug as string)

  const plans = [
    {
      name: 'Básico',
      price: `$${specs.basic}`,
      features: [
        ...specs.features,
        'PWA instalable',
        'Hosting Incluido',
        'Soporte Email'
      ],
      color: 'bg-green-500',
      isPopular: false
    },
    {
      name: 'Premium',
      price: `$${specs.premium}`,
      features: [
        'TODO lo del plan Básico',
        'Uso ILIMITADO',
        'Branding White-Label',
        'Analytics Avanzado',
        'IA Predictiva / Generativa',
        'Soporte Prioritario 24/7'
      ],
      color: 'bg-primary',
      isPopular: true
    }
  ]

  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Zap className="w-6 h-6" /></div>
               <span className="font-black uppercase tracking-[0.2em] text-sm">Antigravity <span className="text-white/20 italic">Showcase</span></span>
            </Link>
            <Link href="/login" className="px-8 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all">Get Started</Link>
        </div>
      </nav>

      <header className="relative pt-48 pb-32 px-6 z-10 text-center">
         <div className="max-w-4xl mx-auto space-y-12">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
            >
               <Sparkles className="w-4 h-4 text-primary" /> Solución Empresarial de Próxima Generación
            </motion.div>
            
            <motion.h1 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase"
            >
               {name} <br/> <span className="text-primary italic">SaaS</span>
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
               className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
            >
               {description}. Automatiza tu negocio y escala con inteligencia artificial integrada.
            </motion.p>
         </div>
      </header>

      {/* --- PRICING SECTION --- */}
      <section className="py-32 px-6 relative z-10">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Planes y Precios</h2>
               <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Elige tu <span className="italic opacity-30">Escala</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
               {plans.map((plan, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                 >
                    <GlassCard className={`p-10 h-full space-y-10 flex flex-col justify-between relative overflow-hidden border-white/5 ${plan.isPopular ? 'border-primary/40 ring-1 ring-primary/20 bg-primary/[0.02]' : ''}`}>
                       {plan.isPopular && (
                         <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl">Recomendado</div>
                       )}
                       
                       <div className="space-y-8">
                          <div className="space-y-2">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">{plan.name}</h4>
                             <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white italic">{plan.price}</span>
                                <span className="text-xs font-bold text-white/20 uppercase tracking-widest">/mes</span>
                             </div>
                          </div>

                          <div className="space-y-4">
                             {plan.features.map((feat, j) => (
                               <div key={j} className="flex items-center gap-3 text-sm font-medium text-white/60">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.isPopular ? 'bg-primary text-white' : 'bg-white/10 text-white/40'}`}>
                                     <Check className="w-3 h-3" />
                                  </div>
                                  {feat}
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="pt-10">
                          <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-xl ${plan.isPopular ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-black'}`}>
                             Seleccionar Plan {plan.name}
                          </button>
                       </div>
                    </GlassCard>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CAPABILITIES --- */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><Smartphone className="w-7 h-7" /></div>
               <h5 className="text-xl font-black uppercase italic">PWA & Mobile Ready</h5>
               <p className="text-white/40 text-sm leading-relaxed">Tus clientes pueden instalar la plataforma directamente en sus móviles como una app nativa con tu logo.</p>
            </div>
            <div className="space-y-6">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><ShieldCheck className="w-7 h-7" /></div>
               <h5 className="text-xl font-black uppercase italic">Infraestructura Segura</h5>
               <p className="text-white/40 text-sm leading-relaxed">Datos encriptados y backups diarios automáticos sobre el protocolo seguro de Antigravity.</p>
            </div>
            <div className="space-y-6">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><Globe className="w-7 h-7" /></div>
               <h5 className="text-xl font-black uppercase italic">Marca Blanca Total</h5>
               <p className="text-white/40 text-sm leading-relaxed">Personaliza dominios, correos, logos y colores para que la herramienta sea 100% tuya.</p>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl">A</div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Antigravity Ecosystem</p>
            </div>
            <p className="text-white/10 text-[9px] font-black uppercase tracking-widest italic">© 2026 Antigravity IA. Todos los derechos reservados.</p>
         </div>
      </footer>

    </div>
  )
}
