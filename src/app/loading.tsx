import React from 'react'
import { Zap } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050014]/80 backdrop-blur-3xl selection:bg-primary/30">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse-subtle" />
        
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-20 h-20 relative flex items-center justify-center">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary border-r-accent-pink animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-accent-blue/20 border-b-accent-blue border-l-primary animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            
            {/* Center core */}
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent-pink flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="font-black text-sm uppercase tracking-[0.4em] text-white/80 glow-text">
              Antigravity
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
