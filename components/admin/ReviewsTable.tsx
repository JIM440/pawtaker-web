'use client';

import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface Review {
  id: string;
  stars: 1 | 2 | 3 | 4 | 5;
  reviewerName: string;
  reviewerEmail: string;
  revieweeName: string;
  revieweeRole: 'Taker' | 'Owner';
  excerpt: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', stars: 5, reviewerName: 'Sarah Johnson', reviewerEmail: 'sarah.j@example.com', revieweeName: 'Mike Ross', revieweeRole: 'Taker', excerpt: 'Mike was absolutely fantastic with Buddy. He sent photos every hour and followed all care instructions perfectly.', date: 'Mar 10, 2026' },
  { id: 'r2', stars: 4, reviewerName: 'Emily Davis', reviewerEmail: 'emily.d@example.com', revieweeName: 'Alice Johnson', revieweeRole: 'Owner', excerpt: 'Alice was very welcoming and communicative. A small issue with timing but overall a great experience.', date: 'Mar 8, 2026' },
  { id: 'r3', stars: 2, reviewerName: 'Bob Smith', reviewerEmail: 'bob@example.com', revieweeName: 'Charlie Davis', revieweeRole: 'Taker', excerpt: 'The care was average at best. Instructions were not fully followed and communication was poor throughout the stay.', date: 'Mar 5, 2026' },
  { id: 'r4', stars: 5, reviewerName: 'Diana Prince', reviewerEmail: 'diana@example.com', revieweeName: 'Evan Wright', revieweeRole: 'Taker', excerpt: 'Evan is a natural with animals. Max was so happy and well cared for. Will definitely request again.', date: 'Feb 28, 2026' },
  { id: 'r5', stars: 1, reviewerName: 'Evan Wright', reviewerEmail: 'evan@example.com', revieweeName: 'Unknown User', revieweeRole: 'Owner', excerpt: 'The owner was unreachable for 2 hours during pickup. Very stressful situation for everyone involved.', date: 'Feb 20, 2026' },
  { id: 'r6', stars: 3, reviewerName: 'Laura Martinez', reviewerEmail: 'laura.m@example.com', revieweeName: 'Tom Baker', revieweeRole: 'Taker', excerpt: 'Decent care overall. The pet was safe and fed, but there were fewer check-in photos than expected.', date: 'Feb 14, 2026' },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'text-amber-400' : 'text-outline/30'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteReview = reviews.find((r) => r.id === deleteId);

  const handleDelete = () => {
    if (!deleteId) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Reviewee</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-4">
                    <Stars count={review.stars} />
                    <span className="text-xs text-on-surface/50 mt-0.5 block">{review.stars}/5</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-on-surface">{review.reviewerName}</p>
                    <p className="text-xs text-on-surface/60">{review.reviewerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-on-surface">{review.revieweeName}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${review.revieweeRole === 'Taker' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      {review.revieweeRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[260px]">
                    <p className="text-on-surface/80 text-sm line-clamp-2">{review.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface/60 hidden sm:table-cell whitespace-nowrap">{review.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setDeleteId(review.id)}
                      title="Delete review"
                      className="p-2 hover:bg-red-50 rounded-lg text-error transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    No reviews to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>Showing <span className="font-semibold">{reviews.length}</span> reviews</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/60 disabled:opacity-50" disabled>‹</button>
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80">›</button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        title={`Delete review by ${deleteReview?.reviewerName ?? 'user'}?`}
        description="This will permanently remove the review from the platform."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
