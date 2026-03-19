# PawTaker Admin Panel — Authentication Flow
## How Sessions, Tokens, and Route Protection Work

---

## Overview

The admin panel uses **Supabase Auth** with the `@supabase/ssr` package, which is specifically designed for server-rendered frameworks like Next.js. It works differently from the mobile app (which uses `expo-secure-store`) — the key difference is that tokens live in **cookies** instead of device storage, which allows the server to read and validate them on every request.

```
Admin visits any /admin/* page
        ↓
layout.tsx (Server Component) runs FIRST
        ↓
Reads session cookies → validates JWT → checks is_admin
        ↓
Not authenticated?  → redirect to /admin/login
Not admin?          → redirect to /admin/login
Admin confirmed?    → render the page ✅
```

---

## The Two-Table Model (same as mobile)

The web admin uses the same Supabase database as the mobile app.

### `auth.users` (Supabase managed)
- Stores credentials, hashed password, JWT tokens, email verification
- Never touched directly — only accessed via `supabase.auth.*` methods
- Created automatically on `signUp()` or admin user creation

### `public.users` (Application table)
- Stores the actual profile: name, email, kyc_status, points_balance, language, etc.
- Linked to `auth.users` by sharing the **exact same UUID**
- Has an `is_admin` boolean column — this is what gates admin access
- Read and written freely by the application

```
auth.users.id  ←——— same UUID ———→  public.users.id
                                           ↑
                                     is_admin = true ← required to access admin panel
```

---

## How Tokens Work on Web (vs Mobile)

| | Mobile App | Web Admin |
|---|---|---|
| Token storage | `expo-secure-store` (encrypted hardware) | **HttpOnly cookies** |
| Token name | Stored as opaque key-value | `sb-[project-ref]-auth-token` |
| Server can read? | No | **Yes** — via `cookies()` in Server Components |
| Auto-refresh | `autoRefreshToken: true` in client config | `createBrowserClient` handles it |
| JS can read tokens? | No | No (HttpOnly — not accessible to JavaScript) |
| Survives browser restart? | Yes (`persistSession: true`) | Yes — cookies persist |

### Token Lifecycle

```
Admin logs in → Supabase issues:
  access_token  → valid for 1 hour
  refresh_token → valid for 60 days

Both stored as HttpOnly cookies automatically by @supabase/ssr
```

