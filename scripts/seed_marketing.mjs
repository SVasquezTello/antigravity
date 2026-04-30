import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('📣 Seeding Micro-Apps para Agencias de Marketing y Publicidad...')

  const apps = [
    {
      slug: 'reactiva-cliente-mkt',
      name_en: 'ReactivaCliente MKT',
      name_es: 'ReactivaCliente MKT',
      description_en: 'That prospect who went silent after the proposal is still your best lead.',
      description_es: 'Ese prospecto que vio tu propuesta y desapareció sigue siendo tu mejor oportunidad.',
      icon: 'Users',
      form_schema: [
        {
          id: 'empresa',
          type: 'text',
          label_en: 'Prospect / Client Company',
          label_es: 'Nombre de la empresa prospecto o cliente anterior',
          required: true
        },
        {
          id: 'servicio_cotizado',
          type: 'select',
          label_en: 'Service Quoted or Previously Contracted',
          label_es: 'Servicio cotizado o contratado anteriormente',
          required: true,
          options: [
            { value: 'redes_sociales', label_en: 'Social Media Management', label_es: 'Manejo de redes sociales' },
            { value: 'paid_ads', label_en: 'Paid Ads (Google/Meta)', label_es: 'Publicidad pagada (Google / Meta Ads)' },
            { value: 'seo', label_en: 'SEO / Web Positioning', label_es: 'SEO / Posicionamiento web' },
            { value: 'branding', label_en: 'Branding & Identity', label_es: 'Branding e identidad de marca' },
            { value: 'web', label_en: 'Website / Landing Page', label_es: 'Página web / landing page' },
            { value: 'email_mkt', label_en: 'Email Marketing', label_es: 'Email marketing / automatización' },
            { value: 'contenido', label_en: 'Content Creation', label_es: 'Creación de contenido / copywriting' },
            { value: 'full_service', label_en: 'Full Service / Integral', label_es: 'Marketing integral / full service' }
          ]
        },
        {
          id: 'dias_frio',
          type: 'text',
          label_en: 'Days Without Response',
          label_es: 'Días sin respuesta desde el último contacto',
          required: true
        },
        {
          id: 'situacion',
          type: 'textarea',
          label_en: 'Context (what happened in the last interaction)',
          label_es: 'Contexto: qué pasó en el último contacto',
          required: true,
          placeholder_es: 'Enviamos propuesta, dijo que la revisaría, desapareció. / Ex-cliente que salió hace 3 meses alegando presupuesto...'
        },
        {
          id: 'objecion',
          type: 'select',
          label_en: 'Assumed / Known Objection',
          label_es: 'Objeción asumida o conocida',
          required: true,
          options: [
            { value: 'precio', label_en: 'Price / Budget', label_es: 'Precio / presupuesto' },
            { value: 'resultados', label_en: 'Doubts About Results / ROI', label_es: 'Dudas sobre resultados / ROI' },
            { value: 'agencia_actual', label_en: 'Has Another Agency', label_es: 'Ya tiene otra agencia' },
            { value: 'tiempo', label_en: 'No Time to Manage It', label_es: 'No tiene tiempo para gestionarlo' },
            { value: 'desconocida', label_en: 'Unknown', label_es: 'Desconocida' }
          ]
        }
      ],
      prompt_template: `Actúa como el Director Comercial de una agencia de marketing de alto rendimiento con un pipeline activo y cero tolerancia a las propuestas que mueren en silencio.

Empresa: {{empresa}}
Servicio: {{servicio_cotizado}}
Días en silencio: {{dias_frio}}
Contexto del último contacto: {{situacion}}
Objeción asumida: {{objecion}}

Genera DOS mensajes de reactivación listos para enviar HOY por WhatsApp o email:

1. "VERSIÓN VALOR + INSIGHT":
Reabre la conversación ofreciendo algo concreto y gratuito que demuestre el nivel de la agencia: un dato sobre la industria de {{empresa}}, una auditoría rápida de su perfil en {{servicio_cotizado}}, o un hallazgo específico de su competencia. Que {{empresa}} piense "esta agencia ya está trabajando para mí antes de firmar". Toca sutilmente la objeción {{objecion}} sin mencionarla directamente. Máx. 6 líneas.

2. "VERSIÓN URGENCIA DE MERCADO":
Crea urgencia legítima basada en algo real: temporada de alta demanda publicitaria, cambio de algoritmo de Meta/Google que les afecta, o un competidor directo que está invirtiendo fuerte ahora. Ofrece una reunión de diagnóstico de 20 minutos sin costo como siguiente paso de baja fricción. Máx. 5 líneas.

Al final: recomienda cuál enviar primero y el timing ideal (¿mañana 10am? ¿jueves después del mediodía?).`
    },
    {
      slug: 'upsell-agencia-ai',
      name_en: 'UpsellAgencia AI',
      name_es: 'UpsellAgencia AI',
      description_en: 'They pay for social media. Discover the 3 services they\'ll add this quarter.',
      description_es: 'Pagan por un servicio. Descubre los 3 que agregarán al contrato este trimestre.',
      icon: 'TrendingUp',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Company',
          label_es: 'Nombre del cliente',
          required: true
        },
        {
          id: 'servicio_actual',
          type: 'text',
          label_en: 'Currently Contracted Service(s)',
          label_es: 'Servicio(s) actualmente contratado(s)',
          required: true,
          placeholder_es: 'Manejo de redes sociales + diseño gráfico mensual'
        },
        {
          id: 'meses_cliente',
          type: 'text',
          label_en: 'Months as Client',
          label_es: 'Meses que lleva como cliente',
          required: true
        },
        {
          id: 'objetivo_cliente',
          type: 'select',
          label_en: "Client's Main Business Goal",
          label_es: 'Objetivo principal del cliente',
          required: true,
          options: [
            { value: 'mas_ventas', label_en: 'More Sales / Leads', label_es: 'Más ventas / leads' },
            { value: 'posicionamiento', label_en: 'Brand Awareness / Positioning', label_es: 'Reconocimiento de marca / posicionamiento' },
            { value: 'lanzamiento', label_en: 'New Product / Service Launch', label_es: 'Lanzamiento de nuevo producto o servicio' },
            { value: 'traficoweb', label_en: 'More Website Traffic', label_es: 'Más tráfico web' },
            { value: 'retencion_clientes', label_en: 'Customer Retention / Loyalty', label_es: 'Retención de clientes propios' }
          ]
        },
        {
          id: 'servicios_agencia',
          type: 'textarea',
          label_en: 'Services Your Agency Offers',
          label_es: 'Servicios que ofrece tu agencia',
          required: true,
          placeholder_es: 'Google Ads, Meta Ads, SEO, email marketing, landing pages, video corto, influencer marketing, CRM, análisis de datos...'
        }
      ],
      prompt_template: `Eres el Estratega de Cuentas Senior de una agencia de marketing de performance. Sabes que retener y hacer crecer un cliente existente cuesta 5 veces menos que conseguir uno nuevo.

Cliente: {{cliente}} (lleva {{meses_cliente}} meses)
Contrato actual: {{servicio_actual}}
Objetivo del cliente: {{objetivo_cliente}}
Servicios de la agencia: {{servicios_agencia}}

Identifica los 3 servicios adicionales con mayor probabilidad de que {{cliente}} contrate este trimestre para acercarse a su objetivo de {{objetivo_cliente}}.

Para cada upsell:
1. EL SERVICIO: Cuál de {{servicios_agencia}} es el más estratégico para {{objetivo_cliente}} y por qué es el momento perfecto dado los {{meses_cliente}} meses de relación (ya tienen datos, confianza y contexto).
2. EL ARGUMENTO ROI: Qué resultado concreto y medible puede esperar {{cliente}} al agregar este servicio. Usa métricas realistas de la industria (ej. "Las campañas de Google Ads bien gestionadas generan en promedio 4x el ROAS en el primer trimestre para negocios como el tuyo").
3. EL GUION DE LA REUNIÓN: Las frases exactas que el account manager usa en la próxima llamada o reunión de seguimiento para presentarlo como una "recomendación estratégica del equipo", no como una venta adicional.

Cierra con el "Paquete de Crecimiento {{cliente}}": cómo presentar los 3 servicios como un plan trimestral integrado con nombre, precio combinado y proyección de resultados que justifique la inversión total.`
    },
    {
      slug: 'propuesta-win-ai',
      name_en: 'PropuestaWin AI',
      name_es: 'PropuestaWin AI',
      description_en: 'Generate winning proposals that close, not just impress.',
      description_es: 'Genera propuestas que cierran contratos, no solo impresionan en la reunión.',
      icon: 'FileText',
      form_schema: [
        {
          id: 'empresa_cliente',
          type: 'text',
          label_en: 'Prospect Company Name',
          label_es: 'Nombre de la empresa prospecto',
          required: true
        },
        {
          id: 'industria_cliente',
          type: 'text',
          label_en: 'Client\'s Industry',
          label_es: 'Industria del cliente',
          required: true,
          placeholder_es: 'Restaurante, clínica dental, inmobiliaria, e-commerce de ropa...'
        },
        {
          id: 'servicios_propuestos',
          type: 'textarea',
          label_en: 'Services to Propose',
          label_es: 'Servicios que vas a proponer',
          required: true,
          placeholder_es: 'Manejo de Instagram y Facebook + campañas Meta Ads + diseño de 12 posts mensuales'
        },
        {
          id: 'dolor_cliente',
          type: 'textarea',
          label_en: "Client's Pain Point (what they told you)",
          label_es: 'Dolor del cliente que mencionó en la reunión o conversación',
          required: true,
          placeholder_es: '"No tenemos presencia en redes", "Invertimos en publicidad y no vemos resultados", "Queremos más clientes pero no sabemos cómo"...'
        },
        {
          id: 'precio_propuesta',
          type: 'text',
          label_en: 'Proposed Monthly Investment',
          label_es: 'Inversión mensual que vas a proponer',
          required: true
        },
        {
          id: 'diferencial_agencia',
          type: 'textarea',
          label_en: 'Your Agency\'s Differentiators',
          label_es: 'Diferenciadores de tu agencia vs. competencia',
          required: true,
          placeholder_es: 'Reportes semanales, gestor dedicado, sin permanencia mínima, especialistas en su industria, garantía de resultados...'
        }
      ],
      prompt_template: `Actúa como el Socio Estratégico de la agencia, el que escribe las propuestas que se firman — no las que se archivan.

Prospecto: {{empresa_cliente}} (industria: {{industria_cliente}})
Servicios a proponer: {{servicios_propuestos}}
Dolor del cliente: "{{dolor_cliente}}"
Inversión propuesta: {{precio_propuesta}} / mes
Diferenciadores de la agencia: {{diferencial_agencia}}

Genera el "Kit de Propuesta Ganadora" completo:

1. EXECUTIVE SUMMARY (el párrafo de apertura que decide si siguen leyendo):
Una descripción de 4-5 líneas que demuestre que entendemos el negocio de {{empresa_cliente}} y su dolor "{{dolor_cliente}}" mejor de lo que ellos mismos lo describirían. Que lean esto y piensen: "estas personas ya nos conocen".

2. EL DIAGNÓSTICO DEL PROBLEMA:
No lo que "haremos", sino lo que está pasando HOY en el negocio de {{empresa_cliente}} por no tener {{servicios_propuestos}}. Cuantifica la oportunidad perdida en términos concretos para la industria {{industria_cliente}}.

3. NUESTRA PROPUESTA DE VALOR:
Los {{servicios_propuestos}} explicados como soluciones a "{{dolor_cliente}}", no como una lista de tareas. Para cada servicio: qué resultado específico produce, en qué tiempo, y cómo se mide.

4. POR QUÉ NOSOTROS — NO OTRA AGENCIA:
Un párrafo corto y contundente que use {{diferencial_agencia}} para desactivar la comparación con la competencia. Que sea verificable y concreto, no adjetivos vacíos.

5. INVERSIÓN Y ROI ESPERADO:
Presenta {{precio_propuesta}}/mes como una inversión, no un costo. Incluye el ROI mínimo esperable y razonable para {{industria_cliente}} en los primeros 90 días.

6. CALL TO ACTION DE CIERRE:
El párrafo final que invita a dar el siguiente paso concreto (firmar, agendar kick-off, pagar primer mes) con fecha límite de validez de la propuesta.`
    },
    {
      slug: 'decide-agencia',
      name_en: 'DecideAgencia',
      name_es: 'DecideAgencia',
      description_en: 'Your agency metrics should drive strategy, not just fill Monday.com.',
      description_es: 'Tus métricas de agencia deben generar decisiones, no solo llenar dashboards.',
      icon: 'BarChart2',
      form_schema: [
        {
          id: 'datos_agencia',
          type: 'textarea',
          label_en: 'Agency Data (clients, revenue, churn, margins, team)',
          label_es: 'Datos de la agencia (clientes activos, ingresos, bajas, márgenes, equipo)',
          required: true,
          placeholder_es: 'Clientes activos: 18, MRR: $45,000, bajas este trimestre: 3, servicio más vendido: redes sociales (60%), margen promedio: 38%...'
        },
        {
          id: 'problema',
          type: 'text',
          label_en: 'Main Business Problem',
          label_es: 'Principal problema o decisión que necesitas resolver',
          required: true,
          placeholder_es: '¿Por qué pierdo clientes al 3er mes? / ¿Cuál servicio debería pausar? / ¿Cómo llegar a 60 clientes?'
        },
        {
          id: 'area',
          type: 'select',
          label_en: 'Focus Area',
          label_es: 'Área a analizar',
          required: true,
          options: [
            { value: 'retencion', label_en: 'Client Retention & Churn', label_es: 'Retención de clientes y churn' },
            { value: 'rentabilidad', label_en: 'Service & Client Profitability', label_es: 'Rentabilidad por servicio / cliente' },
            { value: 'equipo', label_en: 'Team Capacity & Utilization', label_es: 'Capacidad del equipo y utilización' },
            { value: 'nuevos_clientes', label_en: 'New Business & Prospecting', label_es: 'Nuevos clientes y prospección' },
            { value: 'precios', label_en: 'Pricing & Package Strategy', label_es: 'Estrategia de precios y paquetes' }
          ]
        },
        {
          id: 'contexto',
          type: 'textarea',
          label_en: 'Context (market, team situation, competition)',
          label_es: 'Contexto relevante (mercado, situación del equipo, competencia)',
          required: true
        }
      ],
      prompt_template: `Eres un Consultor de Gestión Estratégica especializado en agencias de marketing y servicios creativos. Has reestructurado más de 50 agencias que "facturaban bien pero no ganaban bien".

Datos de la agencia: {{datos_agencia}}
Problema principal: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y sin ambigüedad. Nada de "mejorar la comunicación con clientes". Sí: "Revisar los 3 clientes con más de 45 días de factura pendiente con este mensaje y protocolo de escalada".
2. FUNDAMENTO EN NÚMEROS: Cómo los datos de {{datos_agencia}} justifican esta decisión específicamente para el área de {{area}}.
3. EJECUCIÓN EN 48H: El primer paso concreto que el director o socio ejecuta esta semana para activar la decisión.

Finaliza con el "Diagnóstico de la Agencia":
🟢 Agencia Escalable y Rentable | 🟡 Factura bien, gana poco | 🔴 Churn elevado o márgenes negativos
Justificado en dos líneas con los datos proporcionados.`
    },
    {
      slug: 'pulse-agencia',
      name_en: 'PulseAgencia',
      name_es: 'PulseAgencia',
      description_en: 'Know the real health of every client account in 60 seconds.',
      description_es: 'El semáforo semanal de tu agencia: cuentas, entregas, cobranza y alertas de churn.',
      icon: 'Activity',
      form_schema: [
        {
          id: 'clientes_activos',
          type: 'text',
          label_en: 'Number of Active Clients',
          label_es: 'Número de clientes activos esta semana',
          required: true
        },
        {
          id: 'entregas_semana',
          type: 'textarea',
          label_en: 'Deliverables Due This Week',
          label_es: 'Entregables pendientes o completados esta semana',
          required: true,
          placeholder_es: 'Reporte mensual cliente X (pendiente), campaña Meta cliente Y (entregada), diseños cliente Z (en proceso)...'
        },
        {
          id: 'clientes_riesgo',
          type: 'textarea',
          label_en: 'At-Risk Clients (silent, complaining, slow to pay)',
          label_es: 'Clientes en riesgo de churn o con señales de alerta',
          required: true,
          placeholder_es: 'Cliente A no responde en 10 días, cliente B se quejó de los resultados de ads, cliente C tiene 2 meses de deuda...'
        },
        {
          id: 'cobranza_pendiente',
          type: 'text',
          label_en: 'Pending Collections ($)',
          label_es: 'Cobranza pendiente de la semana ($)',
          required: true
        },
        {
          id: 'nuevos_prospectos',
          type: 'text',
          label_en: 'New Prospects in Pipeline',
          label_es: 'Nuevos prospectos en pipeline esta semana',
          required: true
        },
        {
          id: 'meta_mrr',
          type: 'text',
          label_en: 'Monthly Recurring Revenue Goal (MRR)',
          label_es: 'Meta de MRR del mes ($)',
          required: false
        }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Comercial y Operativa de una Agencia de Marketing de Alto Rendimiento.
El director necesita el pulso real de la agencia en menos de 60 segundos — sin abrir 5 hojas de cálculo.

- Clientes activos: {{clientes_activos}}
- Entregables semana: {{entregas_semana}}
- Clientes en riesgo: {{clientes_riesgo}}
- Cobranza pendiente: \${{cobranza_pendiente}}
- Prospectos en pipeline: {{nuevos_prospectos}}
- Meta MRR: \${{meta_mrr}}

Genera el "PulseAgencia Semanal":

1. SEMÁFORO EJECUTIVO:
🟢 Agencia en Control | 🟡 Presión en Cuentas o Cobranza | 🔴 Churn Inminente o Entregas Críticas
Basado en el estado de {{clientes_riesgo}}, la deuda de {{cobranza_pendiente}} y las entregas de {{entregas_semana}}.

2. TOP ALERTA DE CHURN: Identifica al cliente de {{clientes_riesgo}} con mayor probabilidad de cancelar esta semana y genera el mensaje exacto que el account manager le envía HOY para retenerlo, sin sonar desesperado.

3. PRIORIDAD DE COBRANZA: Con \${{cobranza_pendiente}} en juego, identifica el primer movimiento de cobranza que el director autoriza esta semana: qué cliente, qué mensaje y qué fecha límite antes de escalar.

4. ESTADO DE ENTREGABLES: ¿Hay algún entregable de {{entregas_semana}} que, si se retrasa, puede detonar una queja o cancelación? Identifícalo y sugiere la acción preventiva.

5. PROYECCIÓN DE MRR: Con los {{nuevos_prospectos}} en pipeline y el estado actual, ¿cuánto MRR adicional puede cerrarse esta semana? ¿Se alcanzará la meta de \${{meta_mrr}}? ¿Qué brecha hay y con cuántos cierres se cubre?`
    },
    {
      slug: 'agencia-loop',
      name_en: 'AgenciaLoop Premium',
      name_es: 'AgenciaLoop Premium',
      description_en: 'From first pitch to 12-month retainer. Full agency growth system.',
      description_es: 'Desde el primer pitch hasta el retainer de 12 meses. El sistema completo de tu agencia.',
      icon: 'RefreshCw',
      form_schema: [
        {
          id: 'agencia',
          type: 'text',
          label_en: 'Agency Name',
          label_es: 'Nombre de la agencia',
          required: true
        },
        {
          id: 'especialidad',
          type: 'text',
          label_en: 'Agency Specialty / Services',
          label_es: 'Especialidad y servicios principales de la agencia',
          required: true,
          placeholder_es: 'Social media + paid ads para restaurantes y retail, agencia full service B2B...'
        },
        {
          id: 'num_clientes',
          type: 'text',
          label_en: 'Current Number of Clients',
          label_es: 'Número actual de clientes',
          required: true
        },
        {
          id: 'mrr_actual',
          type: 'text',
          label_en: 'Current Monthly Recurring Revenue (MRR)',
          label_es: 'MRR actual de la agencia ($)',
          required: true
        },
        {
          id: 'dolor_clientes',
          type: 'textarea',
          label_en: 'New Business Problem (pipeline, proposals, closing)',
          label_es: 'Problema principal en nuevo negocio (pipeline, propuestas, cierre)',
          required: true
        },
        {
          id: 'dolor_retencion',
          type: 'textarea',
          label_en: 'Client Retention Problem (churn, dissatisfaction)',
          label_es: 'Problema principal de retención (churn, cuentas insatisfechas)',
          required: true
        },
        {
          id: 'fase',
          type: 'select',
          label_en: 'Priority Module Today',
          label_es: 'Módulo donde necesitas más impacto hoy',
          required: true,
          options: [
            { value: 'nuevo_negocio', label_en: 'New Business & Prospecting', label_es: 'Nuevo negocio y prospección' },
            { value: 'retencion', label_en: 'Client Retention & Account Growth', label_es: 'Retención y crecimiento de cuentas' },
            { value: 'operacion', label_en: 'Agency Operations & Profitability', label_es: 'Operación interna y rentabilidad' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para agencias de marketing en crecimiento, implementando el sistema "AgenciaLoop": el ciclo de escalamiento sin caos para líderes de agencia que quieren pasar de nómada digital a empresa real.

Agencia: {{agencia}}
Especialidad: {{especialidad}}
Clientes actuales: {{num_clientes}}
MRR actual: \${{mrr_actual}}
Problema de nuevo negocio: {{dolor_clientes}}
Problema de retención: {{dolor_retencion}}
Fase prioritaria: {{fase}}

Activa el módulo AgenciaLoop correspondiente:

Si {{fase}} = NUEVO NEGOCIO:
→ Diseña la "Máquina de Prospección de {{agencia}}" para duplicar el pipeline en 30 días. Incluye:
(1) El perfil exacto del cliente ideal para {{especialidad}} con 5 criterios de calificación (industria, tamaño, presupuesto mínimo, señal de dolor, canal de contacto).
(2) La secuencia de prospección en LinkedIn/WhatsApp/email de 5 toques en 10 días con los mensajes exactos para cada toque.
(3) El proceso de la "reunión de diagnóstico gratuita de 30 min": cómo estructurarla para que el prospecto termine la reunión queriendo firmar, con las 5 preguntas que revelan el dolor real y el presupuesto disponible.

Si {{fase}} = RETENCIÓN:
→ Construye el "Sistema de Cuenta Saludable" de {{agencia}}: el mapa de los 4 momentos donde más se pierde un cliente en agencias de {{especialidad}} y la intervención exacta en cada uno, el "Health Score" de cada cliente (cómo calcular en 5 minutos si una cuenta está en riesgo), el protocolo de "Revisión Trimestral de Valor" que convierte clientes conformes en embajadores y clientes insatisfechos en casos de éxito rescatados.

Si {{fase}} = OPERACIÓN:
→ Diseña el "Modelo Operativo Rentable de {{agencia}}": la estructura de equipo ideal para el nivel de {{num_clientes}} clientes y \${{mrr_actual}} MRR (roles, carga máxima por persona, protocolo de onboarding de cuenta nueva), la fórmula para calcular el precio mínimo rentable por servicio considerando horas reales + overhead + margen objetivo, y el sistema de reportes al cliente que reduce las llamadas de "¿cómo vamos?" al mínimo y maximiza la percepción de valor sin consumir tiempo del equipo.

Cierra con "El Próximo Movimiento de {{agencia}}": la única acción de mayor ROI que el director ejecuta en las próximas 48 horas para acelerar el crecimiento hacia la siguiente etapa.`
    },
    {
      slug: 'influencer-scale',
      name_en: 'InfluencerScale AI',
      name_es: 'InfluencerScale AI',
      description_en: 'Evaluate influencer alignment and projected campaign ROI.',
      description_es: 'Evalúa el alineamiento de influencers y el ROI proyectado de campaña.',
      icon: 'Star',
      form_schema: [
        { id: 'influencer', type: 'text', label_en: 'Influencer Name/Handle', label_es: 'Nombre/User del Influencer', required: true },
        { id: 'audiencia_datos', type: 'textarea', label_en: 'Audience Data (Engagement, Location, Interests)', label_es: 'Datos de audiencia (Engagement, ubicación, intereses)', required: true },
        { id: 'objetivo_campana', type: 'text', label_en: 'Campaign Goal', label_es: 'Objetivo de la campaña', required: true }
      ],
      prompt_template: `Actúa como un Especialista en Marketing de Influencers. Queremos saber si este influencer vale la inversión.
      
      INFLUENCER: {{influencer}}
      DATOS: {{audiencia_datos}}
      META: {{objetivo_campana}}
      
      ENTREGA:
      1. SCORE DE ALINEAMIENTO (1-10): ¿Realmente su audiencia encaja con la marca?
      2. ROI PROYECTADO: Estimación de impacto basada en engagement real.
      3. 3 IDEAS DE CONTENIDO: Cómo integrar la marca de forma orgánica y efectiva.`
    },
    {
      slug: 'copy-audit-ai',
      name_en: 'CopyAudit AI',
      name_es: 'CopyAudit AI',
      description_en: 'Surgical audit of landing pages and ads to increase conversion.',
      description_es: 'Auditoría quirúrgica de landing pages y ads para subir la conversión.',
      icon: 'Search',
      form_schema: [
        { id: 'copy_actual', type: 'textarea', label_en: 'Current Copy', label_es: 'Copy actual', required: true },
        { id: 'target', type: 'text', label_en: 'Target Audience', label_es: 'Audiencia objetivo', required: true },
        { id: 'conversion_actual', type: 'text', label_en: 'Current Conversion Rate', label_es: 'Tasa de conversión actual (si se conoce)', required: false }
      ],
      prompt_template: `Eres un Copywriter de Respuesta Directa con obsesión por la conversión. Destroza y reconstruye este copy.
      
      COPY: {{copy_actual}}
      TARGET: {{target}}
      CONVERSIÓN: {{conversion_actual}}
      
      ENTREGA:
      1. ANÁLISIS DE PUNTOS DÉBILES: ¿Dónde se pierde la atención o la confianza?
      2. REESTRUCTURACIÓN PSICOLÓGICA: 3 cambios clave para inyectar deseo y urgencia.
      3. EL NUEVO COPY "CONTROL": La versión optimizada lista para testear.`
    },
    {
      slug: 'funnel-architect',
      name_en: 'FunnelArchitect',
      name_es: 'FunnelArchitect',
      description_en: 'Design high-conversion sales funnels from lead to customer.',
      description_es: 'Diseña embudos de venta de alta conversión desde lead hasta cliente.',
      icon: 'Filter',
      form_schema: [
        { id: 'producto', type: 'text', label_en: 'Product/Service', label_es: 'Producto o servicio', required: true },
        { id: 'lead_magnet', type: 'text', label_en: 'Lead Magnet Idea', label_es: 'Idea de gancho (Lead Magnet)', required: true },
        { id: 'precio_final', type: 'text', label_en: 'Main Offer Price', label_es: 'Precio de la oferta principal', required: true }
      ],
      prompt_template: `Actúa como un Estratega de Funnels. Diseña un embudo que convierta desconocidos en compradores.
      
      OFERTA: {{producto}} por {{precio_final}}
      GANCHO: {{lead_magnet}}
      
      GENERA EL ROADMAP DEL FUNNEL:
      1. FASE DE CAPTACIÓN: Anuncios y canales.
      2. FASE DE ADOCTRINAMIENTO: Qué pasa después del registro (secuencia de valor).
      3. FASE DE CIERRE: Estrategia de la página de ventas y checkout.
      4. UPSELL SUGERIDO: Cómo aumentar el valor medio del carrito.`
    },
    {
      slug: 'creative-brief-ai',
      name_en: 'CreativeBrief AI',
      name_es: 'CreativeBrief AI',
      description_en: 'Generate precise briefs for creative teams to avoid rework.',
      description_es: 'Genera briefs precisos para equipos creativos y evita re-trabajos.',
      icon: 'Palette',
      form_schema: [
        { id: 'proyecto', type: 'text', label_en: 'Project Name', label_es: 'Nombre del proyecto', required: true },
        { id: 'mensaje_clave', type: 'textarea', label_en: 'Key Message', label_es: 'Mensaje clave a transmitir', required: true },
        { id: 'entregables', type: 'text', label_en: 'Deliverables (Ads, Banners, Video)', label_es: 'Entregables (Ads, banners, video)', required: true }
      ],
      prompt_template: `Eres un Director de Arte experimentado. Dale claridad total al equipo creativo.
      
      PROYECTO: {{proyecto}}
      MENSAJE: {{mensaje_clave}}
      ENTREGABLES: {{entregables}}
      
      ENTREGA EL BRIEF MAESTRO:
      1. CONCEPTO CREATIVO: El "gran ángulo" de la campaña.
      2. LOOK & FEEL: Tono visual, sensaciones y referencias.
      3. REQUISITOS TÉCNICOS: Lo que no puede faltar para que el ad funcione.`
    },
    {
      slug: 'mkt-automation-flow',
      name_en: 'MktAutomation Flow',
      name_es: 'MktAutomation Flow',
      description_en: 'Design automated email/WhatsApp flows for lead nurturing.',
      description_es: 'Diseña flujos automatizados de email/WhatsApp para nutrir leads.',
      icon: 'Workflow',
      form_schema: [
        { id: 'disparador', type: 'text', label_en: 'Trigger (e.g. download)', label_es: 'Disparador (ej. descarga de ebook)', required: true },
        { id: 'num_mensajes', type: 'number', label_en: 'Number of Messages', label_es: 'Número de mensajes en la secuencia', required: true },
        { id: 'objetivo_final', type: 'text', label_en: 'Final Goal (sale, booking)', label_es: 'Objetivo final (venta, cita)', required: true }
      ],
      prompt_template: `Actúa como un Especialista en Marketing Automation. Crea un flujo que trabaje por ti 24/7.
      
      FLUJO: {{num_mensajes}} pasos desde {{disparador}} hasta {{objetivo_final}}.
      
      ENTREGA:
      1. DIAGRAMA LÓGICO: Cuándo se envía cada mensaje (Día 0, Día 1, etc.).
      2. ASUNTOS / HOOKS: Los ganchos de cada mensaje para asegurar apertura.
      3. LÓGICA DE SEGMENTACIÓN: Qué pasa si no abren el mensaje 2?`
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

    // AgenciaLoop & DecideAgencia → Enterprise, rest → Pro
    let targetPlan = proPlan
    if (app.slug === 'agencia-loop' || app.slug === 'decide-agencia') {
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

  console.log('\n✅ Micro-Apps de Agencias de Marketing completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
