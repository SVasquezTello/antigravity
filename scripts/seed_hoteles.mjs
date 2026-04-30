import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🏨 Seeding Micro-Apps para Hoteles, Hostales y Alojamientos Turísticos...')

  const apps = [
    // ─────────────────────────────────────────────────────────────────
    // APP 1 — ReactivaStay  (Dolor #1: huéspedes que preguntan y desaparecen)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'reactiva-stay',
      name_en: 'ReactivaStay',
      name_es: 'ReactivaStay',
      description_en: 'That guest didn\'t disappear. They just need the right message.',
      description_es: 'Ese huésped no desapareció. Solo necesita el mensaje correcto para reservar.',
      icon: 'MessageSquare',
      form_schema: [
        {
          id: 'nombre_cliente',
          type: 'text',
          label_en: 'Guest Name',
          label_es: 'Nombre del cliente / huésped',
          required: true
        },
        {
          id: 'tipo_habitacion',
          type: 'select',
          label_en: 'Room Type Inquired',
          label_es: 'Tipo de habitación consultada',
          required: true,
          options: [
            { value: 'sencilla', label_en: 'Single Room', label_es: 'Habitación sencilla' },
            { value: 'doble', label_en: 'Double / Twin', label_es: 'Habitación doble / twin' },
            { value: 'suite', label_en: 'Suite', label_es: 'Suite' },
            { value: 'familiar', label_en: 'Family Room', label_es: 'Habitación familiar' },
            { value: 'dormitorio', label_en: 'Hostel Dorm', label_es: 'Dormitorio compartido (hostal)' },
            { value: 'cabaña', label_en: 'Cabin / Bungalow', label_es: 'Cabaña / bungalow' }
          ]
        },
        {
          id: 'fechas',
          type: 'text',
          label_en: 'Probable Stay Dates',
          label_es: 'Fechas probables de estadía',
          required: true
        },
        {
          id: 'num_huespedes',
          type: 'text',
          label_en: 'Number of Guests',
          label_es: 'Número de huéspedes',
          required: true
        },
        {
          id: 'ultimo_mensaje',
          type: 'textarea',
          label_en: 'Last Message from Guest',
          label_es: 'Último mensaje recibido del cliente',
          required: true,
          placeholder_es: '"¿Cuánto cuesta la habitación doble para el 15?" — y después silencio...'
        },
        {
          id: 'dias_sin_responder',
          type: 'text',
          label_en: 'Days Without Response',
          label_es: 'Días sin responder',
          required: true
        }
      ],
      prompt_template: `Actúa como el mejor Revenue Manager y asesor de ventas hoteleras de la región.
Tienes un cliente potencial que consultó disponibilidad y desapareció. No lo perdiste: solo necesita el mensaje correcto en el momento correcto.

Cliente: {{nombre_cliente}}
Habitación consultada: {{tipo_habitacion}}
Fechas posibles: {{fechas}}
Número de huéspedes: {{num_huespedes}}
Último mensaje recibido: "{{ultimo_mensaje}}"
Días en silencio: {{dias_sin_responder}}

Genera EXACTAMENTE 2 mensajes de seguimiento listos para copiar y pegar en WhatsApp:

1. "VERSIÓN SUAVE — El consultor amigable":
Retoma el contacto con calidez genuina. Menciona las fechas {{fechas}} y la {{tipo_habitacion}} para demostrar que recuerdas su consulta. Ofrece un pequeño detalle de valor: disponibilidad actualizada, una ventaja especial para esas fechas, o una dato que le ayude a decidir (ej. "esa semana tenemos pocos cuartos disponibles"). Termina con una pregunta simple y de baja fricción. Máximo 5 líneas.

2. "VERSIÓN DIRECTA — El cierre amable":
Crea urgencia legítima basada en temporada, disponibilidad limitada o una oferta con fecha de expiración real. Sé directo: pregunta si quiere que aparte la habitación ahora. Incluye el siguiente paso exacto que debe dar para confirmar. Máximo 4 líneas.

Al final indica: ¿cuál de los dos mensajes recomiendas enviar hoy y por qué? (1 línea).`
    },

    // ─────────────────────────────────────────────────────────────────
    // APP 2 — UpsellStay AI  (Dolor #2: no vender servicios adicionales)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'upsell-stay-ai',
      name_en: 'UpsellStay AI',
      name_es: 'UpsellStay AI',
      description_en: 'They booked the room. Now discover what else they\'ll gladly pay for.',
      description_es: 'Ya reservó la habitación. Descubre los 3 extras que pagará con gusto.',
      icon: 'TrendingUp',
      form_schema: [
        {
          id: 'reserva',
          type: 'text',
          label_en: 'Confirmed Reservation Details',
          label_es: 'Reserva confirmada (hab., fechas, noches)',
          required: true,
          placeholder_es: 'Suite Deluxe, 22-25 abril, 3 noches, 2 adultos'
        },
        {
          id: 'perfil_huesped',
          type: 'select',
          label_en: 'Guest Profile',
          label_es: 'Perfil del huésped',
          required: true,
          options: [
            { value: 'pareja', label_en: 'Couple / Romantic trip', label_es: 'Pareja / viaje romántico' },
            { value: 'familia', label_en: 'Family with children', label_es: 'Familia con niños' },
            { value: 'negocios', label_en: 'Business traveler', label_es: 'Viajero de negocios' },
            { value: 'grupo_amigos', label_en: 'Group of friends', label_es: 'Grupo de amigos' },
            { value: 'viajero_solo', label_en: 'Solo traveler', label_es: 'Viajero solo' },
            { value: 'luna_miel', label_en: 'Honeymoon / Anniversary', label_es: 'Luna de miel / aniversario' }
          ]
        },
        {
          id: 'presupuesto_estimado',
          type: 'select',
          label_en: 'Estimated Guest Budget',
          label_es: 'Presupuesto estimado del huésped',
          required: true,
          options: [
            { value: 'economico', label_en: 'Budget traveler', label_es: 'Económico / cuida el gasto' },
            { value: 'moderado', label_en: 'Mid-range, open to extras', label_es: 'Moderado / abierto a extras' },
            { value: 'premium', label_en: 'Premium / wants the best', label_es: 'Premium / quiere lo mejor' }
          ]
        },
        {
          id: 'historial',
          type: 'textarea',
          label_en: 'Guest History (if returning)',
          label_es: 'Historial del huésped si es recurrente (servicios previos, preferencias)',
          required: false,
          placeholder_es: 'Primera visita, o: "En su última estadía pidió desayuno en habitación y late checkout"'
        },
        {
          id: 'catalogo_servicios',
          type: 'textarea',
          label_en: 'Your Hotel\'s Available Services / Extras',
          label_es: 'Catálogo de servicios adicionales de tu hotel',
          required: true,
          placeholder_es: 'Traslado aeropuerto, desayuno buffet, desayuno en habitación, tours, spa, early check-in, late check-out, upgrade, flores, decoración romántica, box de bienvenida...'
        }
      ],
      prompt_template: `Actúa como el Gerente de Revenue y Experiencias de un hotel boutique 5 estrellas.
La reserva ya está confirmada — eso es lo más difícil. Ahora tu trabajo es maximizar el valor de esta estadía antes de que el huésped llegue.

Reserva: {{reserva}}
Perfil del huésped: {{perfil_huesped}}
Presupuesto estimado: {{presupuesto_estimado}}
Historial: {{historial}}
Catálogo de extras: {{catalogo_servicios}}

Detecta los 3 upsells con mayor probabilidad de aceptación para ESTE huésped específico. Para cada uno:

1. QUÉ OFRECER: El servicio exacto de {{catalogo_servicios}} que más encaja con el perfil {{perfil_huesped}} y presupuesto {{presupuesto_estimado}}. Explica brevemente la sintonía.

2. EL ARGUMENTO EMOCIONAL: Por qué este servicio hará que su estadía sea memorable / más cómoda / más especial — sin sonar a catálogo de ventas.

3. EL MENSAJE LISTO: El texto exacto (3-4 líneas máx) que recepción envía por WhatsApp antes del check-in para presentar el extra de forma irresistible y sin presión.

Cierra con la "Oferta Combinada": cómo presentar los 3 servicios juntos como un "Paquete {{perfil_huesped}}" con precio especial y nombre memorable que el huésped recuerde y recomiende.`
    },

    // ─────────────────────────────────────────────────────────────────
    // APP 3 — OperaStay  (Dolor #3: mala coordinación interna)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'opera-stay',
      name_en: 'OperaStay',
      name_es: 'OperaStay',
      description_en: 'Zero coordination chaos. Every arrival executed perfectly.',
      description_es: 'Nunca más una reserva mal coordinada. Check-in impecable garantizado.',
      icon: 'ClipboardCheck',
      form_schema: [
        {
          id: 'nombre_huesped',
          type: 'text',
          label_en: 'Guest Name',
          label_es: 'Nombre del huésped',
          required: true
        },
        {
          id: 'reserva_confirmada',
          type: 'text',
          label_en: 'Confirmed Reservation',
          label_es: 'Reserva confirmada (hab., tipo, noches)',
          required: true,
          placeholder_es: 'Habitación 204 – Doble Superior, 2 noches, 22-24 abril'
        },
        {
          id: 'fecha_hora_llegada',
          type: 'text',
          label_en: 'Arrival Date & Time',
          label_es: 'Fecha y hora de llegada confirmada',
          required: true
        },
        {
          id: 'servicios_incluidos',
          type: 'textarea',
          label_en: 'Included Services & Extras',
          label_es: 'Servicios incluidos y extras confirmados',
          required: true,
          placeholder_es: 'Desayuno incluido, late checkout, traslado desde aeropuerto a las 3pm, cuna para bebé...'
        },
        {
          id: 'observaciones',
          type: 'textarea',
          label_en: 'Special Notes (allergies, celebrations, requests)',
          label_es: 'Observaciones especiales del huésped',
          required: true,
          placeholder_es: 'Alergia a nueces, celebran aniversario, llegada tardía approx. 11pm, habitación en piso alto preferible...'
        }
      ],
      prompt_template: `Actúa como el Director de Operaciones de un hotel de lujo con cero tolerancia al error en la experiencia del huésped.
Un check-in tardío, una habitación no lista o una observación ignorada puede convertirse en una reseña de 1 estrella que arruina meses de trabajo.

Huésped: {{nombre_huesped}}
Reserva: {{reserva_confirmada}}
Llegada: {{fecha_hora_llegada}}
Servicios: {{servicios_incluidos}}
Observaciones críticas: {{observaciones}}

Convierte esta reserva en el "Briefing Operativo Maestro" — el documento que garantiza un check-in de 5 estrellas:

1. CHECKLIST DE RECEPCIÓN (antes de que llegue el huésped):
Las tareas exactas que recepción debe completar antes de {{fecha_hora_llegada}}: confirmación de habitación, asignación verificada, detalles de pago, mensaje de bienvenida pre-arrival. Destaca cualquier acción urgente por {{observaciones}}.

2. ORDEN DE HOUSEKEEPING:
El briefing exacto para el equipo de limpieza: qué habitación, a qué hora debe estar lista (con margen de 2h antes de {{fecha_hora_llegada}}), configuración especial requerida, amenities adicionales y detalles de {{observaciones}} que el cuarto debe reflejar (cuna, decoración, etc.).

3. COORDINACIÓN DE SERVICIOS EXTRAS:
Para cada servicio de {{servicios_incluidos}}, el responsable asignado, el horario de ejecución y el protocolo de confirmación.

4. ALERTA DE OBSERVACIONES CRÍTICAS:
Resalta en negrita las notas de {{observaciones}} que NINGÚN departamento puede olvidar. Una línea por alerta, estilo semáforo 🔴.

5. MENSAJE PRE-ARRIVAL PARA {{nombre_huesped}}:
El WhatsApp cálido y profesional que se envía 24h antes de {{fecha_hora_llegada}} confirmando todo y haciendo que el huésped llegue emocionado, no ansioso.`
    },

    // ─────────────────────────────────────────────────────────────────
    // APP 4 — DecideStay  (Dolor #4: datos sin decisiones)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'decide-stay',
      name_en: 'DecideStay',
      name_es: 'DecideStay',
      description_en: 'Your hotel data should tell you where the money is. Not just sit in Excel.',
      description_es: 'Tus datos deben decirte dónde está el dinero. No solo acumularse en Excel.',
      icon: 'BarChart2',
      form_schema: [
        {
          id: 'reporte_hotel',
          type: 'textarea',
          label_en: 'Hotel Report (occupancy, revenue, channels, cancellations)',
          label_es: 'Reporte del hotel (ocupación, ingresos, canales, cancelaciones, temporadas)',
          required: true,
          placeholder_es: 'Ocupación promedio: 68%, ingresos mes: $85,000, canal Booking: 55%, directo: 20%, cancelaciones: 18%...'
        },
        {
          id: 'problema_principal',
          type: 'text',
          label_en: 'Main Problem to Solve',
          label_es: 'Principal problema o decisión que necesitas tomar',
          required: true,
          placeholder_es: '¿Cuándo subir tarifas? / ¿Qué canal me deja más margen? / ¿Por qué cae la ocupación en mayo?'
        },
        {
          id: 'area_analisis',
          type: 'select',
          label_en: 'Area to Analyze',
          label_es: 'Área a analizar',
          required: true,
          options: [
            { value: 'tarifas', label_en: 'Pricing & Revenue Management', label_es: 'Tarifas y revenue management' },
            { value: 'canales', label_en: 'Booking Channels & Commissions', label_es: 'Canales de reserva y comisiones' },
            { value: 'ocupacion', label_en: 'Occupancy & Seasonality', label_es: 'Ocupación y temporadas' },
            { value: 'cancelaciones', label_en: 'Cancellation Rate', label_es: 'Tasa de cancelación' },
            { value: 'huespedes', label_en: 'Guest Loyalty & Repeat Visits', label_es: 'Fidelización y huéspedes recurrentes' }
          ]
        },
        {
          id: 'contexto',
          type: 'textarea',
          label_en: 'Relevant Context (events, competition, location)',
          label_es: 'Contexto relevante (eventos locales, competencia, temporada, zona)',
          required: true
        }
      ],
      prompt_template: `Eres un Revenue Manager Senior con especialidad en hoteles independientes, boutiques y alojamientos turísticos.
La mayoría de los hoteleros miran sus reportes y no saben qué hacer con ellos. Tú sí.

Reporte del hotel: {{reporte_hotel}}
Problema principal: {{problema_principal}}
Área de análisis: {{area_analisis}}
Contexto: {{contexto}}

No me des un resumen del reporte. Dame EXACTAMENTE 3 Decisiones Comerciales u Operativas de alto impacto para resolver {{problema_principal}} en el área de {{area_analisis}}.

Para cada decisión:
1. LA DECISIÓN: Acción concreta y ejecutable (ej. "Subir tarifa de habitaciones dobles un 22% los jueves y viernes de mayo basándote en que la ocupación histórica en esos días es del 91%").
2. JUSTIFICACIÓN NUMÉRICA: Sustentada estrictamente en los datos de {{reporte_hotel}}. Sin perogrulladas.
3. EJECUCIÓN: El primer movimiento que el gerente o propietario hace mañana antes del mediodía para activar esta decisión.

Cierra con el "Diagnóstico de Salud del Hotel":
🟢 Hotel Optimizado y Rentable | 🟡 Oportunidades sin explotar | 🔴 Fuga de ingresos crítica
Justificado en dos líneas con los números del reporte.`
    },

    // ─────────────────────────────────────────────────────────────────
    // APP 5 — PulseStay  (Dolor #5: el dueño no sabe cómo va el hotel)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'pulse-stay',
      name_en: 'PulseStay',
      name_es: 'PulseStay',
      description_en: 'Know exactly how your hotel is doing today. Without calling anyone.',
      description_es: 'Sabe cómo va tu hotel hoy sin llamar al equipo ni estar en recepción.',
      icon: 'Activity',
      form_schema: [
        {
          id: 'reporte_dia',
          type: 'textarea',
          label_en: "Receptionist's Daily Report",
          label_es: 'Reporte del día del encargado / recepción',
          required: true,
          placeholder_es: 'Check-ins realizados: 4, check-outs: 2, habitaciones ocupadas: 11/15, ingreso del día: $3,200...'
        },
        {
          id: 'meta_esperada',
          type: 'text',
          label_en: 'Expected Daily Goal (occupancy or revenue)',
          label_es: 'Meta esperada del día (ocupación o ingresos)',
          required: true,
          placeholder_es: '80% de ocupación o $4,000 en ingresos'
        },
        {
          id: 'incidencias',
          type: 'textarea',
          label_en: 'Incidents or Problems Today',
          label_es: 'Incidencias o problemas del día',
          required: true,
          placeholder_es: 'Huésped molesto por ruido, A/C de habitación 312 en falla, reserva duplicada resuelta, late checkout sin aviso...'
        },
        {
          id: 'reservas_activas',
          type: 'text',
          label_en: 'Active Reservations (tonight & next 48h)',
          label_es: 'Reservas activas confirmadas (esta noche y próximas 48h)',
          required: true,
          placeholder_es: '11 ocupadas hoy, 13 confirmadas para mañana, 9 para el miércoles'
        },
        {
          id: 'comentario_encargado',
          type: 'textarea',
          label_en: "Manager's Note or Request to Owner",
          label_es: 'Comentario o solicitud del encargado al dueño',
          required: false,
          placeholder_es: 'Necesitamos reponer amenities, el técnico del elevador debe venir esta semana, huésped dejó buena reseña...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Hotelera del dueño — sus ojos y cerebro en la propiedad cuando no está presente.

El propietario necesita saber en 60 segundos si el hotel va bien, qué problema exige su atención y qué debe coordinar mañana.

- Reporte del día: {{reporte_dia}}
- Meta del día: {{meta_esperada}}
- Incidencias: {{incidencias}}
- Reservas activas: {{reservas_activas}}
- Comentario del encargado: {{comentario_encargado}}

Genera el "PulseStay del Día":

1. SEMÁFORO OPERATIVO:
🟢 Hotel en Control Total | 🟡 Atención Requerida | 🔴 Alerta — Acción Urgente del Propietario
Basado en el cumplimiento de {{meta_esperada}}, gravedad de {{incidencias}} y tendencia de {{reservas_activas}}.

2. ANÁLISIS DE RENDIMIENTO DEL DÍA:
¿Se cumplió la meta {{meta_esperada}}? Si no, ¿cuánto se dejó de ganar y por qué? ¿Las {{incidencias}} de hoy tendrán impacto en las reservas de los próximos días (reseña negativa, cancelación probable)?

3. LA ÚNICA ACCIÓN URGENTE DEL PROPIETARIO:
Lo único que el dueño debe resolver personalmente o por WhatsApp en las próximas 2 horas. Basado en las {{incidencias}} y el {{comentario_encargado}}. Sin micromanagement innecesario — solo lo que realmente requiere su autoridad.

4. PROYECCIÓN DE LOS PRÓXIMOS 2 DÍAS:
Con las {{reservas_activas}} confirmadas, ¿cuál es el ingreso proyectado para mañana y pasado? ¿Hay alguna ventana de tiempo para vender habitaciones de última hora y a qué precio?

5. RESPUESTA AL ENCARGADO:
Un mensaje breve, directivo y motivador que el dueño reenvía al encargado respondiendo a {{comentario_encargado}}. Que refuerce liderazgo y cultura de reporte diario.`
    },

    // ─────────────────────────────────────────────────────────────────
    // APP 6 — StayLoop Premium  (Fusión: ReactivaStay + OperaStay + PulseStay)
    // ─────────────────────────────────────────────────────────────────
    {
      slug: 'stay-loop',
      name_en: 'StayLoop Premium',
      name_es: 'StayLoop Premium',
      description_en: 'From the first inquiry to the returning guest. Full hotel cycle.',
      description_es: 'Desde la primera consulta hasta el regreso del huésped. El ciclo completo de tu hotel.',
      icon: 'RefreshCw',
      form_schema: [
        {
          id: 'hotel',
          type: 'text',
          label_en: 'Hotel / Property Name',
          label_es: 'Nombre del hotel o propiedad',
          required: true
        },
        {
          id: 'tipo_alojamiento',
          type: 'select',
          label_en: 'Property Type',
          label_es: 'Tipo de alojamiento',
          required: true,
          options: [
            { value: 'hotel_boutique', label_en: 'Boutique Hotel', label_es: 'Hotel boutique' },
            { value: 'hotel_negocios', label_en: 'Business Hotel', label_es: 'Hotel de negocios' },
            { value: 'hostal', label_en: 'Hostel', label_es: 'Hostal / mochilero' },
            { value: 'apart_hotel', label_en: 'Apart-Hotel / Suite', label_es: 'Apart-hotel / suites' },
            { value: 'lodge_rural', label_en: 'Lodge / Eco-lodge / Rural', label_es: 'Lodge / eco-lodge / rural' },
            { value: 'hotel_resort', label_en: 'Resort / All-inclusive', label_es: 'Resort / todo incluido' }
          ]
        },
        {
          id: 'num_habitaciones',
          type: 'text',
          label_en: 'Number of Rooms',
          label_es: 'Número de habitaciones',
          required: true
        },
        {
          id: 'dolor_ventas',
          type: 'textarea',
          label_en: 'Main Sales / Booking Problem',
          label_es: 'Problema principal en ventas o reservas (leads fríos, baja ocupación, canales...)',
          required: true
        },
        {
          id: 'dolor_operacion',
          type: 'textarea',
          label_en: 'Main Operational Problem',
          label_es: 'Problema operativo principal (coordinación, huéspedes molestos, reseñas...)',
          required: true
        },
        {
          id: 'fase',
          type: 'select',
          label_en: 'Priority Module Today',
          label_es: 'Módulo donde necesitas más impacto hoy',
          required: true,
          options: [
            { value: 'reservas', label_en: 'Reservations & Lead Recovery', label_es: 'Reservas y recuperación de prospectos' },
            { value: 'operacion', label_en: 'Check-in Operations & Coordination', label_es: 'Operación de check-ins y coordinación interna' },
            { value: 'control', label_en: 'Revenue Control & Owner Dashboard', label_es: 'Control de ingresos y reporte al propietario' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de Hospitalidad más efectivo para hoteles independientes, boutiques y alojamientos turísticos que operan sin los recursos de una cadena internacional pero con la ambición de superarlas en experiencia, implementando el sistema "StayLoop": el ciclo de crecimiento sin fugas para hoteleros con visión empresarial.

Hotel: {{hotel}}
Tipo de alojamiento: {{tipo_alojamiento}}
Habitaciones: {{num_habitaciones}}
Problema de ventas/reservas: {{dolor_ventas}}
Problema operativo: {{dolor_operacion}}
Fase prioritaria: {{fase}}

Activa el módulo StayLoop correspondiente:

Si {{fase}} = RESERVAS:
→ Diseña la "Máquina de Reservas Directas" para {{hotel}}. Incluye:
(1) La campaña de reactivación de prospectos fríos con 2 mensajes de WhatsApp listos para usar (versión suave y versión urgente), adaptados al {{tipo_alojamiento}}.
(2) La estrategia para reducir la dependencia de OTAs (Booking, Airbnb) y aumentar reservas directas: el argumento de "precio especial canal directo", la oferta de bienvenida exclusiva y el protocolo de captura de datos del huésped en el primer contacto.
(3) El script de ventas para el momento en que un prospecto pregunta por WhatsApp: cómo responder, qué preguntar, cómo cerrar la reserva en menos de 3 mensajes.

Si {{fase}} = OPERACIÓN:
→ Construye el "Protocolo de Check-in Perfecto" para {{hotel}} con {{num_habitaciones}} habitaciones:
El flujo completo de coordinación entre recepción, housekeeping y servicios extras (quién notifica a quién, en qué momento y con qué herramienta), el checklist de preparación de habitación con 3 niveles (básico, estándar, VIP), el sistema de alertas internas para huéspedes con solicitudes especiales, y el protocolo de resolución de incidencias en las primeras 2 horas para que el problema no llegue a reseña negativa.

Si {{fase}} = CONTROL:
→ Diseña el "Dashboard Mental del Propietario de {{hotel}}": los 5 KPIs que el dueño debe revisar cada mañana en menos de 5 minutos (ocupación, ingreso promedio por noche, tasa de conversión de prospectos, NPS/reseñas, reservas próximas 7 días), la fórmula y benchmark de cada KPI para {{tipo_alojamiento}} de {{num_habitaciones}} habitaciones, y la política de revenue management dinámico: cuándo subir tarifas, cuándo lanzar promos de última hora y cómo gestionar temporadas bajas generando ingresos alternativos.

Cierra siempre con "El Próximo Movimiento de {{hotel}}": la única acción de mayor ROI que el dueño o gerente ejecuta mañana antes del primer check-in del día.`
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
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase
          .from('micro_apps')
          .select('id')
          .eq('slug', app.slug)
          .single()

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
          console.log(`Updated ${app.slug}`)
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError.message)
        continue
      }
    } else {
      app.id = appId
    }

    // Plan assignment — StayLoop & DecideStay → Enterprise, rest → Pro
    let targetPlan = proPlan
    if (app.slug === 'stay-loop' || app.slug === 'decide-stay') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase
        .from('plan_apps')
        .select('*')
        .eq('plan_id', targetPlan.id)
        .eq('app_id', app.id)
        .single()

      if (!existingLink) {
        await supabase.from('plan_apps').insert({
          plan_id: targetPlan.id,
          app_id: app.id
        })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else {
        console.log(`${app.slug} already linked to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('\n✅ Micro-Apps de Hoteles y Alojamientos completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
