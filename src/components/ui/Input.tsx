import * as React from 'react'
import { LucideIcon } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
}

export function Input({ className = '', icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3 text-white/50 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-light ${Icon ? 'pl-10 pr-4' : 'px-4'} ${className}`}
        {...props}
      />
    </div>
  )
}
