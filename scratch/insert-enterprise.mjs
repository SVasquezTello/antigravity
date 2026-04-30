import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('Inserting Enterprise Plan...');
  
  const planData = {
    slug: "enterprise",
    name_en: "Enterprise",
    name_es: "Enterprise",
    description_en: "Custom scaling and ultimate access",
    description_es: "Escalamiento personalizado y acceso total",
    price_monthly: 197,
    items_en: [
      "All apps included",
      "Unlimited generations",
      "24/7 Priority support",
      "Early access to new apps",
      "Personalized onboarding session"
    ],
    items_es: [
      "Todas las apps incluidas",
      "Generaciones ilimitadas",
      "Soporte prioritario 24/7",
      "Acceso anticipado a nuevas apps",
      "Sesión de onboarding personalizada"
    ],
    sort_order: 4,
    is_active: true
  };

  // 1. Insert or Upsert the Plan
  const { data: newPlan, error: insertError } = await supabase
    .from('plans')
    .upsert(planData, { onConflict: 'slug' })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error inserting plan:', insertError);
    return;
  }

  const newPlanId = newPlan.id;
  console.log('Enterprise Plan created with ID:', newPlanId);

  // 2. Fetch all apps
  const { data: apps, error: appsError } = await supabase.from('micro_apps').select('id');
  if (appsError) {
    console.error('Error fetching apps:', appsError);
    return;
  }

  // 3. Map apps to the enterprise plan
  console.log('Inserting mappings into plan_apps...');
  // First delete any existing just in case (for idempotency)
  await supabase.from('plan_apps').delete().eq('plan_id', newPlanId);

  const mappings = apps.map(app => ({
    plan_id: newPlanId,
    app_id: app.id
  }));

  const { error: mappingError } = await supabase
    .from('plan_apps')
    .insert(mappings);

  if (mappingError) {
    console.error('Error mappings plan_apps:', mappingError);
  } else {
    console.log(`Successfully mapped ${mappings.length} apps to Enterprise plan.`);
  }
}

main().catch(console.error);
