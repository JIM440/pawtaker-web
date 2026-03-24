🐾  PawTaker — Admin Panel
Supabase Admin Client Fix
For the Junior Developer  •  Version 1.0  •  March 2026

Framework
Next.js 16 App Router	Backend
Supabase + SSR	Issue
RLS blocking admin queries

0.  Purpose & Scope
This document explains a critical bug in the PawTaker admin panel where admin API routes return empty results even though data exists in the database. It explains exactly why it happens and gives step-by-step instructions to fix it permanently.
After following this guide the admin panel will correctly fetch all users, all KYC submissions, and any other admin data queries.

What this fixes	Details
Users list empty	GET /api/admin/users returning 0 rows despite users existing in DB
KYC submissions empty	GET /api/admin/kyc-submissions returning 0 rows despite submissions existing
Root cause	Supabase SSR client injecting user JWT, which is blocked by RLS policies
Solution	Create a separate pure service role client that bypasses RLS entirely
Files to create	lib/supabase/admin.ts  (new file)
Files to modify	lib/api/admin/auth.ts  (update requireAdminClient)


1.  Understanding the Problem
Before touching any code, read this section carefully. It explains exactly what is going wrong so you understand why the fix works.

1.1  What Is RLS?
RLS stands for Row Level Security. It is a PostgreSQL feature enabled on all PawTaker tables. It means every query to the database is filtered based on WHO is making the request.

Who is querying	What RLS allows them to see
Regular user (JWT)	Only their own rows — their own profile, their own pets, their own requests etc.
Service role key	ALL rows in ALL tables — RLS is completely bypassed
Unauthenticated	Zero rows — nothing

✅  NOTE  This is why your SQL queries in the Supabase dashboard returned results — the dashboard uses the service role key internally. But your API routes were not.

1.2  What Is the SSR Client?
The SSR client (@supabase/ssr) is the Supabase client designed for Next.js server-side rendering. Its job is to read the logged-in user's session from cookies and attach it to every request.
This is exactly what you want for regular user-facing pages — it means each user only sees their own data. But it is the wrong client for admin operations.

1.3  The Exact Bug
Here is what happens when your admin API route runs:

Admin visits /api/admin/kyc-submissions
        ↓
requireAdminClient() is called
        ↓
SSR client is created using @supabase/ssr
        ↓
SSR client reads admin user's JWT from cookies
        ↓
Admin JWT is injected into the Authorization header
        ↓
Query runs: SELECT * FROM kyc_submissions
        ↓
RLS checks: 'Can this admin user see these rows?'
        ↓
RLS policy says: user can only see their own submissions
        ↓
Result: 0 rows  ← no error, just empty  ❌

⚠️  NOTE  This is the most confusing part — you get NO ERROR. Supabase does not say 'permission denied'. RLS silently filters out all rows the user is not allowed to see. This makes the bug look like the data does not exist.

1.4  Why the SQL Editor Worked
When you ran the queries directly in the Supabase SQL Editor and got results, that is because the SQL Editor runs queries using the service role key — it bypasses RLS completely. Your API routes were not doing this.

1.5  The Correct Architecture
SSR client (@supabase/ssr)
  Purpose: read user session from cookies
  RLS:     YES — subject to RLS
  Use for: checking if a user is logged in and is_admin = true
           NOTHING ELSE in admin API routes

Admin client (supabase-js direct + service role key)
  Purpose: perform privileged data operations
  RLS:     NO  — bypasses RLS entirely
  Use for: ALL data queries and mutations in admin API routes


2.  The Fix — Step by Step
There are two steps. Do them in order. Do not skip Step 1.

Step 1	Create the Admin Supabase Client  —  lib/supabase/admin.ts

Create a brand new file at this path:

lib/supabase/admin.ts

Paste this exact code into the file:

import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Admin Supabase client.
 *
 * Uses the service role key directly via supabase-js (NOT @supabase/ssr).
 * This means no cookie/session injection can override the key.
 * RLS is bypassed entirely — this client can read and write all rows.
 *
 * RULES:
 * 1. Only import this in server-side files (API routes, Server Actions).
 * 2. Never import this in any client component or page component.
 * 3. Always verify the user is an admin BEFORE using this client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.'
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false, // no token to refresh — service role never expires
      persistSession:   false, // no session to persist
    },
  });
}

