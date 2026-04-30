-- Seeding New Industry Vertical Micro-Apps
-- 2026-04-25: Antigravity Expansion

-- 1. Real Estate: Property Description Generator
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'real-estate-desc',
    'Real Estate Describer',
    'Descriptor Inmobiliario',
    'Generate emotional and persuasive property descriptions for listings.',
    'Genera descripciones inmobiliarias emocionales y persuasivas para listados.',
    'Home',
    '[
      {"name": "type", "label": {"en": "Property Type", "es": "Tipo de Propiedad"}, "type": "select", "options": [
        {"value": "apartment", "label": {"en": "Apartment", "es": "Apartamento"}},
        {"value": "house", "label": {"en": "House", "es": "Casa"}},
        {"value": "penthouse", "label": {"en": "Penthouse", "es": "Ático"}},
        {"value": "commercial", "label": {"en": "Commercial", "es": "Local Comercial"}}
      ], "required": true},
      {"name": "features", "label": {"en": "Key Features", "es": "Características Clave"}, "type": "textarea", "placeholder": {"en": "3 bedrooms, 2 baths, pool, near beach...", "es": "3 hab, 2 baños, piscina, cerca de la playa..."}, "required": true},
      {"name": "vibe", "label": {"en": "Tone / Vibe", "es": "Tono / Ambiente"}, "type": "select", "options": [
        {"value": "luxury", "label": {"en": "Luxury", "es": "Lujo"}},
        {"value": "cozy", "label": {"en": "Cozy", "es": "Acogedor"}},
        {"value": "modern", "label": {"en": "Modern", "es": "Moderno"}},
        {"value": "investment", "label": {"en": "Investment Opportunity", "es": "Oportunidad de Inversión"}}
      ], "required": true}
    ]'::jsonb,
    '[
      {"name": {"en": "Beachfront Villa", "es": "Villa frente al mar"}, "values": {"type": "house", "features": "5 bedrooms, private pool, direct beach access, newly renovated kitchen", "vibe": "luxury"}}
    ]'::jsonb,
    'Act as a premium real estate copywriter. Write a high-converting property description for a {{type}}. Features: {{features}}. Tone: {{vibe}}. Include a catchy title, a detailed body focusing on benefits, and a call to action.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('intermediary', 'professional', 'enterprise');

-- 2. Education: Course Curriculum Architect
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'course-architect',
    'Course Architect',
    'Arquitecto de Cursos',
    'Design a comprehensive course curriculum and module structure.',
    'Diseña un currículo de curso completo y una estructura de módulos.',
    'BookOpen',
    '[
      {"name": "topic", "label": {"en": "Course Topic", "es": "Tema del Curso"}, "type": "text", "placeholder": {"en": "Digital Marketing for Beginners", "es": "Marketing Digital para Principiantes"}, "required": true},
      {"name": "duration", "label": {"en": "Target Duration (Weeks)", "es": "Duración Objetivo (Semanas)"}, "type": "number", "required": true},
      {"name": "level", "label": {"en": "Student Level", "es": "Nivel del Estudiante"}, "type": "select", "options": [
        {"value": "beginner", "label": {"en": "Beginner", "es": "Principiante"}},
        {"value": "intermediate", "label": {"en": "Intermediate", "es": "Intermedio"}},
        {"value": "advanced", "label": {"en": "Advanced", "es": "Avanzado"}}
      ], "required": true}
    ]'::jsonb,
    '[
      {"name": {"en": "Python Intro", "es": "Intro a Python"}, "values": {"topic": "Introduction to Python Programming", "duration": 4, "level": "beginner"}}
    ]'::jsonb,
    'Act as an instructional designer. Create a {{duration}}-week course curriculum for "{{topic}}" at a {{level}} level. Provide module names, learning objectives, and a brief description for each week.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 3. Manufacturing: SOP Generator
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'sop-generator',
    'SOP Generator',
    'Generador de PNT',
    'Create standard operating procedures for manufacturing processes.',
    'Crea procedimientos normalizados de trabajo para procesos de fabricación.',
    'Settings',
    '[
      {"name": "process", "label": {"en": "Process Name", "es": "Nombre del Proceso"}, "type": "text", "placeholder": {"en": "Machine Maintenance", "es": "Mantenimiento de Maquinaria"}, "required": true},
      {"name": "steps", "label": {"en": "Rough Steps", "es": "Pasos Básicos"}, "type": "textarea", "placeholder": {"en": "1. Turn off power, 2. Clean filter...", "es": "1. Apagar corriente, 2. Limpiar filtro..."}, "required": true},
      {"name": "safety", "label": {"en": "Safety Gear Required", "es": "Equipo de Seguridad Requerido"}, "type": "text", "placeholder": {"en": "Gloves, Goggles", "es": "Guantes, Gafas"}, "required": true}
    ]'::jsonb,
    '[
      {"name": {"en": "Basic Cleaning", "es": "Limpieza Básica"}, "values": {"process": "Workstation Cleaning", "steps": "Wipe surfaces, empty bins, sanitize tools", "safety": "Gloves"}}
    ]'::jsonb,
    'Act as an operations manager. Write a professional Standard Operating Procedure (SOP) for: {{process}}. Required safety gear: {{safety}}. Rough steps to expand: {{steps}}. Format with clear sections: Scope, Prerequisites, Safety, and Step-by-Step Instructions.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');

