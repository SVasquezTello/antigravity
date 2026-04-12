'use client'

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2 } from 'lucide-react'

interface Preset {
  label_es: string
  label_en: string
  values: Record<string, any>
}

interface AutofillBadgesProps {
  presets: Preset[]
  onSelect: (values: Record<string, any>) => void
  activeValues?: Record<string, any>
}

export function AutofillBadges({ presets, onSelect, activeValues }: AutofillBadgesProps) {
  const { language } = useTranslation()

  if (!presets || presets.length === 0) return null

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          {language === 'en' ? 'Pro Catalyst Presets' : 'Ajustes Rápidos Pro'}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {presets.map((preset, idx) => {
          const label = language === 'en' ? preset.label_en : preset.label_es
          const isActive = activeValues && Object.keys(preset.values).every(
            key => String(activeValues[key]) === String(preset.values[key])
          )

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              type="button"
              onClick={() => onSelect(preset.values)}
              className={`relative group px-5 py-2.5 rounded-2xl text-[12px] font-black transition-all duration-500 border overflow-hidden flex items-center gap-2 ${
                isActive
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.08] hover:border-white/10 hover:text-white shadow-xl'
              }`}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <span className="relative z-10 tracking-tight uppercase">
                {label}
              </span>

              {!isActive && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
