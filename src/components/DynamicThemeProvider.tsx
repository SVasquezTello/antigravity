'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BrandingHead } from './BrandingHead'

interface ThemeContextProps {
  primaryColor: string
  partnerName: string
  logoUrl: string | null
  brandingConfig: {
    radius?: string
    secondaryColor?: string
    faviconUrl?: string
  }
  setPrimaryColor: (color: string) => void
  setBrandingConfig: (config: any) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState('#7C3AED')
  const [partnerName, setPartnerName] = useState('Antigravity')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [brandingConfig, setBrandingConfig] = useState<any>({
    radius: '1.5rem',
    secondaryColor: '#10B981'
  })
  
  const supabase = React.useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchPartnerBranding = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: uData } = await supabase
          .from('users')
          .select('partner_id')
          .eq('id', user.id)
          .single()

        if (uData?.partner_id) {
          const { data: pData } = await supabase
            .from('partners')
            .select('name, primary_color, logo_url, branding_config')
            .eq('id', uData.partner_id)
            .single()

          if (pData) {
            if (pData.primary_color) setPrimaryColor(pData.primary_color)
            if (pData.name) setPartnerName(pData.name)
            if (pData.logo_url) setLogoUrl(pData.logo_url)
            if (pData.branding_config) {
              setBrandingConfig((prev: any) => ({ ...prev, ...pData.branding_config }))
            }
          }
        }
      }
    }
    fetchPartnerBranding()
  }, [supabase])

  useEffect(() => {
    // Inject into CSS Variables
    document.documentElement.style.setProperty('--partner-primary', primaryColor)
    document.documentElement.style.setProperty('--partner-radius', brandingConfig.radius || '1.5rem')
    
    // Generate derived semi-transparent version for effects
    if (primaryColor.startsWith('#')) {
      const r = parseInt(primaryColor.slice(1, 3), 16)
      const g = parseInt(primaryColor.slice(3, 5), 16)
      const b = parseInt(primaryColor.slice(5, 7), 16)
      document.documentElement.style.setProperty('--partner-primary-rgb', `${r}, ${g}, ${b}`)
    }
  }, [primaryColor, brandingConfig])

  return (
    <ThemeContext.Provider value={{ primaryColor, partnerName, logoUrl, brandingConfig, setPrimaryColor, setBrandingConfig }}>
      <BrandingHead />
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a DynamicThemeProvider')
  return context
}
