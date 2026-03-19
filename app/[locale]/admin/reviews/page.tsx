import ReviewsTable from '@/components/admin/ReviewsTable';

export default function ReviewsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Reviews</h1>
        <p className="text-on-surface/70 text-sm mt-1">
          User-submitted reviews across all care sessions.
        </p>
      </div>
      <ReviewsTable />
    </div>
  );
}
