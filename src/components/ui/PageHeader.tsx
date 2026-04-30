'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  actions?: React.ReactNode
  icon?: React.ElementType
}

/**
 * 16.4 Page Header Pattern
 * Ensures consistency across the entire enterprise ecosystem
 */
export function PageHeader({ title, subtitle, breadcrumbs, actions, icon: Icon }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-4">
        {/* Breadcrumb Path */}
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
             <span>Portal</span>
             {breadcrumbs.map((crumb, i) => (
               <React.Fragment key={i}>
                 <ChevronRight className="w-3 h-3 text-white/10" />
                 <span className={i === breadcrumbs.length - 1 ? 'text-primary' : ''}>{crumb.label}</span>
               </React.Fragment>
             ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
           {Icon && (
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                <Icon className="w-6 h-6" />
             </div>
           )}
           <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'text-primary italic' : ''}>{word} </span>
                ))}
              </h1>
              {subtitle && <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{subtitle}</p>}
           </div>
        </div>
      </div>

      {actions && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {actions}
        </motion.div>
      )}
    </header>
  )
}
