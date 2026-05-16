'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Rocket, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PartnerJoinPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [partner, setPartner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: Info, 2: Success

  useEffect(() => {
    const fetchPartner = async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', params.slug)
        .single()
      
      if (data) {
        setPartner(data)
      }
      setLoading(false)
    }
    fetchPartner()
  }, [params.slug])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { 
            first_name: formData.firstName,
            last_name: formData.lastName
          } 
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create Client Workspace
        const { data: client, error: clientError } = await supabase
          .from('workspaces')
          .insert({
            name: formData.companyName || `${formData.firstName}'s Workspace`,
            partner_id: partner.id,
            status: 'active'
          })
          .select()
          .single()
        
        if (clientError) throw clientError

        // 3. Update User Profile
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ 
            role: 'client', 
            workspace_id: client.id,
            partner_id: partner.id
          })
          .eq('id', authData.user.id)
        
        if (userUpdateError) throw userUpdateError

        setStep(2)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/20 uppercase tracking-[0.5em] font-black italic">Syncing Protocol...</div>

  if (!partner) return <div className="min-h-screen bg-[#050014] flex items-center justify-center text-white/40 uppercase font-black italic">Partner Workspace Not Found</div>

  const primaryColor = partner.primary_color || '#7C3AED'

  return (
    <div className="min-h-screen bg-[#050014] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full animate-pulse opacity-20" style={{ backgroundColor: primaryColor }} />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
         
         {/* Left Side: Branding & Value Prop */}
         <div className="space-y-10 text-center lg:text-left">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
               {partner.logo_url ? (
                 <img src={partner.logo_url} alt={partner.name} className="h-12 w-auto" />
               ) : (
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-2xl" style={{ color: primaryColor }}>{partner.name[0]}</div>
               )}
               <span className="font-black uppercase tracking-[0.2em] text-sm text-white/60">{partner.name}</span>
            </div>

            <div className="space-y-6">
               <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.8]">
                  Empower your <br/> <span style={{ color: primaryColor }} className="italic">Business</span>
               </h1>
               <p className="text-white/40 text-lg font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Únete al ecosistema de IA de {partner.name} y automatiza tus procesos operativos en minutos.
               </p>
            </div>

            <div className="space-y-4 pt-4">
               {[
                 'Acceso instantáneo a micro-apps de IA',
                 'Panel administrativo personalizado',
                 'Soporte técnico prioritario',
                 'Reportes de ROI automatizados'
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 justify-center lg:justify-start text-white/60 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} />
                    {item}
                 </div>
               ))}
            </div>
         </div>

         {/* Right Side: Registration Form */}
         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <GlassCard className="p-10 space-y-8 border-white/5 shadow-2xl">
               {step === 1 ? (
                 <>
                   <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Quick Onboarding</h2>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Start your digital transformation today</p>
                   </div>

                   <form onSubmit={handleRegister} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">First Name</label>
                           <input 
                             required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Last Name</label>
                           <input 
                             required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" 
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Company / Workspace Name</label>
                         <div className="relative">
                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                            <input 
                               required type="text" placeholder="Acme Corp" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-primary outline-none" 
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Business Email</label>
                         <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                            <input 
                               required type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-primary outline-none" 
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Security Key</label>
                         <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                            <input 
                               required type="password" placeholder="••••••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-primary outline-none" 
                            />
                         </div>
                      </div>

                      <button 
                        type="submit" disabled={isSubmitting}
                        className="w-full py-5 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}40` }}
                      >
                         {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                         Create Workspace
                      </button>
                   </form>
                 </>
               ) : (
                 <div className="text-center space-y-8 py-10">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mx-auto">
                       <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black text-white uppercase italic">Welcome Aboard!</h2>
                       <p className="text-white/40 text-xs font-medium">Your enterprise workspace for <span className="text-white font-bold">{formData.companyName}</span> has been deployed.</p>
                    </div>
                    <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:invert transition-all">
                       Enter Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
               )}
            </GlassCard>
         </motion.div>
      </div>
    </div>
  )
}
