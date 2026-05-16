-- Paquete: Wellness & Digital Commerce Bundle
-- Fecha: 2026-05-12 (Extra Shift)
-- Objetivo: Expandir Antigravity hacia Salud, Estilo de Vida y Comercio Electrónico.

-- 1. Mental Clarity Coach
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('mental-clarity', 'Mental Clarity Coach', 'Coach de Claridad Mental', 'AI-guided journaling and stress management strategy.', 'Estrategia de gestión de estrés y diario guiado por IA.', 'Sparkles', 
'[{"name": "feeling", "label": "¿Cómo te sientes hoy?", "type": "textarea"}, {"name": "challenge", "label": "Tu mayor desafío actual", "type": "text"}]'::jsonb,
'Act as a specialized Psychologist and Executive Coach. Based on the feelings: {{feeling}} and this challenge: {{challenge}}, provide a "Clarity Roadmap". Include a perspective shift, a cognitive reframing exercise, and 3 immediate steps to reduce mental noise.');

-- 2. Meal Plan Architect
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('meal-architect', 'Meal Plan Architect', 'Arquitecto de Dietas', 'Custom nutritional plans based on goals and preferences.', 'Planes nutricionales personalizados según objetivos y preferencias.', 'Heart', 
'[{"name": "goal", "label": "Objetivo (Perder peso/Ganar músculo)", "type": "text"}, {"name": "restrictions", "label": "Restricciones (Vegano/Keto/etc)", "type": "text"}]'::jsonb,
'Act as a Certified Nutritionist. Design a 3-day sample meal plan for someone looking to {{goal}} with {{restrictions}} restrictions. Include caloric estimates, macro breakdown, and a simple shopping list.');

-- 3. Fitness Routine Pro
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('fitness-pro', 'Fitness Routine Pro', 'Rutina de Entrenamiento Pro', 'Hyper-personalized workout routines for any level.', 'Rutinas de entrenamiento hiper-personalizadas para cualquier nivel.', 'Activity', 
'[{"name": "place", "label": "Dónde entrenas (Casa/Gym)", "type": "text"}, {"name": "days", "label": "Días por semana", "type": "number"}]'::jsonb,
'Act as a High-Performance Personal Trainer. Create a weekly training routine for {{days}} days per week at {{place}}. Focus on compound movements, progressive overload, and include specific recovery tips.');

-- 4. Sleep Optimizer AI
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('sleep-optimizer', 'Sleep Optimizer AI', 'Optimizador de Sueño', 'Science-based protocols to improve sleep quality.', 'Protocolos basados en ciencia para mejorar la calidad del sueño.', 'Clock', 
'[{"name": "issue", "label": "Principal problema al dormir", "type": "textarea"}]'::jsonb,
'Act as a Sleep Scientist. Analyze this issue: {{issue}}. Provide a "Sleep Hygiene Protocol" including circadian rhythm alignment, evening routine adjustments, and environmental optimization for deep sleep.');

-- 5. Product Hunter Pro (Dropshipping)
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('product-hunter', 'Product Hunter Pro', 'Cazador de Productos Ganadores', 'Find high-potential products for dropshipping or retail.', 'Encuentra productos de alto potencial para dropshipping o retail.', 'Search', 
'[{"name": "niche", "label": "Nicho de Mercado", "type": "text"}, {"name": "budget", "label": "Presupuesto de Inversión", "type": "number"}]'::jsonb,
'Act as an E-commerce Expert. Suggest 3 "Winning Products" in the {{niche}} niche with an investment of {{budget}}. Explain the "Why" (trends, pain points), target audience, and a suggested marketing angle for each.');

-- 6. Winning Product Describer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('product-describer', 'Winning Product Describer', 'Descriptor de Productos Top', 'Write high-converting product descriptions for Shopify/Amazon.', 'Escribe descripciones de productos de alta conversión para Shopify/Amazon.', 'ShoppingCart', 
'[{"name": "features", "label": "Características del Producto", "type": "textarea"}]'::jsonb,
'Act as a Direct Response Copywriter. Write a persuasive product description based on: {{features}}. Use the AIDA framework (Attention, Interest, Desire, Action), include bullet points of benefits (not just features), and a scarcity-driven CTA.');

-- 7. Customer Support Bot Script
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('support-bot-script', 'Customer Support Bot Script', 'Guionista de Bots de Soporte', 'Design automated flows for WhatsApp or Web bots.', 'Diseña flujos automáticos para bots de WhatsApp o Web.', 'MessageSquare', 
'[{"name": "business", "label": "Giro del Negocio", "type": "text"}, {"name": "faqs", "label": "Preguntas Frecuentes", "type": "textarea"}]'::jsonb,
'Act as a CX (Customer Experience) Architect. Design a conversation flow for a support bot for {{business}}. Address these FAQs: {{faqs}}. Ensure the tone is helpful, concise, and includes clear menu options for the user.');

-- 8. Supply Chain Risk Analyzer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('supply-chain-risk', 'Supply Chain Risk Analyzer', 'Analista de Riesgos Logísticos', 'Identify and mitigate bottlenecks in your supply chain.', 'Identifica y mitiga cuellos de botella en tu cadena de suministro.', 'Wrench', 
'[{"name": "route", "label": "Ruta/Proceso de Suministro", "type": "textarea"}]'::jsonb,
'Act as a Supply Chain Consultant. Analyze this process: {{route}}. Identify 3 potential risks (logistics, geopolitical, or quality) and provide a mitigation plan for each to ensure business continuity.');

-- 10. Language Learning Roadmap
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('language-roadmap', 'Language Learning Roadmap', 'Mapa de Aprendizaje de Idiomas', 'Personalized plan to master any language fast.', 'Plan personalizado para dominar cualquier idioma rápido.', 'GraduationCap', 
'[{"name": "language", "label": "Idioma que quieres aprender", "type": "text"}, {"name": "time", "label": "Minutos al día disponibles", "type": "number"}]'::jsonb,
'Act as a Polyglot and Language Coach. Create a "Fast-Track Roadmap" to learn {{language}} with {{time}} minutes a day. Include a weekly schedule focusing on the Pareto Principle (the 20% of grammar/vocab used 80% of the time).');

-- 9. Event Planner AI (Insertada aquí para completar el orden)
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('event-planner', 'Event Planner AI', 'Planificador de Eventos IA', 'Structure and organize any event from scratch.', 'Estructura y organiza cualquier evento desde cero.', 'Layout', 
'[{"name": "event", "label": "Tipo de Evento", "type": "text"}, {"name": "guests", "label": "Número de Invitados", "type": "number"}]'::jsonb,
'Act as a Professional Event Planner. Create a master plan for a {{event}} with {{guests}} guests. Include a timeline (countdown), budget allocation suggestions, and a checklist for vendors and logistics.');

-- Vincular todas las nuevas apps al plan profesional
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, m.id 
FROM public.plans p 
CROSS JOIN public.micro_apps m
WHERE p.slug = 'professional' 
ON CONFLICT DO NOTHING;
