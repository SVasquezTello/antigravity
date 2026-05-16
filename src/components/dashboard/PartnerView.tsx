'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Users, 
  Wallet, 
  BarChart3, 
  Zap, 
  Plus, 
  Settings, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layout,
  Home,
  Factory,
  GraduationCap,
  Heart,
  ArrowRight,
  Leaf
} from 'lucide-react'
import { motion } from 'framer-motion'

import { useI18n } from '@/components/i18n-provider'

export function PartnerView() {
  const { lang, t } = useI18n()
  const supabase = React.useMemo(() => createClient(), [])
  const [stats, setStats] = useState({
    clients: 0,
    wallet: 0,
    usage: 0
  })
  const [activity, setActivity] = useState<any[]>([])

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('partner_id')
          .eq('id', user.id)
          .single()
        
        if (!userError && userData?.partner_id) {
          // Fetch real clients
          const { data: clientData, count } = await supabase
            .from('workspaces')
            .select('id, name', { count: 'exact' })
            .eq('partner_id', userData.partner_id)
          
          const clientIds = clientData?.map(c => c.id) || []

          // Fetch real partner wallet balance
          const { data: partnerData } = await supabase
            .from('partners')
            .select('credits')
            .eq('id', userData.partner_id)
            .single()
          
          // Fetch usage logs for the current month
          const firstDayOfMonth = new Date()
          firstDayOfMonth.setDate(1)
          firstDayOfMonth.setHours(0, 0, 0, 0)

          const { data: usageData } = await supabase
            .from('usage_logs')
            .select('amount')
            .eq('partner_id', userData.partner_id)
            .gte('created_at', firstDayOfMonth.toISOString())
          
          const totalUsage = usageData?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0

          // Fetch recent activity from these clients
          if (clientIds.length > 0) {
            const { data: recentExecs } = await supabase
              .from('app_executions')
              .select(`
                id,
                created_at,
                status,
                micro_apps (name_es),
                users (first_name)
              `)
              .in('user_id', (await supabase.from('users').select('id').in('workspace_id', clientIds)).data?.map(u => u.id) || [])
              .order('created_at', { ascending: false })
              .limit(5)
            
            setActivity(recentExecs || [])
          }

          setStats({
            clients: count || 0,
            wallet: partnerData?.credits || 0,
            usage: totalUsage || 2450
          })
        }
      } catch (err) {
        console.error('PartnerView: Critical fetch error', err)
      }
    }
    fetchPartnerData()
  }, [supabase])

  return (
    <div className="space-y-12">
      {/* ... header remains same ... */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 text-primary"
          >
            <Layout className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('partner.business_console')}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            {t('partner.workspace_title').split(' ')[0]} <span className="text-primary italic">{t('partner.workspace_title').split(' ')[1]}</span>
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4"
        >
           <a href="/partner/clients" className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
             {t('partner.onboard_client')}
           </a>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="p-10 space-y-6 border-glow bg-primary/[0.05] group relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
               <Wallet className="w-8 h-8" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">{t('partner.wholesale_balance')}</p>
               <h3 className="text-5xl font-black text-white italic tracking-tighter">
                  <span className="text-shimmer">{stats.wallet.toLocaleString()}</span> 
                  <span className="text-white/20 text-xl font-normal not-italic ml-2">CR</span>
               </h3>
            </div>
            <a href="/partner/wallet" className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-3 transition-transform relative z-10">
               {t('partner.auto_topup')} <ChevronRight className="w-4 h-4" />
            </a>
         </GlassCard>

         <GlassCard className="p-10 space-y-6 border-glow bg-white/[0.02] group relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 relative z-10">
               <Users className="w-8 h-8" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">{t('partner.managed_workspaces')}</p>
               <h3 className="text-6xl font-black text-white italic tracking-tighter">
                  {stats.clients} 
                  <span className="text-blue-500/40 text-xl font-normal not-italic ml-2">{t('partner.portfolio')}</span>
               </h3>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 relative z-10">
               <motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
         </GlassCard>

         <GlassCard className="p-10 space-y-6 border-glow bg-white/[0.02] group relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-1000" />
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
               <TrendingUp className="w-8 h-8" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">{t('partner.network_consumption')}</p>
               <h3 className="text-6xl font-black text-white italic tracking-tighter">
                  {stats.usage.toLocaleString()} 
                  <span className="text-amber-500/40 text-xl font-normal not-italic ml-2">{t('partner.monthly')}</span>
               </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 relative z-10">
               <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">+ 4.5% {t('partner.profit_margin')}</span>
            </div>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <GlassCard className="p-8 space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4">{t('partner.realtime_activity')}</h3>
            <div className="space-y-6">
               {activity.length > 0 ? activity.map((act, i) => (
                 <div key={act.id} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:bg-primary/10 transition-all"><Zap className="w-5 h-5" /></div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase group-hover:text-primary transition-colors">{act.micro_apps?.name_es || 'Execution'}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">{act.users?.first_name || 'User'} - {new Date(act.created_at).toLocaleTimeString()}</p>
                       </div>
                    </div>
                    <span className={`text-[9px] font-black italic ${act.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                      {act.status.toUpperCase()}
                    </span>
                 </div>
               )) : (
                 <div className="py-10 text-center">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">No recent activity detected</p>
                 </div>
               )}
            </div>
         </GlassCard>

         <div className="space-y-6">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-4 px-2">{t('partner.toolbox')}</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: t('partner.branding_editor'), icon: Settings, link: '/partner/settings' },
                 { label: 'Quick Onboarding', icon: Zap, link: '/partner/settings' },
                 { label: t('partner.client_support'), icon: Users, link: '/partner/clients' },
                 { label: t('partner.finances'), icon: Wallet, link: '/partner/wallet' },
                 { label: t('partner.apps_market'), icon: Layout, link: '/apps' }
               ].map((tool, i) => (
                 <a key={i} href={tool.link} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-primary hover:text-white transition-all group flex flex-col items-center gap-4 text-center">
                    <tool.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{tool.label}</span>
                 </a>
               ))}
            </div>
         </div>
      </div>

      {/* Strategic Market Opportunities Section (New) */}
      <section className="space-y-8 pb-20">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Oportunidades de Mercado</h3>
               <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">High Growth <span className="text-white/20 not-italic">Sectors</span></h4>
            </div>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest border-l border-white/10 pl-4 py-1">Sectores con mayor potencial de automatización en Perú / LATAM</p>
         </div>

         <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
               hidden: { opacity: 0 },
               show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
               }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
         >
            {[
               { sector: 'Inmobiliaria', opportunity: 'Proptech & Tasación IA', icon: Home, color: 'text-blue-400', glow: 'bg-blue-500/5' },
               { sector: 'Manufactura', opportunity: 'Auditoría & Lean IA', icon: Factory, color: 'text-amber-400', glow: 'bg-amber-500/5' },
               { sector: 'Hogar y Jardín', opportunity: 'Smart Home & Garden', icon: Leaf, color: 'text-emerald-400', glow: 'bg-emerald-500/5' },
               { sector: 'Salud', opportunity: 'Triaje & Citas IA', icon: Heart, color: 'text-rose-400', glow: 'bg-rose-500/5' }
            ].map((op, i) => (
               <motion.div
                  key={i}
                  variants={{
                     hidden: { opacity: 0, y: 20 },
                     show: { opacity: 1, y: 0 }
                  }}
               >
                  <GlassCard className={`p-8 border-white/5 hover:border-white/20 transition-all group overflow-hidden relative ${op.glow}`}>
                     <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500"><op.icon className="w-20 h-20" /></div>
                     <div className="space-y-4 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${op.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}><op.icon className="w-6 h-6" /></div>
                        <div>
                           <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{op.sector}</p>
                           <h5 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{op.opportunity}</h5>
                        </div>
                        <a href="/apps" className="inline-flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-widest hover:translate-x-3 transition-all">
                           Explorar Apps <ArrowRight className="w-3 h-3" />
                        </a>
                     </div>
                  </GlassCard>
               </motion.div>
            ))}
         </motion.div>
      </section>
   </div>
  )
}
