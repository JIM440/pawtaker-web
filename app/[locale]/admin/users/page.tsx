import { createAdminClient } from '@/lib/supabase/server';
import UsersTable from '@/components/admin/UsersTable';

export default async function UsersPage() {
  const supabase = await createAdminClient();

  const result = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('=== /admin/users DEBUG ===');
  console.log('error:', result.error);
  console.log('count:', result.data?.length ?? 0, 'total rows');
  console.log('rows:', JSON.stringify(result.data, null, 2));

  const nonAdmins = (result.data ?? []).filter(u => !u.is_admin);
  console.log('non-admin rows:', nonAdmins.length);
  console.log('========================');

  return (
    <div className="p-6 md:p-8">
      <UsersTable />
    </div>
  );
}
