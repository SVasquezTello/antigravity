import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserAccessibleApps } from '@/lib/access';
import { MicroAppRunner } from '@/components/apps/MicroAppRunner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MicroAppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const accessibleSlugs = await getUserAccessibleApps(user.id);
  if (!accessibleSlugs.includes(slug)) {
    redirect('/plans');
  }

  return (
    <div className="h-full w-full flex flex-col">
      <MicroAppRunner appSlug={slug} />
    </div>
  );
}
