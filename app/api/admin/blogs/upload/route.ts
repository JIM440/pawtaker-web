import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

const BLOG_IMAGES_BUCKET = 'blog-images';

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: Request) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = sanitizeFileName(file.name.replace(/\.[^.]+$/, '')) || 'blog-image';
    const storagePath = `blogs/${Date.now()}-${fileName}.${fileExt}`;

    const storage = (admin as unknown as {
      storage: {
        from: (bucket: string) => {
          upload: (
            path: string,
            body: Buffer,
            options: { contentType: string; upsert: boolean }
          ) => Promise<{ error: { message: string } | null }>;
          getPublicUrl: (path: string) => { data: { publicUrl: string } };
        };
      };
    }).storage.from(BLOG_IMAGES_BUCKET);

    const { error } = await storage.upload(storagePath, fileBuffer, {
      contentType: file.type || 'image/png',
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = storage.getPublicUrl(storagePath);

    return NextResponse.json({ url: publicUrl, path: storagePath });
  } catch (error) {
    console.error('[api/admin/blogs/upload] POST', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
