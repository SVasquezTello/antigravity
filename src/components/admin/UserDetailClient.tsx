'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { User, Activity, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface UserDetailClientProps {
  user: any
  plan: any
  executions: any[]
  payments: any[]
  planAppsCount?: number
  totalAppsCount?: number
  totalExecutions?: number
}

export function UserDetailClient({ user, plan, executions, payments, planAppsCount, totalAppsCount, totalExecutions }: UserDetailClientProps) {
  const { language } = useTranslation()

  const formattedDate = user.plan_assigned_at 
    ? new Date(user.plan_assigned_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : null;
  const daysDiff = user.plan_assigned_at 
    ? Math.floor((new Date().getTime() - new Date(user.plan_assigned_at).getTime()) / (1000 * 3600 * 24)) 
    : 0;


  return (
    <div className="space-y-8 min-h-full p-6 lg:p-8 flex flex-col pt-0">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-white/50">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            {language === 'en' ? 'User Profile' : 'Perfil de Usuario'}
          </h2>
          <div className="space-y-2">
            <p className="text-white/50 text-sm">Role: <span className="text-white capitalize">{user.role}</span></p>
            <p className="text-white/50 text-sm">Created At: <span className="text-white">{new Date(user.created_at).toLocaleString()}</span></p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-pink" />
              {language === 'en' ? 'Plan Assignment' : 'Asignación de Plan'}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                <p className="text-white/50 text-sm font-medium">{language === 'en' ? 'Tier:' : 'Nivel:'}</p>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                   {user.plan_source && (
                     <span className="text-white/30 px-2 py-0.5 bg-white/5 border border-white/5 rounded-md font-mono text-[10px] tracking-widest">{user.plan_source}</span>
                   )}
                   <p className="text-primary font-black uppercase text-sm bg-primary/10 px-2 py-0.5 rounded-md">
                     {plan ? (language === 'en' ? plan.name_en : plan.name_es) : 'FREE'}
                   </p>
                </div>
              </div>
              
              {user.plan_assigned_at && (
                <div className="flex items-center justify-between pb-3 border-b border-white/5 gap-4">
                  <p className="text-white/50 text-sm font-medium">{language === 'en' ? 'Assigned On:' : 'Asignado el:'}</p>
                  <div className="text-right">
                    <p className="text-white text-sm truncate max-w-[150px] sm:max-w-none" title={language === 'en' ? `Since ${formattedDate}` : `Desde el ${formattedDate}`}>
                      {language === 'en' ? `Since ${formattedDate}` : `Desde el ${formattedDate}`}
                    </p>
                    <p className="text-[11px] text-accent-pink font-bold mt-0.5 uppercase tracking-widest">
                      {language === 'en' ? `${daysDiff} days ago` : `Hace ${daysDiff} días`}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                 <p className="text-white/50 text-sm font-medium">{language === 'en' ? 'Apps Unlocked:' : 'Apps Desbloqueadas:'}</p>
                 <p className="text-white text-sm font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                   {language === 'en' ? `${planAppsCount || 0} of ${totalAppsCount || 0} apps` : `${planAppsCount || 0} de ${totalAppsCount || 0} apps`}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                 <p className="text-white/50 text-sm font-medium">{language === 'en' ? 'Total Executions:' : 'Ejecuciones Totales:'}</p>
                 <p className="text-white text-sm font-bold">
                    {totalExecutions || 0}
                 </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          {language === 'en' ? 'Payment History' : 'Historial de Pagos'}
        </h2>
        {payments.length === 0 ? (
          <p className="text-white/50 text-sm italic">{language === 'en' ? 'No automated payments registered.' : 'Sin pagos automáticos registrados.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map(log => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-white/60">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white font-mono text-xs">{log.event_type}</td>
                    <td className="px-4 py-3 text-white capitalize">{log.source}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">${log.normalized_payload?.amount || '0.00'}</td>
                    <td className="px-4 py-3 text-white/60">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-accent-cyan" />
          {language === 'en' ? 'Execution History' : 'Historial de Ejecución'}
        </h2>
        {executions.length === 0 ? (
          <p className="text-white/50 text-sm italic">{language === 'en' ? 'No app executions found.' : 'No se encontraron ejecuciones.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">App</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {executions.map(ex => (
                  <tr key={ex.id}>
                    <td className="px-4 py-3 text-white/60">{new Date(ex.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white">{language === 'en' ? ex.micro_apps?.name_en : ex.micro_apps?.name_es}</td>
                    <td className="px-4 py-3 capitalize text-white/60">{ex.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
