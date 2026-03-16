# PawTaker Web — Claude Code Guidelines

## Project Overview
Next.js admin panel + marketing website for PawTaker.
- **Stack:** Next.js 16.1.6, React 19, TypeScript 5, Tailwind CSS v4
- **Auth:** Supabase Auth (email/password, admin flag on `users` table)
- **DB:** Same Supabase project as mobile app
- **i18n:** next-intl (EN + FR)

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
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Colour Palette (matches mobile)
| Token | Hex |
|-------|-----|
| primary | #1A3C5E |
| primaryLight | #4A90D9 |
| accent | #F5A623 |
| success | #27AE60 |
| warning | #E67E22 |
| danger | #C0392B |
| background | #F8F9FA |
| textPrimary | #1A1A2E |
| textSecondary | #6B7280 |

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