-- 4. Health/Beauty: Treatment Planner
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'beauty-planner',
    'Treatment Planner',
    'Planificador de Tratamientos',
    'Design personalized skin or beauty treatment routines.',
    'Diseña rutinas de tratamiento de piel o belleza personalizadas.',
    'Sparkles',
    '[
      {"name": "skin_type", "label": {"en": "Skin Type", "es": "Tipo de Piel"}, "type": "select", "options": [
        {"value": "oily", "label": {"en": "Oily", "es": "Grasa"}},
        {"value": "dry", "label": {"en": "Dry", "es": "Seca"}},
        {"value": "combination", "label": {"en": "Combination", "es": "Mixta"}}
      ], "required": true},
      {"name": "concerns", "label": {"en": "Primary Concerns", "es": "Preocupaciones Principales"}, "type": "textarea", "placeholder": {"en": "Acne, fine lines, dullness...", "es": "Acné, arrugas, falta de brillo..."}, "required": true}
    ]'::jsonb,
    '[]'::jsonb,
    'Act as a professional aesthetician. Create a personalized treatment plan for a client with {{skin_type}} skin and these concerns: {{concerns}}. Include a morning routine, evening routine, and weekly specialized treatments.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('intermediary', 'professional', 'enterprise');

-- 5. Retail: Inventory Strategy
WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'retail-strategy',
    'Inventory Strategy',
    'Estrategia de Inventario',
    'Generate strategies to move slow-moving stock or prep for seasons.',
    'Genera estrategias para mover stock lento o prepararse para temporadas.',
    'Grid',
    '[
      {"name": "items", "label": {"en": "Affected Items", "es": "Artículos Afectados"}, "type": "textarea", "required": true},
      {"name": "goal", "label": {"en": "Goal", "es": "Objetivo"}, "type": "select", "options": [
        {"value": "clearance", "label": {"en": "Clearance / Flash Sale", "es": "Liquidación / Venta Flash"}},
        {"value": "seasonal", "label": {"en": "Seasonal Launch", "es": "Lanzamiento de Temporada"}},
        {"value": "restock", "label": {"en": "Restock Optimization", "es": "Optimización de Reabastecimiento"}}
      ], "required": true}
    ]'::jsonb,
    '[]'::jsonb,
    'Act as a retail merchandise manager. Propose a detailed inventory and marketing strategy for these items: {{items}}. The primary goal is {{goal}}. Include pricing suggestions, bundle ideas, and 3 promotional taglines.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT id, (SELECT id FROM inserted_app) FROM public.plans WHERE slug IN ('professional', 'enterprise');
