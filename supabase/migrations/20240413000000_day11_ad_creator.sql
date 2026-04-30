-- Day 11: Create Ad Copy Generator Micro App
-- Inserts a powerful new marketing tool and binds it to Premium plans.

WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'ad-creator',
    'Ad Copy Generator',
    'Creador de Anuncios',
    'Generate high-converting ad copy optimized for specific social media platforms.',
    'Genera el texto de anuncios publicitarios optimizado para plataformas de redes sociales.',
    'Target',
    '[
      {"name": "product", "label": {"en": "Product / Service", "es": "Producto o Servicio"}, "type": "textarea", "placeholder": {"en": "Describe what you are selling...", "es": "Describe qué estás vendiendo..."}, "required": true},
      {"name": "audience", "label": {"en": "Target Audience", "es": "Público Objetivo"}, "type": "text", "placeholder": {"en": "e.g., Young professionals, Parents", "es": "Ej: Estudiantes universitarios, emprendedores"}, "required": true},
      {"name": "platform", "label": {"en": "Platform", "es": "Plataforma"}, "type": "select", "options": [
        {"value": "facebook", "label": {"en": "Facebook Ads", "es": "Facebook Ads"}},
        {"value": "instagram", "label": {"en": "Instagram Ads", "es": "Instagram Ads"}},
        {"value": "tiktok", "label": {"en": "TikTok Ads", "es": "TikTok Ads"}},
        {"value": "google", "label": {"en": "Google Search Ads", "es": "Google Search Ads"}}
      ], "required": true},
      {"name": "tone", "label": {"en": "Tone of voice", "es": "Tono de voz"}, "type": "select", "options": [
        {"value": "persuasive", "label": {"en": "Persuasive", "es": "Persuasivo"}},
        {"value": "urgent", "label": {"en": "Urgent", "es": "Urgente / FOMO"}},
        {"value": "humorous", "label": {"en": "Humorous", "es": "Humorístico"}},
        {"value": "professional", "label": {"en": "Professional", "es": "Profesional"}}
      ], "required": true}
    ]'::jsonb,
    '[
      {"name": {"en": "Fitness App (Facebook)", "es": "App de Fitness (Facebook)"}, "values": {"product": "A revolutionary mobile app that generates personalized 15-minute home workouts without any equipment.", "audience": "Busy professionals who want to stay fit", "platform": "facebook", "tone": "urgent"}},
      {"name": {"en": "Local Cafe (TikTok)", "es": "Cafetería (TikTok)"}, "values": {"product": "Artisan coffee beans roasted locally with a deep, chocolatey flavor. Try our new iced vanilla latte.", "audience": "Gen Z and Millennials who love aesthetic coffee shops", "platform": "tiktok", "tone": "humorous"}}
    ]'::jsonb,
    'Act as an expert digital marketer and direct response copywriter. Your task is to write high-converting ad copy based on the following inputs:

Product/Service: {{product}}
Target Audience: {{audience}}
Platform: {{platform}}
Tone of Voice: {{tone}}

Please generate 3 different variations of ad copy. This output must be specifically tailored for the chosen platform:
- For Facebook/Instagram: Include an engaging hook, supportive body copy, emojis, and a clear call-to-action (CTA).
- For TikTok: Provide a hook script, visual cues or audio trends suggestions, and a catchy caption with 3-5 hashtags.
- For Google Search: Provide 3 Headlines (up to 30 chars each) and 2 Descriptions (up to 90 chars each).

Make sure the output is formatting cleanly with bolding, and the response is around 250 words minimum to provide comprehensive value.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, i.id
FROM public.plans p
CROSS JOIN inserted_app i
WHERE p.slug IN ('professional', 'enterprise');
