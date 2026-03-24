# PawTaker Web - Project Overview

This document explains the current state of the `pawtaker-web` project as a whole: what it contains, how it is structured, and how it works today.

---

## 1) What this project is

`pawtaker-web` is the web surface of PawTaker. It currently includes:

- A public marketing site (localized EN/FR).
- A web admin panel for platform operations.
- API routes used by the admin panel.
- Shared i18n, styling, and Supabase integration utilities.

The mobile app is a separate codebase, but this web project uses the same backend concepts (`users`, `kyc_submissions`, etc.).

---

## 2) Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS v4 + `lucide-react`
- **i18n**: `next-intl` (EN/FR)
- **Backend**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Data fetching/cache**: TanStack React Query

---

## 3) High-level architecture

- **App Router pages** live under `app/`.
- All user-facing routes are locale-scoped via `app/[locale]/...`.
- **Middleware** handles locale routing and pathname propagation.
- **Admin pages** are rendered in a shared admin shell layout (sidebar + topbar).
- **Admin API routes** live under `app/api/admin/...` and enforce admin checks.
- **Supabase server/client helpers** live under `lib/supabase/...`.
- **Feature-level API helpers and query hooks** live under `lib/api/...` and `lib/queries/...`.

---

## 4) Folder structure (important parts)

- `app/`
  - `[locale]/(marketing)/...` -> marketing pages (`/`, `/about`, `/how-it-works`, legal pages)
  - `[locale]/admin/...` -> admin UI pages (dashboard, users, kyc, requests, pets, reviews, reports, contact, login)
  - `api/admin/...` -> server routes for admin data/actions
- `components/`
  - `admin/` -> admin UI components (tables, cards, modals, sidebar, topbar)
  - `marketing/` -> marketing UI components
  - `providers/ReactQueryProvider.tsx` -> React Query app provider
- `lib/`
  - `supabase/` -> typed Supabase clients + database types
  - `i18n/` -> routing, locale config, navigation wrappers, message files
  - `api/admin/` -> admin server-side query/mutation helpers
  - `queries/admin/` -> React Query hooks for admin pages
- `docs/` -> product/flow documentation used for implementation reference

---

## 5) Routing and i18n behavior

- Supported locales: `en`, `fr`.
- Locale prefix strategy is `as-needed` (default locale can be unprefixed).
- Middleware ensures locale-aware routing and sets `x-pathname` header used by admin layout for active nav/title logic.
- Messages are loaded from:
  - `lib/i18n/messages/en.json`
  - `lib/i18n/messages/fr.json`

---

## 6) Auth and authorization (current web behavior)

- Supabase Auth handles user sessions.
- Admin API routes verify:
  1. Authenticated user exists.
  2. User is admin (`users.is_admin = true`).
- Helper used for this: `lib/api/admin/auth.ts` (`requireAdminClient()`).

For admin pages, auth checks are performed in the admin layout and in API routes for data operations.

---

## 7) Data layer and API pattern

Current pattern used in admin:

1. **Route handlers** under `app/api/admin/...` expose server endpoints.
2. **DB helpers** under `lib/api/admin/...` contain Supabase query/mutation logic.
3. **React Query hooks** under `lib/queries/admin/...` fetch/cache/mutate from client pages.

This keeps UI, transport, and DB logic separated.

---

## 8) KYC flow (currently implemented)

The KYC admin page is now DB-backed (not mock-only):

- **List submissions**
  - `GET /api/admin/kyc-submissions`
  - Loads `kyc_submissions` + related `users` data
  - Maps to the existing KYC card UI model (images, status, user details)

- **Approve/Reject**
  - `PATCH /api/admin/kyc-submissions/[id]`
  - Approve: sets submission status to `approved`
  - Reject: requires reason, sets status to `rejected` and stores reviewer notes
  - Both update `reviewed_at`
  - Also sync `users.kyc_status` to match moderation result

- **Client integration**
  - `lib/queries/admin/kyc.ts` provides list + mutations
  - `app/[locale]/admin/kyc/page.tsx` uses query loading/error states and cache invalidation
  - Existing KYC card/image modal UX is preserved

---

## 9) Other admin pages

Most admin sections are implemented in UI and currently use either:

- Real API probing (example: users fetch logging path), or
- Mock data in the component/page while API integration is staged.

The admin panel includes reusable patterns:

- Confirmation modal for destructive actions.
- Profile/details-style modal patterns.
- Responsive table/card layouts.

---

## 10) Environment and configuration

Required environment variables (from current setup):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Notes:

- Service role key is used only on server-side admin operations.
- Never expose service role keys to client components.

---

## 11) How to run

- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Production build check: `npm run build`
- Production start: `npm run start`

---

## 12) Current status summary

- Marketing site: localized and implemented.
- Admin shell + pages: implemented with responsive UI.
- KYC moderation: integrated with real DB via secure API + React Query.
- Supabase typed model: present in `lib/supabase/types.ts`.
- Project is actively evolving; some admin sections still use mock data pending full DB wiring.

