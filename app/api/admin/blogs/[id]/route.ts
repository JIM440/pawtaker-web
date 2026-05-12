import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_published: boolean;
};

function isMissingBlogsTableError(message: string): boolean {
  return message.includes("Could not find the table 'public.blogs'");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

function sanitizeBlogHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function createExcerpt(html: string): string {
  const plainText = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= 170) return plainText;
  return `${plainText.slice(0, 167).trim()}...`;
}

async function createUniqueSlug(
  client: {
    from: (table: string) => {
      select: (query: string) => {
        eq: (column: string, value: unknown) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
        };
      };
    };
  },
  title: string,
  excludeId: string
) {
  const baseSlug = slugify(title) || `blog-${Date.now()}`;
  let slug = baseSlug;
  let attempt = 1;

  while (attempt < 20) {
    const { data } = await client.from('blogs').select('id').eq('slug', slug).maybeSingle();
    if (!data || data.id === excludeId) {
      return slug;
    }

    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await params;

    const body = (await req.json()) as {
      title?: string;
      contentHtml?: string;
      coverImageUrl?: string | null;
      isPublished?: boolean;
    };

    const title = body.title?.trim();
    const sanitizedHtml = sanitizeBlogHtml(body.contentHtml ?? '');
    const coverImageUrl = body.coverImageUrl?.trim() || null;
    const isPublished = body.isPublished ?? true;

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    if (!sanitizedHtml) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    const client = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          eq: (column: string, value: unknown) => {
            maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
          };
        };
        update: (
          payload: Record<string, unknown>
        ) => {
          eq: (column: string, value: unknown) => {
            select: (query: string) => {
              single: () => Promise<{ data: BlogRow | null; error: { message: string } | null }>;
            };
          };
        };
        delete: () => {
          eq: (column: string, value: unknown) => Promise<{ error: { message: string } | null }>;
        };
      };
    };

    const slug = await createUniqueSlug(client, title, id);

    const { data, error } = await client
      .from('blogs')
      .update({
        slug,
        title,
        excerpt: createExcerpt(sanitizedHtml),
        content_html: sanitizedHtml,
        cover_image_url: coverImageUrl,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select('id, slug, title, excerpt, content_html, cover_image_url, created_at, updated_at, published_at, is_published')
      .single();

    if (error) {
      if (isMissingBlogsTableError(error.message)) {
        return NextResponse.json(
          { error: 'Blogs table not found. Run the SQL in supabase/blogs.sql in your Supabase SQL editor first.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data });
  } catch (error) {
    console.error('[api/admin/blogs/[id]] PATCH', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await params;

    const client = admin as unknown as {
      from: (table: string) => {
        delete: () => {
          eq: (column: string, value: unknown) => Promise<{ error: { message: string } | null }>;
        };
      };
    };

    const { error } = await client.from('blogs').delete().eq('id', id);

    if (error) {
      if (isMissingBlogsTableError(error.message)) {
        return NextResponse.json(
          { error: 'Blogs table not found. Run the SQL in supabase/blogs.sql in your Supabase SQL editor first.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/blogs/[id]] DELETE', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
