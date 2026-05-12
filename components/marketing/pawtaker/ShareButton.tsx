'use client';

import { Share2 } from 'lucide-react';

export function ShareButton({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url?: string;
}) {
  async function handleShare() {
    if (typeof window === 'undefined') return;

    const shareUrl = url ?? window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Ignore clipboard failure for now.
    }
  }

  return (
    <button
      type="button"
      aria-label="Share post"
      onClick={handleShare}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#faf2f4] text-[#665459]"
    >
      <Share2 className="h-8 w-8" />
    </button>
  );
}
