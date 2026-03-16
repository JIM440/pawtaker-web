# PawTaker Web — Cursor Rules

See CLAUDE.md at the project root for full guidelines.

## Server vs Client Components
- Default to Server Components (no 'use client')
- Add 'use client' only when using: useState, useEffect, browser APIs, event handlers
- Data fetching always in Server Components via `createAdminClient()`

## Patterns

### Server Component with data
```tsx
// app/(admin)/users/page.tsx
import { createAdminClient } from '@/lib/supabase/server';

export default async function UsersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('users').select('*');
  return <UserTable users={data ?? []} />;
}
```

### Client Component
```tsx
'use client';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const supabase = createClient();
  // ...
}
```

## Tailwind
Using Tailwind CSS v4 — no `tailwind.config.js` needed for basic usage.
Custom tokens defined inline with hex values until CSS vars are set up.

## Do NOT
- Use service role key in Client Components
- Add 'use client' to layout files unless absolutely necessary
- Fetch data in Client Components (use Server Components + props)
