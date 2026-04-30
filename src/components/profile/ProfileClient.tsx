'use client'

import React, { useState, useRef, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTranslation } from '@/hooks/useTranslation'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/ToastProvider'
import { Camera, Save, Mail, Trash2, Loader2, Shield, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileClientProps {
  user: any
  plan: any
}

// Simple MD5 impl for Gravatar
function md5Cycle(x: any[], k: any[]) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
}
function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
function md51(s: string) {
    var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
}
function md5blk(s: string) {
    var md5blks: number[] = [], i; 
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
}
function md5cycle(x: any[], k: any[]) { md5Cycle(x, k); }
function add32(a: number, b: number) { return (a + b) & 0xFFFFFFFF; }
function hex(x: any[]) {
    for (var i = 0; i < x.length; i++)
        x[i] = ("00000000" + ((x[i] >>> 0).toString(16))).slice(-8);
    return x.join('');
}
function md5(s: string) { return hex(md51(s)); }


export function ProfileClient({ user, plan }: ProfileClientProps) {
  const { language } = useTranslation()
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(user.first_name || '')
  const [lastName, setLastName] = useState(user.last_name || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || null)
  const [prefLanguage, setPrefLanguage] = useState(user.language || 'es')
  const [timezone, setTimezone] = useState(user.timezone || 'UTC')
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const hasChanges = firstName !== (user.first_name || '') || 
                     lastName !== (user.last_name || '') ||
                     prefLanguage !== (user.language || 'es') ||
                     timezone !== (user.timezone || 'UTC')

  // Auto-generated Avatar logic
  const getInitials = () => {
    const f = firstName.charAt(0) || user.email.charAt(0)
    const l = lastName.charAt(0) || ''
    return (f + l).toUpperCase()
  }

  const getAvatarBg = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500']
    const index = (user.id.charCodeAt(0) + user.id.charCodeAt(1)) % colors.length
    return colors[index]
  }

  const displayAvatar = avatarUrl || null // null means show initials

  const joinDate = new Date(user.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from('users').update({
        first_name: firstName,
        last_name: lastName,
        language: prefLanguage,
        timezone: timezone
      }).eq('id', user.id)

      if (error) throw error

      await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      })

      toast({ title: language === 'en' ? 'Profile updated successfully' : 'Perfil actualizado con éxito', type: 'success' })
      router.refresh()
    } catch (e: any) {
      toast({ title: e.message || 'Error updating profile', type: 'error' })
    }
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: language === 'en' ? 'Passwords do not match' : 'Las contraseñas no coinciden', type: 'error' })
      return
    }
    setIsChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast({ title: error.message, type: 'error' })
    } else {
      toast({ title: language === 'en' ? 'Password changed' : 'Contraseña cambiada', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    }
    setIsChangingPassword(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast({ title: language === 'en' ? 'File too large (Max 1MB)' : 'Archivo muy pesado (Máx 1MB)', type: 'error' })
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
      
      setAvatarUrl(publicUrl)
      toast({ title: language === 'en' ? 'Avatar updated' : 'Avatar actualizado', type: 'success' })
      
      // Auto-refresh layout so Header picks it up
      setTimeout(() => router.refresh(), 500)
    } catch(e: any) {
      console.error(e)
      toast({ title: e.message || 'Error uploading file', type: 'error' })
    }
    
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    try {
      await supabase.from('users').update({ avatar_url: null }).eq('id', user.id)
      setAvatarUrl(null)
      toast({ title: language === 'en' ? 'Avatar removed' : 'Avatar eliminado', type: 'success' })
      setTimeout(() => router.refresh(), 500)
    } catch(e) {
       toast({ title: 'Error', type: 'error' })
    }
    setIsUploading(false)
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{language === 'en' ? 'My Profile' : 'Mi Perfil'}</h1>
          <p className="text-white/60">{language === 'en' ? 'Manage your personal information and preferences.' : 'Administra tu información personal y preferencias.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 animate-entrance">
          
          {/* Left Column - Avatar & Info */}
          <GlassCard className="p-8 flex flex-col items-center text-center">
            
            <div className="relative group mb-6">
               <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/10 bg-white/5 mx-auto flex items-center justify-center">
                 {isUploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                       <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                 ) : displayAvatar ? (
                    <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <div className={`w-full h-full flex items-center justify-center text-3xl font-black text-white ${getAvatarBg()}`}>
                       {getInitials()}
                    </div>
                 )}
               </div>

               <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-3 bg-primary rounded-full hover:bg-primary/80 transition-colors shadow-xl ring-4 ring-[#050014] text-white disabled:opacity-50"
                  title={language === 'en' ? 'Change Photo' : 'Cambiar Foto'}
               >
                 <Camera className="w-5 h-5" />
               </button>
               <input 
                 type="file" 
                 accept="image/png, image/jpeg, image/gif, image/webp" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleFileSelect} 
               />
            </div>

            {avatarUrl && (
              <button onClick={handleRemoveAvatar} className="text-xs text-red-400 hover:text-red-300 mb-6 flex items-center gap-1 transition-colors">
                 <Trash2 className="w-3 h-3" /> {language === 'en' ? 'Remove custom avatar' : 'Eliminar avatar personalizado'}
              </button>
            )}

            <h2 className="text-xl font-bold text-white leading-tight">
              {firstName} {lastName}
            </h2>
            
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm border border-white/10"
                 style={{ backgroundColor: user.role === 'admin' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}>
              {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
              {user.role}
            </div>

            <div className="mt-6 w-full border-t border-white/10 pt-6 space-y-4 text-sm text-left">
               <div className="flex justify-between items-center text-white/60">
                 <span>{language === 'en' ? 'Joined:' : 'Miembro desde:'}</span>
                 <span className="text-white font-medium capitalize">{joinDate}</span>
               </div>
               <div className="flex justify-between items-center text-white/60">
                 <span>{language === 'en' ? 'Plan:' : 'Plan actual:'}</span>
                 <span className="text-white font-medium">{plan ? (language === 'en' ? plan.name_en : plan.name_es) : (language === 'en' ? 'No plan' : 'Sin plan')}</span>
               </div>
            </div>

          </GlassCard>

          {/* Right Column - Form */}
          <GlassCard className="p-8">
            <div className="flex gap-6 border-b border-white/5 mb-8">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-white/40 hover:text-white/60'}`}
              >
                {language === 'en' ? 'Profile Info' : 'Información'}
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-white/40 hover:text-white/60'}`}
              >
                {language === 'en' ? 'Security' : 'Seguridad'}
              </button>
            </div>

            {activeTab === 'profile' ? (
              <div className="space-y-6 animate-entrance">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'First Name' : 'Nombre'}</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'Last Name' : 'Apellido'}</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'Language' : 'Idioma'}</label>
                    <select 
                      value={prefLanguage} 
                      onChange={(e) => setPrefLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'Timezone' : 'Zona Horaria'}</label>
                    <select 
                      value={timezone} 
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="America/Mexico_City">Mexico City (CST)</option>
                      <option value="Europe/Madrid">Madrid (CET)</option>
                      <option value="America/Bogota">Bogotá (COT)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium text-white/60">{language === 'en' ? 'Account Status' : 'Estado de Cuenta'}</label>
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${user.suspended ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                         <span className="text-sm font-bold text-white uppercase tracking-wider">{user.suspended ? 'Suspended' : 'Active'}</span>
                      </div>
                      <span className="text-[10px] text-white/30 uppercase font-black">{language === 'en' ? 'Professional Tier' : 'Nivel Profesional'}</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {language === 'en' ? 'Save Changes' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-entrance">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-xs text-primary font-medium">
                    {language === 'en' ? 'Manage your account security and password.' : 'Gestiona la seguridad de tu cuenta y contraseña.'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'New Password' : 'Nueva Contraseña'}</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">{language === 'en' ? 'Confirm Password' : 'Confirmar Contraseña'}</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={!newPassword || isChangingPassword}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    {language === 'en' ? 'Update Password' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </div>
            )}
          </GlassCard>

        </div>
      </div>
    </div>
  )
}
