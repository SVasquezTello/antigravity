'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  X, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from 'lucide-react'

interface TopupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number) => void
}

export function TopupModal({ isOpen, onClose, onSuccess }: TopupModalProps) {
  const [selectedPack, setSelectedPack] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const packs = [
    { id: 1, label: 'Starter', credits: 1000, price: 50, bonus: '0%' },
    { id: 2, label: 'Growth', credits: 5000, price: 200, bonus: '10%', popular: true },
    { id: 3, label: 'Enterprise', credits: 20000, price: 700, bonus: '25%' }
  ]

  const handlePurchase = async () => {
    if (!selectedPack) return
    setLoading(true)
    
    // Simulate Payment
    setTimeout(() => {
      const pack = packs.find(p => p.id === selectedPack)
      if (pack) onSuccess(pack.price)
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-10 space-y-10">
              <header className="flex justify-between items-start">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Recharge <span className="text-primary">Credits</span></h2>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Wholesale inventory for your client network</p>
                 </div>
                 <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-white/20 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {packs.map((pack) => (
                   <button 
                     key={pack.id}
                     onClick={() => setSelectedPack(pack.id)}
                     className={`p-6 rounded-3xl border transition-all text-left relative flex flex-col justify-between h-48 ${selectedPack === pack.id ? 'bg-primary border-primary' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                   >
                      {pack.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Most Popular</span>
                      )}
                      <div>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${selectedPack === pack.id ? 'text-white/60' : 'text-white/20'}`}>{pack.label}</p>
                         <h3 className="text-2xl font-black text-white italic mt-1">{pack.credits.toLocaleString()} <span className="text-xs opacity-40">CR</span></h3>
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-black text-white">${pack.price}</p>
                         <p className={`text-[9px] font-bold ${selectedPack === pack.id ? 'text-white/40' : 'text-green-500'}`}>{pack.bonus} Bonus Included</p>
                      </div>
                   </button>
                 ))}
              </div>

              <GlassCard className="p-8 bg-white/5 border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
                       <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Default Payment Method</p>
                       <p className="text-sm font-bold text-white uppercase italic">•••• •••• •••• 4022</p>
                    </div>
                 </div>
                 <ShieldCheck className="w-6 h-6 text-primary" />
              </GlassCard>

              <button 
                onClick={handlePurchase}
                disabled={!selectedPack || loading}
                className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 hover:invert transition-all active:scale-95 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                 Confirm Purchase
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
