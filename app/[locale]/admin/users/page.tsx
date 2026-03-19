import UsersTable from '@/components/admin/UsersTable';

export default function UsersPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-on-surface tracking-tight">User Management</h1>
        <p className="text-on-surface/70 text-sm mt-1">
          Search, filter, and manage all registered users.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
