import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Seeding Micro-Apps para Empresas de Construcción y Contratistas...')

  const apps = [
    {
      slug: 'reactiva-obra',
      name_en: 'ReactivaObra',
      name_es: 'ReactivaObra',
      description_en: 'Recover cold quotes or past clients for new projects.',
      description_es: 'Rescata cotizaciones frías o vende extensiones a clientes pasados.',
      icon: 'Briefcase',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del Cliente', required: true },
        { id: 'project_type', type: 'text', label_en: 'Project/Quote Type', label_es: 'Tipo de Proyecto cotizado o realizado', required: true },
        { id: 'time_passed', type: 'text', label_en: 'Time Since Last Contact', label_es: 'Tiempo desde el último contacto/obra', required: true },
        { id: 'excuse', type: 'select', label_en: 'Assumed Objection', label_es: 'Objeción que pausó la venta', required: true,
          options_es: ['Presupuesto/Precio', 'Falta de tiempo del cliente', 'Dudas técnicas', 'Permisos', 'Desconocida'],
          options_en: ['Budget/Price', 'Lack of Time', 'Technical Doubts', 'Permits', 'Unknown']
        },
        { id: 'channel', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal de contacto', required: true,
          options_es: ['WhatsApp', 'Email', 'Llamada'],
          options_en: ['WhatsApp', 'Email', 'Call']
        }
      ],
      prompt_template: `Actúa como Director Comercial de una Constructora de Alto Nivel.
Tienes una cotización fría o un cliente pasado que puede generar una nueva obra. 
- Cliente: {{client_name}}
- Proyecto: {{project_type}}
- Tiempo frío: {{time_passed}}
- Objeción asumida: {{excuse}}

Genera 2 mensajes de seguimiento elegantes y de altísimo valor percibido para enviar por {{channel}}:
1. "Versión Consultor": Enfocada en ofrecerle una actualización sobre regulaciones, costos de materiales que acaban de bajar, o una nueva idea arquitectónica gratis para reabrir el diálogo sobre su {{excuse}}.
2. "Versión Cierre Directo": Una propuesta asertiva ofreciendo iniciar la primera fase del {{project_type}} con condiciones especiales si firma esta semana.
Ambos textos deben transmitir confianza, no desesperación por vender.`
    },
    {
      slug: 'upsell-obra',
      name_en: 'UpsellObra AI',
      name_es: 'UpsellObra AI',
      description_en: 'Increase the ticket size before digging the foundations.',
      description_es: 'Aumenta el ticket de la obra vendiendo acabados o domótica.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del Cliente', required: true },
        { id: 'current_project', type: 'text', label_en: 'Current Project', label_es: 'Proyecto actualmente firmado/acordado', required: true },
        { id: 'budget_profile', type: 'select', label_en: 'Budget Flexibility', label_es: 'Flexibilidad de Presupuesto', required: true,
          options_es: ['Ajustado al centavo', 'Margen moderado', 'Presupuesto Alto/Premium'],
          options_en: ['Very Strict', 'Moderate Margin', 'High Budget/Premium']
        },
        { id: 'available_upgrades', type: 'textarea', label_en: 'Available Upgrades', label_es: 'Mejoras posibles (Ej. porcelanato, domótica, panel solar)', required: true }
      ],
      prompt_template: `Eres un Arquitecto Estratega y Negociador experto.
El cliente ya aceptó el presupuesto base. Es el momento perfecto para incrementar el margen de ganancia ofreciendo mejoras (adicionales/vicios ocultos positivos).
- Proyecto Actual: {{current_project}}
- Perfil Económico: {{budget_profile}}
- Mis opciones de mejora: {{available_upgrades}}

Detecta las 3 mejoras ('upsells') constructivas más rentables e irresistibles que calcen con su perfil.
Para cada una proporciona:
1. Qué material/tecnología ofrecer.
2. Argumento de 'Costo a Largo Plazo': Cómo gastar esto HOY le ahorrará miles en mantenimiento, luz o agua en los próximos 5 años.
3. El guion de whatsapp o email exacto para presentarlo casualmente como una "sugerencia del ingeniero/arquitecto pensando en su comodidad futura".`
    },
    {
      slug: 'orden-obra',
      name_en: 'ChecklistObra',
      name_es: 'OrdenObra',
      description_en: 'Stop losing money on idle workers waiting for materials.',
      description_es: 'Evita tener cuadrillas paradas esperando materiales atrasados.',
      icon: 'CalendarCheck',
      form_schema: [
        { id: 'project_name', type: 'text', label_en: 'Project Phase', label_es: 'Fase de la Obra (ej. Cimentación, Acabados)', required: true },
        { id: 'foreman', type: 'text', label_en: 'Foreman in Charge', label_es: 'Maestro de Obra o Residente a cargo', required: true },
        { id: 'crew_size', type: 'text', label_en: 'Crew Size', label_es: 'Tamaño de cuadrilla hoy', required: true },
        { id: 'critical_materials', type: 'textarea', label_en: 'Critical Materials', label_es: 'Materiales críticos requeridos hoy', required: true }
      ],
      prompt_template: `Actúa como Gerente de Suministros y Logística de Obra (Project Manager).
Las horas muertas por falta de material hunden económicamente a las constructoras. 
- Fase actual: {{project_name}}
- Residente: {{foreman}} (con {{crew_size}} trabajadores)
- Materiales Críticos: {{critical_materials}}

Genera un Protocolo Operativo "Día Cero Retrasos" para el Residente:
1. Misión Matutina (6:00 AM): El formato de confirmación fotográfica exacto que {{foreman}} debe enviarte sobre el inventario de {{critical_materials}}.
2. Plan de Contingencia Aislado: Si el material clave retrasa 4 horas su llegada, ¿qué tareas secundarias productivas exactas debe realizar la cuadrilla en la fase de {{project_name}} para no desperdiciar el jornal de {{crew_size}} personas?
3. Checklist de Salida (Cierre de día): 3 fotos obligatorias que el Residente debe subir al sistema para aprobar el avance de hoy.`
    },
    {
      slug: 'decide-obra',
      name_en: 'DecideObra',
      name_es: 'DecideObra',
      description_en: 'Numbers dictate if a delay ruins your profit margin.',
      description_es: 'Tus números dictan si un retraso arruina tu margen de ganancia.',
      icon: 'PieChart',
      form_schema: [
        { id: 'financial_data', type: 'textarea', label_en: 'Project Financials', label_es: 'Costos actuales vs. Presupuesto estimado', required: true },
        { id: 'main_delay', type: 'text', label_en: 'Main Bottleneck', label_es: 'Principal cuello de botella/retraso', required: true },
        { id: 'focus_area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options_es: ['Sobrecostos de Material', 'Nómina/Horas Extras', 'Flujo de Caja/Pagos del Cliente'],
          options_en: ['Material Overcosts', 'Payroll/Overtime', 'Cash Flow/Client Payments']
        },
        { id: 'context', type: 'textarea', label_en: 'Market Context', label_es: 'Contexto (Lluvias, huelgas, inflación)', required: true }
      ],
      prompt_template: `Eres un Auditor Financiero Implacable para Empresas Contratistas. 
Las constructoras quiebran no por mala arquitectura, sino por mal flujo de caja.
- Números de Obra: {{financial_data}}
- Retraso principal: {{main_delay}}
- Foco de sangrado: {{focus_area}}
- Contexto agravante: {{context}}

Entrega 3 Decisiones Ejecutivas Financieras Salvavidas.
Para cada decisión, sé agresivo y directo:
1. El movimiento (Ej. congelar frente B, negociar anticipo extra, cambiar proveedor de acero).
2. Justificación matemática estricta basada en evitar un colapso del flujo de caja.
3. El borrador del mensaje urgente pero diplomático que el dueño debe enviarle hoy al Proveedor o al Cliente (según corresponda) para ejecutar el movimiento.`
    },
    {
      slug: 'pulse-obra',
      name_en: 'PulseObra',
      name_es: 'PulseObra',
      description_en: 'Read the pulse of all your active projects without visiting them.',
      description_es: 'El pulso diario de tus obras activas sin tener que visitarlas.',
      icon: 'Activity',
      form_schema: [
        { id: 'daily_progress', type: 'textarea', label_en: 'Daily Progress', label_es: 'Avance físico de hoy (metros, vaciados, etc)', required: true },
        { id: 'incidents', type: 'textarea', label_en: 'Equipment/Weather Issues', label_es: 'Fallas de maquinaria, clima, accidentes', required: true },
        { id: 'deliveries', type: 'select', label_en: 'Material Deliveries', label_es: 'Estado de suministros', required: true,
          options_es: ['Llegó todo a tiempo', 'Llegó tarde/incompleto', 'Falta Crítica para mañana'],
          options_en: ['All On Time', 'Late/Partial', 'Critical Shortage Tomorrow']
        },
        { id: 'foreman_notes', type: 'textarea', label_en: 'Foreman Notes', label_es: 'Notas/Pedidos del maestro de obra', required: true }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia de un Ingeniero Supervisor.
El dueño no puede estar en 5 obras a la vez. Entrégale un reporte ejecutivo hiper-condensado de esta obra.
- Avance Físico: {{daily_progress}}
- Incidencias: {{incidents}}
- Logística: {{deliveries}}
- Pide el Residente: {{foreman_notes}}

Crea el "Semáforo del Contratista":
1. Indicador Visual: 🟢 (Obra Acelerada), 🟡 (Desfasaje Menor), 🔴 (Alerta Roja/Obra Estancada). Sustentado en 1 línea.
2. Nivel de Eficiencia de Hoy: Comparamos el {{daily_progress}} con las horas pagadas. ¿Fue rentable el jornal de hoy?
3. Peligro de Mañana: Tarea crítica que el dueño debe coordinar desde la oficina a primera hora debido al estatus de {{deliveries}} o los {{incidents}}.
4. Respuesta al Residente: Un mensaje corto, autoritario pero de apoyo, escrito para que el dueño se lo reenvíe directamente al maestro de obra respondiendo a {{foreman_notes}}.`
    },
    {
      slug: 'obra-loop',
      name_en: 'ObraLoop Premium',
      name_es: 'ObraLoop Premium',
      description_en: 'Predictable profits, constant cashflow, zero idle time.',
      description_es: 'Ganancias predecibles y cero horas muertas. El sistema premium.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'company_name', type: 'text', label_en: 'Company Name', label_es: 'Nombre de la Constructora', required: true },
        { id: 'specialty', type: 'text', label_en: 'Market Specialty', label_es: 'Especialidad (Vivienda, Comercial, Vías)', required: true },
        { id: 'cashflow_pain', type: 'textarea', label_en: 'Cashflow Pain', label_es: 'Problema del flujo de dinero actual', required: true },
        { id: 'operative_chaos', type: 'textarea', label_en: 'Operative Chaos', label_es: 'Caos operativo más frecuente con las cuadrillas', required: true }
      ],
      prompt_template: `Eres un Consultor de Imperios Constructores implementando la filosofía 'ObraLoop'.
- Constructora: {{company_name}}
- Fuerte (Nicho): {{specialty}}
- Agujero Financiero: {{cashflow_pain}}
- Desorden Operativo: {{operative_chaos}}

Diseña el Sistema ObraLoop (Reglas Inquebrantables de la Empresa) dividido en 3 vertientes rectoras:
1. DIQUE FINANCIERO: Una política drástica de 3 pasos que Ventas/Administración deberá implementar OBLIGATORIAMENTE para corregir {{cashflow_pain}} al negociar los hitos (hitos de control) de los próximos contratos.
2. CADENA OPERATIVA DE HIERRO: Un protocolo a exigirle a los proveedores y residentes para eliminar el caos de {{operative_chaos}}, estableciendo multas internas y ventanas de entrega.
3. MOTOR DE CRECIMIENTO: El manual de 'Soft-Selling' (Venta cruzada) de acabados o mantenimientos a los clientes {{specialty}} a usarse cuando la obra esté al 80% (justo cuando el cliente ya confía en nosotros al máximo).`
    }
  ]

  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').insert({
      id: appId,
      slug: app.slug,
      name_en: app.name_en,
      name_es: app.name_es,
      description_en: app.description_en,
      description_es: app.description_es,
      icon: app.icon,
      form_schema: app.form_schema,
      prompt_template: app.prompt_template
    })

    if (appError) {
      if (appError.code === '23505') {
        console.log(`App ${app.slug} already exists, updating it.`)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
             name_en: app.name_en,
             name_es: app.name_es,
             description_en: app.description_en,
             description_es: app.description_es,
             icon: app.icon,
             form_schema: app.form_schema,
             prompt_template: app.prompt_template
          }).eq('id', app.id)
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError.message)
        continue
      }
    } else {
      app.id = appId
    }

    // Link Plan
    let targetPlan = proPlan
    if (app.slug === 'obra-loop' || app.slug === 'decide-obra') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps')
        .select('*')
        .eq('plan_id', targetPlan.id)
        .eq('app_id', app.id)
        .single()
      
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('✅ Micro-Apps de Construcción (Seed) completado.')
}

run()
