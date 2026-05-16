import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layout, 
  Star,
  Users,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PartnerStorefrontPage({ params }: { params: Promise<{ partnerSlug: string }> }) {
  const { partnerSlug } = await params
  const supabase = await createClient()

  // 1. Fetch Partner Data
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('slug', partnerSlug)
    .single()

  if (!partner) {
    return notFound()
  }

  // 2. Fetch Partner's Featured Apps
  // For demo, we show the top industrial ones if it's a "Manufactura" partner
  const { data: apps } = await supabase
    .from('micro_apps')
    .select('*')
    .limit(6)

  const primaryColor = partner.primary_color || '#7C3AED'

  return (
    <div className="min-h-screen bg-[#050014] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Theme Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --partner-primary: ${primaryColor};
          --partner-primary-rgb: ${hexToRgb(primaryColor)};
          --partner-radius: 1.5rem; /* Fallback o podrías sacarlo de partnerData.branding_config */
        }
      `}} />

      {/* --- BACKGROUND ORBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050014]/50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
           <div className="flex items-center gap-4">
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xl" style={{ color: primaryColor }}>{partner.name[0]}</div>
              )}
              <span className="font-black uppercase tracking-[0.2em] text-sm">{partner.name}</span>
           </div>
           <div className="flex items-center gap-8">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Client Login</Link>
              <Link href="/register" className="px-8 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl shadow-white/5">Join Workspace</Link>
           </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="relative pt-48 pb-32 px-6 z-10 text-center">
         <div className="max-w-4xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
               <ShieldCheck className="w-4 h-4" style={{ color: primaryColor }} /> Verified {partner.name} Partner Portal
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase">
               Scale your <br/> <span style={{ color: primaryColor }} className="italic">Intelligence</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
               Accede al ecosistema exclusivo de micro-aplicaciones de IA diseñado por {partner.name} para automatizar tu negocio y maximizar resultados operativos.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/register" className="px-12 py-5 rounded-[2rem] text-white font-black uppercase tracking-widest text-sm transition-all shadow-2xl hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                  Get Started Free
               </Link>
               <Link href="#solutions" className="px-12 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                  Browse Solutions
               </Link>
            </div>
         </div>
      </header>

      {/* --- SOLUTIONS GRID --- */}
      <section id="solutions" className="py-32 px-6 relative z-10 bg-white/[0.02] border-y border-white/5">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
               <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Ecosistema de Aplicaciones</h2>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Featured <span className="italic opacity-30">Tools</span></h3>
               </div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Showing {apps?.length} custom solutions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {apps?.map((app, i) => (
                 <GlassCard key={app.id} className="p-10 group hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                          <Zap className="w-7 h-7" style={{ color: primaryColor }} />
                       </div>
                       <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black text-white/20 uppercase tracking-widest">AI v1.5</div>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-3">{app.name_es}</h4>
                    <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">{app.description_es}</p>
                    <Link href="/register" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform" style={{ color: primaryColor }}>
                       Try solution <ArrowRight className="w-4 h-4" />
                    </Link>
                 </GlassCard>
               ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-6 text-center border-t border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-2xl">A</div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Antigravity Ecosystem</p>
            </div>
            <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-white/10">
               <span>© 2026 {partner.name}</span>
               <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Powered by Antigravity AI</span>
            </div>
         </div>
      </footer>
    </div>
  )
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
