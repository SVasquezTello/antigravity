'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react'

interface AdminStatsProps {
  totalUsers: number
  totalUsersWithPlan: number
  totalExecutions: number
  simulatedRevenue: number
}

export function AdminStats({ totalUsers, totalUsersWithPlan, totalExecutions, simulatedRevenue }: AdminStatsProps) {
  const { language } = useTranslation()

  const stats = [
    {
      label: language === 'en' ? 'Total Users' : 'Total Usuarios',
      value: totalUsers,
      icon: <Users className="w-6 h-6 text-primary" />,
      color: 'bg-primary/20'
    },
    {
      label: language === 'en' ? 'Users on Plan' : 'Usuarios con Plan',
      value: totalUsersWithPlan,
      icon: <CreditCard className="w-6 h-6 text-accent-pink" />,
      color: 'bg-accent-pink/20'
    },
    {
      label: language === 'en' ? 'Total Executions' : 'Ejecuciones Totales',
      value: totalExecutions,
      icon: <Activity className="w-6 h-6 text-accent-cyan" />,
      color: 'bg-accent-cyan/20'
    },
    {
      label: language === 'en' ? 'Simulated Revenue' : 'Ingresos Simulados',
      value: `$${simulatedRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      color: 'bg-emerald-400/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-entrance">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="p-6 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-sm font-medium text-white/50">{stat.label}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
