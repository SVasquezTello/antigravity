'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, XCircle, ShieldAlert, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ImpersonationBanner() {
  const router = useRouter()
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [targetName, setTargetName] = useState('')

  useEffect(() => {
    // 12.1 Verificar cookie o localStorage segura
    const checkStatus = () => {
       const status = localStorage.getItem('is_impersonating')
       const name = localStorage.getItem('impersonating_user_name')
       if (status === 'true') {
          setIsImpersonating(true)
          setTargetName(name || 'Customer')
       } else {
          setIsImpersonating(false)
       }
    }
    
    checkStatus()
    // Escuchar cambios en otras pestañas
    window.addEventListener('storage', checkStatus)
    return () => window.removeEventListener('storage', checkStatus)
  }, [])

  const stopImpersonation = () => {
    localStorage.removeItem('is_impersonating')
    localStorage.removeItem('impersonating_user_name')
    localStorage.removeItem('impersonating_user_id')
    
    // Regresar al panel de control original
    window.location.href = '/partner/clients'
  }

  if (!isImpersonating) return null

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[1000] bg-amber-500 text-black px-6 py-3 flex items-center justify-between shadow-2xl border-b border-black/10"
    >
      <div className="flex items-center gap-4">
         <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
            <Eye className="w-5 h-5" />
         </div>
         <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Impersonation Mode Active</p>
            <p className="text-sm font-bold">Viewing as: <span className="underline italic">{targetName}</span></p>
         </div>
         <div className="hidden md:flex items-center gap-2 ml-6 text-[10px] font-black uppercase bg-black/5 px-3 py-1 rounded-full">
            <ShieldAlert className="w-3 h-3" /> Read-Only Operations Recommended
         </div>
      </div>

      <button 
        onClick={stopImpersonation}
        className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-xl shadow-black/20"
      >
        <XCircle className="w-4 h-4" /> Stop Impersonating
      </button>
    </motion.div>
  )
}
