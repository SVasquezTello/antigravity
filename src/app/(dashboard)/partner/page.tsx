'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Zap,
  ArrowRight,
  DollarSign,
  Activity,
  ArrowUpRight,
  Download
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'

export default function PartnerDashboard() {
  const { language } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  const [stats, setStats] = useState({ clients: 0, activeUsers: 0, revenue: 0, growth: 12.5 })
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchPartnerData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Clients
      const { data: clientData } = await supabase.from('workspaces').select('*')
      if (clientData) {
        setClients(clientData)
        setStats(prev => ({ ...prev, clients: clientData.length, revenue: clientData.length * 450 }))
      }

      // Mock Chart Data for Revenue & Usage
      const mockData = [
        { name: 'Jan', revenue: 4000, usage: 2400 },
        { name: 'Feb', revenue: 3000, usage: 1398 },
        { name: 'Mar', revenue: 2000, usage: 9800 },
        { name: 'Apr', revenue: 2780, usage: 3908 },
        { name: 'May', revenue: 1890, usage: 4800 },
        { name: 'Jun', revenue: 2390, usage: 3800 },
      ]
      setChartData(mockData)
      setLoading(false)
    }
    fetchPartnerData()
  }, [supabase])

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{language === 'en' ? 'Enterprise Partner' : 'Socio Corporativo'}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            {language === 'en' ? 'Partner' : 'Panel de'} <br/>
            <span className="text-primary italic">Intelligence</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 border border-white/10 transition-all">
              <Download className="w-4 h-4" /> Export Report
           </button>
        </div>
      </header>

      {/* --- Key Metrics --- */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: stats.clients, icon: Users, color: 'text-blue-400' },
          { label: 'Revenue (MRR)', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
          { label: 'Avg Usage', value: '84%', icon: Activity, color: 'text-purple-400' },
          { label: 'Growth', value: `+${stats.growth}%`, icon: TrendingUp, color: 'text-primary' }
        ].map((s, idx) => (
          <motion.div key={idx} variants={item}>
            <GlassCard className="p-6 space-y-4 border-white/5 relative overflow-hidden group">
               <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+4%</span>
               </div>
               <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter">{s.value}</h3>
               </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Performance Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-8 space-y-8 border-white/5">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Revenue & Usage Trajectory</h3>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         <GlassCard className="p-8 border-white/5 flex flex-col justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic mb-8">Top Performing Clients</h3>
            <div className="space-y-4">
              {clients.length === 0 ? (
                <p className="text-xs text-white/20 italic">No clients active</p>
              ) : (
                clients.slice(0, 5).map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{c.name}</h4>
                        <div className="h-1 w-24 bg-white/5 rounded-full mt-1">
                           <div className="h-full bg-primary rounded-full w-[65%]" />
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-8 py-4 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
               View All Clients
            </button>
         </GlassCard>
      </div>
    </div>
  )
}
