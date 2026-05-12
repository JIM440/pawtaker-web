create extension if not exists pgcrypto;

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content_html text not null,
  cover_image_url text,
  is_published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
before update on public.blogs
for each row
execute function public.set_updated_at();

alter table public.blogs enable row level security;

drop policy if exists "Published blogs are readable by everyone" on public.blogs;
create policy "Published blogs are readable by everyone"
on public.blogs
for select
to anon, authenticated
using (is_published = true);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public blog images are viewable" on storage.objects;
create policy "Public blog images are viewable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-images');
