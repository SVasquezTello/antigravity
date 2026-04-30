'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Zap, 
  Clock, 
  Activity,
  FileDown
} from 'lucide-react'
import { motion } from 'framer-motion'

const COLORS = ['#7C3AED', '#EC4899', '#38BDF8', '#F97316']

export default function AnalyticsPage() {
  const { language, t } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    timeSaved: 0,
    successRate: 0,
    growth: 0
  })
  const [distribution, setDistribution] = useState<any[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Fetch historical executions (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: execs } = await supabase
        .from('app_executions')
        .select('created_at, status, micro_apps(name_en, name_es, slug)')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (execs) {
        // Group by day for the chart
        const dailyGrouped = execs.reduce((acc: any, curr: any) => {
          const date = new Date(curr.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})

        const chartData = Object.keys(dailyGrouped).map(key => ({
          date: key,
          count: dailyGrouped[key]
        }))

        setData(chartData)

        // Calculate App Distribution
        const appGrouped = execs.reduce((acc: any, curr: any) => {
          const appName = language === 'en' ? curr.micro_apps?.name_en : curr.micro_apps?.name_es
          const name = appName || curr.micro_apps?.slug || 'Unknown'
          acc[name] = (acc[name] || 0) + 1
          return acc
        }, {})

        const distData = Object.keys(appGrouped)
          .map(name => ({ name, value: appGrouped[name] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5) // Top 5

        setDistribution(distData)

        // Calculate Stats
        const total = execs.length
        const success = execs.filter((e: any) => e.status === 'completed').length
        setStats({
          total,
          timeSaved: Math.round((success * 15) / 60), // 15 mins saved per successful execution
          successRate: total > 0 ? Math.round((success / total) * 100) : 0,
          growth: 12 // Simulated for now
        })
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [supabase, language])

  const handleCsvExport = () => {
    if (data.length === 0) return
    const headers = ['Date', 'Executions']
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.date},${row.count}`)
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `antigravity_analytics_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportReport = () => {
    window.print()
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Activity className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Business Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            {t('analytics.subtitle')} <span className="text-primary italic">{t('analytics.title')}</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           <button onClick={handleCsvExport} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 border border-white/10 transition-all">
              <Download className="w-5 h-5" />
              CSV
           </button>
           <button onClick={handleExportReport} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-primary/20">
              <FileDown className="w-5 h-5" />
              {t('analytics.export_report')}
           </button>
        </div>
      </header>

      {/* --- Key Metrics --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: t('analytics.total_executions'), value: stats.total, icon: Zap, color: 'text-primary' },
           { label: t('analytics.time_saved'), value: `${stats.timeSaved}h`, icon: Clock, color: 'text-accent-pink' },
           { label: t('analytics.success_rate'), value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-accent-blue' },
           { label: t('analytics.intelligence_index'), value: 'High', icon: Activity, color: 'text-accent-warm' }
         ].map((stat, i) => (
           <GlassCard key={i} className="p-6">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
             </div>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-white">{stat.value}</h3>
           </GlassCard>
         ))}
      </div>

      {/* --- Main Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-8 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-white uppercase tracking-widest">{t('analytics.usage_history')}</h3>
               <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                  <Calendar className="w-4 h-4" /> {t('analytics.last_30_days')}
               </div>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#FFF', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="var(--color-primary)" 
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

          <GlassCard className="p-8 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-8">{t('analytics.app_distribution')}</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution.length > 0 ? distribution : [{ name: 'No Data', value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      {distribution.length === 0 && <Cell fill="rgba(255,255,255,0.05)" />}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#050014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       itemStyle={{ color: '#FFF', fontSize: '12px' }}
                    />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-8">
               {distribution.map((item, i) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-[70%]">
                       <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-[10px] text-white/60 font-bold uppercase truncate tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs text-white font-black">{item.value}</span>
                 </div>
               ))}
               {distribution.length === 0 && (
                 <p className="text-[10px] text-white/20 font-black uppercase text-center py-4">{t('analytics.no_data')}</p>
               )}
            </div>
          </GlassCard>
      </div>
    </div>
  )
}
