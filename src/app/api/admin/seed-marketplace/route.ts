import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

const NEW_APPS = [
  // ... (Tech apps)
  {
    name_es: "TechSupport AI",
    name_en: "TechSupport AI",
    description_es: "Soporte inteligente con chat IA, tickets y WhatsApp integrado para empresas.",
    description_en: "Intelligent support with AI chat, tickets, and integrated WhatsApp for businesses.",
    slug: "tech-support-ai",
    icon: "MessageSquare",
    category: "Agencias"
  },
  {
    name_es: "DataFlow Analytics",
    name_en: "DataFlow Analytics",
    description_es: "Dashboard inteligente con KPIs, reportes de ventas e IA predictiva.",
    description_en: "Intelligent dashboard with KPIs, sales reports, and predictive AI.",
    slug: "dataflow-analytics",
    icon: "BarChart3",
    category: "Finanzas"
  },
  {
    name_es: "SmartQuote Pro",
    name_en: "SmartQuote Pro",
    description_es: "Generación automática de cotizaciones con firma digital y generador de propuestas IA.",
    description_en: "Automatic quote generation with digital signature and AI proposal generator.",
    slug: "smart-quote-pro",
    icon: "ClipboardCheck",
    category: "Agencias"
  },
  {
    name_es: "NexBooking",
    name_en: "NexBooking",
    description_es: "Sistema de reservas y citas online con recordatorios por WhatsApp y pagos integrados.",
    description_en: "Online booking and appointment system with WhatsApp reminders and integrated payments.",
    slug: "nex-booking",
    icon: "Clock",
    category: "Retail"
  },
  {
    name_es: "EduTech Smart",
    name_en: "EduTech Smart",
    description_es: "Plataforma educativa moderna con cursos, evaluaciones e IA de apoyo docente.",
    description_en: "Modern educational platform with courses, evaluations, and teacher-support AI.",
    slug: "edutech-smart",
    icon: "GraduationCap",
    category: "Education"
  },
  // Delivery Apps
  {
    name_es: "QuickFood Delivery",
    name_en: "QuickFood Delivery",
    description_es: "App de delivery para restaurantes con tracking en tiempo real y app de repartidor.",
    description_en: "Delivery app for restaurants with real-time tracking and courier app.",
    slug: "quickfood-delivery",
    icon: "ShoppingCart",
    category: "Retail"
  },
  {
    name_es: "MarketExpress",
    name_en: "MarketExpress",
    description_es: "Delivery para minimarkets con catálogo de productos e inventario sincronizado.",
    description_en: "Delivery for minimarkets with product catalog and synchronized inventory.",
    slug: "market-express",
    icon: "Home",
    category: "Retail"
  },
  {
    name_es: "FarmaGo Delivery",
    name_en: "FarmaGo Delivery",
    description_es: "Sistema de delivery para farmacias con gestión de recetas y alertas de medicamentos.",
    description_en: "Delivery system for pharmacies with prescription management and medication alerts.",
    slug: "farmago-delivery",
    icon: "Heart",
    category: "Salud"
  },
  {
    name_es: "LaundryFast",
    name_en: "LaundryFast",
    description_es: "Delivery para lavanderías con programación de recojo y entrega a domicilio.",
    description_en: "Delivery for laundries with pick-up and home delivery scheduling.",
    slug: "laundry-fast",
    icon: "Scissors",
    category: "Agencias"
  },
  {
    name_es: "MultiDelivery Pro",
    name_en: "MultiDelivery Pro",
    description_es: "Plataforma delivery multi-negocio con comisiones y panel administrativo global.",
    description_en: "Multi-business delivery platform with commissions and global administrative panel.",
    slug: "multidelivery-pro",
    icon: "Rocket",
    category: "Agencias"
  }
]

export async function GET() {
  try {
    for (const app of NEW_APPS) {
      const { data: existing } = await supabaseAdmin
        .from('micro_apps')
        .select('id')
        .eq('slug', app.slug)
        .maybeSingle()

      if (!existing) {
        await supabaseAdmin.from('micro_apps').insert(app)
      }
    }

    return NextResponse.json({ success: true, message: 'High-impact market solutions seeded successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
