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
  console.log('Seeding Micro-Apps para Talleres Mecánicos...')

  const apps = [
    {
      slug: 'reactiva-taller',
      name_en: 'ReactivaTaller',
      name_es: 'ReactivaTaller',
      description_en: 'That client didn\'t leave. They just need the right maintenance reminder.',
      description_es: 'Ese cliente no se fue. Solo olvidó su próximo mantenimiento. Recuérdaselo.',
      icon: 'Tool',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'vehicle', type: 'text', label_en: 'Vehicle Type/Model', label_es: 'Vehículo (Marca/Modelo)', required: true },
        { id: 'last_service', type: 'text', label_en: 'Last Service Done', label_es: 'Último servicio realizado', required: true },
        { id: 'last_date', type: 'text', label_en: 'Last Service Date', label_es: 'Fecha del último servicio', required: true },
        { id: 'mileage', type: 'text', label_en: 'Estimated Mileage', label_es: 'Kilometraje estimado actual', required: true },
        { id: 'channel', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options_es: ['WhatsApp', 'SMS', 'Llamada'],
          options_en: ['WhatsApp', 'SMS', 'Phone Call']
        }
      ],
      prompt_template: `Actúa como el mejor asesor de servicio automotriz. Tu objetivo es lograr que un cliente regrese para su siguiente mantenimiento sin sonar desesperado por vender.
Datos del vehículo y cliente:
- Cliente: {{client_name}}
- Vehículo: {{vehicle}}
- Último servicio: {{last_service}}
- Fecha anterior: {{last_date}}
- Kilometraje actual estimado: {{mileage}}
- Canal de contacto: {{channel}}

Genera 2 mensajes perfectos de reactivación listos para enviar por {{channel}}:
1. "Versión Preventiva": Enfocada en la seguridad del vehículo basada en su kilometraje y el tiempo transcurrido. Generar urgencia sutil sobre desgastes mecánicos.
2. "Versión Promocional": Ofreciendo revisión gratis o pequeño descuento por agendar hoy.
Finalmente, recomienda cuál de las 2 versiones usar basándote en el tipo de vehículo y tiempo desde el último servicio.`
    },
    {
      slug: 'upsell-taller',
      name_en: 'UpsellTaller AI',
      name_es: 'UpsellTaller AI',
      description_en: 'They came for oil. Discover what else their car needs.',
      description_es: 'Ya vino por un servicio. Ahora descubre qué más necesita su auto.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'main_service', type: 'text', label_en: 'Requested Service', label_es: 'Servicio principal solicitado', required: true },
        { id: 'history', type: 'textarea', label_en: 'Vehicle History', label_es: 'Historial del vehículo (roturas previas)', required: true },
        { id: 'mileage', type: 'text', label_en: 'Current Mileage', label_es: 'Kilometraje u odómetro aproximado', required: true },
        { id: 'budget', type: 'select', label_en: 'Client Budget Profile', label_es: 'Presupuesto estimado del cliente', required: true,
          options_es: ['Económico/Estricto', 'Medio', 'Premium/No escatima'],
          options_en: ['Strict/Economy', 'Medium', 'Premium/No limit']
        },
        { id: 'menu_available', type: 'textarea', label_en: 'Services Available', label_es: 'Catálogo de servicios disponibles en taller', required: true }
      ],
      prompt_template: `Eres el Jefe de Taller más rentable del país. Un auto acaba de ingresar.
- Viene por: {{main_service}}
- Historial: {{history}}
- Kilometraje: {{mileage}}
- Perfil del dueño: {{budget}}
- Mi catálogo de servicios: {{menu_available}}

Basado estrictamente en la mecánica preventiva para su kilometraje y su perfil, detecta los 3 'upsells' (servicios adicionales) más probables de cerrar hoy.
Para cada uno:
1. Servicio a ofrecer.
2. Argumento técnico: ¿qué pasaría si NO lo hace hoy? (Causa/Efecto mecánico).
3. Guion corto y directo para que el mecánico/recepcionista se lo diga al cliente y cierre la venta adicional sin parecer vendedor.`
    },
    {
      slug: 'orden-taller',
      name_en: 'OrdenTaller',
      name_es: 'OrdenTaller',
      description_en: 'Never lose an appointment due to poor coordination.',
      description_es: 'Nunca más una cita agendada perdida por falta de repuestos o mecánicos.',
      icon: 'CalendarCheck',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client / Car', label_es: 'Nombre del cliente y auto', required: true },
        { id: 'service', type: 'text', label_en: 'Scheduled Service', label_es: 'Servicio agendado', required: true },
        { id: 'date_time', type: 'text', label_en: 'Date & Time', label_es: 'Fecha y hora de llegada', required: true },
        { id: 'mechanic', type: 'text', label_en: 'Assigned Mechanic', label_es: 'Mecánico asignado', required: true },
        { id: 'observations', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones (ruidos raros, repuestos a comprar)', required: true }
      ],
      prompt_template: `Actúa como el Gerente General y Controlador de Calidad del taller mecánico.
Recibimos la siguiente cita:
- Vehículo/Cliente: {{client_name}}
- Cita para: {{service}}
- Horario de llegada: {{date_time}}
- Mecánico: {{mechanic}}
- Notas del cliente: {{observations}}

Para evitar pérdidas de tiempo y clientes enojados, convierte esta cita en un CHECKLIST OPERATIVO a prueba de errores.
Debe contener:
1. Tareas de Pre-Llegada: (¿Qué bodega/repuestos debe tener listo ANTES de que el auto cruce la puerta?).
2. Checklist para Recepción: (Preguntas obligatorias a hacerle al cliente al recibir la llave).
3. Directriz para el Mecánico ({{mechanic}}): Instrucciones claras basadas en el servicio y las notas.
4. Revisión Final sugerida (QC) antes de devolver el auto.`
    },
    {
      slug: 'decide-taller',
      name_en: 'DecideTaller',
      name_es: 'DecideTaller',
      description_en: 'Your numbers must tell you which service generates the most profit.',
      description_es: 'Tus números deben decirte qué servicio te deja más dinero.',
      icon: 'PieChart',
      form_schema: [
        { id: 'sales_report', type: 'textarea', label_en: 'Workshop Report', label_es: 'Reporte del taller (números crudos)', required: true },
        { id: 'problem', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema percibido', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options_es: ['Mecánicos/Mano de obra', 'Repuestos/Inventario', 'Ventas/Citas'],
          options_en: ['Mechanics/Labor', 'Parts/Inventory', 'Sales/Appointments']
        },
        { id: 'context', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante (baja temporada, renunció alguien)', required: true }
      ],
      prompt_template: `Eres un Consultor Financiero Experto en Centros Automotrices.
El dueño te trae estos datos. No quiere gráficos bonitos, quiere decisiones DURAS Y RENTABLES hoy mismo.
- Datos: {{sales_report}}
- Síntoma del negocio: {{problem}}
- Área elegida: {{area}}
- Contexto: {{context}}

Entrega 3 decisiones operativas ejecutables hoy mismo.
Cada decisión debe tener:
1. Qué cambiar (Ej: subir margen a frenos, dar de baja cierto servicio, cambiar comisión).
2. Justificación en base a los números o las heurísticas de talleres mecánicos modernos.
3. El primer paso rápido para ejecutarlo hoy.`
    },
    {
      slug: 'pulse-taller',
      name_en: 'PulseTaller',
      name_es: 'PulseTaller',
      description_en: 'Know how your workshop is doing today without calling anyone.',
      description_es: 'Sabe cómo va tu taller hoy sin llamar ni perseguir a cada mecánico.',
      icon: 'Activity',
      form_schema: [
        { id: 'daily_report', type: 'textarea', label_en: 'Daily Report Data', label_es: 'Reporte del día (corte preliminar)', required: true },
        { id: 'goal', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada (autos o $)', required: true },
        { id: 'incidents', type: 'textarea', label_en: 'Incidents/Delays', label_es: 'Incidencias, retrasos en elevadores o fallas', required: true },
        { id: 'sales', type: 'textarea', label_en: 'Actual Sales', label_es: 'Ventas/Autos liberados hasta el momento', required: true },
        { id: 'manager_comments', type: 'textarea', label_en: 'Manager Comments', label_es: 'Comentarios del encargado', required: true }
      ],
      prompt_template: `Eres un Auditor Automotriz Automatizado.
El dueño NO está en el taller. Necesita un resumen rápido de cómo va el día.
- Reporte crudo: {{daily_report}}
- Meta: {{goal}}
- Ventas reales al momento: {{sales}}
- Retrasos/Incidencias: {{incidents}}
- Encargado dice: {{manager_comments}}

Genera el "Semáforo Operativo" para el dueño del taller:
1. Semáforo: 🟢 (Todo bien), 🟡 (Alerta), o 🔴 (Fuego/Autos estancados) y por qué de forma directa.
2. Resumen Ejecutivo (3 viñetas cortas, la pura verdad).
3. Brecha de Rentabilidad: Cómo vamos contra la meta.
4. Acciones Urgentes: 1 o 2 instrucciones que el dueño debe enviar por WhatsApp al grupo del taller ahora mismo.`
    },
    {
      slug: 'auto-loop',
      name_en: 'AutoLoop Premium',
      name_es: 'AutoLoop',
      description_en: 'From the appointment to the client\'s return. Total control.',
      description_es: 'Desde la cita hasta el regreso del cliente. El sistema premium de control total.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'shop_name', type: 'text', label_en: 'Workshop Name', label_es: 'Nombre del taller', required: true },
        { id: 'target', type: 'text', label_en: 'Target Audience/Cars', label_es: 'Tipos de autos atendidos (Alta gama, comerciales, etc)', required: true },
        { id: 'operation_report', type: 'textarea', label_en: 'Operation Report', label_es: 'Problemas operativos del mes pasado', required: true },
        { id: 'inactive_clients', type: 'textarea', label_en: 'Inactive Clients', label_es: 'Patrón de clientes inactivos o perdidos', required: true }
      ],
      prompt_template: `Eres un 'Director de Operaciones Automotrices Virtual'.
Estás implementando la Fusión Premium (ReactivaTaller + OrdenTaller + PulseTaller).
- Taller: {{shop_name}}
- Nicho: {{target}}
- Fallas recientes: {{operation_report}}
- Drenaje de clientes: {{inactive_clients}}

Diseña un Master-Plan Operativo "AutoLoop" de 3 ejes:
1. RETENCIÓN ACELERADA: El guion exacto de 2 pasos que Recepción DEBE usar en el momento de entregar la llave para asegurar el regreso del cliente en X meses.
2. CITAS A PRUEBA DE BALAS: Un estándar operativo para que el mecánico no pierda 1 hora buscando repuestos, enfocado en solucionar los problemas operativos mencionados.
3. DASHBOARD DEL DUEÑO: Los únicos 3 KPIs diarios indispensables que el dueño exigirá ver cada noche por mensaje para garantizar el flujo de caja positivo.`
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
    if (app.slug === 'auto-loop' || app.slug === 'decide-taller') {
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

  console.log('✅ Micro-Apps para Talleres (Seed) completado.')
}

run()
