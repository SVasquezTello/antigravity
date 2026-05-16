'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTheme } from '@/components/DynamicThemeProvider'
import { Check, Palette, Smartphone, Laptop, Layout } from 'lucide-react'
import { motion } from 'framer-motion'

const PRESETS = [
  { name: 'Deep Space', color: '#7C3AED' },
  { name: 'Emerald AI', color: '#10B981' },
  { name: 'Sunset Core', color: '#F97316' },
  { name: 'Oceanic Node', color: '#0EA5E9' },
  { name: 'Gothic Rose', color: '#E11D48' }
]

/**
 * 25.2 Live Theme Generator & 25.3 Preview
 * Allows partners to visualize their branding instantly
 */
export function BrandingLab({ initialConfig, onConfigChange }: { initialConfig: any, onConfigChange: (config: any) => void }) {
  const { primaryColor, setPrimaryColor, brandingConfig, setBrandingConfig } = useTheme()
  const [selectedColor, setSelectedColor] = useState(initialConfig?.primaryColor || primaryColor)
  const [previewMode, setPreviewMode] = useState<'dashboard' | 'login'>('dashboard')

  const handleColorPick = (color: string) => {
    setSelectedColor(color)
    setPrimaryColor(color) // Live Preview!
    onConfigChange({ ...brandingConfig, primaryColor: color })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
      {/* Controls */}
      <div className="space-y-8">
        <div className="space-y-4">
           <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Signature Color</p>
           <div className="flex gap-4">
              <input 
                type="color" 
                value={selectedColor} 
                onChange={(e) => handleColorPick(e.target.value)}
                className="w-16 h-16 bg-transparent border-none cursor-pointer rounded-2xl overflow-hidden" 
              />
              <input 
                type="text" 
                value={selectedColor.toUpperCase()} 
                readOnly
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-center" 
              />
           </div>
        </div>

        <div className="space-y-4">
           <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Identity Presets</p>
           <div className="grid grid-cols-2 gap-3">
              {PRESETS.map(preset => (
                <button 
                   key={preset.name}
                   onClick={() => handleColorPick(preset.color)}
                   className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 items-center hover:scale-105 active:scale-95 ${selectedColor === preset.color ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                >
                   <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: preset.color }} />
                   <span className="text-[8px] font-black uppercase text-white/40">{preset.name}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-4 pt-4">
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Edge Rounding</p>
              <span className="text-[10px] font-mono text-primary font-bold">{brandingConfig.radius || '1.5rem'}</span>
           </div>
           <input 
             type="range" min="0" max="3" step="0.25" 
             defaultValue={parseFloat(brandingConfig.radius || '1.5')}
             onChange={(e) => {
               const val = `${e.target.value}rem`;
               const newConfig = { ...brandingConfig, radius: val };
               setBrandingConfig(newConfig);
               onConfigChange(newConfig);
             }}
             className="w-full accent-primary bg-white/5 rounded-full h-2 cursor-pointer" 
           />
           <div className="flex justify-between text-[8px] font-black text-white/10 uppercase tracking-widest">
              <span>Sharp</span>
              <span>Modern</span>
              <span>Round</span>
           </div>
        </div>

        <div className="pt-6 border-t border-white/5">
           <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
              <button 
                onClick={() => setPreviewMode('dashboard')}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'dashboard' ? 'bg-white text-black shadow-xl' : 'text-white/30 hover:text-white'}`}
              >
                 Dashboard
              </button>
              <button 
                onClick={() => setPreviewMode('login')}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'login' ? 'bg-white text-black shadow-xl' : 'text-white/30 hover:text-white'}`}
              >
                 Login Page
              </button>
           </div>
        </div>
      </div>

      {/* Live Preview (25.2) */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
               Live {previewMode === 'dashboard' ? 'Interaction' : 'Entrance'} Preview
            </p>
            <div className="flex gap-2">
               <Laptop className="w-4 h-4 text-white/10" />
               <Smartphone className="w-4 h-4 text-white/10" />
            </div>
         </div>
         
         <GlassCard className="p-8 border-primary/20 bg-[#050014] overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
               {previewMode === 'dashboard' ? (
                 <motion.div 
                    key="dash"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full space-y-6 opacity-60"
                 >
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary" />
                          <div className="w-20 h-2 bg-white/10 rounded" />
                       </div>
                       <div className="flex gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/20" />
                          <div className="w-4 h-4 rounded-full bg-white/10" />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                       {[1,2,3].map(i => (
                         <div key={i} className="p-4 border border-white/5 rounded-xl space-y-2">
                            <div className="w-4 h-4 rounded bg-primary/10" />
                            <div className="w-full h-2 bg-white/5 rounded" />
                            <div className="w-1/2 h-4 bg-primary/20 rounded" />
                         </div>
                       ))}
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                       <div className="w-full h-10 bg-primary rounded-xl flex items-center justify-center">
                          <div className="w-1/4 h-2 bg-white/20 rounded" />
                       </div>
                       <div className="flex justify-center">
                         <div className="w-1/2 h-2 bg-white/5 rounded" />
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div 
                    key="login"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-64 space-y-8 text-center"
                 >
                    <div className="space-y-4 flex flex-col items-center">
                       <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <span className="text-white font-black text-xl">L</span>
                       </div>
                       <div className="w-24 h-2 bg-white/20 rounded mx-auto" />
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                       <div className="w-full h-8 bg-white/5 rounded-xl" />
                       <div className="w-full h-8 bg-white/5 rounded-xl" />
                       <div className="w-full h-10 bg-primary rounded-xl shadow-lg shadow-primary/20" />
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Glowing Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: selectedColor }} />
         </GlassCard>
      </div>
    </div>
  )
}
