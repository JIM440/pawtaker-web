import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeaderActions from '@/components/admin/AdminHeaderActions';
import AdminPageHeading from '@/components/admin/AdminPageHeading';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)(?=\/|$)/, '') || pathname;
  const isLoginPage = pathWithoutLocale.startsWith('/admin/login');

  // Login page renders without the shell and without auth checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  // --- Auth guard (runs on every admin page except login) ---

  const supabase = await createAdminClient();

  // 1. Check there is a valid session (validates the JWT from cookies)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // 2. Check the user has is_admin = true in public.users
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    // Valid Supabase session but not an admin — boot them out
    redirect(`/${locale}/admin/login`);
  }

  // --- Admin confirmed — render the shell ---
  return (
    <div className="min-h-screen bg-background-base flex overflow-x-hidden">
      <AdminSidebar pathname={pathname} adminEmail={user.email ?? ''} />
      <main className="flex-1 min-w-0 min-h-0 flex flex-col pt-16 md:max-h-screen">
        <header className="h-16 border-b border-outline/20 bg-white/80 backdrop-blur-sm px-4 md:px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-20 md:left-64">
          <div className="ml-12 md:ml-0">
            <AdminPageHeading />
          </div>
          <div className="ml-4">
            <AdminHeaderActions />
          </div>
        </header>
        <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
