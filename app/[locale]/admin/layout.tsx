import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminHeaderActions from '@/components/admin/AdminHeaderActions';
import AdminPageHeading from '@/components/admin/AdminPageHeading';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { NotificationProvider } from '@/components/admin/NotificationProvider';
import { PushSubscriber } from '@/components/admin/PushSubscriber';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import ToastProvider from '@/components/ui/ToastProvider';
import { createAdminClient } from '@/lib/supabase/server';

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

  // Login page renders without the shell and without auth checks.
  if (isLoginPage) {
    return <>{children}</>;
  }

  const supabase = await createAdminClient();

  // 1. Check there is a valid session (validates the JWT from cookies).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // 2. Check the user has is_admin = true in public.users.
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <ReactQueryProvider>
      <ToastProvider>
        <NotificationProvider>
          <PushSubscriber />
          <Toaster position="bottom-right" richColors closeButton />
          <div className="fixed inset-0 flex overflow-hidden bg-background-base">
            <AdminSidebar pathname={pathname} adminEmail={user.email ?? ''} />
            <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pt-16">
              <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-outline/20 bg-white/80 px-4 backdrop-blur-sm md:left-64 md:px-8">
                <div className="ml-12 md:ml-0">
                  <AdminPageHeading />
                </div>
                <div className="ml-4">
                  <AdminHeaderActions />
                </div>
              </header>
              <div className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto">
                {children}
              </div>
            </main>
          </div>
        </NotificationProvider>
      </ToastProvider>
    </ReactQueryProvider>
  );
}
