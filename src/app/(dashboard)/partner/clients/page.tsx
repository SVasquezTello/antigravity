'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/components/ui/ToastProvider'
import { 
  Users, 
  Search, 
  ExternalLink, 
  Power, 
  Activity,
  BarChart,
  Eye,
  Loader2,
  Building
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PartnerClientsPage() {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: userData } = await supabase.from('users').select('partner_id').eq('id', user.id).single()
      if (userData?.partner_id) {
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', userData.partner_id)
          .order('name', { ascending: true })
        if (data) setClients(data)
      }
      setLoading(false)
    }
    fetchClients()
  }, [supabase])

  const handleSuplantar = (clientId: string, clientName: string) => {
    localStorage.setItem('is_impersonating', 'true')
    localStorage.setItem('impersonating_user_name', clientName)
    localStorage.setItem('impersonating_user_id', clientId)
    
    toast({ 
      title: `Entering Support Mode`, 
      description: `Viewing workspace as ${clientName}`,
      type: 'success' 
    })
    
    router.push('/apps')
  }

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="p-8 animate-pulse text-white/20">Loading Clients...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Building className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Portfolio Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Client <span className="text-primary italic">Workspaces</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary outline-none"
              />
           </div>
           <button className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20"><Building className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-8 space-y-6 group hover:border-primary/40 transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                    <Building className="w-6 h-6" />
                 </div>
                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                    client.status === 'active' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'
                 }`}>
                    {client.status || 'Active'}
                 </span>
              </div>

              <div>
                 <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">ID: {client.id.substring(0, 8)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase mb-1">Users</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-3 h-3 text-primary" /> 12</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase mb-1">Usage</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2"><Activity className="w-3 h-3 text-primary" /> 450</p>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button 
                  onClick={() => handleSuplantar(client.id, client.name)}
                  className="flex-1 py-3 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                    <Eye className="w-4 h-4" />
                    Support
                 </button>
                 <button className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                    <Power className="w-4 h-4" />
                 </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
