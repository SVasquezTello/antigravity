'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ThemeContextProps {
  primaryColor: string
  setPrimaryColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

/**
 * 25.1 / 25.2 Dynamic Theme Engine
 * Injects partner-specific branding tokens into the CSS root
 */
export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState('#7C3AED')
  const supabase = React.useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchPartnerBranding = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: uData, error: uError } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (!uError && uData && 'partner_id' in uData && uData.partner_id) {
          const { data: pData } = await supabase.from('partners').select('primary_color').eq('id', uData.partner_id).single()
          if (pData?.primary_color) {
            setPrimaryColor(pData.primary_color)
          }
        }
      }
    }
    fetchPartnerBranding()
  }, [supabase])

  useEffect(() => {
    // Inject into CSS Variables
    document.documentElement.style.setProperty('--partner-primary', primaryColor)
    
    // Generate derived semi-transparent version for effects
    const r = parseInt(primaryColor.slice(1, 3), 16)
    const g = parseInt(primaryColor.slice(3, 5), 16)
    const b = parseInt(primaryColor.slice(5, 7), 16)
    document.documentElement.style.setProperty('--partner-primary-rgb', `${r}, ${g}, ${b}`)
  }, [primaryColor])

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a DynamicThemeProvider')
  return context
}