✅  NOTE  The Database type import path assumes types.ts is in the same lib/supabase/ folder. If your types file is somewhere else adjust the import path accordingly.

Step 2	Update requireAdminClient()  —  lib/api/admin/auth.ts

Open the existing file at:

lib/api/admin/auth.ts

Replace the entire contents with the following. Read the comments carefully — they explain what each part does:

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminClient } from '../../supabase/admin';

/**
 * requireAdminClient()
 *
 * Call this at the top of every admin API route.
 *
 * It does three things:
 *   1. Reads the session from cookies using the SSR client.
 *   2. Verifies the session belongs to a user where is_admin = true.
 *   3. Returns the admin client (service role) for all data operations.
 *
 * If the user is not authenticated or not an admin, it returns
 * a 401/403 NextResponse that the API route can return immediately.
 *
 * Usage in an API route:
 *   const result = await requireAdminClient();
 *   if (result instanceof NextResponse) return result;
 *   const { admin } = result;
 */
export async function requireAdminClient(): Promise<
  { admin: ReturnType<typeof createAdminClient> } | NextResponse
> {
  // ── Step A: Read the user session from cookies ──────────────────
  // We use the SSR client here ONLY for reading the session.
  // This client is subject to RLS — but that is fine because we only
  // use it to check auth, not to query data.
  const cookieStore = await cookies();

  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},  // read-only — we do not need to set cookies here
      },
    }
  );

  const { data: { user }, error: authError } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized — no valid session.' },
      { status: 401 }
    );
  }

  // ── Step B: Check is_admin using the admin client ────────────────
  // We use the admin client (service role) here because the SSR client
  // would be subject to RLS on the users table.
  const adminClient = createAdminClient();

  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return NextResponse.json(
      { error: 'Forbidden — admin access required.' },
      { status: 403 }
    );
  }

  // ── Step C: Return the admin client for data operations ──────────
  // All queries and mutations in the API route should use this client.
  return { admin: adminClient };
}


3.  Updating the API Routes
Now that requireAdminClient() returns a NextResponse on failure, every API route that calls it must be updated to handle that response. The pattern is the same for every route.

3.1  The Pattern — Apply to Every Admin API Route
Every admin API route must follow this exact pattern:

import { requireAdminClient } from '../../../../lib/api/admin/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  // Step 1 — Require admin. If not admin, return the error response.
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;  // ← 401 or 403
  const { admin } = result;

  // Step 2 — Use admin client for all data operations.
  const { data, error } = await admin
    .from('your_table')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

3.2  KYC Submissions Route  —  app/api/admin/kyc-submissions/route.ts
Update the GET handler to use the new pattern:

import { requireAdminClient } from '../../../../lib/api/admin/auth';
import { listKycSubmissionsForAdmin } from '../../../../lib/api/admin/kyc';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const { data, error } = await listKycSubmissionsForAdmin(admin);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data ?? [] });
}

Update the PATCH handler (approve/reject) the same way:

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const body = await req.json();
  // ... rest of your existing approve/reject logic, using admin instead of supabase
}

3.3  Users Route  —  app/api/admin/users/route.ts
Apply the same pattern:

import { requireAdminClient } from '../../../../lib/api/admin/auth';
import { fetchNonAdminUsersForAdmin } from '../../../../lib/api/admin/users';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await requireAdminClient();
  if (result instanceof NextResponse) return result;
  const { admin } = result;

  const { data, error } = await fetchNonAdminUsersForAdmin(admin);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
}

3.4  All Other Admin Routes
Apply the exact same pattern to every other file under app/api/admin/. The steps are always identical:

1.	Call requireAdminClient() and assign the result.
2.	Check if result instanceof NextResponse — if yes, return it immediately.
3.	Destructure admin from result.
4.	Use admin for all Supabase queries — never use the SSR client for data.

API Route File	Status after this fix
app/api/admin/kyc-submissions/route.ts	Update as shown in 3.2
app/api/admin/kyc-submissions/[id]/route.ts	Update as shown in 3.2 (PATCH handler)
app/api/admin/users/route.ts	Update as shown in 3.3
app/api/admin/users/[id]/route.ts	Update using the pattern in 3.1
Any other app/api/admin/... routes	Update using the pattern in 3.1


