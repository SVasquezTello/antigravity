-- Paquete: Shift Planning Elite Bundle
-- Fecha: 2026-05-12
-- Objetivo: Optimización de recursos humanos en Salud, Seguridad, Fábricas y Retail.

-- 1. ShiftMaster Pro: Planificación General
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'shift-master-pro',
    'ShiftMaster Pro',
    'ShiftMaster Pro (Planificación)',
    'Advanced labor shift management and planning for businesses.',
    'Gestión y planificación avanzada de turnos laborales para empresas.',
    'Calendar',
    '[
      {"name": "staff_count", "label": {"en": "Number of Employees", "es": "Número de Empleados"}, "type": "number", "required": true},
      {"name": "business_type", "label": {"en": "Business Type", "es": "Tipo de Negocio"}, "type": "select", "options": [
        {"value": "restaurant", "label": {"en": "Restaurant", "es": "Restaurante"}},
        {"value": "office", "label": {"en": "Office", "es": "Oficina/Corporativo"}},
        {"value": "service", "label": {"en": "Service Center", "es": "Centro de Servicios"}}
      ], "required": true},
      {"name": "requirements", "label": {"en": "Specific Requirements", "es": "Requerimientos Específicos"}, "type": "textarea", "placeholder": "Ej: Turnos rotativos, 24/7, horas pico los fines de semana", "required": true}
    ]'::jsonb,
    'Act as an Operations Manager. Create an optimized weekly shift schedule for a {{business_type}} with {{staff_count}} employees. Take into account these requirements: {{requirements}}. Provide a structured table with suggested shifts, rest days, and total hours per employee, ensuring maximum coverage during peak times.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 2. MedTurnos AI: Planificación Médica
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'med-turnos-ai',
    'MedTurnos AI',
    'MedTurnos AI (Hospitalario)',
    'Specialized hospital and medical staff scheduling.',
    'Planificación especializada para personal médico y hospitalario.',
    'Heart',
    '[
      {"name": "dept", "label": {"en": "Department", "es": "Departamento/Área"}, "type": "text", "placeholder": "Ej: Emergencias, UCI, Pediatría", "required": true},
      {"name": "shift_type", "label": {"en": "Shift Pattern", "es": "Patrón de Turnos"}, "type": "select", "options": [
        {"value": "24h", "label": {"en": "24-hour Guards", "es": "Guardias de 24h"}},
        {"value": "12h", "label": {"en": "12-hour Rotations", "es": "Rotaciones de 12h"}},
        {"value": "custom", "label": {"en": "Custom", "es": "Personalizado"}}
      ], "required": true}
    ]'::jsonb,
    'Act as a Hospital Administrator. Design a medical staff schedule for the {{dept}} department using a {{shift_type}} pattern. Ensure legal rest periods are respected and provide a strategy for emergency backup coverage based on typical patient load.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 3. GuardControl Scheduler: Seguridad
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'guard-control-scheduler',
    'GuardControl Scheduler',
    'GuardControl Scheduler (Seguridad)',
    'Security personnel scheduling with patrol and incident tracking.',
    'Programación de personal de seguridad con rastreo de rondas e incidencias.',
    'Shield',
    '[
      {"name": "post_count", "label": {"en": "Security Posts", "es": "Puestos de Vigilancia"}, "type": "number", "required": true},
      {"name": "guard_count", "label": {"en": "Available Guards", "es": "Vigilantes Disponibles"}, "type": "number", "required": true},
      {"name": "risk_level", "label": {"en": "Risk Level", "es": "Nivel de Riesgo"}, "type": "select", "options": [
        {"value": "low", "label": {"en": "Low", "es": "Bajo"}},
        {"value": "medium", "label": {"en": "Medium", "es": "Medio"}},
        {"value": "high", "label": {"en": "High", "es": "Alto/Crítico"}}
      ], "required": true}
    ]'::jsonb,
    'Act as a Security Operations Director. Create a deployment plan for {{guard_count}} guards covering {{post_count}} posts with a {{risk_level}} risk level. Include rotation schedules, mandatory check-in points, and an incident reporting protocol.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 4. FactoryShift ERP: Producción
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'factory-shift-erp',
    'FactoryShift ERP',
    'FactoryShift ERP (Industrial)',
    'Industrial production shift optimization and workforce planning.',
    'Optimización de turnos de producción industrial y planificación de personal.',
    'Factory',
    '[
      {"name": "lines", "label": {"en": "Production Lines", "es": "Líneas de Producción"}, "type": "number", "required": true},
      {"name": "workers_per_line", "label": {"en": "Workers per Line", "es": "Trabajadores por Línea"}, "type": "number", "required": true},
      {"name": "target", "label": {"en": "Production Target", "es": "Objetivo de Producción"}, "type": "text", "required": true}
    ]'::jsonb,
    'Act as an Industrial Engineer. Optimize the workforce distribution for {{lines}} production lines with {{workers_per_line}} workers each to meet the target: {{target}}. Plan for 3 rotating shifts (morning, afternoon, night) and include a downtime maintenance window.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 5. RetailStaff Planner: Tiendas
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
  VALUES (
    'retail-staff-planner',
    'RetailStaff Planner',
    'RetailStaff Planner (Comercio)',
    'Personnel scheduling for stores and supermarkets based on demand.',
    'Programación de personal para tiendas y supermercados basada en la demanda.',
    'ShoppingCart',
    '[
      {"name": "store_size", "label": {"en": "Store Size / Areas", "es": "Tamaño de Tienda / Áreas"}, "type": "text", "placeholder": "Ej: 5 cajas, 3 pasillos, almacén", "required": true},
      {"name": "peak_hours", "label": {"en": "Peak Traffic Hours", "es": "Horas de Mayor Tráfico"}, "type": "text", "placeholder": "Ej: 11am-2pm, 6pm-9pm", "required": true}
    ]'::jsonb,
    'Act as a Retail Store Manager. Plan the staffing requirements for a store with {{store_size}}. Focus coverage on these peak hours: {{peak_hours}}. Design a rotation that ensures customer service quality while managing employee labor costs effectively.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');
