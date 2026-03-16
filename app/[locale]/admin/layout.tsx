import { headers } from 'next/headers';

// Route protection disabled: all admin routes are open; sidebar always shown.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;
  const isLoginPage = pathWithoutLocale.startsWith('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background-base flex">
      <aside className="w-64 bg-primary text-on-primary flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="text-xl font-bold">PawTaker</span>
          <span className="block text-xs text-white/60 mt-0.5">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
            { href: '/admin/users', label: 'Users', icon: '👥' },
            { href: '/admin/kyc', label: 'KYC Review', icon: '🪪' },
            { href: '/admin/requests', label: 'Care Requests', icon: '🐾' },
            { href: '/admin/reports', label: 'Reports', icon: '🚩' },
            { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50">
          Admin
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