**Within 1 hour of login:**
- Server reads `access_token` cookie → valid JWT → no DB call needed → access granted
- JWT is verified cryptographically (Supabase's public key)

**After 1 hour (access_token expired):**
- `createBrowserClient` in the browser detects expiry
- Silently calls Supabase with the `refresh_token`
- Supabase returns a new `access_token`
- Cookie is updated — admin notices nothing

**After 60 days (or refresh_token invalidated):**
- Refresh attempt fails
- Session becomes null
- Next page visit → layout guard fires → `redirect` to `/admin/login`

**What clears a session early:**
- Admin clicks Sign Out → `supabase.auth.signOut()` → cookies deleted immediately
- Password changed from Supabase dashboard → all sessions invalidated
- "Revoke all sessions" in Supabase dashboard

---

## The Three Protection Layers

### Layer 1 — Login Page (`app/[locale]/admin/login/page.tsx`)

The login form does two checks:

```
1. supabase.auth.signInWithPassword({ email, password })
   → Wrong credentials → show Supabase error message

2. supabase.from('users').select('is_admin').eq('id', user.id)
   → is_admin = false → supabase.auth.signOut() + show "Access denied"
   → is_admin = true  → router.push('/admin/dashboard')
```

Why sign out immediately if not admin? Because credentials were valid — the Supabase session was created. We don't want a non-admin user sitting with an active session, so we clear it right away and show an error.

### Layer 2 — Admin Layout (`app/[locale]/admin/layout.tsx`)

This is a **Server Component** that runs on every single admin page request (except `/admin/login`). It is the main security backstop.

```typescript
// 1. Get the user from the session cookie
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect(`/${locale}/admin/login`);

// 2. Confirm they are an admin
const { data: profile } = await supabase
  .from('users').select('is_admin').eq('id', user.id).single();
if (!profile?.is_admin) redirect(`/${locale}/admin/login`);
```

This runs on **every page load** — so even if someone somehow bypasses the login page (e.g., directly navigates to `/admin/dashboard`), they are redirected before any page content is rendered.

`supabase.auth.getUser()` does not just decode the JWT — it makes a call to the Supabase Auth server to confirm the token is still valid (not revoked). This is the most secure check available.

### Layer 3 — Sign Out (`components/admin/ProfileModal.tsx`)

When the admin clicks Sign Out and confirms:

```typescript
await supabase.auth.signOut(); // deletes both cookies from the browser
router.push(`/${locale}/admin/login`);
router.refresh(); // tells Next.js server to re-render — layout guard fires
```

`router.refresh()` is important: without it, Next.js might serve a cached version of the page briefly even after the cookies are gone.

---

## Files Involved and How They Connect

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│                                                         │
│  cookies: sb-[ref]-auth-token (access + refresh)        │
│           ↑ written by createBrowserClient              │
│           ↓ read by createServerClient (server side)    │
└─────────────────────────────────────────────────────────┘
```

### `lib/supabase/client.ts`
**When used:** Client Components (`'use client'`) — login page, ProfileModal
**Key:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (public, anon)
**What it does:**
- `createBrowserClient` — manages cookies in the browser
- Handles auto token refresh silently in the background
- Used for: `signInWithPassword`, `signOut`, checking `is_admin` on login

```typescript
export function createClient() {
  return createBrowserClient(URL, PUBLISHABLE_KEY);
}
```

### `lib/supabase/server.ts`
**When used:** Server Components and Server Actions only — never in `'use client'` files
**Two clients:**

`createAdminClient()` — uses `SUPABASE_SERVICE_ROLE_KEY`
- Bypasses Row Level Security (RLS) completely
- Used in `layout.tsx` for the auth guard (reads `public.users.is_admin`)
- Used for any admin operation that needs to read/write any user's data

`createServerSideClient()` — uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Respects RLS — can only read/write data the logged-in user is allowed to
- Used for reading data on behalf of the current user

### `app/[locale]/admin/layout.tsx`
**Type:** Server Component (async)
**Role:** Auth guard for all admin pages
**Flow:**
1. Skips if it's the login page (no redirect loop)
2. Calls `createAdminClient()` — reads the session cookie
3. `getUser()` — validates JWT with Supabase Auth server
4. Queries `public.users` for `is_admin`
5. Redirects to login if either check fails
6. Renders the sidebar + topbar shell if both pass

### `app/[locale]/admin/login/page.tsx`
**Type:** Client Component (`'use client'`)
**Role:** Credential verification + is_admin pre-check
**Flow:**
1. `signInWithPassword` — verify credentials
2. Query `public.users` for `is_admin`
3. If not admin: `signOut()` + show error
4. If admin: redirect to dashboard (layout guard will re-confirm server-side)

### `components/admin/ProfileModal.tsx`
**Type:** Client Component
**Role:** Sign Out action
**Flow:**
1. Admin clicks Sign Out → confirmation modal appears
2. On confirm: `supabase.auth.signOut()` — deletes cookies
3. `router.push(/${locale}/admin/login)` — navigate to login
4. `router.refresh()` — forces server re-render so layout guard detects missing session

### `components/admin/AdminSidebar.tsx`
**Type:** Client Component
**Role:** Navigation + profile modal trigger
**Auth relevance:** Opens `ProfileModal` which contains the Sign Out flow

---

## What Happens in Each Scenario

### Scenario 1 — Valid admin logs in
```
Login form → signInWithPassword ✅ → is_admin = true ✅
→ cookies set → redirect /admin/dashboard
→ layout runs → getUser() ✅ → is_admin ✅ → page renders
```

### Scenario 2 — Valid user but not admin
```
Login form → signInWithPassword ✅ → is_admin = false
→ signOut() called immediately → cookies cleared
→ "Access denied" error shown → user stays on login page
```

### Scenario 3 — Someone navigates directly to /admin/dashboard without logging in
```
Browser has no session cookies
→ layout runs → getUser() returns null
→ redirect to /admin/login
```

### Scenario 4 — Session expires after 60 days
```
Admin opens /admin/dashboard
→ layout runs → access_token expired → refresh attempt
→ refresh_token also expired → getUser() returns null
→ redirect to /admin/login
```

### Scenario 5 — Admin signs out
```
Profile modal → confirm sign out
→ supabase.auth.signOut() → cookies deleted from browser
→ router.push /admin/login → router.refresh()
→ layout runs → no cookies → getUser() null → redirect to login
```

### Scenario 6 — Admin closes browser and comes back next day
```
Browser still has cookies (HttpOnly cookies survive browser close)
→ access_token likely expired (was valid 1 hour)
→ createBrowserClient detects expiry → uses refresh_token automatically
→ New access_token issued → admin continues working
(This happens transparently — admin sees no interruption)
```

---

## Environment Variables Required

```bash
# In .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...  # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                                  # service role — NEVER expose to browser
```

**Why two keys?**
- `PUBLISHABLE_DEFAULT_KEY` — safe to be in the browser. Used for login, session management, and reading user's own data.
- `SERVICE_ROLE_KEY` — server only. Bypasses all RLS. Used in layout guard to check `is_admin` without being blocked by database policies.

---

## Database Requirement

For auth to work, `public.users` must have:
- `id uuid` (same as `auth.users.id`) — primary key
- `is_admin boolean` — must be `true` for admin access

The admin user is created via `scripts/create-admin-user.js` which sets `is_admin = true`. For any new admin, you must manually set `is_admin = true` in the Supabase dashboard or via SQL:

```sql
UPDATE public.users SET is_admin = true WHERE email = 'admin@example.com';
```
