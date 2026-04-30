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
  console.log('Seeding Micro-Apps para Restaurantes...')

  const apps = [
    {
      slug: 'reactiva-food',
      name_en: 'ReactivaFood',
      name_es: 'ReactivaFood',
      description_en: 'That client didn\'t leave. They just need the right message to return.',
      description_es: 'Ese cliente no se fue. Solo necesita el mensaje correcto para regresar.',
      icon: 'MessageCircle',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'last_visit', type: 'text', label_en: 'Last Visit', label_es: 'Última visita', required: true },
        { id: 'avg_ticket', type: 'text', label_en: 'Average Order Value', label_es: 'Consumo promedio', required: true },
        { id: 'frequency', type: 'select', label_en: 'Usual Frequency', label_es: 'Frecuencia habitual', required: true,
          options: [
            { value: 'first_time', label_en: 'First Time', label_es: 'Primera vez' },
            { value: 'occasional', label_en: 'Occasional', label_es: 'Ocasional' },
            { value: 'frequent', label_en: 'Frequent', label_es: 'Frecuente' }
          ]
        },
        { id: 'channel', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'instagram', label_en: 'Instagram', label_es: 'Instagram' },
            { value: 'sms', label_en: 'SMS', label_es: 'SMS' }
          ]
        }
      ],
      prompt_template: `Actúa como un experto en marketing gastronómico y ventas.
Necesito reactivar a un cliente de mi restaurante que ha dejado de venir. Usa la siguiente información:
- Nombre del cliente: {{client_name}}
- Última visita: {{last_visit}}
- Consumo promedio: {{avg_ticket}}
- Frecuencia habitual: {{frequency}}
- Canal a utilizar: {{channel}}

Genera 2 mensajes perfectos de reactivación listos para copiar y pegar en el canal seleccionado:
1. Una "versión suave" (conversacional, recordando la buena experiencia, sin vender directamente).
2. Una "versión promocional" (con un gancho o incentivo irresistible basado en su consumo promedio).
Finalmente, recomienda cuál de las 2 versiones usar según la frecuencia habitual del cliente.`
    },
    {
      slug: 'upsell-food',
      name_en: 'UpsellFood AI',
      name_es: 'UpsellFood AI',
      description_en: 'They already ordered. Now discover what else to sell them.',
      description_es: 'Ya pidió una vez. Ahora descubre qué más venderle.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'current_order', type: 'text', label_en: 'Current Order', label_es: 'Pedido actual', required: true },
        { id: 'history', type: 'textarea', label_en: 'Client History', label_es: 'Historial del cliente', required: true },
        { id: 'avg_ticket', type: 'text', label_en: 'Average Ticket', label_es: 'Ticket promedio', required: true },
        { id: 'profile', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente (ej. familiar, fit, oficinista)', required: true },
        { id: 'menu_available', type: 'textarea', label_en: 'Available Menu', label_es: 'Menú disponible', required: true }
      ],
      prompt_template: `Eres el mejor mesero/ventas de un restaurante de clase mundial.
Tu objetivo es aumentar el ticket promedio sin que el cliente sienta que le estás vendiendo.
Analiza la siguiente mesa/pedido:
- Pedido actual: {{current_order}}
- Historial del cliente: {{history}}
- Ticket promedio: {{avg_ticket}}
- Perfil del cliente: {{profile}}
- Menú disponible: {{menu_available}}

Detecta los 3 upsells (ventas adicionales o cruzadas) más probables de éxito.
Para cada uno genera:
1. El producto a ofrecer.
2. El argumento comercial / psicológico de por qué lo comprará.
3. El guion o frase exacta que el mesero debe decirle para cerrar la venta natural y tentadora.`
    },
    {
      slug: 'reserva-food',
      name_en: 'ReservaFood',
      name_es: 'ReservaFood',
      description_en: 'Never lose a reservation again. From reservation to operational checklist.',
      description_es: 'Nunca más una reserva perdida. De reserva a checklist operativo garantizado.',
      icon: 'CalendarCheck',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'date_time', type: 'text', label_en: 'Date and Time', label_es: 'Fecha y hora', required: true },
        { id: 'pax', type: 'text', label_en: 'Number of People (Pax)', label_es: 'Número de personas', required: true },
        { id: 'type', type: 'select', label_en: 'Reservation Type', label_es: 'Tipo de reserva', required: true,
          options: [
            { value: 'normal', label_en: 'Normal Dinner/Lunch', label_es: 'Comida/Cena normal' },
            { value: 'birthday', label_en: 'Birthday / Celebration', label_es: 'Cumpleaños / Celebración' },
            { value: 'anniversary', label_en: 'Anniversary', label_es: 'Aniversario' },
            { value: 'corporate', label_en: 'Corporate', label_es: 'Corporativa / Negocios' }
          ]
        },
        { id: 'observations', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones especiales (alergias, pedidos)', required: true }
      ],
      prompt_template: `Actúa como Maître y Gerente de Operaciones de un restaurante premium.
Recibimos una nueva reserva. Conviértela en un checklist operativo impecable a prueba de fallos.
Datos de la reserva:
- Cliente: {{client_name}}
- Fecha y hora: {{date_time}}
- Personas: {{pax}}
- Tipo de evento: {{type}}
- Observaciones: {{observations}}

Genera un documento que contenga:
1. Alerta Principal (lo más importante a cuidar).
2. Checklist para Recepción/Host (asignación de mesa, saludo ideal).
3. Checklist para Cocina (alertas por alergias o tiempos y requerimientos según el tipo de evento).
4. Checklist para Salón/Mesero (detalles de servicio, preparativos, posible venta cruzada/upsell recomendada para este tipo de evento).`
    },
    {
      slug: 'decide-food',
      name_en: 'DecideFood',
      name_es: 'DecideFood',
      description_en: 'Your numbers must tell you what to sell and what to change.',
      description_es: 'Tus números deben decirte qué vender más y cómo ser más rentable.',
      icon: 'PieChart',
      form_schema: [
        { id: 'sales_report', type: 'textarea', label_en: 'Sales Report', label_es: 'Reporte de ventas (datos crudos)', required: true },
        { id: 'problem', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema percibido', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'salon', label_en: 'Dining Room', label_es: 'Salón' },
            { value: 'kitchen', label_en: 'Kitchen / Menu', label_es: 'Cocina / Menú' },
            { value: 'delivery', label_en: 'Delivery', label_es: 'Delivery' }
          ]
        },
        { id: 'context', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante (ej. temporada baja, falta de personal)', required: true }
      ],
      prompt_template: `Eres un Consultor Gastronómico Experto en Rentabilidad y Costos.
El dueño del restaurante te presenta este escenario, no quiere datos obvios, quiere DECISIONES ACCIONABLES INMEDIATAS.
- Reporte/Números de ventas: {{sales_report}}
- Problema central: {{problem}}
- Área afectada: {{area}}
- Contexto de la situación: {{context}}

Entrégale exactamente 3 decisiones operativas/comerciales ejecutables hoy mismo.
Cada decisión debe tener:
1. Qué se debe hacer (ej: eliminar plato X, armar promo Y, cambiar horario Z).
2. Justificación basada en la información proporcionada o heurísticas estándar de la industria gastronómica.
3. El primer paso para ejecutarlo ahora.`
    },
    {
      slug: 'pulse-food',
      name_en: 'PulseFood',
      name_es: 'PulseFood',
      description_en: 'Know how your restaurant is doing today without calling anyone.',
      description_es: 'Sabe cómo va tu restaurante hoy sin tener que llamar al encargado.',
      icon: 'Activity',
      form_schema: [
        { id: 'daily_report', type: 'textarea', label_en: 'Daily Report Data', label_es: 'Reporte del día (corte de caja preliminar)', required: true },
        { id: 'goal', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada ($ o Pax)', required: true },
        { id: 'incidents', type: 'textarea', label_en: 'Incidents/Delays', label_es: 'Incidencias, quejas o retrasos', required: true },
        { id: 'sales', type: 'textarea', label_en: 'Actual Sales', label_es: 'Ventas realizadas al momento', required: true },
        { id: 'manager_comments', type: 'textarea', label_en: 'Manager Comments', label_es: 'Comentarios del encargado', required: true }
      ],
      prompt_template: `Eres un Auditor Operativo Automatizado para el dueño de un restaurante.
El dueño NO ESTÁ PRESENTE y necesita entender de un vistazo cómo va el restaurante en este turno.
- Reporte crudo: {{daily_report}}
- Meta del turno: {{goal}}
- Ventas reales: {{sales}}
- Incidencias reportadas: {{incidents}}
- Comentarios del gerente: {{manager_comments}}

Genera el "Semáforo Operativo" para el dueño:
1. El Semáforo: 🟢 (Todo bien), 🟡 (Alerta moderada), o 🔴 (Fuego/Crítico) y por qué.
2. Resumen Ejecutivo (en 3 viñetas breves, lo esencial que el dueño debe saber).
3. Brecha de Ventas: (Cómo vamos vs la meta esperada y qué falta para llegar).
4. Acciones Urgentes: (1 o 2 cosas que el dueño debe autorizar, ordenar o revisar de inmediato).`
    },
    {
      slug: 'food-loop',
      name_en: 'FoodLoop Premium',
      name_es: 'FoodLoop',
      description_en: 'From reservation to the client\'s return. The premium 3-in-1 system.',
      description_es: 'Desde la reserva hasta el regreso del cliente. El sistema premium para el control total.',
      icon: 'Infinity',
      form_schema: [
        { id: 'restaurant_name', type: 'text', label_en: 'Restaurant Name', label_es: 'Nombre del restaurante', required: true },
        { id: 'target_audience', type: 'text', label_en: 'Target Audience Profile', label_es: 'Perfil del público', required: true },
        { id: 'operation_report', type: 'textarea', label_en: 'Operation Report', label_es: 'Resumen operativo del mes anterior', required: true },
        { id: 'inactive_clients', type: 'textarea', label_en: 'Inactive Clients Pattern', label_es: 'Patrón de clientes que no vuelven', required: true }
      ],
      prompt_template: `Eres un 'Director Gastronómico Virtual'.
Estás implementando la Fusión Premium (ReactivaFood + ReservaFood + PulseFood) para estructurar el ecosistema operativo.
Restaurante: {{restaurant_name}}
Público: {{target_audience}}
Problemas operativos recientes: {{operation_report}}
Patrón de clientes perdidos: {{inactive_clients}}

Diseña un Master-Plan Operativo "FoodLoop" de 3 ejes:
1. PLAN DE RETENCIÓN CERO CAÍDAS: Un protocolo estándar para los próximos 30 días para recuperar clientes inactivos.
2. PROTOCOLO DE RESERVAS REDITUABLES: Cómo cada reserva en este salón debe estructurarse para garantizar 1 upsell de alto ticket.
3. DASHBOARD MENTAL DEL DUEÑO: 3 KPIs diarios indispensables que el dueño debe exigir a su encargado para no perder dinero hoy, basados en las recientes fallas operativas.`
    }
  ]

  // Fetch plans
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
        console.error(`Error inserting ${app.slug}:`, appError)
        continue
      }
    } else {
      app.id = appId
    }

    // Link Plan
    let targetPlan = proPlan
    if (app.slug === 'food-loop' || app.slug === 'decide-food') {
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

  console.log('✅ Micro-Apps para Restaurantes (Seed) completado.')
}

run()
