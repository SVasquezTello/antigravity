import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🧪 Seeding Micro-Apps para Laboratorios Clínicos y Diagnóstico...')

  const apps = [
    {
      slug: 'reactiva-paciente-lab',
      name_en: 'ReactivaPacienteLab',
      name_es: 'ReactivaPacienteLab',
      description_en: 'Your patient got their results and disappeared. Their health didn\'t stop needing monitoring.',
      description_es: 'Tu paciente recibió resultados y desapareció. Su salud no dejó de necesitar monitoreo.',
      icon: 'UserCheck',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'estudio_previo', type: 'text', label_en: 'Last Test / Panel Done', label_es: 'Último estudio o panel realizado', required: true, placeholder_es: 'Perfil lipídico completo, Glucosa y hemoglobina glucosilada, Biometría hemática...' },
        { id: 'meses_ausente', type: 'text', label_en: 'Months Without Returning', label_es: 'Meses sin regresar al laboratorio', required: true },
        { id: 'condicion_seguimiento', type: 'select', label_en: 'Follow-up Reason / Condition', label_es: 'Motivo de seguimiento o condición del paciente', required: true,
          options: [
            { value: 'diabetes', label_en: 'Diabetes / Blood sugar monitoring', label_es: 'Diabetes / control glucémico' },
            { value: 'hipertension', label_en: 'Hypertension / Cardiovascular', label_es: 'Hipertensión / cardiovascular' },
            { value: 'tiroides', label_en: 'Thyroid disorder', label_es: 'Trastorno tiroideo' },
            { value: 'colesterol', label_en: 'High cholesterol / lipids', label_es: 'Colesterol alto / dislipidemia' },
            { value: 'chequeo_anual', label_en: 'Annual preventive checkup', label_es: 'Chequeo preventivo anual' },
            { value: 'embarazo', label_en: 'Pregnancy / prenatal monitoring', label_es: 'Embarazo / control prenatal' },
            { value: 'otro', label_en: 'Other / General follow-up', label_es: 'Otro / seguimiento general' }
          ]
        },
        { id: 'resultado_previo', type: 'select', label_en: 'Previous Result Status', label_es: 'Estado del resultado previo', required: true,
          options: [
            { value: 'alterado', label_en: 'Altered / out of range', label_es: 'Alterado / fuera de rango' },
            { value: 'normal', label_en: 'Within normal range', label_es: 'Dentro de rango normal' },
            { value: 'borderline', label_en: 'Borderline / needs monitoring', label_es: 'Limítrofe / requiere seguimiento' }
          ]
        }
      ],
      prompt_template: `Actúa como el Coordinador de Salud Preventiva de un laboratorio clínico que entiende que el mayor servicio que puede dar no es solo entregar resultados — es ayudar al paciente a dar seguimiento a su salud.

Paciente: {{paciente}}
Estudio previo: {{estudio_previo}}
Ausente hace: {{meses_ausente}} meses
Condición de seguimiento: {{condicion_seguimiento}}
Resultado anterior: {{resultado_previo}}

Genera DOS mensajes de seguimiento clínico listos para enviar por WhatsApp:

1. "VERSIÓN RECORDATORIO CLÍNICO DE SALUD":
Recuérdale a {{paciente}} que dado su historial de {{condicion_seguimiento}} y el resultado {{resultado_previo}} de su último {{estudio_previo}}, el tiempo de control ha llegado. Incluye un dato clínico real y accesible que justifique por qué este momento específico es importante para su monitoreo (ej: "La hemoglobina glucosilada debe medirse cada 3-6 meses para detectar cambios antes de que sean irreversibles"). Tono: aliado de salud, sin alarmismo. Máx. 5 líneas.

2. "VERSIÓN SALUD PREVENTIVA + FACILIDAD":
Hazle saber que regresar es fácil: resultados en el mismo día, toma de muestra en ayuno solo mañanas, o incluso servicio a domicilio si está disponible. Si el resultado previo fue {{resultado_previo}}, ofrece el panel de seguimiento específico recomendado para {{condicion_seguimiento}}. CTA simple: "¿Te agendo para esta semana en ayuno?". Máx. 4 líneas.

Al final: indica cada cuántos meses debería hacerse seguimiento este paciente dado {{condicion_seguimiento}} y {{resultado_previo}}, para que el laboratorio programe recordatorios automáticos.`
    },
    {
      slug: 'upsell-lab-ai',
      name_en: 'UpsellLab AI',
      name_es: 'UpsellLab AI',
      description_en: 'They came for a glucose test. Show them the panel that could save their life.',
      description_es: 'Vino por una glucosa. Muéstrale el panel que puede cambiar su calidad de vida.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'estudio_solicitado', type: 'text', label_en: 'Test / Study Ordered', label_es: 'Estudio o análisis solicitado hoy', required: true, placeholder_es: 'Solo glucosa en ayuno, Biometría hemática básica, TSH...' },
        { id: 'perfil_paciente', type: 'select', label_en: 'Patient Profile', label_es: 'Perfil del paciente', required: true,
          options: [
            { value: 'adulto_riesgo', label_en: 'Adult with risk factors (diabetes, HTN)', label_es: 'Adulto con factores de riesgo (diabetes, HTA, obesidad)' },
            { value: 'adulto_mayor', label_en: 'Senior patient (60+)', label_es: 'Adulto mayor (60+)' },
            { value: 'adulto_joven', label_en: 'Young adult preventive', label_es: 'Adulto joven en prevención' },
            { value: 'mujer_fertil', label_en: 'Woman of reproductive age', label_es: 'Mujer en edad fértil' },
            { value: 'embarazada', label_en: 'Pregnant patient', label_es: 'Paciente embarazada' },
            { value: 'deportista', label_en: 'Athlete / high physical activity', label_es: 'Deportista / alta actividad física' }
          ]
        },
        { id: 'motivo_consulta', type: 'text', label_en: 'Reason for Visit / Symptoms Mentioned', label_es: 'Motivo de consulta o síntomas mencionados', required: false, placeholder_es: 'Control de rutina enviado por médico, cansancio, subida de peso, mareos...' },
        { id: 'paquetes_disponibles', type: 'textarea', label_en: 'Available Panels / Packages', label_es: 'Paquetes o paneles disponibles en tu laboratorio', required: true, placeholder_es: 'Perfil lipídico completo, Panel tiroideo completo, Perfil hepático, Panel cardiovascular ejecutivo, Panel de la mujer, Check-up preventivo 40+, Panel deportivo...' }
      ],
      prompt_template: `Actúa como el Asesor de Salud Preventiva de un laboratorio clínico de alto valor, que convierte cada visita en una oportunidad de diagnóstico ampliado que puede detectar problemas antes de que se vuelvan enfermedades.

Paciente: {{paciente}} (perfil: {{perfil_paciente}})
Estudio solicitado: {{estudio_solicitado}}
Motivo de consulta: {{motivo_consulta}}
Paquetes disponibles: {{paquetes_disponibles}}

Identifica los 3 estudios complementarios o paquetes de {{paquetes_disponibles}} con mayor justificación clínica y preventiva para ESTE paciente. Para cada uno:

1. QUÉ OFRECER: El panel o estudio específico de {{paquetes_disponibles}} y por qué es especialmente relevante para el perfil {{perfil_paciente}} que ya viene por {{estudio_solicitado}}.

2. EL ARGUMENTO PREVENTIVO (basado en evidencia real):
El dato clínico que justifica por qué detectar este parámetro HOY tiene valor. Ej: "En pacientes con {{perfil_paciente}}, la función tiroidea alterada es la causa no diagnosticada más frecuente de {{motivo_consulta}} — y se detecta con una sola muestra adicional de sangre". Lenguaje accesible, nunca alarmista.

3. EL GUION DE RECEPCIÓN (palabras exactas):
Lo que el personal de recepción o el técnico dice al explicar el estudio solicitado, de forma cálida y presentando el complemento como "lo que nuestros médicos recomiendan para completar el panorama de salud en pacientes como usted".

Cierra con: el "Panel Integral {{paciente}}" — cómo presentar como kit los estudios del día + los 3 complementos con nombre del paquete, precio combinado con descuento vs. individual, y el beneficio de "un solo ayuno, panorama de salud completo".`
    },
    {
      slug: 'informa-resultados-ai',
      name_en: 'InformaResultados AI',
      name_es: 'InformaResultados AI',
      description_en: 'Turn a confusing blood report into a clear message that the patient actually understands.',
      description_es: 'Convierte un reporte técnico en un mensaje claro que el paciente entiende y agradece.',
      icon: 'FileText',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'estudios_realizados', type: 'text', label_en: 'Tests Performed', label_es: 'Estudios realizados', required: true, placeholder_es: 'Biometría hemática, glucosa, perfil lipídico, función renal...' },
        { id: 'resultados_clave', type: 'textarea', label_en: 'Key Results (values and reference ranges)', label_es: 'Resultados clave con valores y rangos de referencia', required: true, placeholder_es: 'Glucosa: 128 mg/dL (Ref: 70-100) ALTO / Colesterol total: 210 mg/dL (Ref: <200) ALTO / Hemoglobina: 14.2 g/dL (Normal)...' },
        { id: 'tipo_comunicacion', type: 'select', label_en: 'Communication Type', label_es: 'Tipo de comunicación a generar', required: true,
          options: [
            { value: 'whatsapp_paciente', label_en: 'WhatsApp message for patient (non-technical)', label_es: 'Mensaje WhatsApp para paciente (sin tecnicismos)' },
            { value: 'resumen_medico', label_en: 'Summary for referring physician', label_es: 'Resumen para médico tratante' },
            { value: 'recomendaciones_casa', label_en: 'At-home recommendations for patient', label_es: 'Recomendaciones de hábitos para el paciente' },
            { value: 'todo', label_en: 'Complete communication kit', label_es: 'Kit completo de comunicación (todo lo anterior)' }
          ]
        },
        { id: 'alertas', type: 'select', label_en: 'Alert Level', label_es: 'Nivel de alerta de los resultados', required: true,
          options: [
            { value: 'normal', label_en: 'All within normal range', label_es: 'Todos en rango normal' },
            { value: 'leve', label_en: 'Mild alterations (borderline)', label_es: 'Alteraciones leves (limítrofe)' },
            { value: 'moderado', label_en: 'Significant alterations requiring medical attention', label_es: 'Alteraciones significativas — requiere atención médica' },
            { value: 'critico', label_en: 'Critical values — urgent medical contact', label_es: 'Valores críticos — contacto médico urgente' }
          ]
        }
      ],
      prompt_template: `Actúa como el Comunicador Clínico de un laboratorio de diagnóstico de excelencia: alguien que domina la fisiología y el arte de traducir números en información útil para personas comunes.

Paciente: {{paciente}}
Estudios: {{estudios_realizados}}
Resultados: {{resultados_clave}}
Tipo de comunicación: {{tipo_comunicacion}}
Nivel de alerta: {{alertas}}

Genera el "Kit de Comunicación de Resultados":

REGLA FUNDAMENTAL: NUNCA hagas diagnóstico ni indicaciones médicas. Informa, contextualiza, y siempre concluye con "Tu médico es quien interpretará estos resultados en el contexto completo de tu salud".

1. MENSAJE PARA {{paciente}} (WhatsApp, sin tecnicismos):
Estructura en 3 partes: (a) "Tus resultados están listos" — resumen de lo que se midió en términos cotidianos, (b) "Esto es lo que encontramos" — los valores clave de {{resultados_clave}} explicados en lenguaje humano con comparaciones visuales (ej: "Tu glucosa está en 128 — el rango saludable es hasta 100, por lo que aparece ligeramente elevada"), (c) "El siguiente paso" — acorde al nivel {{alertas}}: si es normal → tranquilizar y sugerir próximo control; si es alterado → urgir de forma serena a consultar con su médico antes de X días.

2. NOTA PARA EL MÉDICO (si aplica):
Un párrafo técnico-conciso con los valores fuera de rango de {{resultados_clave}}, delta vs. resultado anterior si se conoce, y la solicitud respetuosa de que oriente al paciente sobre el seguimiento.

3. RECOMENDACIONES GENERALES DE HÁBITOS (no prescriptivas):
Basadas en {{resultados_clave}} con nivel {{alertas}}, 3-5 hábitos generales de salud que el laboratorio puede compartir como "información de bienestar" — sin reemplazar al médico. Ej: si glucosa alta → hidratación, reducir ultraprocesados, caminar 30 min/día.

4. INVITACIÓN AL PRÓXIMO CONTROL:
El mensaje de cierre que invita a {{paciente}} a programar ya el próximo estudio de seguimiento, acorde a {{alertas}} y el tiempo recomendado clínicamente.`
    },
    {
      slug: 'decide-lab',
      name_en: 'DecideLab',
      name_es: 'DecideLab',
      description_en: 'Your lab data should tell you which tests make money and which eat capacity.',
      description_es: 'Tus datos deben decirte qué estudios generan dinero y cuáles consumen capacidad sin retorno.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_lab', type: 'textarea', label_en: 'Lab Data (tests, revenue, volume, costs)', label_es: 'Datos del laboratorio (estudios más solicitados, ingresos, volumen diario, costos de reactivos)', required: true, placeholder_es: 'Estudios/día: 120 muestras, ingreso mes: $145,000, top estudios: biometría (30%), glucosa (22%), perfil lipídico (18%), costo reactivos: 28% del ingreso, médicos remitentes: 15...' },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Principal problema o decisión de negocio', required: true, placeholder_es: '¿Qué estudio impulsar para subir margen? / ¿Vale la pena agregar el área de genética? / ¿Por qué bajan los médicos remitentes?' },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'rentabilidad', label_en: 'Test Profitability & Margins', label_es: 'Rentabilidad por estudio y márgenes' },
            { value: 'capacidad', label_en: 'Lab Capacity & Peak Hours', label_es: 'Capacidad y horarios de alta demanda' },
            { value: 'referentes', label_en: 'Referral Sources (doctors, clinics)', label_es: 'Médicos y clínicas remitentes' },
            { value: 'nuevos_servicios', label_en: 'New Services / Expansion', label_es: 'Nuevos servicios o expansión de menú clínico' },
            { value: 'paquetes', label_en: 'Preventive Packages & Pricing', label_es: 'Paquetes preventivos y estrategia de precios' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context (competition, zone, insurance)', label_es: 'Contexto relevante (competencia, zona, convenios con aseguradoras o empresas)', required: true }
      ],
      prompt_template: `Eres un Consultor de Gestión para laboratorios clínicos y centros de diagnóstico independientes que compiten con cadenas de laboratorio de alto volumen.

El error más común: el laboratorio que tiene equipo de alta tecnología pero precios bajos y márgenes que no cubren la depreciación del equipo.

Datos del laboratorio: {{datos_lab}}
Problema: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta con números. Ej: "Crear el 'Paquete Ejecutivo 40+' agrupando los 6 estudios más solicitados por ese perfil con 15% de descuento vs. precio individual — el margen combinado sigue siendo 34% porque el costo de reactivos en volumen baja 8%".
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_lab}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN ESTA SEMANA: El primer paso que el director o gerente ejecuta mañana para activar la decisión.

Finaliza con el "Diagnóstico Financiero del Laboratorio":
🟢 Laboratorio Rentable y Posicionado | 🟡 Volumen sin margen suficiente | 🔴 Alta dependencia de pocos estudios o remitentes
Justificado en dos líneas con los datos proporcionados.`
    },
    {
      slug: 'pulse-lab',
      name_en: 'PulseLab',
      name_es: 'PulseLab',
      description_en: 'Daily lab intelligence: samples, revenue, pending results and incidents.',
      description_es: 'Inteligencia diaria: muestras procesadas, ingresos, resultados pendientes e incidencias.',
      icon: 'Activity',
      form_schema: [
        { id: 'muestras_dia', type: 'text', label_en: 'Samples Processed Today', label_es: 'Muestras procesadas hoy', required: true },
        { id: 'ingresos_dia', type: 'text', label_en: "Today's Revenue ($)", label_es: 'Ingresos del día ($)', required: true },
        { id: 'resultados_pendientes', type: 'text', label_en: 'Pending Results / Delayed Deliveries', label_es: 'Resultados pendientes de entrega o con retraso', required: true },
        { id: 'estudio_top', type: 'text', label_en: 'Most Requested Test Today', label_es: 'Estudio más solicitado del día', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Quality Incidents / Equipment Issues', label_es: 'Incidencias de calidad, fallas de equipo o situaciones críticas', required: true, placeholder_es: 'Muestra hemolizada de paciente García que debe repetirse / Analizador de química en mantenimiento / Paciente sin ayuno correcto...' },
        { id: 'meta_dia', type: 'text', label_en: "Today's Revenue Goal ($)", label_es: 'Meta de ingresos del día ($)', required: false }
      ],
      prompt_template: `Actúa como el Sistema de Control de Calidad y Gestión Operativa de un laboratorio clínico de alto rendimiento.
El director necesita saber en 60 segundos si el día fue operativamente limpio y financieramente sano.

- Muestras procesadas: {{muestras_dia}}
- Ingresos del día: \${{ingresos_dia}}
- Resultados pendientes: {{resultados_pendientes}}
- Estudio top del día: {{estudio_top}}
- Incidencias: {{incidencias}}
- Meta del día: \${{meta_dia}}

Genera el "PulseLab del Día":

1. SEMÁFORO OPERATIVO:
🟢 Día Controlado y Rentable | 🟡 Incidencias manejables con impacto menor | 🔴 Incidencia crítica de calidad o resultado comprometido
Basado en: cumplimiento de meta \${{meta_dia}}, gravedad de {{incidencias}} y volumen de {{resultados_pendientes}} sin entregar.

2. ANÁLISIS DE PRODUCTIVIDAD:
Ingreso promedio por muestra (\${{ingresos_dia}} / {{muestras_dia}}) vs. lo esperado. Si hay baja, ¿se procesaron muchos estudios de bajo costo y poco margen? ¿El {{estudio_top}} está traccionando bien?

3. GESTIÓN DE RESULTADOS PENDIENTES:
Para {{resultados_pendientes}}: ¿cuántos están en riesgo de superar el tiempo de entrega prometido? Genera el mensaje de comunicación proactiva que el personal envía HOY a los pacientes o médicos afectados, antes de que ellos llamen a preguntar.

4. PLAN DE INCIDENCIAS:
Para la incidencia más crítica de {{incidencias}}: el protocolo de acción exacto — qué se corrige, quién lo comunica al paciente o médico, cómo se documenta para el control de calidad y si implica repetición de muestra.

5. PROYECCIÓN DE MAÑANA:
Si el ritmo de hoy se mantiene, ¿cerrará la semana sobre o bajo la meta? ¿Qué acción puede activar el director para aumentar el volumen de mañana (llamada a médicos remitentes, campaña de último momento a pacientes de seguimiento)?`
    },
    {
      slug: 'lab-loop',
      name_en: 'LabLoop Premium',
      name_es: 'LabLoop Premium',
      description_en: 'From first panel to lifetime preventive health partner. Full lab growth system.',
      description_es: 'Desde el primer análisis hasta el aliado de salud preventiva de por vida. El sistema completo.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'laboratorio', type: 'text', label_en: 'Lab / Clinic Name', label_es: 'Nombre del laboratorio o centro de diagnóstico', required: true },
        { id: 'tipo_lab', type: 'select', label_en: 'Lab Type', label_es: 'Tipo de laboratorio', required: true,
          options: [
            { value: 'general', label_en: 'General / Clinical Lab', label_es: 'Laboratorio clínico general' },
            { value: 'especializado', label_en: 'Specialized (oncology, genetics, hormones)', label_es: 'Especializado (oncología, genética, hormonas)' },
            { value: 'empresa', label_en: 'Corporate / Occupational Health Lab', label_es: 'Laboratorio empresarial / salud ocupacional' },
            { value: 'hospital', label_en: 'Hospital / Clinic Lab', label_es: 'Laboratorio de hospital o clínica' }
          ]
        },
        { id: 'muestras_dia_promedio', type: 'text', label_en: 'Average Daily Sample Volume', label_es: 'Volumen promedio de muestras por día', required: true },
        { id: 'dolor_pacientes', type: 'textarea', label_en: 'Patient Retention / Reactivation Problem', label_es: 'Problema de retención o reactivación de pacientes', required: true, placeholder_es: 'Pacientes que vienen una vez y no regresan, no tenemos sistema de seguimiento, dependemos de médicos remitentes...' },
        { id: 'dolor_crecimiento', type: 'textarea', label_en: 'Revenue / Growth Problem', label_es: 'Problema de ingresos o crecimiento del laboratorio', required: true, placeholder_es: 'Ticket promedio bajo, no vendemos paquetes preventivos, pocas empresas con convenio...' },
        { id: 'fase', type: 'select', label_en: 'Priority Module Today', label_es: 'Módulo donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'pacientes', label_en: 'Patient Retention & Reactivation', label_es: 'Retención y reactivación de pacientes' },
            { value: 'ticket', label_en: 'Ticket Increase & Preventive Packages', label_es: 'Ticket promedio y paquetes preventivos' },
            { value: 'referentes', label_en: 'Referral Network & Corporate Accounts', label_es: 'Red de referentes y convenios empresariales' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para laboratorios clínicos independientes que quieren crecer más allá del modelo reactivo, implementando el sistema "LabLoop": el ciclo de prosperidad para laboratorios que quieren ser el aliado de salud preventiva de su comunidad.

Laboratorio: {{laboratorio}}
Tipo: {{tipo_lab}}
Volumen: {{muestras_dia_promedio}} muestras/día
Problema de pacientes: {{dolor_pacientes}}
Problema de crecimiento: {{dolor_crecimiento}}
Fase prioritaria: {{fase}}

Activa el módulo LabLoop correspondiente:

Si {{fase}} = PACIENTES:
→ Diseña el "Programa de Paciente Frecuente de {{laboratorio}}" con enfoque preventivo. Incluye:
(1) La clasificación de la base de pacientes por perfil de riesgo y frecuencia de control recomendada: Crónicos (cada 3 meses), Preventivos (cada 6 meses), Anuales (una vez al año). Criterios para clasificar a cada paciente.
(2) La campaña de reactivación por segmento: mensajes exactos de WhatsApp personalizados para cada perfil, con el argumento clínico específico de por qué este es el momento de su próximo control.
(3) El "Recordatorio de Salud Automático": el sistema de 3 mensajes (aviso 2 semanas antes, recordatorio 1 semana antes, último aviso el día antes del aniversario del último estudio) para que ningún paciente de seguimiento se quede sin su control periódico.

Si {{fase}} = TICKET:
→ Construye el "Catálogo de Paquetes Preventivos de {{laboratorio}}": 5 paquetes diseñados por perfil de paciente con nombre evocador y clínicamente sólido (ej. "Panel Cardio-Metabólico", "Check-up Hormonal Femenino 35+", "Panel Ejecutivo"), los estudios incluidos en cada uno, el precio con descuento vs. individual, y el argumento de venta de 2 oraciones para cada paquete. Incluye el protocolo de cómo el personal de recepción presenta los paquetes en el momento de la toma de muestra sin sonar a vendedor de seguros.

Si {{fase}} = REFERENTES:
→ Diseña la "Red de Aliados Clínicos de {{laboratorio}}": la estrategia para reactivar médicos remitentes que han dejado de enviar pacientes (mensaje personalizado + beneficio concreto como resultados prioritarios en 4h, reporte digital directo a WhatsApp del médico, o capacitación breve sobre nuevas pruebas disponibles), el plan de captación de convenios empresariales — qué tipo de empresa priorizar, qué paquete de salud ocupacional ofrecer, cómo estructurar el acuerdo comercial, y el kit de presentación en 1 página para el médico o empresa que el director puede enviar hoy.

Cierra con "El Próximo Movimiento de {{laboratorio}}": la única acción de mayor impacto clínico y comercial que el director ejecuta mañana antes de abrir la primera cita.`
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
    if (app.slug === 'lab-loop' || app.slug === 'decide-lab') targetPlan = businessPlan || proPlan

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Laboratorios Clínicos completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()
