'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { UserPlus, DollarSign, Zap, Activity } from 'lucide-react'


interface ActivityItem {
  id: string
  type: 'user' | 'payment' | 'execution'
  date: Date
  title_en: string
  title_es: string
}

interface RecentActivityProps {
  recentUsers: any[]
  recentPayments: any[]
  recentExecutions: any[]
}

export function RecentActivity({ recentUsers, recentPayments, recentExecutions }: RecentActivityProps) {
  const { language } = useTranslation()

  // Compile and sort all activities
  const activities: ActivityItem[] = []

  recentUsers?.forEach(u => {
    activities.push({
      id: `u-${u.id}`,
      type: 'user',
      date: new Date(u.created_at),
      title_en: `🆕 ${u.first_name || 'New user'} registered`,
      title_es: `🆕 ${u.first_name || 'Nuevo usuario'} se registró`
    })
  })

  recentPayments?.forEach(p => {
    const amount = p.normalized_payload?.amount || 0
    const email = p.normalized_payload?.customer?.email || 'someone'
    activities.push({
      id: `p-${p.id}`,
      type: 'payment',
      date: new Date(p.created_at),
      title_en: `💰 Payment of $${amount} received from ${email}`,
      title_es: `💰 Pago de $${amount} recibido de ${email}`
    })
  })

  recentExecutions?.forEach(e => {
    const userName = e.users?.first_name || 'A user'
    const appNameEn = e.micro_apps?.name_en || 'an App'
    const appNameEs = e.micro_apps?.name_es || 'una App'
    activities.push({
      id: `e-${e.id}`,
      type: 'execution',
      date: new Date(e.created_at),
      title_en: `🤖 ${userName} used ${appNameEn}`,
      title_es: `🤖 ${userName} usó ${appNameEs}`
    })
  })

  // Sort descending by date and take top 10
  const sortedActivities = activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserPlus className="w-5 h-5 text-primary" />
      case 'payment': return <DollarSign className="w-5 h-5 text-emerald-400" />
      case 'execution': return <Zap className="w-5 h-5 text-accent-cyan" />
      default: return <Activity className="w-5 h-5 text-white" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-primary/20 border-primary/20'
      case 'payment': return 'bg-emerald-400/20 border-emerald-400/20'
      case 'execution': return 'bg-accent-cyan/20 border-accent-cyan/20'
      default: return 'bg-white/10 border-white/10'
    }
  }

  const getRelativeTime = (date: Date, lang: string) => {
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    
    const rtf = new Intl.RelativeTimeFormat(lang === 'en' ? 'en' : 'es', { numeric: 'auto' })
    
    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second')
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute')
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return rtf.format(-diffInHours, 'hour')
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return rtf.format(-diffInDays, 'day')
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month')
    const diffInYears = Math.floor(diffInMonths / 12)
    return rtf.format(-diffInYears, 'year')
  }

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-accent-pink" />
        {language === 'en' ? 'Recent Activity' : 'Actividad Reciente'}
      </h2>
      
      {sortedActivities.length === 0 ? (
        <p className="text-white/50 text-sm italic">{language === 'en' ? 'No recent activity.' : 'Sin actividad reciente.'}</p>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border ${getColor(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                <p className="text-white text-sm font-medium">
                  {language === 'en' ? item.title_en : item.title_es}
                </p>
              </div>
              <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider shrink-0 whitespace-nowrap self-end sm:self-auto">
                {getRelativeTime(item.date, language)}
              </p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
