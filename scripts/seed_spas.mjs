import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('💆 Seeding Micro-Apps para Spas y Centros de Bienestar...')

  const apps = [
    {
      slug: 'reactiva-spa',
      name_en: 'ReactivaSpa',
      name_es: 'ReactivaSpa',
      description_en: 'Your best client hasn\'t booked in 6 weeks. One message brings them back.',
      description_es: 'Tu mejor clienta no ha reservado en semanas. Un mensaje la trae de vuelta.',
      icon: 'Heart',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name',
          label_es: 'Nombre de la clienta / cliente',
          required: true
        },
        {
          id: 'servicio_favorito',
          type: 'text',
          label_en: 'Their Favorite Service',
          label_es: 'Servicio favorito o más frecuente',
          required: true,
          placeholder_es: 'Masaje de relajación 60min, Facial anti-age, Ritual de aromaterapia, Limpieza profunda...'
        },
        {
          id: 'semanas_ausente',
          type: 'text',
          label_en: 'Weeks Without Booking',
          label_es: 'Semanas sin reservar',
          required: true
        },
        {
          id: 'tipo_spa',
          type: 'select',
          label_en: 'Spa / Center Type',
          label_es: 'Tipo de spa o centro',
          required: true,
          options: [
            { value: 'spa_relajacion', label_en: 'Relaxation & Massage Spa', label_es: 'Spa de relajación y masajes' },
            { value: 'spa_estetico', label_en: 'Aesthetic / Beauty Spa', label_es: 'Spa estético / belleza' },
            { value: 'spa_medico', label_en: 'Medical Spa / Medspa', label_es: 'Spa médico / medspa' },
            { value: 'centro_bienestar', label_en: 'Holistic Wellness Center', label_es: 'Centro de bienestar holístico' },
            { value: 'spa_hotel', label_en: 'Hotel Spa', label_es: 'Spa de hotel' }
          ]
        },
        {
          id: 'motivo_ausencia',
          type: 'select',
          label_en: 'Probable Reason for Absence',
          label_es: 'Motivo probable de ausencia',
          required: true,
          options: [
            { value: 'olvido', label_en: 'Simply forgot / busy', label_es: 'Olvidó / vida ocupada' },
            { value: 'precio', label_en: 'Price sensitivity', label_es: 'Sensibilidad al precio' },
            { value: 'insatisfecha', label_en: 'May have been dissatisfied', label_es: 'Puede haber salido insatisfecha' },
            { value: 'temporada', label_en: 'Seasonal / holiday break', label_es: 'Pausa estacional / vacaciones' },
            { value: 'desconocido', label_en: 'Unknown', label_es: 'Desconocido' }
          ]
        }
      ],
      prompt_template: `Actúa como la Directora de Experiencia del Cliente de un spa de lujo que entiende que cada clienta que no regresa es una relación de bienestar interrumpida, no solo una venta perdida.

Clienta: {{cliente}}
Servicio favorito: {{servicio_favorito}}
Ausente hace: {{semanas_ausente}} semanas
Tipo de centro: {{tipo_spa}}
Motivo probable: {{motivo_ausencia}}

Genera DOS mensajes de reactivación listos para enviar por WhatsApp:

1. "VERSIÓN BIENESTAR GENUINO" (emocional y personalizada):
Hazle saber a {{cliente}} que se le extraña de forma auténtica. Menciona su {{servicio_favorito}} como si el spa lo tuviera reservado solo para ella. Si el motivo fue {{motivo_ausencia}}, abórdalo con delicadeza: si fue precio, sugiere algo más accesible; si fue insatisfacción, invítala a una conversación; si fue olvido, usa el "tu cuerpo lo necesita después de X semanas" como gancho. Termina con una invitación cálida, no una presión. Máx. 5 líneas.

2. "VERSIÓN RITUAL EXCLUSIVO" (beneficio tangible e inmediato):
Crea una razón concreta y urgente para reservar esta semana: disponibilidad especial en su {{servicio_favorito}} preferido, un complemento gratuito (aromaterapia, mascarilla facial, té de bienvenida) al reservar antes de cierta fecha, o un precio especial de "cliente frecuente que extrañamos". CTA claro y cálido: "¿Te agendo para esta semana?". Máx. 4 líneas.

Incluye al final: el mejor horario y día de la semana para enviar este tipo de mensajes a clientas de {{tipo_spa}} y por qué.`
    },
    {
      slug: 'upsell-spa-ai',
      name_en: 'UpsellSpa AI',
      name_es: 'UpsellSpa AI',
      description_en: 'They booked a 60-min massage. Help them discover their perfect wellness journey.',
      description_es: 'Reservó un masaje de 60 min. Descubre el ritual completo que merece su bienestar.',
      icon: 'TrendingUp',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name',
          label_es: 'Nombre de la clienta / cliente',
          required: true
        },
        {
          id: 'servicio_reservado',
          type: 'text',
          label_en: 'Booked Service',
          label_es: 'Servicio reservado hoy',
          required: true,
          placeholder_es: 'Masaje sueco 60 min, Facial hidratante, Envolvimiento corporal...'
        },
        {
          id: 'perfil_cliente',
          type: 'select',
          label_en: 'Client Profile',
          label_es: 'Perfil de la clienta',
          required: true,
          options: [
            { value: 'primera_vez', label_en: 'First-time visitor', label_es: 'Primera vez en el spa' },
            { value: 'ocasional', label_en: 'Occasional (once every 1-2 months)', label_es: 'Ocasional (cada 1-2 meses)' },
            { value: 'frecuente', label_en: 'Regular (2+ times/month)', label_es: 'Frecuente (2+ veces al mes)' },
            { value: 'regalo', label_en: 'Gift card / special occasion', label_es: 'Vale de regalo / ocasión especial' }
          ]
        },
        {
          id: 'necesidad_expresada',
          type: 'text',
          label_en: 'Need Expressed by Client',
          label_es: 'Necesidad o queja expresada por la clienta',
          required: false,
          placeholder_es: 'Mucho estrés, dolor en cuello y espalda, piel deshidratada, no puede dormir bien...'
        },
        {
          id: 'menu_spa',
          type: 'textarea',
          label_en: 'Spa Menu / Available Upgrades',
          label_es: 'Menú del spa y upgrades disponibles',
          required: true,
          placeholder_es: 'Extensión 30 min (+$250), puntas calientes (+$180), mascarilla facial (+$150), aromaterapia premium (+$120), descuento en producto, membresía mensual, paquete parejas...'
        }
      ],
      prompt_template: `Eres la Directora de Experiencias de un spa de bienestar premium que sabe que el momento más poderoso para incrementar el ticket es ANTES de que la clienta entre al cuarto de tratamiento — cuando ya está relajada y en modo "me lo merezco".

Clienta: {{cliente}} (perfil: {{perfil_cliente}})
Servicio reservado: {{servicio_reservado}}
Necesidad expresada: {{necesidad_expresada}}
Menú disponible: {{menu_spa}}

Selecciona los 3 complementos o upgrades de {{menu_spa}} con mayor probabilidad de aceptación para ESTA clienta específica. Para cada uno:

1. QUÉ OFRECER: El upgrade exacto y por qué encaja perfectamente con {{servicio_reservado}} y la necesidad de {{necesidad_expresada}}.

2. EL ARGUMENTO DE BIENESTAR: Cómo este complemento potencia el resultado del servicio principal. Nada de "cuesta solo $X más" — enfócate en lo que SIENTE y lo que GANA. Ej: "La aromaterapia profundiza el estado de relajación hasta en un 40% más — tu sistema nervioso lo notará desde la primera respiración."

3. EL GUION DE LA RECEPCIONISTA: Las palabras exactas para presentarlo en el check-in, de forma cálida y sin presión. Que suene como una recomendación personalizada del equipo, no un menú de opciones.

Cierra con: el "Ritual Completo {{cliente}}" — cómo nombrar y presentar la combinación del servicio + los 3 upgrades como una experiencia única con nombre evocador (ej. "Ritual Renacimiento") y un precio paquete que haga sentir que es una ganga vs. todo por separado.`
    },
    {
      slug: 'ritual-express-ai',
      name_en: 'RitualExpress AI',
      name_es: 'RitualExpress AI',
      description_en: 'Personalized post-treatment care that clients actually follow and share.',
      description_es: 'Protocolo de cuidado post-tratamiento que las clientas siguen, agradecen y comparten.',
      icon: 'Sparkles',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name',
          label_es: 'Nombre de la clienta / cliente',
          required: true
        },
        {
          id: 'tratamiento_realizado',
          type: 'text',
          label_en: 'Treatment Performed Today',
          label_es: 'Tratamiento realizado hoy',
          required: true,
          placeholder_es: 'Masaje descontracturante + aromaterapia, Facial anti-edad con vitamina C, Exfoliación corporal y envolvimiento...'
        },
        {
          id: 'condicion_piel_cuerpo',
          type: 'text',
          label_en: 'Skin / Body Condition Observed',
          label_es: 'Condición de piel o cuerpo observada durante el tratamiento',
          required: false,
          placeholder_es: 'Piel deshidratada con tendencia seca, tensión cervical severa, piel sensible reactiva...'
        },
        {
          id: 'productos_usados',
          type: 'textarea',
          label_en: 'Products Used During Treatment',
          label_es: 'Productos utilizados en el tratamiento',
          required: false,
          placeholder_es: 'Aceite de argán, mascarilla de ácido hialurónico, barro volcánico, sérum vitamina C...'
        },
        {
          id: 'objetivo_comunicacion',
          type: 'select',
          label_en: 'Communication Goal',
          label_es: 'Objetivo de la comunicación post-tratamiento',
          required: true,
          options: [
            { value: 'cuidado_casa', label_en: 'At-home care instructions', label_es: 'Instrucciones de cuidado en casa' },
            { value: 'proxima_cita', label_en: 'Next appointment recommendation', label_es: 'Recomendación de próxima cita' },
            { value: 'producto_recomendado', label_en: 'Product recommendation to purchase', label_es: 'Recomendación de producto para comprar' },
            { value: 'todo', label_en: 'Complete post-visit kit (all of the above)', label_es: 'Kit post-visita completo (todo lo anterior)' }
          ]
        }
      ],
      prompt_template: `Actúa como la Terapeuta Principal y Embajadora de Bienestar del spa — alguien que domina tanto la técnica como el arte de hacer que cada clienta se enamore del proceso de cuidado y regrese sola.

Clienta: {{cliente}}
Tratamiento de hoy: {{tratamiento_realizado}}
Condición observada: {{condicion_piel_cuerpo}}
Productos usados: {{productos_usados}}
Objetivo: {{objetivo_comunicacion}}

Genera el "Kit Post-Ritual {{cliente}}" — el mensaje más hermoso y útil que ha recibido después de un spa:

1. MENSAJE DE CIERRE INMEDIATO (enviar al salir del spa, WhatsApp):
3-4 líneas cálidas que hagan sentir a {{cliente}} que fue la única clienta del día. Menciona algo específico del {{tratamiento_realizado}}, cómo observaste su {{condicion_piel_cuerpo}} y cómo el tratamiento empezará a hacer efecto en las próximas horas. Termina con algo que anticipe con emoción (ej. "Notarás tu piel diferente mañana por la mañana 🌿").

2. PROTOCOLO DE CUIDADO EN CASA (si aplica):
Las instrucciones exactas de las próximas 24-48h adaptadas al {{tratamiento_realizado}} y {{condicion_piel_cuerpo}}. Qué hacer, qué evitar y por qué. En bullet points escanéables con emojis sutiles. Máx. 8 puntos.

3. RECOMENDACIÓN DE PRODUCTO (si aplica):
El producto de {{productos_usados}} o complementario que deberías llevar a casa. Presentado como "lo que usé contigo hoy y por qué tus resultados durarán más si lo tienes". Incluye el beneficio específico para su {{condicion_piel_cuerpo}}.

4. INVITACIÓN A PRÓXIMA CITA (suave y específica):
No "ven cuando quieras" — sino "Para mantener los resultados del {{tratamiento_realizado}}, te recomiendo volver en X semanas. ¿Te agendo el [día sugerido basado en el tratamiento]?" Que sea una recomendación profesional, no un cierre de venta.`
    },
    {
      slug: 'decide-spa',
      name_en: 'DecideSpa',
      name_es: 'DecideSpa',
      description_en: 'Your spa metrics should tell you which treatments make money and which steal time.',
      description_es: 'Tus métricas deben decirte qué tratamientos hacen dinero y cuáles roban tiempo.',
      icon: 'BarChart2',
      form_schema: [
        {
          id: 'datos_spa',
          type: 'textarea',
          label_en: 'Spa Business Data (revenue, treatments, utilization)',
          label_es: 'Datos del spa (ingresos, tratamientos más/menos solicitados, ocupación de terapeutas)',
          required: true,
          placeholder_es: 'Ingresos mes: $95,000, tratamiento más vendido: masaje relajación 60min (40%), facial: 25%, tiempo muerto por terapeutas: 30%, membresías activas: 12...'
        },
        {
          id: 'problema',
          type: 'text',
          label_en: 'Main Business Problem',
          label_es: 'Principal problema o decisión de negocio a resolver',
          required: true,
          placeholder_es: '¿Qué hacer con los días muertos del martes? / ¿Vale la pena contratar otra terapeuta? / ¿Cómo subir el ticket promedio?'
        },
        {
          id: 'area',
          type: 'select',
          label_en: 'Focus Area',
          label_es: 'Área de análisis',
          required: true,
          options: [
            { value: 'rentabilidad', label_en: 'Treatment Profitability', label_es: 'Rentabilidad por tratamiento' },
            { value: 'ocupacion', label_en: 'Therapist Utilization & Scheduling', label_es: 'Ocupación de terapeutas y agenda' },
            { value: 'membresías', label_en: 'Membership & Recurring Revenue', label_es: 'Membresías e ingresos recurrentes' },
            { value: 'ticket', label_en: 'Average Ticket & Upsell', label_es: 'Ticket promedio y upsell' },
            { value: 'temporada', label_en: 'Seasonality & Promotions', label_es: 'Temporalidad y promociones' }
          ]
        },
        {
          id: 'contexto',
          type: 'textarea',
          label_en: 'Context (competition, location, target market)',
          label_es: 'Contexto relevante (competencia, zona, perfil del cliente objetivo)',
          required: true
        }
      ],
      prompt_template: `Eres un Consultor de Revenue Management para spas, centros de bienestar y negocios de servicios de lujo accesible.
El mayor error en spa: tener agenda llena y no saber por qué los números no cuadran al final del mes.

Datos: {{datos_spa}}
Problema: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y medible. No "mejorar el marketing" sino "lanzar el martes 'Ritual 2x1' con cita previa — el día de menor ocupación — con estos 2 tratamientos específicos porque su margen permite el descuento sin pérdida".
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_spa}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN ESTA SEMANA: El primer paso que la dueña o gerente ejecuta mañana para activar la decisión.

Finaliza con el "Diagnóstico de Salud del Spa":
🟢 Spa Rentable y con Clientas Felices | 🟡 Ocupada pero con margen perdido | 🔴 Agenda irregular y ticket bajo
Justificado en dos líneas con los datos y el {{problema}} descrito.`
    },
    {
      slug: 'pulse-spa',
      name_en: 'PulseSpa',
      name_es: 'PulseSpa',
      description_en: 'Know if today\'s appointments filled your day with revenue or just hours.',
      description_es: 'Sabe si las citas de hoy llenaron el día de ingresos o solo de horas ocupadas.',
      icon: 'Activity',
      form_schema: [
        {
          id: 'citas_dia',
          type: 'text',
          label_en: 'Appointments Completed Today',
          label_es: 'Citas atendidas hoy',
          required: true
        },
        {
          id: 'ingresos_dia',
          type: 'text',
          label_en: "Today's Revenue ($)",
          label_es: 'Ingresos del día ($)',
          required: true
        },
        {
          id: 'cancelaciones',
          type: 'text',
          label_en: 'Cancellations / No-shows',
          label_es: 'Cancelaciones o no-shows del día',
          required: true
        },
        {
          id: 'horas_muertas',
          type: 'text',
          label_en: 'Idle Hours (therapists without appointments)',
          label_es: 'Horas muertas (terapeutas sin cita)',
          required: true,
          placeholder_es: '2 horas / 0 horas / Terapeuta María estuvo sin cita de 2pm a 5pm'
        },
        {
          id: 'meta_dia',
          type: 'text',
          label_en: "Today's Revenue Goal ($)",
          label_es: 'Meta de ingresos del día ($)',
          required: false
        },
        {
          id: 'feedback_clientes',
          type: 'textarea',
          label_en: 'Client Feedback / Incidents Today',
          label_es: 'Feedback de clientas o incidencias del día',
          required: false,
          placeholder_es: 'Clienta López encantada, pidió tarjeta de referidos / Clienta nueva llegó tarde y hubo tensión / Terapeuta Sofía reportó dolor de muñeca...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia de Negocio de un Spa de Alto Rendimiento.
La dueña necesita saber en 45 segundos si el día fue rentable, qué oportunidades se perdieron y qué hacer diferente mañana.

- Citas atendidas: {{citas_dia}}
- Ingresos del día: \${{ingresos_dia}}
- Cancelaciones / no-shows: {{cancelaciones}}
- Horas muertas: {{horas_muertas}}
- Meta del día: \${{meta_dia}}
- Feedback e incidencias: {{feedback_clientes}}

Genera el "PulseSpa del Día":

1. SEMÁFORO DE BIENESTAR COMERCIAL:
🟢 Día Brillante | 🟡 Potencial no aprovechado | 🔴 Día por debajo de la meta
Basado en: cumplimiento de \${{meta_dia}}, impacto de {{cancelaciones}} y costo real de {{horas_muertas}}.

2. CÁLCULO DE OPORTUNIDAD PERDIDA:
¿Cuánto dinero representaron las {{cancelaciones}} y las {{horas_muertas}} combinadas? ¿Qué tratamiento o clienta podría haberse agendado en ese tiempo para cubrir la brecha?

3. ACCIÓN URGENTE POR CANCELACIONES:
Genera el mensaje que la recepcionista envía MAÑANA a las clientas de {{cancelaciones}} para reagendar con una pequeña ventaja ("tienes prioridad en agenda esta semana"). Cálido y sin reproches.

4. GESTIÓN DEL FEEDBACK:
Para cada elemento de {{feedback_clientes}}, la respuesta o acción inmediata: si fue experiencia positiva, cómo capitalizarla (pedir reseña, solicitar referido, agradecer); si fue negativa, el protocolo de recuperación.

5. PLAN DE MAÑANA:
Basado en el ritmo de hoy, ¿qué tipo de tratamiento o franja horaria debería priorizar la agenda de mañana para superar el resultado de hoy? ¿Hay horas muertas proyectadas que se pueden llenar hoy mismo con un mensaje a clientas frecuentes?`
    },
    {
      slug: 'spa-loop',
      name_en: 'SpaLoop Premium',
      name_es: 'SpaLoop Premium',
      description_en: 'From first visit to lifetime wellness member. Full spa growth cycle.',
      description_es: 'Desde la primera visita hasta la membresía de por vida. El ciclo completo de tu spa.',
      icon: 'RefreshCw',
      form_schema: [
        {
          id: 'spa',
          type: 'text',
          label_en: 'Spa / Center Name',
          label_es: 'Nombre del spa o centro de bienestar',
          required: true
        },
        {
          id: 'tipo_spa',
          type: 'select',
          label_en: 'Spa Type',
          label_es: 'Tipo de spa o centro',
          required: true,
          options: [
            { value: 'spa_relajacion', label_en: 'Relaxation & Massage Spa', label_es: 'Spa de relajación y masajes' },
            { value: 'spa_estetico', label_en: 'Aesthetic / Beauty Spa', label_es: 'Spa estético / tratamientos de belleza' },
            { value: 'spa_medico', label_en: 'Medical Spa / Medspa', label_es: 'Spa médico / medspa' },
            { value: 'centro_bienestar', label_en: 'Holistic Wellness Center', label_es: 'Centro de bienestar holístico' }
          ]
        },
        {
          id: 'num_terapeutas',
          type: 'text',
          label_en: 'Number of Therapists / Staff',
          label_es: 'Número de terapeutas y personal',
          required: true
        },
        {
          id: 'dolor_agenda',
          type: 'textarea',
          label_en: 'Scheduling / Retention Problem',
          label_es: 'Problema de agenda y retención de clientas',
          required: true,
          placeholder_es: 'Muchas clientas de una sola visita que no regresan, días muertos en semana, cancelaciones frecuentes...'
        },
        {
          id: 'dolor_ingresos',
          type: 'textarea',
          label_en: 'Revenue / Growth Problem',
          label_es: 'Problema de ingresos o crecimiento del negocio',
          required: true,
          placeholder_es: 'Ticket promedio bajo, no tenemos membresías, dependemos de temporadas, poca diferencia vs. competencia...'
        },
        {
          id: 'fase',
          type: 'select',
          label_en: 'Priority Module Today',
          label_es: 'Módulo donde necesitas más impacto hoy',
          required: true,
          options: [
            { value: 'fidelizacion', label_en: 'Client Retention & Reactivation', label_es: 'Fidelización y reactivación de clientas' },
            { value: 'ticket', label_en: 'Ticket Increase & Memberships', label_es: 'Aumento de ticket y membresías' },
            { value: 'operacion', label_en: 'Scheduling & Team Optimization', label_es: 'Optimización de agenda y equipo' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para spas y centros de bienestar que quieren crecer sin perder la esencia de su experiencia, implementando el sistema "SpaLoop": el ciclo de prosperidad para espacios de bienestar con visión empresarial.

Spa: {{spa}}
Tipo: {{tipo_spa}}
Equipo: {{num_terapeutas}} personas
Problema de agenda/retención: {{dolor_agenda}}
Problema de ingresos: {{dolor_ingresos}}
Fase prioritaria: {{fase}}

Activa el módulo SpaLoop correspondiente:

Si {{fase}} = FIDELIZACIÓN:
→ Diseña el "Programa de Clientas Fieles de {{spa}}" con 3 niveles: Visitante, Regular y VIP. Incluye:
(1) Los criterios de cada nivel y los beneficios exclusivos que reciben (prioridad de agenda, tratamiento de cumpleaños, descuento en membresía, acceso a nuevos rituales primero).
(2) La campaña de reactivación de las últimas 30 clientas inactivas mayores de 6 semanas — con 2 mensajes de WhatsApp listos: uno basado en el tratamiento favorito y otro con una oferta de regreso exclusiva.
(3) El protocolo de "primer mes de membresía" para convertir clientas ocasionales en suscriptoras: qué incluye, cómo presentarlo en la cita, el argumento de "te sale más barato que una sola visita" con los números reales.

Si {{fase}} = TICKET:
→ Construye el "Menú de Experiencias Premium de {{spa}}": 3 rituales o paquetes nuevos con nombres evocadores (ej. "Ritual Luna Llena", "Experiencia Detox Profundo") que combinen tratamientos existentes en experiencias de 90-120 min con precio accesible pero margen superior, el guion de presentación para recepción y terapeutas que aumenta el ticket promedio en cada reserva, la estrategia de membresía mensual con 2 niveles (Bienestar Esencial / Ritual Completo) con precio, incluidos y el argumento de "1 suscripción = resultados visibles".

Si {{fase}} = OPERACIÓN:
→ Diseña el "Sistema de Agenda Perfecta de {{spa}}": la política de cancelaciones y no-shows que protege el ingreso sin ahuyentar clientas (depósito, lista de espera, confirmación 24h), la distribución óptima de turnos para {{num_terapeutas}} terapeutas que elimina horas muertas en días planos, el protocolo de lunes a viernes para ocupar los horarios históricamente vacíos con estrategias de última hora (lista de espera activa, "cita exprés de 45 min disponible hoy").

Cierra con "El Próximo Movimiento de {{spa}}": la única acción de mayor ROI que la dueña ejecuta esta semana para ver resultados en menos de 7 días.`
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

    // SpaLoop & DecideSpa → Enterprise, rest → Pro
    let targetPlan = proPlan
    if (app.slug === 'spa-loop' || app.slug === 'decide-spa') {
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

  console.log('\n✅ Micro-Apps de Spas y Centros de Bienestar completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
