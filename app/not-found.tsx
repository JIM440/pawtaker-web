import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';

/**
 * Fallback when no locale segment matches (rare). Uses the same PawTaker surface
 * tokens as `app/[locale]/not-found.tsx`; copy is English-only here.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-base px-4 py-12 font-sans antialiased">
      <div className="w-full max-w-md rounded-2xl border border-outline/20 bg-white p-8 text-center shadow-xl shadow-primary/10 ring-1 ring-outline/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
          <Image
            src="/logos/logomark-electric-pear.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </div>
        <p className="font-wobblite text-5xl font-bold leading-none text-primary">404</p>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-on-surface">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/70">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}
