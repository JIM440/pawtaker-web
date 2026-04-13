import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { createAdminClient } from '@/lib/supabase/admin';

type LocalePayload = {
  locale?: 'en' | 'fr';
};

export async function PUT(request: Request) {
  try {
    const { locale } = (await request.json()) as LocalePayload;

    if (locale !== 'en' && locale !== 'fr') {
      return NextResponse.json({ error: 'Locale must be "en" or "fr".' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const authClient = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ persisted: false }, { status: 401 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('users')
      .update({
        language: locale,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ persisted: true });
  } catch (error) {
    console.error('[api/locale] PUT', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
