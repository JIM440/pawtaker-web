import { NextResponse } from 'next/server';
import type { Locale } from '@/lib/i18n/config';
import { getPublishedBlogs } from '@/lib/blogs';

function resolveLocale(value: string | null): Locale {
  return value === 'fr' || value === 'en' ? value : 'en';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = resolveLocale(searchParams.get('locale'));
    const blogs = await getPublishedBlogs(locale);
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('[api/blogs] GET', error);
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 });
  }
}
