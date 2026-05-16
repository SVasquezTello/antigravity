'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  ArrowRight,
  Target,
  Rocket,
  ShieldCheck,
  Calculator,
  Plus,
  Minus,
  MessageSquare,
  ShoppingCart,
  GraduationCap,
  Factory
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

import { useTheme } from '@/components/DynamicThemeProvider'

export default function ScalingSimulator() {
  const { language } = useTranslation()
  const { primaryColor } = useTheme()
  const [currency, setCurrency] = useState<'USD' | 'PEN'>('PEN')
  const [clients, setClients] = useState(10)
  const [fee, setFee] = useState(129)
  const [efficiency, setEfficiency] = useState(35)
  const [results, setResults] = useState({
    monthlyRevenue: 0,
    annualRevenue: 0,
    timeSaved: 0,
    profitMargin: 85
  })
  const [projection, setProjection] = useState<any[]>([])

  useEffect(() => {
    const monthly = clients * fee
    const annual = monthly * 12
    const hours = clients * (efficiency / 100) * 160 // Based on 160h work month
    
    setResults({
      monthlyRevenue: monthly,
      annualRevenue: annual,
      timeSaved: Math.round(hours),
      profitMargin: 85 + (clients > 50 ? 5 : 0)
    })

    // Generate 12-month projection
    const data = []
    for (let i = 1; i <= 12; i++) {
      const growthFactor = 1 + (i * 0.15) // 15% monthly growth simulation
      data.push({
        month: `Month ${i}`,
        revenue: Math.round(monthly * growthFactor),
        savings: Math.round(monthly * growthFactor * 0.4)
      })
    }
    setProjection(data)
  }, [clients, fee, efficiency])

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Calculator className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{language === 'en' ? 'Growth Strategy' : 'Estrategia de Crecimiento'}</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Scaling <span className="text-primary italic">Simulator</span>
        </h1>
        <p className="text-white/40 text-sm max-w-2xl font-medium">
          {language === 'en' 
            ? 'Project your earnings and operational impact as you scale your industrial SaaS ecosystem.' 
            : 'Proyecta tus ganancias e impacto operativo mientras escalas tu ecosistema SaaS industrial.'}
        </p>

        {/* Currency Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-white/10">
          {['PEN', 'USD'].map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr as any)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${currency === curr ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60'}`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* --- Strategic Presets (New) --- */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pt-4">
           {[
             { label: 'Hogar y Jardín', fee: 129, efficiency: 70, icon: Zap },
             { label: 'Delivery Agency', fee: 149, efficiency: 65, icon: Rocket },
             { label: 'AI Support SaaS', fee: 99, efficiency: 85, icon: MessageSquare },
             { label: 'Industrial Analytics', fee: 450, efficiency: 90, icon: Factory }
           ].map((preset, idx) => (
             <motion.button
               key={idx}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 setFee(preset.fee)
                 setEfficiency(preset.efficiency)
               }}
               className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 whitespace-nowrap group hover:bg-primary hover:border-primary transition-all"
             >
               <preset.icon className="w-4 h-4 text-primary group-hover:text-white" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{preset.label}</span>
             </motion.button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Controls --- */}
        <div className="space-y-6">
          <GlassCard className="p-8 space-y-10 border-white/5">
             <h3 className="text-sm font-black text-white uppercase tracking-widest italic">{language === 'en' ? 'Core Variables' : 'Variables Clave'}</h3>
             
             {/* Clients Slider */}
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{language === 'en' ? 'Total Clients' : 'Clientes Totales'}</p>
                   <span className="text-xl font-black text-primary italic">{clients}</span>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={() => setClients(Math.max(1, clients - 5))} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all"><Minus className="w-4 h-4" /></button>
                   <input type="range" min="1" max="500" value={clients} onChange={(e) => setClients(parseInt(e.target.value))} className="flex-1 accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
                   <button onClick={() => setClients(clients + 5)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                </div>
             </div>

             {/* Fee Slider */}
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{language === 'en' ? 'Monthly Fee' : 'Cuota Mensual'}</p>
                   <span className="text-xl font-black text-white italic">{currency === 'PEN' ? 'S/' : '$'}{fee}</span>
                </div>
                <input type="range" min="100" max="5000" step="50" value={fee} onChange={(e) => setFee(parseInt(e.target.value))} className="w-full accent-white h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             {/* Efficiency Slider */}
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{language === 'en' ? 'Efficiency Boost' : 'Aumento de Eficiencia'}</p>
                   <span className="text-xl font-black text-accent-blue italic">{efficiency}%</span>
                </div>
                <input type="range" min="10" max="95" value={efficiency} onChange={(e) => setEfficiency(parseInt(e.target.value))} className="w-full accent-accent-blue h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="pt-6 border-t border-white/5">
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                   <Rocket className="w-4 h-4" /> {language === 'en' ? 'Save Strategy' : 'Guardar Estrategia'}
                </button>
             </div>
          </GlassCard>

          <GlassCard className="p-8 border-accent-pink/20 bg-accent-pink/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><Target className="w-16 h-16" /></div>
             <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">{language === 'en' ? 'Expansion Insight' : 'Perspectiva de Expansión'}</h4>
             <p className="text-xs text-white/60 leading-relaxed font-medium">
                {clients > 100 
                  ? (language === 'en' ? 'You are reaching Enterprise scale. Automating client onboarding will increase profit margins by 12%.' : 'Estás alcanzando escala Enterprise. Automatizar el onboarding aumentará márgenes un 12%.')
                  : (language === 'en' ? 'Focus on high-value niche segments to maximize your fee per client in the early stages.' : 'Enfócate en segmentos de nicho de alto valor para maximizar tu cuota por cliente en etapas tempranas.')}
             </p>
          </GlassCard>
        </div>

        {/* --- Results --- */}
        <div className="lg:col-span-2 space-y-8">
           <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Monthly MRR', value: `${currency === 'PEN' ? 'S/' : '$'}${results.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', glow: 'shadow-green-500/10' },
                 { label: 'Annual Revenue', value: `${currency === 'PEN' ? 'S/' : '$'}${results.annualRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', glow: 'shadow-primary/10' },
                 { label: 'Monthly Hours Saved', value: `${results.timeSaved}h`, icon: Zap, color: 'text-accent-blue', glow: 'shadow-blue-500/10' }
               ].map((res, i) => (
                 <motion.div key={i} variants={item}>
                    <GlassCard className={`p-8 space-y-4 border-white/5 hover:border-white/20 transition-all relative overflow-hidden group ${res.glow}`}>
                       <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                       <div className={`p-3 w-fit rounded-xl bg-white/5 ${res.color} shadow-lg relative z-10`}>
                          <res.icon className="w-6 h-6" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{res.label}</p>
                          <h3 className="text-3xl font-black text-white italic tracking-tighter">{res.value}</h3>
                       </div>
                    </GlassCard>
                 </motion.div>
               ))}
           </motion.div>

           <GlassCard className="p-10 space-y-10 border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest italic">{language === 'en' ? '12-Month Projection' : 'Proyección a 12 Meses'}</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{language === 'en' ? 'Compounding growth simulation' : 'Simulación de crecimiento compuesto'}</p>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Revenue
                 </div>
              </div>

              <div className="h-[400px] w-full relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projection}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4}/>
                             <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                       <XAxis dataKey="month" stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                       <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${currency === 'PEN' ? 'S/' : '$'}${val/1000}k`} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#050014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px' }}
                          itemStyle={{ color: '#FFF', fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="revenue" stroke={primaryColor} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                       <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-white italic">{language === 'en' ? 'Optimized Profit Margin' : 'Margen de Beneficio Optimizado'}</h4>
                       <p className="text-xs text-white/40 font-medium">{language === 'en' ? 'Scaling reduces overhead per client' : 'Escalar reduce los costos fijos por cliente'}</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right">
                    <span className="text-5xl font-black text-white italic tracking-tighter">{results.profitMargin}%</span>
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1">Efficient Scale</p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  )
}
