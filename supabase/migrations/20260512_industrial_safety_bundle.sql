-- Paquete: Industrial Safety Pro Bundle
-- Fecha: 2026-05-12
-- Objetivo: Soluciones de alto valor para Minería, Construcción e Industria.

-- 1. SafeAudit Pro: Auditoría SST
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'safe-audit-pro',
    'SafeAudit Pro',
    'SafeAudit Pro (Auditoría SST)',
    'Generate professional SST audit reports and compliance checklists.',
    'Genera reportes de auditoría SST profesionales y listas de verificación de cumplimiento.',
    'ShieldCheck',
    '[
      {"name": "sector", "label": {"en": "Industrial Sector", "es": "Sector Industrial"}, "type": "select", "options": [
        {"value": "mining", "label": {"en": "Mining", "es": "Minería"}},
        {"value": "construction", "label": {"en": "Construction", "es": "Construcción"}},
        {"value": "manufacturing", "label": {"en": "Manufacturing", "es": "Manufactura/Fábricas"}},
        {"value": "transport", "label": {"en": "Transport", "es": "Transporte"}}
      ], "required": true},
      {"name": "observations", "label": {"en": "Audit Observations", "es": "Observaciones de la Auditoría"}, "type": "textarea", "placeholder": {"en": "Describe findings, non-compliance, or safe acts...", "es": "Describe hallazgos, incumplimientos o actos seguros..."}, "required": true},
      {"name": "standard", "label": {"en": "Standard/Regulation", "es": "Normativa Aplicable"}, "type": "text", "placeholder": "Ej: Ley 29783, ISO 45001", "required": true}
    ]'::jsonb,
    'Act as a Senior Industrial Safety Auditor. Based on these observations: {{observations}} in the {{sector}} sector, under the {{standard}} regulation, generate a professional Audit Report. Include: 1. Executive Summary, 2. Detailed Findings (Positive and Negative), 3. Risk Level Assessment, 4. Corrective Action Plan (CAP) with deadlines.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 2. RiskControl 360: Matriz IPERC
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'risk-control-360',
    'RiskControl 360',
    'RiskControl 360 (Matriz IPERC)',
    'AI-powered Hazard Identification and Risk Assessment (IPERC).',
    'Identificación de Peligros y Evaluación de Riesgos (IPERC) potenciada por IA.',
    'Activity',
    '[
      {"name": "job_task", "label": {"en": "Job Task / Activity", "es": "Tarea o Actividad Laboral"}, "type": "text", "placeholder": "Ej: Excavación profunda, Trabajo en altura", "required": true},
      {"name": "environment", "label": {"en": "Work Environment", "es": "Entorno de Trabajo"}, "type": "textarea", "placeholder": {"en": "Weather, presence of chemicals, confined space...", "es": "Clima, presencia de químicos, espacio confinado..."}, "required": true}
    ]'::jsonb,
    'Act as a Safety Risk Specialist. Create a comprehensive IPERC Matrix (Hazard Identification, Risk Assessment, and Controls) for the task: {{job_task}} in this environment: {{environment}}. Format the output as a table including: Hazard, Risk, Initial Severity/Probability, Control Measures (Hierarchy of Controls), and Residual Risk.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 3. EPP Manager: Control de Equipos
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'epp-manager',
    'EPP Manager',
    'EPP Manager (Control de Equipos)',
    'Optimize Personal Protective Equipment (PPE) distribution and lifecycles.',
    'Optimiza la distribución y el ciclo de vida de los Equipos de Protección Personal (EPP).',
    'Briefcase',
    '[
      {"name": "work_position", "label": {"en": "Work Position", "es": "Puesto de Trabajo"}, "type": "text", "placeholder": "Ej: Soldador, Operador de Maquinaria Pesada", "required": true},
      {"name": "risk_exposure", "label": {"en": "Primary Risk Exposure", "es": "Exposición Principal a Riesgos"}, "type": "textarea", "placeholder": "Ej: Ruido alto, chispas, caída de objetos", "required": true}
    ]'::jsonb,
    'Act as an Industrial Hygiene and Safety Specialist. Design a PPE (Personal Protective Equipment) Requirement Matrix for the position of {{work_position}} exposed to {{risk_exposure}}. Specify the type of protection needed (Head, Eyes, Ears, Resp, Body, Feet), technical specifications for each EPP, and an estimated replacement frequency based on high-intensity usage.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 4. Incident Tracker AI: Análisis de Causas
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'incident-tracker-ai',
    'Incident Tracker AI',
    'Incident Tracker AI (Análisis Causal)',
    'AI-driven root cause analysis (RCA) for workplace incidents.',
    'Análisis de causa raíz (RCA) de incidentes laborales impulsado por IA.',
    'AlertCircle',
    '[
      {"name": "event_desc", "label": {"en": "Event Description", "es": "Descripción del Evento"}, "type": "textarea", "placeholder": {"en": "What happened? (e.g., forklift collision)", "es": "¿Qué sucedió? (Ej: colisión de montacargas)"}, "required": true},
      {"name": "consequences", "label": {"en": "Consequences", "es": "Consecuencias"}, "type": "text", "placeholder": "Ej: Daño material, lesión leve en brazo", "required": true}
    ]'::jsonb,
    'Act as an Incident Investigator using the ICAM or 5 Whys methodology. Analyze the following incident: {{event_desc}} with these consequences: {{consequences}}. Provide: 1. Possible Root Causes, 2. Contributory Factors, 3. Immediate Corrective Actions, 4. Preventative Recommendations to avoid recurrence.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 5. FireSafety Inspector: Inspección contra Incendios
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'firesafety-inspector',
    'FireSafety Inspector',
    'FireSafety Inspector (Prevención)',
    'Specialized inspections for fire prevention and emergency systems.',
    'Inspecciones especializadas para la prevención de incendios y sistemas de emergencia.',
    'Flame',
    '[
      {"name": "facility_type", "label": {"en": "Facility Type", "es": "Tipo de Instalación"}, "type": "text", "placeholder": "Ej: Almacén de químicos, Oficinas corporativas", "required": true},
      {"name": "findings", "label": {"en": "Inspection Findings", "es": "Hallazgos de Inspección"}, "type": "textarea", "placeholder": "Ej: Extintores vencidos, salida de emergencia obstruida", "required": true}
    ]'::jsonb,
    'Act as a Fire Prevention Specialist (NFPA standard). Generate a Fire Safety Inspection Report for a {{facility_type}} based on these findings: {{findings}}. Include: 1. Risk Rating, 2. Specific regulatory violations, 3. Priority of Repair/Action, 4. Recommendations for fire drills and equipment maintenance.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');
