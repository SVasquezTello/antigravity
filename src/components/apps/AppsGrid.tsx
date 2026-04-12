'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  PenTool, 
  Mail, 
  Briefcase, 
  Share2, 
  Video, 
  LayoutGrid, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Zap, 
  Tv, 
  Users, 
  Search,
  ArrowRight,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Expanded icon map to handle common tool icons
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool,
  Mail,
  Briefcase,
  Share2,
  Video,
  LayoutGrid,
  Sparkles,
  FileText,
  MessageSquare,
  Zap,
  Youtube: Tv,
  Tv,
  Users,
  Search,
};

interface AppType {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  icon: string;
}

interface AppsGridProps {
  apps: AppType[];
  accessibleSlugs: string[];
}

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AppsGrid({ apps, accessibleSlugs }: AppsGridProps) {
  const { language } = useTranslation();

  const hasNoAccess = accessibleSlugs.length === 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Eric's Sober Header Style */}
      <div className="space-y-10 animate-entrance pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-2 uppercase tracking-tight">
            <h1 className="text-4xl md:text-5xl font-black text-[#00A3E0]">
              MICROAPPS HUB
            </h1>
            <span className="text-4xl md:text-5xl font-light text-white">PORTAL</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-white/70 text-base md:text-lg">
            <p>{language === 'en' ? 'Access your AI tools with cutting-edge technology and premium design.' : 'Accede a tus herramientas de IA con tecnología de última generación y diseño premium.'}</p>
            <Link href="/admin" className="text-[#7C3AED] hover:text-white transition-colors underline decoration-1 underline-offset-4">
              Admin
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {language === 'en' ? 'My Applications' : 'Mis Aplicaciones'}
          </h2>
          <div className="text-sm font-medium text-white/50">
            V1.0.4 - LIVE
          </div>
        </div>
      </div>

      {/* Empty State Banner (if no access) */}
      {hasNoAccess && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-primary/20 bg-primary/5"
        >
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {language === 'en' ? 'Upgrade your plan' : 'Mejora tu plan'}
            </h2>
            <p className="text-white/60">
              {language === 'en' 
                ? 'Unlock all the potential by choosing a premium subscription.' 
                : 'Desbloquea todo el potencial eligiendo una suscripción premium.'}
            </p>
          </div>
          <Link href="/plans" className="px-8 py-3 rounded-2xl bg-primary text-white font-black shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105 transition-all">
            {language === 'en' ? 'Unlock Now' : 'Desbloquear Ahora'}
          </Link>
        </motion.div>
      )}

      {/* Grid with improved cards */}
      <motion.div 
        variants={containerVars} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {apps.map(app => {
          const isAccessible = accessibleSlugs.includes(app.slug);
          const forceLocked = hasNoAccess || !isAccessible;
          
          const IconComp = ICON_MAP[app.icon] || Sparkles;
          
          return (
            <motion.div key={app.slug} variants={itemVars}>
              <Link 
                href={forceLocked ? '/plans' : `/apps/${app.slug}`}
                className={cn(
                  "relative flex flex-col h-full p-8 transition-all duration-500 overflow-hidden rounded-[2.5rem]",
                  forceLocked 
                    ? "bg-white/[0.02] border border-white/5 opacity-60 hover:opacity-100 grayscale-[0.5]"
                    : "glass-card group hover:translate-y-[-8px]"
                )}
              >
                {/* Visual Flair for Unlocked Cards */}
                {!forceLocked && (
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
                )}

                {forceLocked && (
                  <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 z-20">
                    <Lock className="w-4 h-4 text-white/40" />
                  </div>
                )}
                
                <div className={cn(
                  "relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500",
                  forceLocked 
                    ? "bg-white/5" 
                    : "bg-white/5 group-hover:bg-primary group-hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] group-hover:scale-110"
                )}>
                  <IconComp className={cn("w-8 h-8 transition-all duration-300", 
                    forceLocked ? "text-white/20" : "text-primary group-hover:text-white"
                  )} />
                </div>
                
                <div className="relative z-10 flex-1 space-y-4">
                  <h3 className={cn("text-2xl font-black leading-tight tracking-tight", 
                    forceLocked ? "text-white/40" : "text-white group-hover:text-primary transition-colors"
                  )}>
                    {language === 'en' ? app.name_en : app.name_es}
                  </h3>
                  <p className="text-sm text-white/30 font-medium leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors">
                    {language === 'en' ? app.description_en : app.description_es}
                  </p>
                </div>

                {!forceLocked && (
                  <div className="relative z-10 mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-primary/60 transition-colors">
                      {language === 'en' ? 'Launch' : 'Lanzar'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
