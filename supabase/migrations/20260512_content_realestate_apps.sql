-- Paquete: Authority & Real Estate Pro Bundle
-- Fecha: 2026-05-12 (Extra Shift 2)
-- Objetivo: Dominar el mercado de contenido digital y bienes raíces avanzado.

-- 1. YouTube Video Script Architect
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('youtube-architect', 'YouTube Script Architect', 'Arquitecto de Guiones YouTube', 'Structure long-form video scripts with hooks and calls to action.', 'Estructura guiones de video de larga duración con hooks y CTAs.', 'Rocket', 
'[{"name": "topic", "label": "Tema del Video", "type": "text"}, {"name": "length", "label": "Duración estimada (min)", "type": "number"}]'::jsonb,
'Act as a Professional YouTuber with 1M+ subs. Create a detailed script for a {{length}} minute video about {{topic}}. Include a high-retention Intro, 3 main pillars/chapters, a "mid-roll" engagement teaser, and a powerful Outro.');

-- 2. Twitter/X Thread Master
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('twitter-thread', 'Twitter Thread Master', 'Maestro de Hilos de Twitter', 'Turn any complex idea into a viral Twitter thread.', 'Convierte cualquier idea compleja en un hilo viral de Twitter.', 'MessageSquare', 
'[{"name": "concept", "label": "Concepto o Idea", "type": "textarea"}]'::jsonb,
'Act as a Viral Ghostwriter. Convert this concept: {{concept}} into a 7-8 tweet Twitter thread. Use "The Hook" (Tweet 1), "The Value" (Tweets 2-6), and "The CTA" (Tweet 8). Use punchy sentences and formatting for high readability.');

-- 3. LinkedIn Authority Post Creator
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
----------
-- Truncated for brevity, inserting the remaining 8 apps below
----------
'LinkedIn Authority Post', 'Post de Autoridad LinkedIn', 'Professional posts that build trust and authority in your industry.', 'Posts profesionales que construyen confianza y autoridad en tu industria.', 'Briefcase',
'[{"name": "insight", "label": "Aprendizaje o Insight", "type": "textarea"}]'::jsonb,
'Act as a Thought Leader. Write a professional LinkedIn post about: {{insight}}. Use a "hook-benefit-story-lesson" structure. Ensure the tone is authoritative yet approachable.');

-- 4. Blog Post Outline Generator
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('blog-outline', 'Blog Post Outline', 'Estructurador de Blogs', 'Create a SEO-ready skeleton for your next long-form article.', 'Crea un esqueleto listo para SEO para tu próximo artículo largo.', 'Layout',
'[{"name": "title", "label": "Título o Tema", "type": "text"}]'::jsonb,
'Act as a Content Strategist. Create a detailed SEO outline for a blog post titled "{{title}}". Include suggested H1, H2, and H3 headers, bullet points for what to cover in each section, and a primary keyword focus.');

-- 5. Podcast Show Notes Writer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('podcast-notes', 'Podcast Show Notes', 'Notas de Podcast Pro', 'Generate professional descriptions and timestamps for podcasts.', 'Genera descripciones profesionales y timestamps para podcasts.', 'Activity',
'[{"name": "summary", "label": "Resumen del Episodio", "type": "textarea"}]'::jsonb,
'Act as a Podcast Producer. Write professional show notes based on this summary: {{summary}}. Include a catchy description, 5 key takeaways, and a template for timestamps (00:00).');

-- 6. Property ROI Calculator AI
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('property-roi', 'Property ROI Calculator', 'Calculadora de ROI Inmob.', 'Analyze investment potential and cash flow of any property.', 'Analiza el potencial de inversión y flujo de caja de cualquier propiedad.', 'BarChart3',
'[{"name": "price", "label": "Precio de Compra", "type": "number"}, {"name": "rent", "label": "Renta Estimada", "type": "number"}]'::jsonb,
'Act as a Real Estate Investment Analyst. Calculate the estimated ROI, Cap Rate, and Cash-on-Cash return for a property bought at {{price}} with an estimated monthly rent of {{rent}}. Provide a "Buy/Pass" recommendation based on typical market benchmarks.');

-- 7. Real Estate Listing Video Script
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('listing-video', 'Listing Video Script', 'Guion de Video Inmob.', 'Professional scripts for property video tours and TikTok/Reels.', 'Guiones profesionales para recorridos de video y TikTok/Reels.', 'Zap',
'[{"name": "property", "label": "Nombre/Tipo de Propiedad", "type": "text"}, {"name": "highlight", "label": "Lo más destacado", "type": "text"}]'::jsonb,
'Act as a Luxury Real Estate Agent. Write a 45-second script for a video tour of: {{property}}. Highlight: {{highlight}}. Focus on the lifestyle benefits and include visual cues for the cameraman.');

-- 8. Tenant Welcome Guide Creator
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('tenant-guide', 'Tenant Welcome Guide', 'Guía de Bienvenida Inquilino', 'Professional welcome kits to reduce tenant friction.', 'Kits de bienvenida profesionales para reducir fricciones con inquilinos.', 'Heart',
'[{"name": "amenities", "label": "Amenidades/Reglas", "type": "textarea"}]'::jsonb,
'Act as a Property Manager. Create a "Welcome to Your New Home" guide. Based on these amenities/rules: {{amenities}}, write a friendly yet professional welcome letter, a quick start guide for the house, and a list of emergency contacts.');

-- 9. Short-Term Rental Description (Airbnb)
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('airbnb-desc', 'Airbnb Listing Optimizer', 'Optimizador de Airbnb', 'Write catchy titles and descriptions for Airbnb/Vrbo.', 'Escribe títulos y descripciones atractivas para Airbnb/Vrbo.', 'Home',
'[{"name": "location", "label": "Ubicación", "type": "text"}, {"name": "unique", "label": "Qué la hace única", "type": "text"}]'::jsonb,
'Act as a Superhost. Write a high-converting Airbnb listing title and description for a property in {{location}}. Unique selling point: {{unique}}. Focus on hospitality and local experiences.');

-- 10. Zoning & Land Use Advisor
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('zoning-advisor', 'Zoning & Land Use Advisor', 'Asesor de Zonificación', 'Preliminary analysis of land potential and use cases.', 'Análisis preliminar de potencial de terreno y casos de uso.', 'Scale',
'[{"name": "area", "label": "Área/Ubicación del Terreno", "type": "text"}, {"name": "project", "label": "Proyecto Pensado", "type": "text"}]'::jsonb,
'Act as an Urban Planner. Based on the location {{area}} and the project idea {{project}}, provide a preliminary analysis of what to look for in local zoning laws. Suggest 3 questions the developer should ask at the city planning office.');

-- Vincular todas las nuevas apps al plan profesional
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, m.id 
FROM public.plans p 
CROSS JOIN public.micro_apps m
WHERE p.slug = 'professional' 
ON CONFLICT DO NOTHING;
