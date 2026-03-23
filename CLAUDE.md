# PawTaker Web — Claude Code Guidelines

## Project Overview
Next.js admin panel + marketing website for PawTaker.
- **Stack:** Next.js 16.1.6, React 19, TypeScript 5, Tailwind CSS v4
- **Auth:** Supabase Auth (email/password, admin flag on `users` table)
- **DB:** Same Supabase project as mobile app
- **i18n:** next-intl (EN + FR) — see **[docs/i18n.md](docs/i18n.md)** for translations, `localStorage`, and `NEXT_LOCALE` cookie behavior

## Owner
- Web/Admin: Fabrice

## ⚠️ Action Required
Delete `app/page.tsx` — it conflicts with `app/(marketing)/page.tsx` at route `/`.
The home route is served by `app/(marketing)/page.tsx`.

## Folder Structure
```
app/
  (marketing)/         ← Public marketing pages (/ /about /how-it-works)
  (admin)/             ← Admin panel (requires is_admin = true)
components/
  ui/                  ← shadcn/ui primitives (TBD)
  admin/               ← Admin-specific components
  marketing/           ← Marketing-specific components
lib/
  supabase/
    client.ts          ← Browser client (public anon key)
    server.ts          ← Server client (service role, RSC only)
    types.ts           ← Database types
  i18n/
    config.ts          ← next-intl config
    messages/          ← EN + FR JSON files
middleware.ts          ← next-intl + admin route guard
```

## Supabase Client Usage
```ts
// In Server Components / Server Actions (RSC):
import { createAdminClient } from '@/lib/supabase/server';
const supabase = await createAdminClient(); // service role

// In Client Components:
import { createClient } from '@/lib/supabase/client';
const supabase = createClient(); // anon key
```

## Admin Auth
- Supabase Auth + `is_admin` flag on `users` table
- `(admin)/layout.tsx` is a Server Component that checks session + admin flag
- `middleware.ts` double-checks admin routes
- Admin login at `/admin/login`

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (same public key)
SUPABASE_SERVICE_ROLE_KEY=
```
Public client code uses **`getSupabasePublicKey()`** (`lib/supabase/public-env.ts`): it prefers `PUBLISHABLE_DEFAULT_KEY` then falls back to `ANON_KEY`. Set **one** of them in production or login returns **401 Invalid API key**.

## Colour Palette
| Token | Hex | Usage |
|-------|-----|-------|
| primary | #8c4a60 | Main brand colour — buttons, links, active states, headings |
| secondary | #74565f | Secondary actions, verified badges, borders on CTAs |
| tertiary | #7c5635 | Warm accent — metric highlights, step numbers |
| error | #ba1a1a | Destructive actions, error states |
| background-light | #f5f0f0 | Page/section backgrounds |
| background-dark | #1c1618 | Dark mode backgrounds |
| outline-custom | #837377 | Borders and dividers (use at /20 opacity: `border-[#837377]/20`) |
| text-primary | slate-900 | Headings and body text |
| text-secondary | slate-500 | Subtitles, captions, secondary labels |

## Route Map
| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/about` | About page |
| `/how-it-works` | How it works |
| `/admin/login` | Admin login (public) |
| `/admin/dashboard` | Metrics dashboard |
| `/admin/users` | User management |
| `/admin/kyc` | KYC review queue |
| `/admin/requests` | Care requests overview |
| `/admin/reports` | User reports |
| `/admin/settings` | App settings |
