/**
 * Creates the PawTaker admin user in Supabase Auth and ensures a public.users row with is_admin = true.
 * Run from pawtaker-web: node scripts/create-admin-user.js
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

const path = require('path');
const fs = require('fs');

// Load .env.local from pawtaker-web root
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1).replace(/\\n/g, '\n');
      process.env[key] = val;
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in pawtaker-web/.env.local');
  process.exit(1);
}

const ADMIN_EMAIL = 'pawtaker.test.email@gmail.com';
const ADMIN_PASSWORD = 'PawTaker2025##';
const ADMIN_FULL_NAME = 'PawTaker Admin';

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // 1) Create or get auth user
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === ADMIN_EMAIL);

  let userId;
  if (found) {
    userId = found.id;
    console.log('Auth user already exists:', ADMIN_EMAIL, '(id:', userId, ')');
    // Optionally update password so we know it's set correctly
    const { error: updateErr } = await supabase.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD });
    if (updateErr) {
      console.warn('Could not update password (you can reset in Supabase Dashboard):', updateErr.message);
    } else {
      console.log('Password updated to the expected value.');
    }
  } else {
    const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_FULL_NAME },
    });
    if (createErr) {
      console.error('Failed to create auth user:', createErr.message);
      process.exit(1);
    }
    userId = createData.user.id;
    console.log('Created auth user:', ADMIN_EMAIL, '(id:', userId, ')');
  }

  // 2) Upsert public.users so the user is an admin
  const { error: upsertErr } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        is_admin: true,
        kyc_status: 'approved',
        points_balance: 0,
        is_verified: true,
        language: 'en',
      },
      { onConflict: 'id' }
    );

  if (upsertErr) {
    console.warn('Could not upsert public.users:', upsertErr.message);
    console.log('\nRun this SQL in Supabase Dashboard → SQL Editor (create table if needed, then insert):');
    console.log(`
-- If public.users does not exist, create it first (adjust columns to match your schema), then:
INSERT INTO public.users (id, email, full_name, is_admin, kyc_status, points_balance, is_verified, language, created_at, updated_at)
VALUES (
  '${userId}',
  '${ADMIN_EMAIL}',
  '${ADMIN_FULL_NAME}',
  true,
  'approved',
  0,
  true,
  'en',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET is_admin = true, full_name = EXCLUDED.full_name, updated_at = now();
`);
  } else {
    console.log('Upserted public.users with is_admin = true.');
  }
  console.log('\nYou can log in at /admin/login with:', ADMIN_EMAIL, '/', ADMIN_PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
