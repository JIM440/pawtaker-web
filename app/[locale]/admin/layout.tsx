import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import TopbarLangToggle from '@/components/admin/TopbarLangToggle';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;
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
    <div className="min-h-screen bg-background-base flex">
      <AdminSidebar pathname={pathname} locale={locale} />
      <main className="flex-1 flex flex-col min-h-screen md:max-h-screen">
        <header className="h-16 border-b border-outline/20 bg-surface-container-lowest px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1 max-w-xl ml-12 md:ml-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="search"
                placeholder="Search across admin..."
                className="w-full bg-background-base border border-outline/30 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <TopbarLangToggle locale={locale} />
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline/30 bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="text-sm">🔔</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
