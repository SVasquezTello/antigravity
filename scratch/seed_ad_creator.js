const fs = require('fs');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log("Seeding Ad Copy Generator App...");

  // 1. Insert micro app
  const { data: appData, error: appError } = await supabase.from('micro_apps').insert([{
    slug: 'ad-creator',
    name_en: 'Ad Copy Generator',
    name_es: 'Creador de Anuncios',
    description_en: 'Generate high-converting ad copy optimized for specific social media platforms.',
    description_es: 'Genera el texto de anuncios publicitarios optimizado para plataformas de redes sociales.',
    icon: 'Target',
    form_schema: [
      {name: "product", label: {en: "Product / Service", es: "Producto o Servicio"}, type: "textarea", placeholder: {en: "Describe what you are selling...", es: "Describe qué estás vendiendo..."}, required: true},
      {name: "audience", label: {en: "Target Audience", es: "Público Objetivo"}, type: "text", placeholder: {en: "e.g., Young professionals, Parents", es: "Ej: Estudiantes universitarios, emprendedores"}, required: true},
      {name: "platform", label: {en: "Platform", es: "Plataforma"}, type: "select", options: [
        {value: "facebook", label: {en: "Facebook Ads", es: "Facebook Ads"}},
        {value: "instagram", label: {en: "Instagram Ads", es: "Instagram Ads"}},
        {value: "tiktok", label: {en: "TikTok Ads", es: "TikTok Ads"}},
        {value: "google", label: {en: "Google Search Ads", es: "Google Search Ads"}}
      ], required: true},
      {name: "tone", label: {en: "Tone of voice", es: "Tono de voz"}, type: "select", options: [
        {value: "persuasive", label: {en: "Persuasive", es: "Persuasivo"}},
        {value: "urgent", label: {en: "Urgent", es: "Urgente / FOMO"}},
        {value: "humorous", label: {en: "Humorous", es: "Humorístico"}},
        {value: "professional", label: {en: "Professional", es: "Profesional"}}
      ], required: true}
    ],
    autofill_presets: [
      {name: {en: "Fitness App (Facebook)", es: "App de Fitness (Facebook)"}, values: {product: "A revolutionary mobile app that generates personalized 15-minute home workouts without any equipment.", audience: "Busy professionals who want to stay fit", platform: "facebook", tone: "urgent"}},
      {name: {en: "Local Cafe (TikTok)", es: "Cafetería (TikTok)"}, values: {product: "Artisan coffee beans roasted locally with a deep, chocolatey flavor. Try our new iced vanilla latte.", audience: "Gen Z and Millennials who love aesthetic coffee shops", platform: "tiktok", tone: "humorous"}}
    ],
    prompt_template: `Act as an expert digital marketer and direct response copywriter. Your task is to write high-converting ad copy based on the following inputs:

Product/Service: {{product}}
Target Audience: {{audience}}
Platform: {{platform}}
Tone of Voice: {{tone}}

Please generate 3 different variations of ad copy. This output must be specifically tailored for the chosen platform:
- For Facebook/Instagram: Include an engaging hook, supportive body copy, emojis, and a clear call-to-action (CTA).
- For TikTok: Provide a hook script, visual cues or audio trends suggestions, and a catchy caption with 3-5 hashtags.
- For Google Search: Provide 3 Headlines (up to 30 chars each) and 2 Descriptions (up to 90 chars each).

Make sure the output is formatting cleanly with bolding, and the response is around 250 words minimum to provide comprehensive value.`
  }]).select('id').maybeSingle();

  if (appError) {
    if (appError.code === '23505') { // unique constraint violation
      console.log("App 'ad-creator' already exists. Skipping insertion.");
    } else {
      console.error("Error inserting app:", appError);
      process.exit(1);
    }
  } else {
    console.log(`Successfully created app 'ad-creator' with ID: ${appData.id}`);

    // 2. Fetch 'professional' and 'enterprise' plan IDs
    const { data: plansData, error: plansError } = await supabase
      .from('plans')
      .select('id, slug')
      .in('slug', ['professional', 'enterprise']);

    if (plansError) {
      console.error("Error fetching plans:", plansError);
      process.exit(1);
    }

    if (plansData && plansData.length > 0) {
      const planAppInserts = plansData.map(plan => ({
        plan_id: plan.id,
        app_id: appData.id
      }));

      const { error: mappingError } = await supabase
        .from('plan_apps')
        .insert(planAppInserts);

      if (mappingError) {
        console.error("Error mapping app to plans:", mappingError);
      } else {
        console.log(`Successfully mapped 'ad-creator' to plans: ${plansData.map(p => p.slug).join(', ')}`);
      }
    }
  }

  console.log("Done.");
}

run();
