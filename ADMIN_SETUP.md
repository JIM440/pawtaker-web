# Admin panel setup

Admin pages live under **`app/[locale]/(admin)/`** (layout, login, dashboard, users, kyc, requests, reports, settings). They were moved there when we added the `[locale]` segment for next-intl so the home page would work; they were not deleted. URLs are still `/admin/login`, `/admin/dashboard`, etc.

## Test admin login

Use these credentials to sign in to the admin panel (must exist in Supabase):

- **Email:** `pawtaker.test.email@gmail.com`
- **Password:** `PawTaker2025##`

## Creating the admin user in Supabase

1. **Create the user in Supabase Auth**
   - Supabase Dashboard → Authentication → Users → Add user
   - Email: `pawtaker.test.email@gmail.com`
   - Password: `PawTaker2025##` (or set a secure one and update the app)

2. **Set admin flag in the database**
   - Ensure your `users` table has a row for this auth user with `is_admin = true`.
   - Either run a one-off SQL in the Supabase SQL editor, or use a trigger that creates a `users` row on sign-up and then update that row:

   ```sql
   -- After the user exists in auth.users, insert or update public.users
   INSERT INTO public.users (id, email, full_name, is_admin, kyc_status, points_balance)
   VALUES (
     '<auth-user-uuid-from-step-1>',
     'pawtaker.test.email@gmail.com',
     'PawTaker Admin',
     true,
     'approved',
     0
   )
   ON CONFLICT (id) DO UPDATE SET is_admin = true;
   ```

3. **Dashboard data**
   - The admin dashboard (Users, KYC, Requests, Reports) currently uses **static data** for display. Replace the static arrays in each page with Supabase queries when you are ready to go live.
