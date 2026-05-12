'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, MoreHorizontal, Pencil, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import BlogRichTextEditor from '@/components/admin/BlogRichTextEditor';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import LabeledSearch from '@/components/admin/LabeledSearch';
import LabeledSelect from '@/components/admin/LabeledSelect';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/ToastProvider';
import {
  useAdminBlogsQuery,
  useCreateAdminBlogMutation,
  useDeleteAdminBlogMutation,
  useUpdateAdminBlogMutation,
  type AdminBlogInput,
  type AdminBlogRow,
} from '@/lib/queries/admin/blogs';

type BlogSort = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
type BlogStatusFilter = 'all' | 'published' | 'draft';

type BlogFormState = {
  title: string;
  contentHtml: string;
  coverImageUrl: string;
};

function ModalShell({
  title,
  subtitle,
  children,
  onClose,
  closeLabel,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label={closeLabel} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-outline/10 px-6 py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">{title}</h2>
              {subtitle ? <p className="mt-2 text-sm text-on-surface/65">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-on-surface/60 transition-colors hover:bg-surface-container hover:text-on-surface"
              aria-label={closeLabel}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="overflow-x-auto px-6 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function formatDisplayDate(value: string | null, locale: string, draftLabel: string) {
  if (!value) return draftLabel;
  return new Date(value).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReadTimeFromHtml(html: string, suffix: string) {
  const wordCount = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} ${suffix}`;
}

function BlogPreviewModal({
  blog,
  onEdit,
  onPublish,
  onDelete,
  onClose,
}: {
  blog: AdminBlogRow;
  onEdit: (blog: AdminBlogRow) => void;
  onPublish: (blog: AdminBlogRow) => void;
  onDelete: (blog: AdminBlogRow) => void;
  onClose: () => void;
}) {
  const t = useTranslations('admin.blogs');
  const locale = useLocale();
  return (
    <ModalShell title={blog.title} subtitle={`${t('slugLabel')}: ${blog.slug}`} onClose={onClose} closeLabel={t('closeDialog')}>
      <div className="min-w-0 space-y-6">
        {blog.cover_image_url ? (
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="h-auto w-full rounded-2xl object-cover"
          />
        ) : null}
        <div className="flex items-center justify-between gap-4 text-sm text-on-surface/60">
          <div className="flex flex-wrap items-center gap-3">
            <span>{formatDisplayDate(blog.published_at ?? blog.created_at, locale, t('statusDraft'))}</span>
            <span>{blog.is_published ? t('statusPublished') : t('statusDraft')}</span>
          </div>
          <BlogActionsMenu
            blog={blog}
            onView={() => {}}
            onEdit={onEdit}
            onPublish={onPublish}
            onDelete={onDelete}
          />
        </div>
        <div className="overflow-x-auto">
          <article className="blog-content min-w-0" dangerouslySetInnerHTML={{ __html: blog.content_html }} />
        </div>
      </div>
    </ModalShell>
  );
}

function BlogFormModal({
  mode,
  initialBlog,
  onClose,
  onSubmit,
}: {
  mode: 'create' | 'edit';
  initialBlog?: AdminBlogRow | null;
  onClose: () => void;
  onSubmit: (payload: AdminBlogInput) => Promise<void>;
}) {
  const t = useTranslations('admin.blogs');
  const { showToast } = useToast();
  const [form, setForm] = useState<BlogFormState>({
    title: initialBlog?.title ?? '',
    contentHtml: initialBlog?.content_html ?? '<p></p>',
    coverImageUrl: initialBlog?.cover_image_url ?? '',
  });
  const [isPublished, setIsPublished] = useState(initialBlog?.is_published ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const plainTextContent = useMemo(
    () => form.contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    [form.contentHtml]
  );

  const imagePreviewUrl = useMemo(() => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    return form.coverImageUrl;
  }, [form.coverImageUrl, selectedImage]);

  useEffect(() => {
    return () => {
      if (selectedImage && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl, selectedImage]);

  async function uploadImage(file: File) {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch('/api/admin/blogs/upload', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? 'Failed to upload image.');
    return json.url as string;
  }

  async function handleSubmit() {
    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      showToast(t('titleRequired'), 'error');
      return;
    }

    if (!plainTextContent) {
      showToast(t('contentRequired'), 'error');
      return;
    }

    if (!selectedImage && !form.coverImageUrl) {
      showToast(t('coverImageRequired'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let coverImageUrl = form.coverImageUrl.trim() || null;
      if (selectedImage) {
        coverImageUrl = await uploadImage(selectedImage);
      }

      await onSubmit({
        title: trimmedTitle,
        contentHtml: form.contentHtml,
        coverImageUrl,
        isPublished,
      });
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('saveFailed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={mode === 'create' ? 'Create blog' : 'Edit blog'}
      subtitle={mode === 'create' ? t('createSubtitle') : t('editSubtitle')}
      onClose={onClose}
      closeLabel={t('closeDialog')}
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">{t('fieldTitle')}</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                className="w-full rounded-2xl border border-outline/20 px-4 py-3 text-[#665459] outline-none ring-primary/20 placeholder:text-[#665459]/45 focus-visible:ring-2"
                placeholder={t('titlePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">{t('fieldContent')}</label>
              <BlogRichTextEditor
                value={form.contentHtml}
                onChange={(next) => setForm((current) => ({ ...current, contentHtml: next }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">{t('fieldCoverImage')}</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-outline/30 bg-surface-container-lowest px-4 py-4 text-sm font-semibold text-on-surface">
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                {selectedImage ? selectedImage.name : form.coverImageUrl ? t('replaceImage') : t('chooseImage')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedImage(file);
                  }}
                />
              </label>
              <p className="text-xs text-on-surface/60">
                {t('uploadHint', { action: mode === 'create' ? t('createBlog') : t('saveChanges') })}
              </p>
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt={t('coverPreviewAlt')}
                  className="h-auto w-full rounded-2xl border border-outline/10 object-cover"
                />
              ) : null}
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-outline/15 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="size-4 rounded border-outline/30"
              />
              {t('publishImmediately')}
            </label>

            <div className="rounded-2xl border border-outline/15 bg-surface-container-lowest px-4 py-4 text-sm text-on-surface/70">
              <p className="font-semibold text-on-surface">{t('previewDetails')}</p>
              <p className="mt-2">{t('slugGenerated')}</p>
              <p className="mt-2">{t('excerptGenerated')}</p>
              <p className="mt-2">{t('coverIsRequired')}</p>
              <p className="mt-2">{t('wordCount', { count: plainTextContent ? plainTextContent.split(/\s+/).length : 0 })}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-outline/20 px-5 py-3 text-sm font-semibold text-on-surface"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary disabled:opacity-60"
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : t('saving')
              : mode === 'create'
                ? t('createBlog')
                : t('saveChanges')}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function BlogActionsMenu({
  blog,
  onView,
  onEdit,
  onPublish,
  onDelete,
}: {
  blog: AdminBlogRow;
  onView: (blog: AdminBlogRow) => void;
  onEdit: (blog: AdminBlogRow) => void;
  onPublish: (blog: AdminBlogRow) => void;
  onDelete: (blog: AdminBlogRow) => void;
}) {
  const t = useTranslations('admin.blogs');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-full p-2.5 text-on-surface/55 transition-colors hover:bg-surface-container hover:text-on-surface"
        aria-label={t('openActions')}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-[180px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(blog);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-lowest"
          >
            <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('editBlog')}
          </button>
          {!blog.is_published ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onPublish(blog);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-lowest"
            >
              <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t('makePublic')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(blog);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('deleteBlog')}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BlogCard({ blog, onView, onEdit, onPublish, onDelete }: {
  blog: AdminBlogRow;
  onView: (blog: AdminBlogRow) => void;
  onEdit: (blog: AdminBlogRow) => void;
  onPublish: (blog: AdminBlogRow) => void;
  onDelete: (blog: AdminBlogRow) => void;
}) {
  const t = useTranslations('admin.blogs');
  const locale = useLocale();
  return (
    <article className="group relative rounded-[20px] border border-outline/15 bg-[#fffafa] p-1 shadow-sm transition-colors hover:border-outline/25">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onView(blog)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onView(blog);
          }
        }}
        className="block w-full text-left"
        aria-label={t('viewBlog', { title: blog.title })}
      >
      <div className="relative overflow-hidden rounded-[16px] rounded-bl-[4px] rounded-br-[4px] border border-outline/10 bg-surface-container-lowest">
        {blog.cover_image_url ? (
          <img src={blog.cover_image_url} alt={blog.title} className="h-[236px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-[236px] items-center justify-center text-sm text-on-surface/45">{t('noImage')}</div>
        )}
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-start justify-between gap-3 text-[13px] font-medium tracking-[-0.2px] text-[#665459]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                blog.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {blog.is_published ? t('statusPublished') : t('statusDraft')}
            </span>
            <span>{formatDisplayDate(blog.published_at ?? blog.created_at, locale, t('statusDraft'))}</span>
          </div>
          <div
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <BlogActionsMenu blog={blog} onView={onView} onEdit={onEdit} onPublish={onPublish} onDelete={onDelete} />
          </div>
        </div>
        <h2 className="line-clamp-2 text-[20px] font-bold leading-7 tracking-[-0.1px] text-[#3d2d32] group-hover:underline">
          {blog.title}
        </h2>
        <p className="break-all text-[12px] leading-5 tracking-[-0.15px] text-[#8a767c]">/{blog.slug}</p>
        <p className="line-clamp-3 text-[14px] leading-5 tracking-[-0.2px] text-[#665459]">{blog.excerpt}</p>
        <p className="text-[14px] font-medium tracking-[-0.2px] text-[#665459]">{formatReadTimeFromHtml(blog.content_html, t('minRead'))}</p>
      </div>
      </div>
    </article>
  );
}

export default function AdminBlogsPage() {
  const t = useTranslations('admin.blogs');
  const { showToast } = useToast();
  const blogsQuery = useAdminBlogsQuery();
  const createMutation = useCreateAdminBlogMutation();
  const updateMutation = useUpdateAdminBlogMutation();
  const deleteMutation = useDeleteAdminBlogMutation();
  const [sort, setSort] = useState<BlogSort>('date-desc');
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlogRow | null>(null);
  const [previewBlog, setPreviewBlog] = useState<AdminBlogRow | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<AdminBlogRow | null>(null);
  const [publishBlog, setPublishBlog] = useState<AdminBlogRow | null>(null);

  const blogs = useMemo(() => blogsQuery.data ?? [], [blogsQuery.data]);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = blogs.filter((blog) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
            ? blog.is_published
            : !blog.is_published;
      const haystack = [blog.title, blog.slug, blog.excerpt].join(' ').toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'title-desc') return b.title.localeCompare(a.title);
      const aDate = new Date(a.published_at ?? a.created_at).getTime();
      const bDate = new Date(b.published_at ?? b.created_at).getTime();
      return sort === 'date-asc' ? aDate - bDate : bDate - aDate;
    });

    return result;
  }, [blogs, search, sort, statusFilter]);

  async function handleCreate(payload: AdminBlogInput) {
    await createMutation.mutateAsync(payload);
    showToast(t('createdSuccess'), 'success');
  }

  async function handleUpdate(payload: AdminBlogInput) {
    if (!editingBlog) return;
    await updateMutation.mutateAsync({ id: editingBlog.id, payload });
    showToast(t('updatedSuccess'), 'success');
  }

  async function handleDelete() {
    if (!deleteBlog) return;
    try {
      await deleteMutation.mutateAsync(deleteBlog.id);
      showToast(t('deletedSuccess'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('deleteFailed'), 'error');
    }
    setDeleteBlog(null);
  }

  async function handlePublish() {
    if (!publishBlog) return;
    try {
      await updateMutation.mutateAsync({
        id: publishBlog.id,
        payload: {
          title: publishBlog.title,
          contentHtml: publishBlog.content_html,
          coverImageUrl: publishBlog.cover_image_url,
          isPublished: true,
        },
      });
      showToast(t('publishedSuccess'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('publishFailed'), 'error');
    }
    setPublishBlog(null);
  }

  return (
    <>
      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="w-full lg:min-w-[320px]">
              <LabeledSearch
                id="blogs-search"
                label={t('searchLabel')}
                value={search}
                placeholder={t('searchPlaceholder')}
                onChange={setSearch}
              />
            </div>
            <div className="w-full lg:w-auto">
              <LabeledSelect
                id="blogs-status"
                label={t('statusLabel')}
                value={statusFilter}
                onChange={(next) => setStatusFilter(next as BlogStatusFilter)}
                options={[
                  { value: 'all', label: t('allStatuses') },
                  { value: 'published', label: t('statusPublished') },
                  { value: 'draft', label: t('statusDraft') },
                ]}
              />
            </div>
            <div className="w-full lg:w-auto">
              <LabeledSelect
                id="blogs-sort"
                label={t('sortLabel')}
                value={sort}
                onChange={(next) => setSort(next as BlogSort)}
                options={[
                  { value: 'date-desc', label: t('sortNewest') },
                  { value: 'date-asc', label: t('sortOldest') },
                  { value: 'title-asc', label: t('sortTitleAsc') },
                  { value: 'title-desc', label: t('sortTitleDesc') },
                ]}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('createBlog')}
          </button>
        </div>

        {blogsQuery.isError ? (
          <div className="rounded-2xl border border-outline/20 bg-white px-6 py-10 text-center text-on-surface/60 shadow-sm">
            {blogsQuery.error instanceof Error ? blogsQuery.error.message : t('loadFailed')}
          </div>
        ) : null}

        {blogsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-[20px] border border-outline/15 bg-[#fffafa] p-1 shadow-sm">
                <div className="rounded-[16px] rounded-bl-[4px] rounded-br-[4px]">
                  <Skeleton className="h-[236px] w-full rounded-[16px] rounded-bl-[4px] rounded-br-[4px]" />
                </div>
                <div className="space-y-3 px-5 py-5">
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-7 w-11/12 rounded-full" />
                  <Skeleton className="h-7 w-8/12 rounded-full" />
                  <Skeleton className="h-4 w-1/2 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-10/12 rounded-full" />
                  <Skeleton className="h-4 w-8/12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!blogsQuery.isLoading && !blogsQuery.isError && filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-outline/20 bg-white px-6 py-10 text-center text-on-surface/60 shadow-sm">
            {t('emptyState')}
          </div>
        ) : null}

        {!blogsQuery.isLoading && !blogsQuery.isError && filteredBlogs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onView={setPreviewBlog}
                onEdit={setEditingBlog}
                onPublish={setPublishBlog}
                onDelete={setDeleteBlog}
              />
            ))}
          </div>
        ) : null}
      </div>

      {createOpen ? (
        <BlogFormModal mode="create" onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
      ) : null}

      {editingBlog ? (
        <BlogFormModal
          mode="edit"
          initialBlog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSubmit={handleUpdate}
        />
      ) : null}

      {previewBlog ? (
        <BlogPreviewModal
          blog={previewBlog}
          onEdit={(blog) => {
            setPreviewBlog(null);
            setEditingBlog(blog);
          }}
          onPublish={(blog) => {
            setPreviewBlog(null);
            setPublishBlog(blog);
          }}
          onDelete={(blog) => {
            setPreviewBlog(null);
            setDeleteBlog(blog);
          }}
          onClose={() => setPreviewBlog(null)}
        />
      ) : null}

      <ConfirmationModal
        isOpen={Boolean(publishBlog)}
        title={t('publishConfirmTitle')}
        description={t('publishConfirmDesc')}
        confirmLabel={updateMutation.isPending ? t('publishing') : t('makePublic')}
        cancelLabel={t('cancel')}
        confirmDisabled={updateMutation.isPending}
        isLoading={updateMutation.isPending}
        onConfirm={() => void handlePublish()}
        onCancel={() => {
          if (!updateMutation.isPending) setPublishBlog(null);
        }}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteBlog)}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDesc')}
        confirmLabel={deleteMutation.isPending ? t('deleting') : t('delete')}
        cancelLabel={t('cancel')}
        tone="danger"
        confirmDisabled={deleteMutation.isPending}
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleteMutation.isPending) setDeleteBlog(null);
        }}
      />
    </>
  );
}
