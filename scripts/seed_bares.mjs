import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🍺 Seeding Micro-Apps para Bares y Entretenimiento Nocturno...')

  const apps = [
    {
      slug: 'reactiva-noche',
      name_en: 'ReactivaNoche',
      name_es: 'ReactivaNoche',
      description_en: 'Your regulars haven\'t shown up in weeks. One message fills your slow Tuesday.',
      description_es: 'Tus clientes frecuentes no aparecen. Un mensaje llena tu martes muerto.',
      icon: 'Moon',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Customer Name or Group', label_es: 'Nombre del cliente o grupo habitual', required: true },
        { id: 'tipo_lugar', type: 'select', label_en: 'Venue Type', label_es: 'Tipo de lugar', required: true,
          options: [
            { value: 'bar', label_en: 'Bar / Cantina', label_es: 'Bar / Cantina' },
            { value: 'antro', label_en: 'Nightclub / Antro', label_es: 'Antro / Discoteca' },
            { value: 'lounge', label_en: 'Lounge / Rooftop', label_es: 'Lounge / Rooftop' },
            { value: 'karaoke', label_en: 'Karaoke Bar', label_es: 'Bar de karaoke' },
            { value: 'sports_bar', label_en: 'Sports Bar', label_es: 'Sports Bar' },
            { value: 'cerveceria', label_en: 'Craft Beer Bar', label_es: 'Cervecería / bar de cervezas artesanales' }
          ]
        },
        { id: 'consumo_habitual', type: 'text', label_en: 'Their Usual Order / Preference', label_es: 'Consumo o preferencia habitual del cliente', required: true, placeholder_es: 'Botella de whisky con mesa VIP, cervezas artesanales, mesa para 6 los viernes...' },
        { id: 'semanas_ausente', type: 'text', label_en: 'Weeks Without Visiting', label_es: 'Semanas sin visitar', required: true },
        { id: 'evento_proximo', type: 'text', label_en: 'Upcoming Event or Promotion', label_es: 'Evento o promoción próxima que puedas usar de gancho', required: false, placeholder_es: 'Viernes de DJ resident, 2x1 en cocktails miércoles, noche de futbol...' }
      ],
      prompt_template: `Actúa como el Gerente de Relaciones VIP de un bar o antro que sabe que sus mejores clientes no se van — simplemente necesitan la excusa correcta para regresar.

Cliente: {{cliente}}
Tipo de local: {{tipo_lugar}}
Consumo habitual: {{consumo_habitual}}
Sin visitar: {{semanas_ausente}} semanas
Próximo evento: {{evento_proximo}}

Genera DOS mensajes de reactivación listos para enviar por WhatsApp:

1. "VERSIÓN NOSTALGIA + EXCLUSIVIDAD":
Hazle saber a {{cliente}} que el {{tipo_lugar}} lo recuerda. Menciona su {{consumo_habitual}} como si estuviera esperándolo. Si hay {{evento_proximo}}, preséntalo como la excusa perfecta para volver con un beneficio exclusivo por ser cliente frecuente (mesa reservada, primera ronda en la casa, acceso preferencial). Tono: amigo que te invita, no promotor. Máx. 5 líneas.

2. "VERSIÓN EVENTO + URGENCIA" (directa con fecha límite):
Usa el {{evento_proximo}} o crea una razón concreta esta semana (noche temática, partido importante, 2x1 especial) con cupo limitado. El beneficio de llegar: reservar ahora con {{cliente}} para garantizar su mesa o botella. CTA directo: "¿Te anoto esta semana?". Máx. 4 líneas.

Al final sugiere: el día y hora ideal de la semana para enviar este mensaje a clientes de {{tipo_lugar}} y maximizar la conversión.`
    },
    {
      slug: 'upsell-bar-ai',
      name_en: 'UpsellBar AI',
      name_es: 'UpsellBar AI',
      description_en: 'They ordered a beer. Discover how to turn their night into a premium experience.',
      description_es: 'Pidieron una cerveza. Convierte su noche en una experiencia premium con ticket mayor.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'grupo_cliente', type: 'text', label_en: 'Customer / Group Description', label_es: 'Descripción del cliente o grupo en el local', required: true, placeholder_es: 'Grupo de 4 amigos celebrando cumpleaños, pareja en primera visita, grupo de 8 en reservación...' },
        { id: 'consumo_actual', type: 'text', label_en: 'Current Order', label_es: 'Consumo actual o inicial del grupo', required: true, placeholder_es: 'Pidieron cervezas sueltas, una botella de vodka, 4 cocteles...' },
        { id: 'tipo_lugar', type: 'select', label_en: 'Venue Type', label_es: 'Tipo de establecimiento', required: true,
          options: [
            { value: 'bar', label_en: 'Bar / Cantina', label_es: 'Bar / Cantina' },
            { value: 'antro', label_en: 'Nightclub / Antro', label_es: 'Antro / Discoteca' },
            { value: 'lounge', label_en: 'Lounge / Rooftop', label_es: 'Lounge / Rooftop' },
            { value: 'karaoke', label_en: 'Karaoke Bar', label_es: 'Bar de karaoke' },
            { value: 'sports_bar', label_en: 'Sports Bar', label_es: 'Sports Bar' },
            { value: 'cerveceria', label_en: 'Craft Beer Bar', label_es: 'Cervecería artesanal' }
          ]
        },
        { id: 'ocasion', type: 'select', label_en: 'Occasion / Context', label_es: 'Ocasión o contexto de la visita', required: true,
          options: [
            { value: 'cumpleanos', label_en: 'Birthday Celebration', label_es: 'Celebración de cumpleaños' },
            { value: 'fiesta_general', label_en: 'General Night Out', label_es: 'Salida de fin de semana general' },
            { value: 'evento_empresa', label_en: 'Corporate / Work Event', label_es: 'Evento corporativo / trabajo' },
            { value: 'fecha_especial', label_en: 'Special Date / Anniversary', label_es: 'Fecha especial / aniversario' },
            { value: 'casual', label_en: 'Casual / Regular Night', label_es: 'Visita casual / entre semana' }
          ]
        },
        { id: 'menu_premium', type: 'textarea', label_en: 'Premium Products / Experiences Available', label_es: 'Productos premium o experiencias disponibles en el local', required: true, placeholder_es: 'Botella VIP con servicio, mesa reservada, shot de bienvenida, tabla de botanas premium, acceso VIP a pista, coctel especial de la casa...' }
      ],
      prompt_template: `Eres el Gerente de Experiencias de un {{tipo_lugar}} de alto ticket que sabe que el momento de mayor apertura del cliente no es cuando entra — es cuando ya lleva 30 minutos adentro y el ambiente lo tiene en modo celebración.

Grupo: {{grupo_cliente}}
Consumo actual: {{consumo_actual}}
Ocasión: {{ocasion}}
Opciones premium disponibles: {{menu_premium}}

Identifica los 3 upsells con mayor probabilidad de aceptación para ESTE grupo en ESTE momento. Para cada uno:

1. QUÉ OFRECER: El producto o experiencia de {{menu_premium}} más apropiado dada la {{ocasion}} y el {{consumo_actual}} actual.

2. EL MOMENTO Y ARGUMENTO: Cuándo exactamente en la noche presentarlo (al llegar, al pedir la segunda ronda, en el punto alto de la noche) y cómo convertirlo en parte de la experiencia, no en una venta.

3. EL GUION DEL MESERO: Las palabras exactas que el mesero o bartender dice de forma natural, conectando el upsell con la {{ocasion}} de {{grupo_cliente}}. Ej: para cumpleaños → "¿Le avisamos al DJ para que diga su nombre en la pista? Viene incluido con el servicio de botella."

Cierra con: el "Paquete de Noche Perfecta" — cómo presentar el consumo + los 3 upgrades agrupados como una "experiencia {{ocasion}}" con nombre, precio total y el beneficio que hace que el grupo diga "vámonos por eso".`
    },
    {
      slug: 'promo-noche-ai',
      name_en: 'PromoNoche AI',
      name_es: 'PromoNoche AI',
      description_en: 'Pack your slow nights with promotions that actually get people off the couch.',
      description_es: 'Llena tus noches muertas con promociones que sacan a la gente del sofá.',
      icon: 'Zap',
      form_schema: [
        { id: 'nombre_lugar', type: 'text', label_en: 'Venue Name', label_es: 'Nombre del bar o antro', required: true },
        { id: 'tipo_lugar', type: 'select', label_en: 'Venue Type', label_es: 'Tipo de lugar', required: true,
          options: [
            { value: 'bar', label_en: 'Bar / Cantina', label_es: 'Bar / Cantina' },
            { value: 'antro', label_en: 'Nightclub / Antro', label_es: 'Antro / Discoteca' },
            { value: 'lounge', label_en: 'Lounge / Rooftop', label_es: 'Lounge / Rooftop' },
            { value: 'karaoke', label_en: 'Karaoke Bar', label_es: 'Bar de karaoke' },
            { value: 'sports_bar', label_en: 'Sports Bar', label_es: 'Sports Bar' },
            { value: 'cerveceria', label_en: 'Craft Beer Bar', label_es: 'Cervecería artesanal' }
          ]
        },
        { id: 'tipo_promo', type: 'select', label_en: 'Promotion Type', label_es: 'Tipo de promoción a comunicar', required: true,
          options: [
            { value: 'noche_tematica', label_en: 'Themed Night / Special Event', label_es: 'Noche temática / evento especial' },
            { value: 'happy_hour', label_en: 'Happy Hour / 2x1', label_es: 'Happy hour / 2x1 en bebidas' },
            { value: 'reservacion_vip', label_en: 'VIP Reservation / Bottle Service', label_es: 'Reservación VIP / servicio de botella' },
            { value: 'evento_deportivo', label_en: 'Sports Event / Game Night', label_es: 'Evento deportivo / noche de partido' },
            { value: 'lanzamiento', label_en: 'New Product / Menu Launch', label_es: 'Lanzamiento de nuevo producto o menú' },
            { value: 'noche_lenta', label_en: 'Filling a Slow Night', label_es: 'Llenar una noche floja (miércoles, martes)' }
          ]
        },
        { id: 'fecha_hora', type: 'text', label_en: 'Event Date and Time', label_es: 'Fecha y hora del evento o promoción', required: true },
        { id: 'detalle_promo', type: 'textarea', label_en: 'Promotion Details', label_es: 'Detalles de la promoción, precios o atractivos', required: true, placeholder_es: '2x1 en cervezas artesanales de 6 a 9pm, botella desde $800 con mesa reservada para 4, DJ invitado, karaoke con premios...' },
        { id: 'target', type: 'select', label_en: 'Target Audience', label_es: 'Público objetivo de la promo', required: true,
          options: [
            { value: 'jovenes_25_35', label_en: 'Young adults 25-35', label_es: 'Jóvenes 25-35 años' },
            { value: 'ejecutivos', label_en: 'Executives / After-office crowd', label_es: 'Ejecutivos / after office' },
            { value: 'parejas', label_en: 'Couples', label_es: 'Parejas' },
            { value: 'grupos_amigos', label_en: 'Friend groups', label_es: 'Grupos de amigos' },
            { value: 'clientes_existentes', label_en: 'Existing regulars only', label_es: 'Base de clientes existentes (lista de difusión)' }
          ]
        }
      ],
      prompt_template: `Eres el Director Creativo de un equipo de marketing nocturno que sabe que la diferencia entre una noche llena y una vacía no es el DJ — es el mensaje que se envió el martes por la tarde.

Lugar: {{nombre_lugar}} ({{tipo_lugar}})
Tipo de promo: {{tipo_promo}}
Fecha y hora: {{fecha_hora}}
Detalles: {{detalle_promo}}
Público objetivo: {{target}}

Genera el "Kit de Campaña de Noche" completo:

1. EL GANCHO (el mensaje que detiene el scroll y hace decir "hay que ir"):
3 opciones de frase de apertura para {{tipo_promo}} en {{nombre_lugar}}. Una misteriosa, una directa con beneficio, una con urgencia de cupo. Adaptadas al tono del {{tipo_lugar}}.

2. MENSAJE PARA LISTA DE DIFUSIÓN DE WHATSAPP (el más importante):
El texto completo para enviar a la base de clientes existentes. 6-8 líneas máximo. Emojis estratégicos, el beneficio principal de {{detalle_promo}}, urgencia real basada en {{fecha_hora}}, y CTA directo ("Escríbeme RESERVO y te guardo lugar"). Tono: como un amigo que te da el tip.

3. CAPTION DE INSTAGRAM / FACEBOOK:
Copy evocador que vende la experiencia antes de la promoción. Que vean la imagen y ya puedan oler el ambiente. Hashtags relevantes para {{tipo_lugar}} en mercado latino. CTA al link de reserva.

4. STORY / REELS COPY (texto para video corto):
El guion de 5-7 segundos para la pantalla del story: frase inicial de impacto → beneficio → CTA. Que funcione sin sonido.

5. SECUENCIA DE 3 MENSAJES:
Día -3: Genera expectativa sin revelar todo.
Día -1: Detalle completo + urgencia de últimos lugares.
Día mismo: Recordatorio de "esta noche" para los que ya confirmaron y los indecisos.`
    },
    {
      slug: 'decide-bar',
      name_en: 'DecideBar',
      name_es: 'DecideBar',
      description_en: 'Your bar data should tell you what nights to push and what to cut.',
      description_es: 'Tus datos deben decirte qué noches impulsar, qué drinks valen y qué cortar.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_bar', type: 'textarea', label_en: 'Bar / Venue Data (revenue, best nights, top drinks)', label_es: 'Datos del bar (ingresos, noches más rentables, tragos más vendidos, costo de operación)', required: true, placeholder_es: 'Ingreso semana: $95,000, viernes: 45% del total, miércoles: muerto, trago top: margarita ($80, costo $18), personal: 4 meseros + 2 bartenders...' },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Principal problema o decisión a resolver', required: true, placeholder_es: '¿Cómo llenar los miércoles? / ¿Vale la pena abrir entre semana? / ¿Qué trago impulsar para subir margen?' },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área de análisis', required: true,
          options: [
            { value: 'noches', label_en: 'Night / Day Profitability', label_es: 'Rentabilidad por noche / día' },
            { value: 'menu', label_en: 'Menu & Drink Margins', label_es: 'Menú y márgenes por bebida' },
            { value: 'personal', label_en: 'Staff & Labor Costs', label_es: 'Personal y costos laborales' },
            { value: 'eventos', label_en: 'Events & Promotions ROI', label_es: 'ROI de eventos y promociones' },
            { value: 'clientes', label_en: 'Customer Loyalty & Retention', label_es: 'Fidelización y retención de clientes' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context (competition, zone, seasonality)', label_es: 'Contexto relevante (competencia, zona, temporada, regulaciones locales)', required: true }
      ],
      prompt_template: `Eres un Consultor de Revenue Management para bares, antros y locales de entretenimiento nocturno. Has reestructurado negocios nocturnos que parecían rentables pero quemaban efectivo.

Datos del negocio: {{datos_bar}}
Problema: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Comerciales Ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y medible. Ej: "Eliminar la noche del martes y redirigir ese costo de personal a un evento especial el primer miércoles del mes que genere 3x más que 4 martes normales".
2. FUNDAMENTO EN NÚMEROS: Cómo los datos de {{datos_bar}} justifican esta decisión específica para el área de {{area}}.
3. EJECUCIÓN ESTA SEMANA: El primer paso que el dueño o gerente ejecuta mañana para activar la decisión.

Finaliza con el "Diagnóstico de Salud del Negocio Nocturno":
🟢 Negocio Nocturno Rentable | 🟡 Noches inconsistentes y margen frágil | 🔴 Costos fijos vs. ingresos variables en punto crítico
Justificado en dos líneas con los datos proporcionados.`
    },
    {
      slug: 'pulse-bar',
      name_en: 'PulseBar',
      name_es: 'PulseBar',
      description_en: 'Know if tonight was profitable before the last customer leaves.',
      description_es: 'Sabe si la noche fue rentable antes de que salga el último cliente.',
      icon: 'Activity',
      form_schema: [
        { id: 'cubiertos_noche', type: 'text', label_en: 'Covers / Customers Tonight', label_es: 'Cubiertos o clientes atendidos esta noche', required: true },
        { id: 'ingresos_noche', type: 'text', label_en: 'Tonight\'s Revenue ($)', label_es: 'Ingresos de la noche ($)', required: true },
        { id: 'consumo_top', type: 'text', label_en: 'Top-Selling Drink / Product Tonight', label_es: 'Bebida o producto top de la noche', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents / Notable Events', label_es: 'Incidencias o situaciones relevantes de la noche', required: true, placeholder_es: 'Cliente conflictivo en barra, falla en sistema de punto de venta, bartender llegó tarde, mesa vip canceló...' },
        { id: 'meta_noche', type: 'text', label_en: 'Tonight\'s Revenue Goal ($)', label_es: 'Meta de ingresos de la noche ($)', required: false },
        { id: 'gastos_noche', type: 'text', label_en: 'Tonight\'s Costs (staff, supplies, DJ)', label_es: 'Costos de la noche (personal, insumos, DJ, seguridad)', required: false }
      ],
      prompt_template: `Actúa como el Sistema de Control de un negocio nocturno de alto rendimiento.
El dueño quiere saber en 60 segundos si la noche valió la pena y qué hacer diferente mañana o el próximo fin de semana.

- Cubiertos / clientes: {{cubiertos_noche}}
- Ingresos de la noche: \${{ingresos_noche}}
- Bebida top: {{consumo_top}}
- Incidencias: {{incidencias}}
- Meta de la noche: \${{meta_noche}}
- Costos estimados: \${{gastos_noche}}

Genera el "PulseBar de la Noche":

1. SEMÁFORO DE RENTABILIDAD NOCTURNA:
🟢 Noche Exitosa | 🟡 Cubrimos costos y poco más | 🔴 Noche bajo la meta
Basado en: ingresos \${{ingresos_noche}} vs. meta \${{meta_noche}}, margen real (ingresos menos \${{gastos_noche}}), y ticket promedio por cliente.

2. ANÁLISIS DEL TICKET:
Calcula el ticket promedio (\${{ingresos_noche}} / {{cubiertos_noche}}). ¿Es saludable para un {{tipo}} negocio nocturno? ¿Hubo upsell o solo consumo básico?

3. GESTIÓN DE INCIDENCIAS:
Para la incidencia más grave de {{incidencias}}, el protocolo de manejo: cómo se documenta, qué acción correctiva implementar para que no se repita y si requiere comunicación al equipo o al cliente.

4. APRENDIZAJE DE LA NOCHE:
1 cosa que funcionó hoy (basada en {{consumo_top}} y nivel de asistencia) y 1 cosa que no funcionó (basada en {{incidencias}} o en la brecha vs. \${{meta_noche}}). Sin adornos.

5. ACCIÓN PARA LA PRÓXIMA NOCHE:
La única decisión operativa o comercial que cambia algo concreto para la siguiente apertura basada en lo que ocurrió hoy.`
    },
    {
      slug: 'noche-loop',
      name_en: 'NocheLoop Premium',
      name_es: 'NocheLoop Premium',
      description_en: 'From first visit to loyal VIP. Full nightlife business growth cycle.',
      description_es: 'Desde la primera visita hasta el VIP de por vida. El ciclo completo de tu negocio nocturno.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'negocio', type: 'text', label_en: 'Venue Name', label_es: 'Nombre del bar o antro', required: true },
        { id: 'tipo_lugar', type: 'select', label_en: 'Venue Type', label_es: 'Tipo de establecimiento', required: true,
          options: [
            { value: 'bar', label_en: 'Bar / Cantina', label_es: 'Bar / Cantina' },
            { value: 'antro', label_en: 'Nightclub / Antro', label_es: 'Antro / Discoteca' },
            { value: 'lounge', label_en: 'Lounge / Rooftop', label_es: 'Lounge / Rooftop' },
            { value: 'karaoke', label_en: 'Karaoke Bar', label_es: 'Bar de karaoke' },
            { value: 'sports_bar', label_en: 'Sports Bar', label_es: 'Sports Bar' },
            { value: 'cerveceria', label_en: 'Craft Beer Bar', label_es: 'Cervecería artesanal' }
          ]
        },
        { id: 'noches_operacion', type: 'text', label_en: 'Operating Nights Per Week', label_es: 'Noches de operación por semana', required: true },
        { id: 'dolor_asistencia', type: 'textarea', label_en: 'Attendance / Traffic Problem', label_es: 'Problema principal de asistencia o tráfico', required: true, placeholder_es: 'Noches muertas entre semana, clientes que no regresan, dependemos de una sola noche...' },
        { id: 'dolor_ticket', type: 'textarea', label_en: 'Revenue / Ticket Problem', label_es: 'Problema de ticket o ingresos', required: true, placeholder_es: 'La gente pide poco, no compramos servicio de botella, el margen en bebidas es bajo...' },
        { id: 'fase', type: 'select', label_en: 'Priority Module Today', label_es: 'Módulo donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'asistencia', label_en: 'Attendance & Customer Reactivation', label_es: 'Asistencia y reactivación de clientes' },
            { value: 'ticket', label_en: 'Ticket Increase & VIP Experience', label_es: 'Ticket promedio y experiencia VIP' },
            { value: 'operacion', label_en: 'Night Operations & Staff Control', label_es: 'Operación nocturna y control de personal' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para negocios de entretenimiento nocturno en Latinoamérica, implementando el sistema "NocheLoop": el ciclo de rentabilidad para bares y antros que quieren dejar de depender del viernes y construir un negocio que funciona toda la semana.

Negocio: {{negocio}} ({{tipo_lugar}})
Noches operando: {{noches_operacion}} por semana
Problema de asistencia: {{dolor_asistencia}}
Problema de ticket/ingresos: {{dolor_ticket}}
Fase prioritaria: {{fase}}

Activa el módulo NocheLoop correspondiente:

Si {{fase}} = ASISTENCIA:
→ Diseña el "Plan de Llenado Semanal de {{negocio}}" para las próximas 4 semanas. Incluye:
(1) El calendario de eventos o noches temáticas para cada día de operación, con nombre, gancho y público objetivo para cada noche (ej. "Lunes de Bolsillo: cervezas 2x1 de 8-10pm — para el que le quedó pendiente el fin de semana").
(2) La estrategia de reactivación vía WhatsApp: la secuencia de 3 mensajes que se envían a la base de clientes existentes el martes, jueves y viernes de cada semana para llenar las noches con reservaciones anticipadas.
(3) El programa de "Cliente Frecuente": los 3 niveles de beneficios (Regular, VIP, Embajador) con criterios claros y ventajas que hacen que el cliente quiera presumir que es VIP de {{negocio}}.

Si {{fase}} = TICKET:
→ Construye el "Sistema de Revenue Premium de {{negocio}}": el rediseño del menú con los 5 cocktails o experiencias de mayor margen que también son más fáciles de vender por su presentación o nombre, el protocolo de upsell que cada mesero sigue desde el primer contacto con la mesa (las 3 preguntas que abren la conversación hacia servicio de botella o experiencia premium), la estrategia de "Mesa VIP": cómo diferenciar la experiencia de la mesa premium vs. la regular para que valga pagar 3x más y el cliente quiera presumirla en redes.

Si {{fase}} = OPERACIÓN:
→ Diseña el "Manual de Operación Nocturna de {{negocio}}": el flujo de apertura y cierre con checklist por rol (bartender, mesero, seguridad, caja), el protocolo de manejo de incidentes (cliente conflictivo, queja, falla de equipo) que el personal ejecuta sin necesitar al dueño, el sistema de reporte nocturno de 5 puntos que el encargado envía al dueño en 10 minutos al cerrar (caja, incidentes, asistencia, observaciones, impresión general).

Cierra con "El Próximo Movimiento de {{negocio}}": la única acción de mayor ROI que el dueño ejecuta esta semana para ver resultados en la próxima noche de apertura.`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) { console.error('Error fetching plans:', planError); return }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').insert({
      id: appId, slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    })

    if (appError) {
      if (appError.code === '23505') {
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en, name_es: app.name_es,
            description_en: app.description_en, description_es: app.description_es,
            icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log(`Updated ${app.slug}`)
        }
      } else { console.error(`Error inserting ${app.slug}:`, appError.message); continue }
    } else { app.id = appId }

    let targetPlan = proPlan
    if (app.slug === 'noche-loop' || app.slug === 'decide-bar') targetPlan = businessPlan || proPlan

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Bares y Entretenimiento Nocturno completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