4.  Verifying the Fix
After making all changes, verify everything is working correctly with these steps.

4.1	Add a Temporary Debug Log

Temporarily add this to your KYC submissions GET route after fetching:

const { data, error } = await listKycSubmissionsForAdmin(admin);
console.log('[KYC DEBUG] count:', data?.length, 'error:', error?.message);
// Expected output: '[KYC DEBUG] count: 4 error: undefined'

Run the dev server and visit the KYC page. Check the terminal (not the browser console). You should see count: 4. Remove the debug log after confirming.

4.2	Check the Admin Panel Pages

Visit each of these pages in the browser while logged in as an admin and confirm data loads:

5.	Admin → KYC Submissions — should show 4 pending submissions
6.	Admin → Users — should show 5 non-admin users
7.	Open browser DevTools → Network tab → check the API responses are 200 with data

4.3	Test the Auth Guard

Confirm the guard works correctly by testing these scenarios:

Test scenario	Expected result
Visit /api/admin/users while logged out	401 Unauthorized response
Visit /api/admin/users as a non-admin user	403 Forbidden response
Visit /api/admin/users as an admin	200 with full users array
Visit /api/admin/kyc-submissions as admin	200 with all 4 submissions


5.  Rules to Follow Going Forward
Now that this fix is in place, every developer working on the admin panel must follow these rules permanently. Violating them will bring the same bug back.

Rule	Reason
Always use createAdminClient() for admin data queries	The SSR client is subject to RLS and will return empty results
Always call requireAdminClient() at the top of every admin API route	Never allow unauthenticated or non-admin access to reach the data layer
Never import createAdminClient() in a client component	The service role key must never be exposed to the browser — only server-side
Never use the SSR client for data queries in admin routes	It carries the user JWT which RLS uses to filter rows
Always check if (result instanceof NextResponse) after requireAdminClient()	If you skip this check the route will crash when an unauthorized user hits it
SUPABASE_SERVICE_ROLE_KEY must NOT have NEXT_PUBLIC_ prefix	NEXT_PUBLIC_ variables are exposed to the browser — service role key must stay server-only


6.  Implementation Checklist
Complete every item in order before marking this task as done.

Files to Create
8.	Create lib/supabase/admin.ts with the createAdminClient() function (Section 2, Step 1)

Files to Modify
9.	Update lib/api/admin/auth.ts — replace requireAdminClient() with the new version (Section 2, Step 2)
10.	Update app/api/admin/kyc-submissions/route.ts — GET handler (Section 3.2)
11.	Update app/api/admin/kyc-submissions/[id]/route.ts — PATCH handler (Section 3.2)
12.	Update app/api/admin/users/route.ts — GET handler (Section 3.3)
13.	Update all other files under app/api/admin/ using the pattern in Section 3.1

Verification
14.	Add temporary debug log, run dev server, confirm KYC count is 4 in terminal
15.	Confirm Users page shows 5 non-admin users in the browser
16.	Confirm KYC Submissions page shows 4 pending submissions in the browser
17.	Test 401 response when hitting admin API routes while logged out
18.	Remove the temporary debug log


7.  Common Mistakes to Avoid

Mistake	What goes wrong
Forgetting if (result instanceof NextResponse) return result	TypeScript will complain. Worse, if the check is missing, the route will crash trying to destructure admin from a NextResponse object.
Using the SSR client for data queries after the auth check	You will get empty results again for the same RLS reason. Always use the admin client returned from requireAdminClient().
Adding NEXT_PUBLIC_ prefix to SUPABASE_SERVICE_ROLE_KEY	The key gets bundled into the browser JavaScript — a serious security vulnerability. It must never have NEXT_PUBLIC_ prefix.
Calling createAdminClient() directly in a route without the admin check	Any user could hit the route and get all data. Always go through requireAdminClient() first.
Not restarting the dev server after changing .env	Next.js does not hot-reload env variable changes. Always restart after editing .env.


End of Document  •  PawTaker Admin Client Fix  •  v1.0  •  March 2026
