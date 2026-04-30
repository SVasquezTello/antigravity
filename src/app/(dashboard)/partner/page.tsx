'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Zap,
  ArrowRight
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function PartnerDashboard() {
  const { language } = useTranslation()
  const supabase = createClient()
  const [stats, setStats] = useState({ clients: 0, activeUsers: 0, revenue: '$0' })
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartnerData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // En un entorno real, aquí filtraríamos por partner_id del usuario
      // Por ahora, traemos el resumen para demostrar la UI
      const { data: clientData } = await supabase.from('clients').select('*')
      if (clientData) {
        setClients(clientData)
        setStats(prev => ({ ...prev, clients: clientData.length }))
      }
      setLoading(false)
    }
    fetchPartnerData()
  }, [supabase])

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Building2 className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-widest">{language === 'en' ? 'Partner Portal' : 'Portal de Socios'}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
          {language === 'en' ? 'Managing Your' : 'Gestionando tu'} <br/>
          <span className="text-primary italic">Ecosystem</span>
        </h1>
      </header>

      {/* --- Quick Stats --- */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Clients', value: stats.clients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Revenue (MRR)', value: stats.revenue, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Active Apps', value: '269', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
        ].map((s, idx) => (
          <motion.div key={idx} variants={item} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-white">{s.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Clients List --- */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          {language === 'en' ? 'Your Clients' : 'Tus Clientes'}
        </h2>

        {loading ? (
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
        ) : clients.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-4">
            <p className="text-white/30 font-medium">{language === 'en' ? 'No clients assigned yet.' : 'Aún no tienes clientes asignados.'}</p>
            <button className="px-6 py-3 bg-primary text-white rounded-full font-bold text-sm">
              {language === 'en' ? '+ Add First Client' : '+ Añadir primer cliente'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(c => (
              <div key={c.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-white/40">ID: {c.id.slice(0,8)}...</p>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-white/10 text-white/20 hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
