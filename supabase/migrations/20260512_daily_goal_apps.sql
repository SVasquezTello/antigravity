-- Paquete: High-Growth Business Bundle
-- Fecha: 2026-05-12
-- Objetivo: Alcanzar la meta de 10 apps diarias con soluciones de Negocios, Finanzas y Marketing.

-- 1. Financial Health Auditor
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('fin-health-audit', 'Financial Health Auditor', 'Auditor de Salud Financiera', 'Analyze business P&L to find leaks and growth opportunities.', 'Analiza el P&L de tu negocio para encontrar fugas y oportunidades de crecimiento.', 'BarChart3', 
'[{"name": "revenue", "label": "Ingresos Mensuales", "type": "number"}, {"name": "expenses", "label": "Gastos Mensuales", "type": "number"}, {"name": "industry", "label": "Industria", "type": "text"}]'::jsonb,
'Act as a CFO. Analyze these numbers: Revenue {{revenue}}, Expenses {{expenses}} in the {{industry}} sector. Provide a financial health score, identify potential leaks, and give 3 specific strategies to increase net profit.');

-- 2. Tax Optimizer Pro
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('tax-optimizer', 'Tax Optimizer Pro', 'Optimizador de Impuestos', 'Strategy for legal tax deduction and planning.', 'Estrategia para deducción legal de impuestos y planificación.', 'Scale', 
'[{"name": "country", "label": "País", "type": "text"}, {"name": "entity", "label": "Tipo de Empresa", "type": "text"}, {"name": "profit", "label": "Utilidad Anual", "type": "number"}]'::jsonb,
'Act as a Senior Tax Consultant in {{country}}. For a {{entity}} with {{profit}} annual profit, suggest 5 legal ways to optimize taxes and improve fiscal efficiency.');

-- 3. Viral Script Writer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('viral-scripts', 'Viral Script Writer', 'Guionista de Videos Virales', 'Create high-retention scripts for TikTok, Reels, and Shorts.', 'Crea guiones de alta retención para TikTok, Reels y Shorts.', 'Zap', 
'[{"name": "topic", "label": "Tema del Video", "type": "text"}, {"name": "vibe", "label": "Tono", "type": "select", "options": [{"value":"humor","label":"Humor"},{"value":"educational","label":"Educativo"}]}]'::jsonb,
'Act as a Viral Content Creator. Write a 60-second video script about {{topic}} with a {{vibe}} tone. Include a "Pattern Interrupt" hook in the first 3 seconds and a strong CTA at the end.');

-- 4. SEO Article Master
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('seo-article-master', 'SEO Article Master', 'Maestro de Artículos SEO', 'Generate long-form articles optimized for Google ranking.', 'Genera artículos de larga extensión optimizados para Google.', 'BookOpen', 
'[{"name": "keyword", "label": "Palabra Clave", "type": "text"}, {"name": "audience", "label": "Audiencia", "type": "text"}]'::jsonb,
'Act as an SEO Expert. Write a 1000-word article about {{keyword}} for {{audience}}. Include H1, H2, H3 tags, bullet points, and ensure the keyword density is optimized for ranking.');

-- 5. Cold Email Sniper
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('cold-email-sniper', 'Cold Email Sniper', 'Sniper de Emails en Frío', 'High-conversion cold outreach sequences for B2B.', 'Secuencias de prospección en frío de alta conversión para B2B.', 'Target', 
'[{"name": "target", "label": "Quién es tu Cliente", "type": "text"}, {"name": "offer", "label": "Tu Oferta Irresistible", "type": "text"}]'::jsonb,
'Act as a Sales Copywriter. Write a 3-step cold email sequence to pitch {{offer}} to {{target}}. Focus on personalization, short paragraphs, and a low-friction call to action.');

-- 6. Customer Loyalty Designer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('loyalty-designer', 'Customer Loyalty Designer', 'Diseñador de Fidelización', 'Create rewards programs that keep customers coming back.', 'Crea programas de recompensas que hagan que los clientes vuelvan.', 'Heart', 
'[{"name": "business", "label": "Tu Negocio", "type": "text"}, {"name": "goal", "label": "Objetivo (Retención/Ticket Medio)", "type": "text"}]'::jsonb,
'Act as a Retention Marketing Expert. Design a loyalty program for {{business}} focused on {{goal}}. Include 3 tiers of rewards and a strategy for automation.');

-- 7. Startup Pitch Deck AI
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('pitch-deck-ai', 'Startup Pitch Deck AI', 'Creador de Pitch Decks', 'Structure your startup idea for investor presentations.', 'Estructura tu idea de startup para presentaciones ante inversores.', 'Rocket', 
'[{"name": "problem", "label": "Problema que resuelves", "type": "textarea"}, {"name": "solution", "label": "Tu Solución", "type": "textarea"}]'::jsonb,
'Act as a Venture Capitalist. Create a 10-slide outline for a Pitch Deck based on: Problem: {{problem}} and Solution: {{solution}}. Include key metrics to show and the "Big Vision" story.');

-- 8. Legal Contract Reviewer
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('legal-reviewer', 'Legal Contract Reviewer', 'Revisor de Contratos Legales', 'Find hidden risks and red flags in legal documents.', 'Encuentra riesgos ocultos y alertas rojas en documentos legales.', 'Scale', 
'[{"name": "clause", "label": "Cláusula o Resumen del Contrato", "type": "textarea"}]'::jsonb,
'Act as a Senior Lawyer. Review this contract summary/clause: {{clause}}. Identify potential risks, unfair terms, and suggest how to rephrase them to protect the client.');

-- 9. Price Strategy Architect
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('price-architect', 'Price Strategy Architect', 'Arquitecto de Precios', 'Determine the perfect price point for maximum profit.', 'Determina el punto de precio perfecto para la máxima utilidad.', 'TrendingUp', 
'[{"name": "product", "label": "Producto", "type": "text"}, {"name": "cost", "label": "Costo de Producción", "type": "number"}]'::jsonb,
'Act as a Pricing Strategist. Suggest 3 pricing models for {{product}} with a cost of {{cost}}. Explain the psychology behind each (Premium, Value, Psychological) and the estimated profit margin.');

-- 10. Brand Voice Tuner
INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, prompt_template)
VALUES ('brand-voice', 'Brand Voice Tuner', 'Afinador de Voz de Marca', 'Define a unique and consistent personality for your brand.', 'Define una personalidad única y consistente para tu marca.', 'Sparkles', 
'[{"name": "values", "label": "Valores de tu marca", "type": "text"}, {"name": "audience", "label": "Audiencia Ideal", "type": "text"}]'::jsonb,
'Act as a Branding Expert. Define a "Brand Voice & Style Guide" based on these values: {{values}} for this audience: {{audience}}. Include: Tone of voice, words to use, words to avoid, and 3 example sentences.');

-- Vincular todas las nuevas apps al plan profesional
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, m.id 
FROM public.plans p 
CROSS JOIN public.micro_apps m
WHERE p.slug = 'professional' 
ON CONFLICT DO NOTHING;
