import { headers } from 'next/headers';

// Route protection disabled: all admin routes are open.
// Provides shared sidebar + topbar shell for all admin screens.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;
  const isLoginPage = pathWithoutLocale.startsWith('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/kyc', label: 'KYC Review' },
    { href: '/admin/requests', label: 'Care Requests' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background-base flex">
      <aside className="w-64 bg-primary text-on-primary flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            PT
          </div>
          <div>
            <span className="block text-xl font-bold">PawTaker</span>
            <span className="block text-xs text-white/70 mt-0.5">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathWithoutLocale === item.href || pathWithoutLocale.startsWith(item.href + '/');
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <a
          href="/admin/profile"
          className="px-6 py-4 border-t border-white/10 text-xs text-white/70 flex items-center justify-between hover:bg-white/10 transition-colors"
        >
          <div>
            <p className="font-semibold">Alex Admin</p>
            <p className="text-white/60 text-[11px]">Super Admin</p>
          </div>
          <span className="text-white/60">›</span>
        </a>
      </aside>
      <main className="flex-1 flex flex-col max-h-screen">
        <header className="h-16 border-b border-outline/20 bg-surface-container-lowest px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
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
