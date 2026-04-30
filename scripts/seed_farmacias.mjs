import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('💊 Seeding Micro-Apps para Farmacias y Distribuidoras de Salud...')

  const apps = [
    {
      slug: 'reactiva-cliente-farma',
      name_en: 'ReactivaFarma',
      name_es: 'ReactivaFarma',
      description_en: 'Your lapsed patients and wholesale clients are your warmest leads.',
      description_es: 'Tus clientes que dejaron de surtir recetas o de ordenar son tu oportunidad más caliente.',
      icon: 'UserCheck',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Client / Patient Name',
          label_es: 'Nombre del cliente o paciente',
          required: true
        },
        {
          id: 'tipo_cliente',
          type: 'select',
          label_en: 'Client Type',
          label_es: 'Tipo de cliente',
          required: true,
          options: [
            { value: 'paciente', label_en: 'End Patient / Consumer', label_es: 'Paciente / consumidor final' },
            { value: 'mayorista', label_en: 'Wholesale Buyer (clinic, hospital)', label_es: 'Comprador mayorista (clínica, hospital, consultorio)' },
            { value: 'subdistribuidor', label_en: 'Sub-distributor / Reseller', label_es: 'Sub-distribuidor / revendedor' }
          ]
        },
        {
          id: 'producto_habitual',
          type: 'text',
          label_en: 'Product / Medication They Usually Buy',
          label_es: 'Producto o medicamento que compraba habitualmente',
          required: true,
          placeholder_es: 'Metformina 850mg, vitaminas D3 + K2, suero fisiológico x caja...'
        },
        {
          id: 'semanas_inactivo',
          type: 'text',
          label_en: 'Weeks / Months Inactive',
          label_es: 'Semanas o meses sin comprar',
          required: true
        },
        {
          id: 'motivo_probable',
          type: 'select',
          label_en: 'Probable Reason for Inactivity',
          label_es: 'Motivo probable de inactividad',
          required: true,
          options: [
            { value: 'olvido', label_en: 'Simply forgot / no reminder', label_es: 'Simplemente olvidó / no tuvo recordatorio' },
            { value: 'precio', label_en: 'Found cheaper option', label_es: 'Encontró precio más barato' },
            { value: 'cambio_tratamiento', label_en: 'Treatment changed by doctor', label_es: 'Su médico cambió el tratamiento' },
            { value: 'desabasto', label_en: 'Out of stock last time', label_es: 'No tenías stock la última vez' },
            { value: 'desconocido', label_en: 'Unknown', label_es: 'Desconocido' }
          ]
        }
      ],
      prompt_template: `Actúa como el Gerente de Fidelización de una farmacia o distribuidora de salud que entiende que la recompra es la columna vertebral del negocio farmacéutico.

Cliente: {{cliente}} (tipo: {{tipo_cliente}})
Producto habitual: {{producto_habitual}}
Inactivo hace: {{semanas_inactivo}}
Motivo probable: {{motivo_probable}}

Genera DOS mensajes de reactivación listos para WhatsApp:

1. "VERSIÓN SALUD Y RECORDATORIO" (cuidado genuino):
Para un {{tipo_cliente}} que compra {{producto_habitual}}, calcula cuándo debería haberse agotado su suministro basado en {{semanas_inactivo}}. Si es paciente crónico, usa el argumento de adherencia terapéutica (interrumpir un tratamiento crónico tiene consecuencias clínicas reales). Si es mayorista, recuérdale que tener el produto disponible para sus propios clientes es crítico. Tono: aliado de salud, no vendedor. Máx. 5 líneas.

2. "VERSIÓN BENEFICIO DIRECTO" (propuesta de valor):
Ofrece algo concreto que resuelva el {{motivo_probable}}: si fue precio, informa sobre precio especial o paquete de volumen; si fue desabasto, confirma disponibilidad garantizada; si fue olvido, ofrece suscripción de recordatorio mensual automático. CTA directo y de baja fricción. Máx. 4 líneas.

Indica al final: si este cliente es crónico con {{producto_habitual}}, ¿cada cuántas semanas debería configurarse un recordatorio automático?`
    },
    {
      slug: 'upsell-farma-ai',
      name_en: 'UpsellFarma AI',
      name_es: 'UpsellFarma AI',
      description_en: 'They came for their prescription. Discover what else improves their health.',
      description_es: 'Vino por su receta. Descubre los complementos que mejorarán su salud y tu ticket.',
      icon: 'TrendingUp',
      form_schema: [
        {
          id: 'cliente',
          type: 'text',
          label_en: 'Patient / Client Name',
          label_es: 'Nombre del paciente o cliente',
          required: true
        },
        {
          id: 'medicamento_principal',
          type: 'text',
          label_en: 'Main Medication / Product Purchased',
          label_es: 'Medicamento o producto principal que lleva',
          required: true,
          placeholder_es: 'Atorvastatina 20mg, Losartán 50mg, Omeprazol 20mg...'
        },
        {
          id: 'perfil_paciente',
          type: 'select',
          label_en: 'Patient Profile',
          label_es: 'Perfil del paciente / cliente',
          required: true,
          options: [
            { value: 'cronico', label_en: 'Chronic condition patient', label_es: 'Paciente con condición crónica (diabetes, HTA, colesterol)' },
            { value: 'agudo', label_en: 'Acute / occasional condition', label_es: 'Condición aguda / ocasional (gripe, infección, dolor)' },
            { value: 'preventivo', label_en: 'Preventive / wellness focused', label_es: 'Enfocado en prevención y bienestar' },
            { value: 'adulto_mayor', label_en: 'Senior patient (60+)', label_es: 'Adulto mayor (60+)' },
            { value: 'pediatrico', label_en: 'Pediatric / child patient', label_es: 'Paciente pediátrico / niño' }
          ]
        },
        {
          id: 'catalogo_complementos',
          type: 'textarea',
          label_en: 'Available Complementary Products',
          label_es: 'Productos complementarios disponibles en tu farmacia',
          required: true,
          placeholder_es: 'Vitamina D3, Magnesio, Coenzima Q10, Omega 3, probióticos, protector gástrico, glucómetro, tensiómetro, colágeno, zinc...'
        }
      ],
      prompt_template: `Actúa como un Farmacéutico Clínico y Asesor de Salud Integral con especialidad en complementación terapéutica y nutrición ortomolecular.

Paciente: {{cliente}} (perfil: {{perfil_paciente}})
Medicamento principal: {{medicamento_principal}}
Catálogo disponible: {{catalogo_complementos}}

Identifica los 3 complementos o productos de {{catalogo_complementos}} con mayor justificación clínica y comercial para este paciente específico. Para cada uno:

1. QUÉ RECOMENDAR: El producto exacto de {{catalogo_complementos}} y su dosis o presentación ideal para {{perfil_paciente}} tomando {{medicamento_principal}}.

2. ARGUMENTO CLÍNICO-PREVENTIVO: La razón médica concreta por la que este complemento es benéfico o incluso necesario para alguien con este perfil y medicamento. Ejemplo: quien toma estatinas pierde CoQ10; quien toma Metformina absorbe menos B12; los IBP reducen la absorción de magnesio. Usa ciencia real, lenguaje accesible.

3. EL GUION DEL FARMACÉUTICO: Las palabras exactas (3-4 oraciones) que el farmacéutico o asesor dice al momento de entregar {{medicamento_principal}}, presentando el complemento como "recomendación clínica", no como venta. Debe sonar a consejo profesional de alguien que se preocupa por su salud.

Cierra con: "Kit de Salud Completo para {{cliente}}": cómo presentar los 3 complementos juntos como un paquete con nombre (ej. "Kit Control Cardiovascular") y precio combinado que incentive llevarse los 3 en esa misma visita.`
    },
    {
      slug: 'gestiona-stock-ai',
      name_en: 'GestionaStock AI',
      name_es: 'GestionaStock AI',
      description_en: 'Never lose a sale to expired stock or stockouts again.',
      description_es: 'Nunca más pierdas una venta por caducidad, desabasto o sobreinventario.',
      icon: 'Package',
      form_schema: [
        {
          id: 'inventario_actual',
          type: 'textarea',
          label_en: 'Current Inventory Snapshot',
          label_es: 'Estado actual del inventario (productos, cantidades, fechas de caducidad)',
          required: true,
          placeholder_es: 'Amoxicilina 500mg: 340 und, cad. dic-2025 / Paracetamol 1g: 12 und / Vitamina C 1g: 89 und cad. mar-2025 (¡ALERTA!)'
        },
        {
          id: 'rotacion_historica',
          type: 'textarea',
          label_en: 'Historical Sales / Rotation Data',
          label_es: 'Datos de rotación o ventas históricas (unidades vendidas por mes)',
          required: true,
          placeholder_es: 'Amoxicilina: 120 und/mes, Paracetamol: 80 und/mes, Vitamina C: 15 und/mes...'
        },
        {
          id: 'problema_inventario',
          type: 'select',
          label_en: 'Main Inventory Problem',
          label_es: 'Principal problema de inventario que enfrentas',
          required: true,
          options: [
            { value: 'caducidad', label_en: 'Products near expiration', label_es: 'Productos próximos a caducar' },
            { value: 'desabasto', label_en: 'Frequent stockouts of key products', label_es: 'Desabasto frecuente de productos clave' },
            { value: 'sobrestock', label_en: 'Overstock / capital frozen in inventory', label_es: 'Sobreinventario / capital congelado' },
            { value: 'reorden', label_en: 'When and how much to reorder', label_es: 'Cuándo y cuánto reordenar a proveedores' }
          ]
        },
        {
          id: 'proveedor_condiciones',
          type: 'textarea',
          label_en: 'Supplier Conditions (lead time, minimum order, payment terms)',
          label_es: 'Condiciones de proveedores (tiempo de entrega, mínimo de pedido, crédito)',
          required: false,
          placeholder_es: 'Proveedor A: 3 días, pedido mínimo $5,000, 30 días crédito / Proveedor B: contado, entrega al día siguiente...'
        }
      ],
      prompt_template: `Actúa como el Director de Cadena de Suministro de una farmacia o distribuidora de productos de salud con visión de cero desperdicios y cero quiebres de stock.

Inventario actual: {{inventario_actual}}
Rotación histórica: {{rotacion_historica}}
Problema principal: {{problema_inventario}}
Condiciones de proveedores: {{proveedor_condiciones}}

Genera el "Plan de Gestión de Inventario de Acción Inmediata":

1. ALERTAS CRÍTICAS (prioridad máxima esta semana):
Basado en {{inventario_actual}} y {{rotacion_historica}}, identifica los productos que están en riesgo ESTE MES:
- Caducidad inminente: producto, unidades en riesgo y fecha crítica.
- Quiebre de stock proyectado: producto, días de inventario restantes y fecha estimada de agotamiento.
Para cada alerta, la acción exacta que se ejecuta mañana.

2. ESTRATEGIA DE LIQUIDACIÓN (para caducidades):
Para cada producto próximo a vencer, el plan de liquidación más inteligente para recuperar el máximo de capital: promoción 2x1, descuento escalonado, venta a mayorista, donación fiscal. Incluye el precio mínimo de venta sin pérdida neta y el mensaje de WhatsApp listo para enviar a los mejores compradores habituales de ese producto.

3. PLAN DE REORDEN ÓPTIMO:
Basado en {{rotacion_historica}} y {{proveedor_condiciones}}, calcula el punto de reorden y la cantidad óptima de pedido para los 5 productos de mayor rotación. Presenta una tabla simple: Producto | Stock actual | Días de inventario | Pedir cuándo | Pedir cuánto.

4. NEGOCIACIÓN CON PROVEEDOR:
Si hay condiciones de mejora posible con {{proveedor_condiciones}}, genera el argumento y el mensaje para negociar mejores condiciones de crédito, precio por volumen o tiempo de entrega.`
    },
    {
      slug: 'decide-farma',
      name_en: 'DecideFarma',
      name_es: 'DecideFarma',
      description_en: 'Your pharmacy data should tell you which products make money and which drain it.',
      description_es: 'Tus datos deben decirte qué productos hacen dinero y cuáles lo drenan.',
      icon: 'BarChart2',
      form_schema: [
        {
          id: 'datos_farmacia',
          type: 'textarea',
          label_en: 'Pharmacy / Distributor Data (revenue, top products, margins)',
          label_es: 'Datos de la farmacia o distribuidora (ventas, productos top, márgenes, categorías)',
          required: true,
          placeholder_es: 'Ventas mes: $180,000, categoría medicamentos: 65%, OTC y vitaminas: 20%, material de curación: 15%, margen promedio: 28%, top 5 productos por volumen...'
        },
        {
          id: 'problema',
          type: 'text',
          label_en: 'Main Business Decision Needed',
          label_es: 'Principal decisión o problema de negocio que necesitas resolver',
          required: true,
          placeholder_es: '¿Qué categoría debo impulsar? / ¿Por qué bajan las ventas en vitaminas? / ¿Vale la pena negociar exclusividad con un proveedor?'
        },
        {
          id: 'area',
          type: 'select',
          label_en: 'Focus Area',
          label_es: 'Área de análisis',
          required: true,
          options: [
            { value: 'rentabilidad', label_en: 'Product / Category Profitability', label_es: 'Rentabilidad por producto o categoría' },
            { value: 'proveedores', label_en: 'Supplier Strategy & Negotiation', label_es: 'Estrategia con proveedores y negociación' },
            { value: 'mix_productos', label_en: 'Product Mix & Category Expansion', label_es: 'Mix de productos y expansión de categorías' },
            { value: 'clientes', label_en: 'Client Segments & Loyalty', label_es: 'Segmentos de clientes y fidelización' },
            { value: 'precios', label_en: 'Pricing & Competitive Position', label_es: 'Precios y posición competitiva' }
          ]
        },
        {
          id: 'contexto',
          type: 'textarea',
          label_en: 'Market Context (competition, regulation, season)',
          label_es: 'Contexto relevante (competencia, regulación, temporada, cadenas farmacéuticas)',
          required: true
        }
      ],
      prompt_template: `Eres un Consultor de Gestión Comercial especializado en farmacias independientes y distribuidoras de productos de salud que compiten contra cadenas con musculo financiero y descuentos agresivos.

Datos: {{datos_farmacia}}
Decisión a tomar: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Comerciales Ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y cuantificable (ej. "Subir el margen de suplementos vitamínicos del 28% al 38% porque el cliente final no compara precio en esa categoría como lo hace con medicamentos genéricos").
2. FUNDAMENTO EN NÚMEROS: Cómo los datos de {{datos_farmacia}} justifican esta decisión para el área de {{area}}. Sin generalidades.
3. EJECUCIÓN ESTA SEMANA: El primer paso que el dueño o gerente realiza mañana para activar la decisión.

Finaliza con el "Diagnóstico Financiero de la Farmacia":
🟢 Farmacia Rentable y Creciendo | 🟡 Estable pero con fugas de margen | 🔴 Bajo presión de cadenas o márgenes negativos
Justificado en dos líneas con los datos del reporte.`
    },
    {
      slug: 'pulse-farma',
      name_en: 'PulseFarma',
      name_es: 'PulseFarma',
      description_en: 'Daily pharmacy intelligence: sales, alerts and tomorrow\'s priorities.',
      description_es: 'Inteligencia diaria de tu farmacia: ventas, alertas de stock y prioridades de mañana.',
      icon: 'Activity',
      form_schema: [
        {
          id: 'ventas_dia',
          type: 'text',
          label_en: "Today's Total Sales",
          label_es: 'Ventas totales del día ($)',
          required: true
        },
        {
          id: 'num_tickets',
          type: 'text',
          label_en: 'Number of Tickets / Transactions',
          label_es: 'Número de tickets o transacciones del día',
          required: true
        },
        {
          id: 'producto_top',
          type: 'text',
          label_en: 'Best-Selling Product Today',
          label_es: 'Producto más vendido del día',
          required: true
        },
        {
          id: 'alertas_stock',
          type: 'textarea',
          label_en: 'Stock Alerts (low stock, stockouts, expiring)',
          label_es: 'Alertas de inventario del día (productos bajos, agotados o por caducar)',
          required: true,
          placeholder_es: 'Amoxicilina 500mg: últimas 12 cajas / Ibuprofeno 400mg: AGOTADO / Vitamina C: 23 und caducan en 15 días...'
        },
        {
          id: 'meta_dia',
          type: 'text',
          label_en: "Today's Revenue Goal",
          label_es: 'Meta de ventas del día ($)',
          required: false
        },
        {
          id: 'incidencias',
          type: 'textarea',
          label_en: 'Incidents (supplier issues, complaints, cash discrepancies)',
          label_es: 'Incidencias del día (problemas con proveedor, quejas, diferencias en caja)',
          required: false,
          placeholder_es: 'Proveedor no entregó el pedido de ayer, cliente reclamó por precio, faltaron $200 en caja...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Operativa de una Farmacia o Distribuidora de Alto Rendimiento.
El dueño necesita saber en 45 segundos si el día fue bueno, qué riesgos hay para mañana y qué acción ejecuta ahora.

- Ventas del día: \${{ventas_dia}}
- Tickets del día: {{num_tickets}}
- Producto top: {{producto_top}}
- Alertas de stock: {{alertas_stock}}
- Meta del día: \${{meta_dia}}
- Incidencias: {{incidencias}}

Genera el "PulseFarma del Día":

1. SEMÁFORO OPERATIVO:
🟢 Día Rentable y Sin Riesgo | 🟡 Alertas Gestionables | 🔴 Riesgo de Ventas Perdidas o Incidente Crítico
Basado en: cumplimiento de meta \${{meta_dia}}, gravedad de {{alertas_stock}} y {{incidencias}}.

2. ANÁLISIS DEL TICKET PROMEDIO:
Calcula el ticket promedio (\${{ventas_dia}} / {{num_tickets}}) y evalúa si es saludable para una farmacia. ¿Sugiere ventas de mostrador sin complementación o hay margen para upsell?

3. ALERTA PRIORITARIA DE STOCK:
De {{alertas_stock}}, identifica el producto cuya falta o caducidad representa mayor pérdida de venta o riesgo sanitario mañana. Genera la orden de reposición o la acción exacta que el encargado ejecuta antes de cerrar hoy.

4. MANEJO DE INCIDENCIAS:
Si hay {{incidencias}}, proporciona la respuesta o acción correctiva exacta para la más urgente: mensaje al proveedor, protocolo de caja, respuesta al cliente, etc.

5. PROYECCIÓN MAÑANA:
Si se mantiene el ritmo de hoy, ¿cerrará la semana sobre o bajo la meta? ¿Qué producto o acción puede impulsar las ventas de mañana basado en {{producto_top}} y el comportamiento observado hoy?`
    },
    {
      slug: 'farma-loop',
      name_en: 'FarmaLoop Premium',
      name_es: 'FarmaLoop Premium',
      description_en: 'From first dispensing to lifelong patient loyalty. Full pharmacy business cycle.',
      description_es: 'Desde el primer despacho hasta la fidelización del paciente. El ciclo completo de tu farmacia.',
      icon: 'RefreshCw',
      form_schema: [
        {
          id: 'farmacia',
          type: 'text',
          label_en: 'Pharmacy / Distributor Name',
          label_es: 'Nombre de la farmacia o distribuidora',
          required: true
        },
        {
          id: 'tipo_negocio',
          type: 'select',
          label_en: 'Business Type',
          label_es: 'Tipo de negocio',
          required: true,
          options: [
            { value: 'farmacia_independiente', label_en: 'Independent Pharmacy', label_es: 'Farmacia independiente / de barrio' },
            { value: 'farmacia_especializada', label_en: 'Specialty Pharmacy (oncology, compounding)', label_es: 'Farmacia especializada (oncológica, magistral)' },
            { value: 'distribuidora_mayorista', label_en: 'Wholesale Distributor', label_es: 'Distribuidora mayorista' },
            { value: 'distribuidora_medico', label_en: 'Medical / Hospital Distributor', label_es: 'Distribuidora médico-hospitalaria' }
          ]
        },
        {
          id: 'num_empleados',
          type: 'text',
          label_en: 'Number of Employees',
          label_es: 'Número de empleados',
          required: true
        },
        {
          id: 'dolor_ventas',
          type: 'textarea',
          label_en: 'Main Sales / Revenue Problem',
          label_es: 'Problema principal en ventas o ingresos',
          required: true,
          placeholder_es: 'Los clientes compran solo lo del recetario sin explorar más productos, perdemos ventas a Farmacias del Ahorro...'
        },
        {
          id: 'dolor_inventario',
          type: 'textarea',
          label_en: 'Main Inventory / Supplier Problem',
          label_es: 'Problema principal de inventario o proveedores',
          required: true,
          placeholder_es: 'Mucho producto sin movimiento, caducidades frecuentes, proveedor falla en entregas...'
        },
        {
          id: 'fase',
          type: 'select',
          label_en: 'Priority Module Today',
          label_es: 'Módulo donde necesitas más impacto hoy',
          required: true,
          options: [
            { value: 'fidelizacion', label_en: 'Patient Retention & Loyalty', label_es: 'Fidelización de pacientes y reactivación' },
            { value: 'ticket', label_en: 'Average Ticket & Complementation', label_es: 'Ticket promedio y complementación' },
            { value: 'inventario', label_en: 'Inventory & Supplier Optimization', label_es: 'Optimización de inventario y proveedores' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para farmacias independientes y distribuidoras de salud que quieren competir inteligentemente contra las grandes cadenas, implementando el sistema "FarmaLoop": el ciclo de prosperidad para farmacias con identidad y estrategia.

Farmacia: {{farmacia}}
Tipo de negocio: {{tipo_negocio}}
Equipo: {{num_empleados}} empleados
Problema de ventas: {{dolor_ventas}}
Problema de inventario: {{dolor_inventario}}
Fase prioritaria: {{fase}}

Activa el módulo FarmaLoop correspondiente:

Si {{fase}} = FIDELIZACIÓN:
→ Diseña el "Programa de Paciente Frecuente" para {{farmacia}}. Incluye:
(1) La segmentación de la base de clientes en 3 grupos: pacientes crónicos (oro), compradores ocasionales (plata) y visitantes únicos (prospecto). Criterios claros para clasificarlos.
(2) La campaña de WhatsApp de reactivación para los pacientes crónicos ausentes más de 30 días: 2 mensajes listos (recordatorio de medicamento + oferta de surtido rápido).
(3) El "Servicio Diferencial Anti-Cadenas" que una {{tipo_negocio}} puede ofrecer y las cadenas no: asesoría farmacéutica personalizada, entrega a domicilio express, surtido de recetas especiales, crédito personal de confianza. Cómo comunicarlo por WhatsApp o en el punto de venta.

Si {{fase}} = TICKET:
→ Construye el "Manual de Complementación Farmacéutica" para el equipo de {{farmacia}}: los 10 medicamentos más vendidos de {{tipo_negocio}} y el complemento nutricional o producto OTC más afín a cada uno con el argumento clínico de 2 oraciones para presentarlo, el protocolo de "3 segundos de valor" que el farmacéutico usa al entregar cualquier medicamento para aumentar el ticket sin presionar, y el "Kit Mensual de Salud" (paquete de medicamento + complemento + accesorio) para los 3 perfiles de paciente más frecuentes.

Si {{fase}} = INVENTARIO:
→ Diseña el "Sistema de Inventario Inteligente de {{farmacia}}": la fórmula de punto de reorden para los 20 productos de mayor rotación basada en días de inventario y lead time del proveedor, la política de liquidación progresiva (10% desct. a 90 días de vencimiento, 25% a 60, 40% a 30 — cómo comunicarlo), y la estrategia de negociación con el proveedor principal para obtener mejor precio por volumen, plazo de pago extendido o producto en consignación.

Cierra con "El Próximo Movimiento de {{farmacia}}": la única acción de mayor impacto que el dueño ejecuta mañana antes de abrir la farmacia.`
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

    // FarmaLoop & DecideFarma → Enterprise, rest → Pro
    let targetPlan = proPlan
    if (app.slug === 'farma-loop' || app.slug === 'decide-farma') {
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

  console.log('\n✅ Micro-Apps de Farmacias y Distribuidoras completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
