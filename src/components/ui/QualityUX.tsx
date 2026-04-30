'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

/**
 * 26.2 Performance & Quality: Skeleton Loaders
 * Prevents white screens and improves perceived performance
 */
export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClass = "animate-pulse bg-white/5 overflow-hidden relative"
  
  const variantClasses = {
    text: "h-3 w-3/4 rounded-full",
    circular: "rounded-full",
    rectangular: "rounded-2xl"
  }

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  )
}

/**
 * 26.3 Strategic Empty States
 * Guides users when data is absent
 */
export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action 
}: { 
  title: string, 
  description: string, 
  icon: React.ElementType,
  action?: { label: string, onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-white/10">
         <Icon className="w-10 h-10" />
      </div>
      <div className="space-y-2 max-w-sm">
         <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{title}</h3>
         <p className="text-xs text-white/30 font-medium leading-relaxed uppercase tracking-widest">{description}</p>
      </div>
      {action && (
        <button 
          onClick={action.onClick}
          className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
