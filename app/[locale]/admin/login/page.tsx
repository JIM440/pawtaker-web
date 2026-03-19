'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Test admin login (ensure this user exists in Supabase Auth and in `users` with is_admin = true):
 * Email: pawtaker.test.email@gmail.com
 * Password: PawTaker2025##
 */
const DEFAULT_ADMIN_EMAIL = 'pawtaker.test.email@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    // Step 1: authenticate credentials
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Step 2: verify the user has is_admin = true in public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      // Valid Supabase user but not an admin — sign them out immediately
      await supabase.auth.signOut();
      setError('Access denied. This account does not have admin privileges.');
      setLoading(false);
      return;
    }

    // Step 3: admin confirmed — proceed to dashboard
    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <header className="w-full px-6 py-4 flex items-center justify-between bg-surface-container-lowest/70 backdrop-blur-sm border-b border-outline/30">
        <div className="flex items-center gap-2 text-primary">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold tracking-tight">PawTaker</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl shadow-xl shadow-primary/5 border border-outline/30 p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
            <p className="text-on-surface/70 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/70 text-sm">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-surface-container-lowest border border-outline/40 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-on-surface/40 text-sm"
                  placeholder="admin@pawtaker.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-on-surface">Password</label>
                <a className="text-xs font-semibold text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/70 text-sm">
                  🔒
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-surface-container-lowest border border-outline/40 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-on-surface/40 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="space-y-2">
                <p className="text-on-error text-sm bg-error-container px-3 py-2 rounded-lg">
                  {error}
                </p>
                {(error.toLowerCase().includes('invalid') ||
                  error.toLowerCase().includes('credential')) && (
                  <p className="text-on-surface/80 text-xs">
                    Ensure the user exists in Supabase: Dashboard → Authentication → Users. Use
                    &quot;Add user&quot; with this email and password, then add a row in{' '}
                    <code className="bg-black/5 px-1 rounded">users</code> with{' '}
                    <code className="bg-black/5 px-1 rounded">is_admin = true</code>. See{' '}
                    <code className="bg-black/5 px-1 rounded">ADMIN_SETUP.md</code>.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="rounded border-outline/60 text-primary focus:ring-primary h-4 w-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-on-surface/70">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <span className="text-lg">{loading ? '⏳' : '→'}</span>
            </button>
          </form>

        </div>
      </main>

      <footer className="py-6 text-center text-xs text-on-surface/60">
        <p>© 2024 PawTaker Management Systems. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Security Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
