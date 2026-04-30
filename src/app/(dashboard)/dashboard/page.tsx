'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { SuperAdminView } from '@/components/dashboard/SuperAdminView'
import { PartnerView } from '@/components/dashboard/PartnerView'
import { ClientView } from '@/components/dashboard/ClientView'
import { Loader2 } from 'lucide-react'

/**
 * 15.1 - 15.3 Multi-Role Dashboard Switcher
 * Orchestrates the professional experience based on security clearance
 */
export default function UniversalDashboard() {
  const supabase = React.useMemo(() => createClient(), [])
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
          setRole(data?.role || 'client')
        }
      } catch (err) {
        console.error('UniversalDashboard: Session fetch error', err)
        setRole('client')
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [supabase])

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Console...</p>
      </div>
    )
  }

  // Master Switch Logic (15.1 - 15.3)
  if (role === 'super_admin' || role === 'admin') return <SuperAdminView />
  if (role === 'partner') return <PartnerView />
  
  return <ClientView />
}
