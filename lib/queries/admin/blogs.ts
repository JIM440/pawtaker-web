'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ADMIN_BLOGS_QUERY_KEY = ['admin', 'blogs'] as const;

export type AdminBlogRow = {
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

export type AdminBlogInput = {
  title: string;
  contentHtml: string;
  coverImageUrl: string | null;
  isPublished?: boolean;
};

async function fetchAdminBlogs(): Promise<AdminBlogRow[]> {
  const res = await fetch('/api/admin/blogs', { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? 'Failed to fetch blogs.');
  return (json.blogs ?? []) as AdminBlogRow[];
}

export function useAdminBlogsQuery() {
  return useQuery({
    queryKey: ADMIN_BLOGS_QUERY_KEY,
    queryFn: fetchAdminBlogs,
  });
}

export function useCreateAdminBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AdminBlogInput) => {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to create blog.');
      return json.blog as AdminBlogRow;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_QUERY_KEY });
    },
  });
}

export function useUpdateAdminBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminBlogInput;
    }) => {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to update blog.');
      return json.blog as AdminBlogRow;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_QUERY_KEY });
    },
  });
}

export function useDeleteAdminBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to delete blog.');
      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_QUERY_KEY });
    },
  });
}
