import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserAccessibleApps } from '@/lib/access';
import { AppsGrid } from '@/components/apps/AppsGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AppsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obtenemos los slugs de apps a las que el usuario tiene acceso real
  let accessibleSlugs: string[] = [];
  try {
    accessibleSlugs = await getUserAccessibleApps(user.id);
  } catch (e) {
    console.error("Error checking access:", e);
  }

  // Obtenemos todas las aplicaciones de la base de datos
  const { data: apps, error } = await supabase
    .from('micro_apps')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching micro_apps:", error);
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Error al cargar aplicaciones</h2>
        <p className="text-white/60 mb-8">{error.message}</p>
        <a href="/dashboard" className="px-6 py-2 bg-primary rounded-xl text-white">Volver al Inicio</a>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8 animate-entrance">
      <AppsGrid apps={apps || []} accessibleSlugs={accessibleSlugs} />
    </div>
  );
}
