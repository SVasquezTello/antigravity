'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { createClient } from '@/utils/supabase/client'
import { 
  Sparkles, Pencil, Video, Search, FileText, Layout, Lightbulb,
  Zap, Clock, BrainCircuit, Rocket, ChevronRight,
  TrendingUp, Users, Activity, Mail, Share2, Tv, Briefcase
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardChart } from '@/components/ui/DashboardChart'
import { Sparkline } from '@/components/ui/Sparkline'

const ICON_MAP: Record<string, any> = {
  Sparkles, Pencil, Video, Search, FileText, Layout, Lightbulb, Users, Activity, Mail, Share2, Tv, Youtube: Tv, Briefcase
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const { language } = useTranslation()
  const supabase = createClient()
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [mainChartData, setMainChartData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [statsData, setStatsData] = useState({ executions: 0, limit: 50, apps: 0 })

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.log('No user:', authError)
          setErrorMsg('No user found: ' + (authError?.message || 'unknown'))
          setLoading(false)
          return
        }

        // 1. Fetch Apps
        const { data: appData, error: appError } = await supabase
          .from('micro_apps')
          .select('*')
          .order('created_at', { ascending: true })
        if (appError) {
          setErrorMsg('Error fetching apps: ' + appError.message)
        }
        if (appData) {
          setApps(appData)
        }

        // 2. Fetch User Execution Count (this month)
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0,0,0,0)

        const { count } = await supabase
          .from('app_executions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('created_at', startOfMonth.toISOString())
        
        // 3. Fetch Plan Limit securely bypassing cache issues
        const { data: userData } = await supabase
          .from('users')
          .select('plan_id')
          .eq('id', user.id)
          .single()

        let limit = 50;
        if (userData?.plan_id) {
          const { data: planData } = await supabase.from('plans').select('*').eq('id', userData.plan_id).single();
          // Fallback logic in case generations_limit column was missing
          if (planData && 'generations_limit' in planData) {
            limit = (planData as any).generations_limit || 50;
          } else if (planData && (planData as any).price_monthly > 50) {
            limit = 9999;
          }
        }

        setStatsData({ 
          executions: count || 0, 
          limit: limit,
          apps: appData?.length || 0
        })

        // 4. Fetch Daily Stats for Chart
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const { data: dailyData } = await supabase
          .from('app_executions')
          .select('created_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('created_at', sevenDaysAgo.toISOString())

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const chartMap: Record<string, number> = {}
        
        // Init last 7 days
        for(let i=6; i>=0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          chartMap[days[d.getDay()]] = 0
        }

        dailyData?.forEach(ex => {
          const d = new Date(ex.created_at)
          const dayName = days[d.getDay()]
          if (chartMap[dayName] !== undefined) {
            chartMap[dayName]++
          }
        })

        setMainChartData(Object.entries(chartMap).map(([name, value]) => ({ name, value })))

      } catch (err: any) {
        console.error('Fetch error:', err)
        setErrorMsg('Fetch catch error: ' + String(err?.message || err))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  const stats = [
    { 
      label: language === 'en' ? 'AI Generations' : 'Generaciones IA', 
      value: `${statsData.executions}/${statsData.limit}`, 
      icon: BrainCircuit, 
      color: 'text-primary', 
      bg: 'bg-primary/20', 
      trend: statsData.limit ? `${Math.round((statsData.executions / statsData.limit) * 100)}%` : '0%',
      chart: [{v: 10}, {v: 40}, {v: 30}, {v: 60}, {v: 50}, {v: 80}]
    },
    { 
      label: language === 'en' ? 'Time Saved' : 'Tiempo Ahorrado', 
      value: `${Math.round((statsData.executions * 20) / 60)}h`, 
      icon: Clock, 
      color: 'text-accent-pink', 
      bg: 'bg-accent-pink/20', 
      trend: '+24%',
      chart: [{v: 20}, {v: 30}, {v: 25}, {v: 100}, {v: 45}, {v: 70}]
    },
    { 
      label: language === 'en' ? 'Active Apps' : 'Apps Activas', 
      value: statsData.apps.toString(), 
      icon: Zap, 
      color: 'text-accent-blue', 
      bg: 'bg-accent-blue/20', 
      trend: 'Static',
      chart: [{v: 10}, {v: 10}, {v: 12}, {v: 12}, {v: 14}, {v: 15}]
    },
    { 
      label: language === 'en' ? 'Efficiency Score' : 'Puntaje Eficiencia', 
      value: '98%', 
      icon: TrendingUp, 
      color: 'text-accent-warm', 
      bg: 'bg-accent-warm/20', 
      trend: '+8%',
      chart: [{v: 50}, {v: 60}, {v: 55}, {v: 70}, {v: 80}, {v: 95}]
    }
  ]

  if (!mounted) return null

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-12">
      {/* Eric's Sober Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-8 md:p-12 space-y-8"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-2 uppercase tracking-tight">
            <h1 className="text-4xl md:text-6xl font-black text-[#00A3E0]">
              ANTIGRAVITY
            </h1>
            <span className="text-4xl md:text-6xl font-light text-white">PORTAL</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-white/50 text-lg">
            <p>{language === 'en' ? 'Access your AI tools with cutting-edge technology and premium design.' : 'Accede a tus herramientas de IA con tecnología de última generación y diseño premium.'}</p>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="text-sm font-bold text-primary px-3 py-1 rounded-md bg-white/5 border border-white/10">
              V1.0.4 - LIVE
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((s, idx) => (
          <motion.div key={idx} variants={item}>
            <GlassCard className="p-6 group hover:translate-y-[-4px] transition-all bg-white/[0.02]">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <Sparkline data={s.chart} color={`var(--color-accent-${s.color.split('-').pop()})`} />
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                    {s.trend}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-white">{s.value}</h3>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Insight Component */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <DashboardChart data={mainChartData} />
      </motion.div>

      {/* Available Apps Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center p-2">
               <Layout className="w-6 h-6 text-primary" />
            </div>
            {language === 'en' ? 'Select Your Catalyst' : 'Selecciona tu Catalizador'}
          </h2>
          <div className="h-px flex-1 bg-white/5 mx-8 hidden lg:block" />
          <div className="flex items-center gap-3 text-xs font-bold text-white/20 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {apps.length} {language === 'en' ? 'Apps Available' : 'Apps Disponibles'}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            Error: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="glass-card h-80 w-full animate-pulse bg-white/5 rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {apps.map((app) => {
              const IconComp = ICON_MAP[app.icon] || Sparkles
              return (
                <motion.div key={app.slug} variants={item}>
                  <Link href={`/apps/${app.slug}`}>
                    <GlassCard className="group h-full p-8 flex flex-col relative overflow-hidden active:scale-[0.98] transition-all bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/10 rounded-[2rem]">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl group-hover:shadow-primary/40">
                          <IconComp className="w-8 h-8" />
                        </div>
                        
                        <div className="space-y-4 flex-1">
                          <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight">
                            {language === 'en' ? app.name_en : app.name_es}
                          </h3>
                          <p className="text-sm text-white/50 font-medium leading-relaxed line-clamp-3">
                            {language === 'en' ? app.description_en : app.description_es}
                          </p>
                        </div>

                        <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-primary/60 transition-colors">
                            {language === 'en' ? 'Ready to Launch' : 'Listo para Lanzar'}
                          </span>
                          <motion.div 
                            whileHover={{ x: 5 }}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              )
            })}

            <motion.div variants={item} className="glass-card border-dashed border-white/10 bg-transparent p-8 flex flex-col items-center justify-center text-center space-y-6 group rounded-[2rem]">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/5 group-hover:text-white/20 transition-colors">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-white/10 uppercase tracking-widest">
                  {language === 'en' ? 'More Coming Soon' : 'Más próximamente'}
                </p>
                <div className="w-12 h-1 bg-white/5 mx-auto rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10 md:p-14 border-none bg-linear-to-r from-primary/10 via-transparent to-accent-pink/5 flex flex-col lg:flex-row items-center gap-12 rounded-[2.5rem]"
      >
        <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.3)] shrink-0 animate-bounce-slow">
          <Lightbulb className="w-12 h-12 text-primary" />
        </div>
        <div className="flex-1 text-center lg:text-left space-y-4">
          <h4 className="text-3xl font-black text-white tracking-tight">
            {language === 'en' ? 'Did you know?' : '¿Sabías qué?'}
          </h4>
          <p className="text-white/50 text-lg font-medium leading-relaxed max-w-3xl italic">
            {language === 'en' 
              ? 'Each generation is unique. Our algorithm uses Gemini Flash to ensure speed and precision in every click.' 
              : 'Cada generación es única. Nuestro algoritmo utiliza Gemini Flash para garantizar velocidad y precisión en cada clic.'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
