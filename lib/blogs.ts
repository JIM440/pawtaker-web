import type { Locale } from '@/lib/i18n/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export type PublicBlogSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageSrc: string;
};

export type PublicBlogPost = PublicBlogSummary & {
  contentHtml: string;
};

type RawBlogRow = {
  id: string;
  slug: string;
  title: string;
  content_html: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_published: boolean | null;
};

function isMissingBlogsTableError(message: string): boolean {
  return message.includes("Could not find the table 'public.blogs'");
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReadTimeFromHtml(html: string): string {
  const wordCount = stripHtml(html)
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

function mapRowToPublicBlog(row: RawBlogRow): PublicBlogPost {
  const contentHtml = row.content_html?.trim() || '<p></p>';
  const excerpt = stripHtml(contentHtml).slice(0, 170).trim();
  const dateSource = row.published_at || row.created_at;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: excerpt.length > 160 ? `${excerpt.slice(0, 157)}...` : excerpt,
    date: formatDate(dateSource),
    readTime: formatReadTimeFromHtml(contentHtml),
    imageSrc: row.cover_image_url || '/hero_img_1.png',
    contentHtml,
  };
}

async function fetchPublishedBlogRows(): Promise<RawBlogRow[] | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    const supabase = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );
    const client = supabase as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          eq: (column: string, value: unknown) => {
            order: (
              column: string,
              options: { ascending: boolean; nullsFirst?: boolean }
            ) => Promise<{ data: RawBlogRow[] | null; error: { message: string } | null }>;
          };
          maybeSingle: () => Promise<{ data: RawBlogRow | null; error: { message: string } | null }>;
        };
      };
    };

    const { data, error } = await client
      .from('blogs')
      .select('id, slug, title, content_html, cover_image_url, created_at, updated_at, published_at, is_published')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) {
      if (isMissingBlogsTableError(error.message)) {
        return null;
      }
      console.warn('[blogs] failed to fetch published posts:', error.message);
      return null;
    }

    return data ?? [];
  } catch (error) {
    if (error instanceof Error && isMissingBlogsTableError(error.message)) {
      return null;
    }
    console.warn('[blogs] failed to fetch published posts:', error);
    return null;
  }
}

export async function getPublishedBlogs(locale: Locale): Promise<PublicBlogSummary[]> {
  void locale;
  const rows = await fetchPublishedBlogRows();
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((row) => {
    const post = mapRowToPublicBlog(row);
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readTime: post.readTime,
      imageSrc: post.imageSrc,
    };
  });
}

export async function getPublishedBlogBySlug(locale: Locale, slug: string): Promise<PublicBlogPost | null> {
  const rows = await fetchPublishedBlogRows();
  void locale;
  if (!rows || rows.length === 0) return null;

  const row = rows.find((entry) => entry.slug === slug);
  if (!row) {
    return null;
  }

  return mapRowToPublicBlog(row);
}
