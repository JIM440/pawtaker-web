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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center px-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline/30 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-2">Admin Login</h1>
        <p className="text-gray-500 text-sm mb-8">PawTaker administration panel</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-outline/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={DEFAULT_ADMIN_EMAIL}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-outline/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="space-y-2">
              <p className="text-on-error text-sm bg-error-container px-3 py-2 rounded-lg">{error}</p>
              {(error.toLowerCase().includes('invalid') || error.toLowerCase().includes('credential')) && (
                <p className="text-on-surface/80 text-xs">
                  Ensure the user exists in Supabase: Dashboard → Authentication → Users. Use &quot;Add user&quot; with this email and password, then add a row in <code className="bg-black/5 px-1 rounded">users</code> with <code className="bg-black/5 px-1 rounded">is_admin = true</code>. See <code className="bg-black/5 px-1 rounded">ADMIN_SETUP.md</code>.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
