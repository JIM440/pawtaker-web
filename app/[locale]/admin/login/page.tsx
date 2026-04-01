'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AppButton from '@/components/ui/AppButton';

/**
 * Test admin login (ensure this user exists in Supabase Auth and in `users` with is_admin = true):
 * Email: pawtaker.test.email@gmail.com
 * Password: PawTaker2025##
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations('admin.login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-background-base flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white/90 backdrop-blur rounded-2xl shadow-xl shadow-primary/5 border border-outline/30 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-3">
            <Image
              src="/logos/logomark-dusty-plum.svg"
              alt="PawTaker admin"
              width={72}
              height={72}
              className="size-[72px]"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-1 tracking-tight">PawTaker</h1>
          <p className="text-on-surface/70 text-sm">{t('welcome')}</p>
          <div className="inline-flex items-center gap-2 mt-4 rounded-full px-3 py-1 bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {t('secureAccess')}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline/70" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-3 bg-white border border-outline/40 rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-on-surface/50 text-sm"
                placeholder="admin@pawtaker.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-on-surface">{t('password')}</label>
              <a
                className="text-xs font-semibold text-primary hover:underline"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {t('forgotPassword')}
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline/70" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-12 py-3 bg-white border border-outline/40 rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-on-surface/50 text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5 text-on-surface/60"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="space-y-2">
              <p className="text-on-error text-sm bg-error-container px-3 py-2 rounded-lg">{error}</p>
              {(error.toLowerCase().includes('invalid') || error.toLowerCase().includes('credential')) && (
                <p className="text-on-surface/80 text-xs">
                  Ensure the user exists in Supabase: Dashboard -&gt; Authentication -&gt; Users. Use
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
            <label htmlFor="remember" className="text-sm text-on-surface/70">{t('keepAuthenticated')}</label>
          </div>

          <AppButton
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={
              loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              )
            }
          >
            {loading ? t('submitting') : t('submit')}
          </AppButton>
        </form>

        <div className="mt-8 border-t border-outline/20 pt-4 text-center text-xs text-on-surface/60">
          <p>© 2026 PawTaker. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a
              className="hover:text-primary transition-colors"
              href="/en/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              className="hover:text-primary transition-colors"
              href="/en/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
