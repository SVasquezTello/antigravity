'use client'

import { useEffect } from 'react'
import { useTheme } from './DynamicThemeProvider'

export function BrandingHead() {
  const { partnerName, logoUrl } = useTheme()

  useEffect(() => {
    if (partnerName && partnerName !== 'Antigravity') {
      document.title = `${partnerName} | Portal de Inteligencia`
    }

    if (logoUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
      if (link) {
        link.href = logoUrl
      } else {
        const newLink = document.createElement('link')
        newLink.rel = 'icon'
        newLink.href = logoUrl
        document.head.appendChild(newLink)
      }
    }
  }, [partnerName, logoUrl])

  return null
}
