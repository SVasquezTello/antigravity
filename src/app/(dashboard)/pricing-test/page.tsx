'use client'

import { PricingCard } from '@/components/apps/PricingCard'

export default function PricingTestPage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Planes y Precios</h2>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Escala tu impacto con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-pink">Inteligencia Activa</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Elige el nivel de potencia que tu empresa necesita. Desde herramientas especializadas hasta la suite completa de IA industrial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan Especialista */}
          <PricingCard 
            appName="ForgeAI"
            title="Especialista ForgeAI"
            price="$19.99"
            features={[
              "Acceso total a módulos de Manufactura",
              "50 análisis de IA al mes",
              "Alertas de mantenimiento preventivo",
              "Soporte vía chat",
              "Dashboard básico de ROI"
            ]}
          />

          {/* Plan Enterprise (Popular) */}
          <PricingCard 
            appName="Antigravity Suite"
            title="Enterprise Suite"
            price="$49.99"
            isPopular={true}
            features={[
              "Acceso a las 4 verticales (Forge, Edu, Lex, Prop)",
              "Análisis de IA ilimitados",
              "Informes PDF profesionales con marca blanca",
              "Soporte prioritario 24/7",
              "API para integración personalizada",
              "Gestión de múltiples usuarios"
            ]}
          />

          {/* Plan Lite */}
          <PricingCard 
            appName="Antigravity Lite"
            title="Básico"
            price="$0.00"
            features={[
              "Calculadoras de ROI básicas",
              "Visualización de datos públicos",
              "1 análisis de IA de cortesía",
              "Acceso a la comunidad"
            ]}
          />
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            ¿Necesitas una solución personalizada para más de 100 usuarios? 
            <span className="text-primary font-bold ml-2 cursor-pointer hover:underline">Contactar con Ventas</span>
          </p>
        </div>
      </div>
    </div>
  )
}
