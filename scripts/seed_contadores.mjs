import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🧾 Seeding Micro-Apps para Contadores y Despachos Fiscales...')

  const apps = [
    {
      slug: 'reactiva-cliente-fiscal',
      name_en: 'ReactivaCliente Fiscal',
      name_es: 'ReactivaCliente Fiscal',
      description_en: 'Your one-time tax client is your best candidate for a monthly retainer.',
      description_es: 'Tu cliente que solo viene en declaración anual es tu mejor candidato para servicio mensual.',
      icon: 'UserCheck',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name / Company',
          label_es: 'Nombre del cliente o empresa',
          required: true
        },
        {
          id: 'tipo_cliente',
          type: 'select',
          label_en: 'Client Type',
          label_es: 'Tipo de cliente',
          required: true,
          options: [
            { value: 'persona_fisica', label_en: 'Individual with Business Activity', label_es: 'Persona física con actividad empresarial' },
            { value: 'moral', label_en: 'Company (S.A., S. de R.L., etc.)', label_es: 'Persona moral (S.A., S. de R.L., S.C.)' },
            { value: 'asalariado', label_en: 'Salaried / Freelancer (annual return)', label_es: 'Asalariado / freelancer (declaración anual)' },
            { value: 'arrendador', label_en: 'Property Owner / Landlord', label_es: 'Arrendador / propietario de inmueble' },
            { value: 'resico', label_en: 'RESICO / Simplified Regime', label_es: 'RESICO / Régimen Simplificado' }
          ]
        },
        {
          id: 'servicio_previo',
          type: 'text',
          label_en: 'Last Service Provided',
          label_es: 'Último servicio realizado para este cliente',
          required: true,
          placeholder_es: 'Declaración anual 2024, contabilidad mensual que dejó de contratar, constitución de empresa...'
        },
        {
          id: 'meses_inactivo',
          type: 'text',
          label_en: 'Months Inactive / Without Contact',
          label_es: 'Meses sin actividad o sin contacto',
          required: true
        },
        {
          id: 'motivo_salida',
          type: 'select',
          label_en: 'Reason for Inactivity',
          label_es: 'Motivo de inactividad o salida',
          required: true,
          options: [
            { value: 'solo_anual', label_en: 'Only came for annual filing', label_es: 'Solo vino para declaración anual' },
            { value: 'precio', label_en: 'Cost / went to cheaper option', label_es: 'Precio / se fue con contador más barato' },
            { value: 'plataforma_online', label_en: 'Switched to online platform (SAT, Contabilidad en línea)', label_es: 'Se fue a plataforma online o SAT directo' },
            { value: 'sin_actividad', label_en: 'Business went inactive', label_es: 'Empresa o actividad quedó inactiva' },
            { value: 'desconocido', label_en: 'Unknown', label_es: 'Desconocido' }
          ]
        }
      ],
      prompt_template: `Actúa como el Socio Director de un despacho contable que sabe que el mayor activo del negocio no es encontrar clientes nuevos, sino recuperar a los que ya confían en el despacho.

Cliente: {{cliente}} (tipo: {{tipo_cliente}})
Último servicio: {{servicio_previo}}
Inactivo hace: {{meses_inactivo}} meses
Motivo probable: {{motivo_salida}}

Genera DOS mensajes de reactivación listos para enviar HOY por WhatsApp:

1. "VERSIÓN OBLIGACIÓN FISCAL" (urgencia real basada en cumplimiento):
Identifica una obligación fiscal real y próxima que {{tipo_cliente}} podría estar ignorando (declaración provisional mensual, actualización de RFC, cambio de régimen obligatorio por reforma fiscal reciente, CFDI pendientes, buzón tributario activo). Preséntala como "aviso de tu contador" para evitar multas e infracciones reales. Tono: aliado que cuida sus intereses, no vendedor. Máx. 6 líneas.

2. "VERSIÓN BENEFICIO ECONÓMICO" (ahorro fiscal y tranquilidad):
Aborda sutilmente el {{motivo_salida}} con una propuesta concreta: si fue precio, ofrece un plan mensual accesible que se paga solo con las deducciones que actualmente está dejando pasar; si fue plataforma online, explica los riesgos reales de declarar sin asesoría (errores en CFDI, discrepancias, auditorías); si solo vino para lo anual, ofrece el beneficio de la contabilidad mensual en términos de ahorro acumulado al año. Máx. 5 líneas.

Indica al final cuánto dinero en DEVOLUCIÓN o AHORRO fiscal podría estar perdiendo {{tipo_cliente}} cada mes sin servicio contable profesional (estimado realista por perfil).`
    },
    {
      slug: 'upsell-contador-ai',
      name_en: 'UpsellContador AI',
      name_es: 'UpsellContador AI',
      description_en: 'They pay for basic bookkeeping. Unlock the full advisory relationship.',
      description_es: 'Pagan por contabilidad básica. Desbloquea la relación de asesoría fiscal completa.',
      icon: 'TrendingUp',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name / Company',
          label_es: 'Nombre del cliente o empresa',
          required: true
        },
        {
          id: 'servicio_actual',
          type: 'text',
          label_en: 'Currently Contracted Service',
          label_es: 'Servicio actualmente contratado',
          required: true,
          placeholder_es: 'Solo declaración anual / Contabilidad mensual básica / IMSS y nómina...'
        },
        {
          id: 'regimen_fiscal',
          type: 'select',
          label_en: 'Tax Regime',
          label_es: 'Régimen fiscal del cliente',
          required: true,
          options: [
            { value: 'resico', label_en: 'RESICO', label_es: 'RESICO (Régimen Simplificado de Confianza)' },
            { value: 'general_ley', label_en: 'General Regime (Ley)', label_es: 'Régimen General de Ley (Personas Morales)' },
            { value: 'act_empresarial', label_en: 'Business & Professional Activity', label_es: 'Actividad Empresarial y Profesional' },
            { value: 'arrendamiento', label_en: 'Rental Income', label_es: 'Arrendamiento' },
            { value: 'sueldos_salarios', label_en: 'Salaries & Fees', label_es: 'Sueldos y Salarios' },
            { value: 'incorporacion', label_en: 'Tax Incorporation Regime (RIF)', label_es: 'Régimen de Incorporación Fiscal (RIF)' }
          ]
        },
        {
          id: 'situacion_cliente',
          type: 'textarea',
          label_en: 'Client Business Situation',
          label_es: 'Situación actual del negocio del cliente',
          required: true,
          placeholder_es: 'Tiene 3 empleados, factura aprox $80,000/mes, quiere crecer, no tiene control de gastos, nunca ha deducido...'
        },
        {
          id: 'servicios_despacho',
          type: 'textarea',
          label_en: 'Services Your Firm Offers',
          label_es: 'Servicios adicionales que ofrece tu despacho',
          required: true,
          placeholder_es: 'Nómina, IMSS, INFONAVIT, planeación fiscal, constitución de empresa, declaraciones complementarias, asesoría en auditorías, CFDI, representación ante SAT...'
        }
      ],
      prompt_template: `Eres el Consultor Fiscal Senior de un despacho contable que entiende que la diferencia entre un cliente que te paga $500/mes y uno que te paga $3,500/mes es simplemente que nadie le ha mostrado al primero lo que está dejando sobre la mesa.

Cliente: {{cliente}} (régimen: {{regimen_fiscal}})
Servicio actual: {{servicio_actual}}
Situación: {{situacion_cliente}}
Servicios del despacho: {{servicios_despacho}}

Identifica los 3 servicios adicionales de {{servicios_despacho}} con mayor impacto en el bolsillo de {{cliente}} y mayor probabilidad de contratación. Para cada uno:

1. EL SERVICIO: Cuál de {{servicios_despacho}} es más crítico para alguien con régimen {{regimen_fiscal}} en la situación {{situacion_cliente}}.

2. EL ARGUMENTO DE COSTO-OPORTUNIDAD: Cuánto está perdiendo {{cliente}} CADA MES por no tener este servicio. Usa cifras realistas y concretas (multas evitables, deducciones no aplicadas, IMSS mal calculado, ISR pagado de más).

3. EL GUION DE LA CONVERSACIÓN: Las palabras exactas que el contador usa en la revisión mensual o entrega de declaración para presentar el servicio adicional como "detección de una necesidad", no como una venta.

Cierra con el "Paquete Fiscal Integral {{cliente}}": cómo estructurar un retainer mensual que agrupe los 3 servicios con nombre, precio fijo mensual y el argumento de "un solo pago fijo vs. multas e imprevistos".`
    },
    {
      slug: 'explica-fiscal-ai',
      name_en: 'ExplicaFiscal AI',
      name_es: 'ExplicaFiscal AI',
      description_en: 'Turn complex tax concepts into clear client communications that build trust.',
      description_es: 'Convierte conceptos fiscales complejos en comunicaciones claras que fidelizan al cliente.',
      icon: 'FileText',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client Name',
          label_es: 'Nombre del cliente',
          required: true
        },
        {
          id: 'tema_fiscal',
          type: 'text',
          label_en: 'Tax Topic / Situation to Explain',
          label_es: 'Tema fiscal o situación a explicar al cliente',
          required: true,
          placeholder_es: 'Por qué el ISR de este mes fue mayor, qué es el RESICO y cómo le afecta, resultado de su declaración anual, notificación del SAT que recibió...'
        },
        {
          id: 'tipo_comunicacion',
          type: 'select',
          label_en: 'Communication Type',
          label_es: 'Tipo de comunicación a generar',
          required: true,
          options: [
            { value: 'explicacion_whatsapp', label_en: 'WhatsApp explanation (non-technical)', label_es: 'Explicación por WhatsApp (sin tecnicismos)' },
            { value: 'resumen_declaracion', label_en: 'Filing result summary for client', label_es: 'Resumen de resultado de declaración para cliente' },
            { value: 'carta_sat', label_en: 'Response / explanation of SAT notification', label_es: 'Explicación de notificación SAT al cliente' },
            { value: 'carta_propuesta', label_en: 'Service proposal letter', label_es: 'Carta propuesta de servicio' },
            { value: 'requerimiento_docs', label_en: 'Document request to client', label_es: 'Solicitud de documentos al cliente' }
          ]
        },
        {
          id: 'datos_tecnicos',
          type: 'textarea',
          label_en: 'Technical Data / Numbers to Include',
          label_es: 'Datos técnicos o números a incluir en la comunicación',
          required: true,
          placeholder_es: 'El ISR causado fue $12,450, se acreditaron $3,200 de pagos previos, saldo a pagar $9,250. O: La notificación es por discrepancia en CFDI emitidos vs. declarados en 2023...'
        },
        {
          id: 'tono',
          type: 'select',
          label_en: 'Communication Tone',
          label_es: 'Tono de la comunicación',
          required: true,
          options: [
            { value: 'tranquilizador', label_en: 'Reassuring / calming', label_es: 'Tranquilizador / calmar al cliente asustado' },
            { value: 'informativo', label_en: 'Informative / educational', label_es: 'Informativo / educativo' },
            { value: 'urgente', label_en: 'Urgent / action required', label_es: 'Urgente / requiere acción inmediata del cliente' },
            { value: 'profesional_formal', label_en: 'Formal / professional letter', label_es: 'Formal / carta profesional' }
          ]
        }
      ],
      prompt_template: `Actúa como el Comunicador Fiscal experto de un despacho contable: alguien que domina el SAT, el ISR y el IVA tanto como domina el arte de explicarlos en español de todos los días.

Cliente: {{cliente}}
Tema a comunicar: {{tema_fiscal}}
Tipo de documento: {{tipo_comunicacion}}
Datos técnicos: {{datos_tecnicos}}
Tono requerido: {{tono}}

Genera el documento de comunicación al cliente con estas reglas:

REGLA 1 — CERO TECNICISMOS SIN EXPLICACIÓN: Si debes usar un término fiscal (ISR, IVA, CFDI, DIOT), explícalo de inmediato en una frase coloquial entre paréntesis.

REGLA 2 — ESTRUCTURA CLARA: Usa una estructura de 3 partes: ¿Qué pasó? → ¿Por qué pasó? → ¿Qué hacemos ahora? (o ¿qué necesito de ti?).

REGLA 3 — NÚMEROS CONTEXTUALIZADOS: Si hay cifras en {{datos_tecnicos}}, ponlas en contexto de impacto real para {{cliente}}: no solo "el ISR causó $9,250" sino "de cada $100 que facturaste este mes, $11.60 van al SAT como impuesto".

REGLA 4 — CTA CLARO: Si el cliente debe hacer algo, dilo en una sola oración al final: "Para continuar necesito que me envíes X antes del Y".

REGLA 5 — TONO {{tono}}: Ajusta el lenguaje completo a este tono. Si es tranquilizador, abre con "Todo está bien, permíteme explicarte". Si es urgente, abre con la fecha límite.

Genera también: el asunto de email o la primera línea de WhatsApp que aumenta la probabilidad de que {{cliente}} lea el mensaje completo.`
    },
    {
      slug: 'decide-despacho-fiscal',
      name_en: 'DecideDespacho Fiscal',
      name_es: 'DecideDespacho Fiscal',
      description_en: 'Your firm metrics should drive strategy, not just describe the past.',
      description_es: 'Las métricas de tu despacho deben generar estrategia, no solo describir el pasado.',
      icon: 'BarChart2',
      form_schema: [
        {
          id: 'datos_despacho',
          type: 'textarea',
          label_en: 'Firm Data (clients, revenue, services, capacity)',
          label_es: 'Datos del despacho (clientes, ingresos, servicios activos, capacidad del equipo)',
          required: true,
          placeholder_es: 'Clientes activos: 45, MRR: $38,000, declaraciones anuales: 120, servicios: 60% contabilidad mensual, 30% anual, 10% nómina. Equipo: 3 contadores + 1 auxiliar...'
        },
        {
          id: 'problema',
          type: 'text',
          label_en: 'Main Business Problem',
          label_es: 'Principal problema o decisión que necesitas resolver',
          required: true,
          placeholder_es: '¿Cómo crecer sin contratar más? / ¿Por qué sigo igual de ingresos? / ¿Qué clientes debo soltar?'
        },
        {
          id: 'area',
          type: 'select',
          label_en: 'Focus Area',
          label_es: 'Área de análisis',
          required: true,
          options: [
            { value: 'rentabilidad', label_en: 'Client & Service Profitability', label_es: 'Rentabilidad por cliente y servicio' },
            { value: 'capacidad', label_en: 'Team Capacity & Load', label_es: 'Capacidad y carga del equipo' },
            { value: 'precios', label_en: 'Pricing & Retainer Strategy', label_es: 'Precios y estrategia de retainer mensual' },
            { value: 'crecimiento', label_en: 'Growth & New Services', label_es: 'Crecimiento y nuevos servicios' },
            { value: 'temporada', label_en: 'Seasonal Planning (tax season)', label_es: 'Planeación de temporada (declaración anual)' }
          ]
        },
        {
          id: 'contexto',
          type: 'textarea',
          label_en: 'Context (market, reform, competition)',
          label_es: 'Contexto relevante (reforma fiscal, competencia, zona, tipo de clientes)',
          required: true
        }
      ],
      prompt_template: `Eres un Consultor de Gestión para despachos contables y fiscales con experiencia transformando estudios de un solo contador en firmas rentables y escalables.

El error más común: el contador brillante que cobra igual por el cliente que le toma 2 horas y el que le toma 20.

Datos del despacho: {{datos_despacho}}
Problema: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Concreta y medible. No "mejorar la comunicación con clientes", sino "subir la tarifa de los 8 clientes persona moral con servicio mensual de $800 a $1,400 a partir del próximo mes, con este argumento y este mensaje".
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_despacho}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN EN 48H: El primer paso que el contador o socio ejecuta esta semana para activar la decisión.

Finaliza con el "Diagnóstico del Despacho":
🟢 Despacho Escalable y Rentable | 🟡 Ocupado pero con poco margen | 🔴 Saturado, barato y sin crecimiento
Justificado en dos líneas con los datos y el {{problema}} descrito.`
    },
    {
      slug: 'pulse-contador',
      name_en: 'PulseContador',
      name_es: 'PulseContador',
      description_en: 'Never miss a filing deadline or lose a client to avoidable penalties again.',
      description_es: 'Nunca más pierdas un plazo fiscal ni un cliente por multas evitables.',
      icon: 'Activity',
      form_schema: [
        {
          id: 'clientes_activos',
          type: 'text',
          label_en: 'Number of Active Clients',
          label_es: 'Número de clientes activos',
          required: true
        },
        {
          id: 'vencimientos_semana',
          type: 'textarea',
          label_en: 'Filing Deadlines This Week',
          label_es: 'Vencimientos o presentaciones críticas de esta semana',
          required: true,
          placeholder_es: 'DIOT enero: 5 clientes pendientes, ISR mensual persona moral: 3 clientes, IVA complementaria cliente López: vence jueves 25...'
        },
        {
          id: 'documentos_pendientes',
          type: 'textarea',
          label_en: 'Clients Pending Document Delivery',
          label_es: 'Clientes que aún no entregan documentos o facturas',
          required: true,
          placeholder_es: 'García Comercial: no entrega facturas de enero / Martínez: no responde desde el lunes / Pérez: dice que el XML ya lo mandó pero no ha llegado...'
        },
        {
          id: 'cobranza_pendiente',
          type: 'text',
          label_en: 'Pending Collections ($)',
          label_es: 'Cobranza pendiente de la semana ($)',
          required: true
        },
        {
          id: 'carga_equipo',
          type: 'select',
          label_en: 'Team Workload Level',
          label_es: 'Nivel de carga del equipo esta semana',
          required: true,
          options: [
            { value: 'normal', label_en: 'Normal / manageable', label_es: 'Normal / manejable' },
            { value: 'alta', label_en: 'High / under pressure', label_es: 'Alta / bajo presión' },
            { value: 'critica', label_en: 'Critical / overloaded (tax season)', label_es: 'Crítica / saturados (temporada de declaraciones)' }
          ]
        },
        {
          id: 'incidencias',
          type: 'textarea',
          label_en: 'Incidents / Alerts This Week',
          label_es: 'Incidencias o alertas de la semana',
          required: false,
          placeholder_es: 'Cliente con requerimiento del SAT, error en declaración que hay que complementar, cliente enojado por multa...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Control Fiscal y Operativo de un despacho contable de alto rendimiento.
El contador necesita el panorama completo de la semana sin abrir 5 carpetas y sin perseguir a cada cliente para que mande sus documentos.

- Clientes activos: {{clientes_activos}}
- Vencimientos semana: {{vencimientos_semana}}
- Documentos pendientes: {{documentos_pendientes}}
- Cobranza pendiente: \${{cobranza_pendiente}}
- Carga del equipo: {{carga_equipo}}
- Incidencias: {{incidencias}}

Genera el "PulseContador Semanal":

1. SEMÁFORO FISCAL:
🟢 Semana Controlada | 🟡 Vencimientos bajo presión | 🔴 Riesgo de multas o clientes afectados
Basado en {{vencimientos_semana}}, {{documentos_pendientes}} y la carga {{carga_equipo}}.

2. ALERTA DE VENCIMIENTO CRÍTICO:
De {{vencimientos_semana}}, identifica el plazo cuya omisión generaría mayor multa o daño al cliente y al despacho. Proporciona el mensaje de WhatsApp que el auxiliar envía HOY a los clientes de {{documentos_pendientes}} que bloquean esa presentación. Tono: urgente pero profesional.

3. GESTIÓN DE COBRANZA:
Con \${{cobranza_pendiente}} pendiente, genera el mensaje de cobro exacto para el cliente con más días de vencimiento de {{cobranza_pendiente}}. Que sea firme, profesional y que no dañe la relación.

4. MANEJO DE INCIDENCIAS:
Para la incidencia más grave de {{incidencias}}, proporciona el protocolo de respuesta: qué decirle al cliente, qué trámite realizar y en qué orden para mitigar el daño.

5. PLAN DE CAPACIDAD:
Con carga {{carga_equipo}}, ¿qué tarea de {{vencimientos_semana}} puede delegarse a un auxiliar y cuál requiere revisión directa del contador titular? Organiza el día de mañana en bloques de máxima productividad.`
    },
    {
      slug: 'conta-loop',
      name_en: 'ContaLoop Premium',
      name_es: 'ContaLoop Premium',
      description_en: 'From first annual filing to lifetime advisory client. Full accounting firm cycle.',
      description_es: 'Desde la primera declaración anual hasta el cliente de asesoría de por vida. El sistema completo.',
      icon: 'RefreshCw',
      form_schema: [
        {
          id: 'despacho',
          type: 'text',
          label_en: 'Accounting Firm Name',
          label_es: 'Nombre del despacho o firma contable',
          required: true
        },
        {
          id: 'especialidad',
          type: 'text',
          label_en: 'Specialty / Client Types',
          label_es: 'Especialidad y tipo de clientes que atienden',
          required: true,
          placeholder_es: 'PyMEs y personas físicas en RESICO, despacho general, especialidad en nómina y IMSS, sector salud...'
        },
        {
          id: 'num_clientes',
          type: 'text',
          label_en: 'Number of Active Clients',
          label_es: 'Número de clientes activos',
          required: true
        },
        {
          id: 'mrr',
          type: 'text',
          label_en: 'Monthly Recurring Revenue ($)',
          label_es: 'Ingreso mensual recurrente (MRR) del despacho ($)',
          required: true
        },
        {
          id: 'dolor_captacion',
          type: 'textarea',
          label_en: 'Client Acquisition Problem',
          label_es: 'Problema principal para conseguir nuevos clientes',
          required: true,
          placeholder_es: 'Solo entran por referidos, muchos clientes de declaración anual que no continúan, compito con plataformas online baratas...'
        },
        {
          id: 'dolor_operativo',
          type: 'textarea',
          label_en: 'Operational Problem',
          label_es: 'Problema operativo más crítico (documentos, carga, cobranza)',
          required: true,
          placeholder_es: 'Clientes que mandan documentos tarde, equipo saturado en temporada, cobranza difícil...'
        },
        {
          id: 'fase',
          type: 'select',
          label_en: 'Priority Module Today',
          label_es: 'Módulo donde necesitas más impacto hoy',
          required: true,
          options: [
            { value: 'captacion', label_en: 'Client Acquisition & Reactivation', label_es: 'Captación y reactivación de clientes' },
            { value: 'retencion', label_en: 'Client Retention & Upsell', label_es: 'Retención de clientes y conversión a retainer' },
            { value: 'operacion', label_en: 'Firm Operations & Capacity', label_es: 'Operación del despacho y capacidad del equipo' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para despachos contables y fiscales en crecimiento, implementando el sistema "ContaLoop": el ciclo de rentabilidad para contadores que quieren dejar de intercambiar tiempo por dinero y construir un despacho que escala.

Despacho: {{despacho}}
Especialidad: {{especialidad}}
Clientes: {{num_clientes}}
MRR actual: \${{mrr}}
Problema de captación: {{dolor_captacion}}
Problema operativo: {{dolor_operativo}}
Fase prioritaria: {{fase}}

Activa el módulo ContaLoop correspondiente:

Si {{fase}} = CAPTACIÓN:
→ Diseña la "Máquina de Clientes de {{despacho}}" para los próximos 60 días. Incluye:
(1) El perfil exacto del cliente ideal para un despacho de {{especialidad}} — criterios de calificación: régimen fiscal, facturación mensual mínima, número de empleados, nivel de orden financiero.
(2) Los 3 canales de captación más efectivos para ese perfil con la acción concreta en cada canal esta semana (WhatsApp con referidos actuales, LinkedIn profesional, alianza con notarios o bancos locales).
(3) La "Consultoría de Diagnóstico Gratuita de 30 Min": cómo estructurarla para que el prospecto termine la sesión queriendo firmar el retainer mensual. Las 5 preguntas que revelan el caos fiscal del prospecto y crea urgencia genuina de contratar.
(4) La oferta de entrada irresistible: qué servicio gancho (a precio accesible o gratuito) convierte contactos fríos en clientes pagantes.

Si {{fase}} = RETENCIÓN:
→ Construye el "Sistema de Retención y Upgrade de {{despacho}}": el mapa de los 3 momentos donde más se pierden clientes en despachos de {{especialidad}} y la intervención exacta en cada momento (qué decir, qué enviar, qué ofrecer), el protocolo de "Revisión Fiscal de Valor Trimestral" — la reunión de 20 minutos que transforma clientes de declaración anual en retainer mensual, con las 3 preguntas que abren la conversación de upgrade de servicio, la política de "cliente VIP": qué beneficios exclusivos reciben los clientes de retainer que nadie más obtiene y cómo comunicarlo.

Si {{fase}} = OPERACIÓN:
→ Diseña el "Sistema Operativo Eficiente de {{despacho}}": el protocolo de onboarding de cliente nuevo (qué documentos pedir, qué expectativas establecer, qué entregar en los primeros 30 días para que digan "este contador es diferente"), el sistema de recordatorios automáticos para que los clientes entreguen documentos a tiempo (secuencia de 3 mensajes: aviso 7 días antes, recordatorio 3 días antes, urgente el día previo), la estructura de equipo ideal para atender {{num_clientes}} clientes con el nivel actual de MRR \${{mrr}} sin que el socio principal quede saturado.

Cierra con "El Próximo Movimiento de {{despacho}}": la única acción de mayor ROI que el contador ejecuta esta semana para crecer sin trabajar más horas.`
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

    // ContaLoop & DecideDespachoFiscal → Enterprise, rest → Pro
    let targetPlan = proPlan
    if (app.slug === 'conta-loop' || app.slug === 'decide-despacho-fiscal') {
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

  console.log('\n✅ Micro-Apps de Contadores y Despachos Fiscales completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
