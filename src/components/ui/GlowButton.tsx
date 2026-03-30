import * as React from 'react'

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function GlowButton({ children, className = '', variant = 'primary', ...props }: GlowButtonProps) {
  const baseClasses = "relative group px-6 py-3 rounded-xl font-medium overflow-hidden transition-all flex items-center justify-center"
  
  if (variant === 'ghost') {
    return (
      <button 
        className={`${baseClasses} text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button 
      className={`${baseClasses} text-white ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-pink to-accent-warm opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-warm blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
