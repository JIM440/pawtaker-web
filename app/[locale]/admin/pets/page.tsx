import PetsTable from '@/components/admin/PetsTable';

export default function PetsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Pets</h1>
        <p className="text-on-surface/70 text-sm mt-1">
          All registered pets across the platform.
        </p>
      </div>
      <PetsTable />
    </div>
  );
}
