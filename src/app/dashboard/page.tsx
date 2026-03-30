'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { Users, Activity, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Zap } from 'lucide-react'

// Dummy internal metrics arrays to prevent hydration mismatches
const DUMMY_CHART_BARS = [35, 60, 45, 80, 55, 90, 75]
const DUMMY_CHART_LINE = [20, 30, 25, 45, 40, 65, 55, 75, 70, 90, 85, 100]

export default function DashboardPage() {
  const { language } = useTranslation()
  const { toast } = useToast()

  const handleQuickAction = () => {
    toast({ 
      title: language === 'en' ? 'Report generated successfully' : 'Reporte generado con éxito', 
      type: 'success' 
    })
  }

  const handleDeploy = () => {
    toast({ 
      title: language === 'en' ? 'Deploy initialized' : 'Despliegue inicializado', 
      type: 'info' 
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            {language === 'en' ? 'Dashboard Overview' : 'Resumen del Panel'}
          </h1>
          <p className="text-base-content/60 text-sm">
            {language === 'en' ? 'Welcome back, here is what is happening today.' : 'Bienvenido de nuevo, esto es lo que está pasando hoy.'}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <GlowButton variant="ghost" onClick={handleQuickAction} className="py-2.5! px-4! text-sm!">
            {language === 'en' ? 'Generate Report' : 'Generar Reporte'}
          </GlowButton>
          <GlowButton onClick={handleDeploy} className="py-2.5! px-5! text-sm! gap-2!">
            <Zap className="w-4 h-4" />
            {language === 'en' ? 'Deploy App' : 'Desplegar App'}
          </GlowButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
            </span>
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-medium mb-1">{language === 'en' ? 'Total Users' : 'Usuarios Totales'}</p>
            <h3 className="text-2xl font-bold text-white">24,593</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-accent-pink/20 text-accent-pink rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 8.2%
            </span>
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-medium mb-1">{language === 'en' ? 'Active Sessions' : 'Sesiones Activas'}</p>
            <h3 className="text-2xl font-bold text-white">8,342</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-accent-blue/20 text-accent-blue rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" /> 3.1%
            </span>
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-medium mb-1">{language === 'en' ? 'Conversions' : 'Conversiones'}</p>
            <h3 className="text-2xl font-bold text-white">4.3%</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-accent-warm/20 text-accent-warm rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 24.8%
            </span>
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-medium mb-1">{language === 'en' ? 'Revenue' : 'Ingresos'}</p>
            <h3 className="text-2xl font-bold text-white">$143,204</h3>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Traffic Overview' : 'Resumen de Tráfico'}</h3>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-lg text-base-content/60 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-64 relative flex items-end justify-between gap-2 overflow-hidden px-2 pb-6 border-b border-white/5">
            {/* Fake line chart using CSS polygon */}
            <div className="absolute inset-0 bottom-6 px-2 flex items-end z-0">
              <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 Q10,70 20,75 T40,55 T60,60 T80,35 T100,25 T120,40 L120,100 L0,100 Z" 
                  fill="url(#lineGrad)"
                  vectorEffect="non-scaling-stroke"
                  transform="scale(1, 1)"
                  style={{ transformOrigin: 'bottom', transform: 'scale(1, 0.9)' }} 
                />
                <path 
                  d="M0,80 Q10,70 20,75 T40,55 T60,60 T80,35 T100,25 T120,40" 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            {/* Fake X-axis labels */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between px-4 text-xs font-mono text-base-content/40">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Device Sessions' : 'Sesiones por Dispositivo'}</h3>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 px-2 pt-10">
            {DUMMY_CHART_BARS.map((h, i) => (
              <div key={i} className="flex-1 relative group flex items-end" style={{ height: '100%' }}>
                <div 
                  className="w-full bg-accent-pink/50 rounded-t-sm group-hover:bg-accent-pink transition-colors relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 inset-x-0 text-center text-xs opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white">
                    {h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 text-xs text-base-content/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-pink"></span> Mobile
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Desktop
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Recent Activity' : 'Actividad Reciente'}</h3>
          <button className="text-sm font-medium text-primary hover:text-accent-pink transition-colors">
            {language === 'en' ? 'View All' : 'Ver Todo'}
          </button>
        </div>
        <div className="p-0">
          {[
            { id: 1, name: 'Alice Cooper', email: 'alice@example.com', actionEn: 'created a new project', actionEs: 'creó un nuevo proyecto', time: '2 mins ago', initial: 'A', bg: 'bg-primary/20 text-primary' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', actionEn: 'deployed the main application', actionEs: 'desplegó la aplicación principal', time: '1 hr ago', initial: 'B', bg: 'bg-accent-blue/20 text-accent-blue' },
            { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', actionEn: 'updated billing settings', actionEs: 'actualizó la facturación', time: '3 hrs ago', initial: 'C', bg: 'bg-accent-warm/20 text-accent-warm' },
          ].map((item, idx, arr) => (
            <div key={item.id} className={`flex items-start gap-4 p-6 hover:bg-white/[0.02] transition-colors ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg shrink-0 ${item.bg}`}>
                {item.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white mb-0.5">
                  <span className="font-semibold">{item.name}</span>{' '}
                  <span className="text-base-content/70">{language === 'en' ? item.actionEn : item.actionEs}</span>
                </p>
                <p className="text-xs text-base-content/50">{item.email}</p>
              </div>
              <div className="shrink-0 text-xs text-base-content/40 font-medium">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
