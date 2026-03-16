import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export async function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-12 px-4 text-slate-300 sm:px-6 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-6 flex items-center gap-2 text-white">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" />
              </svg>
            </div>
            <span className="text-xl font-bold">PawTaker</span>
          </div>
          <p className="text-sm leading-relaxed">
            Making pet care social, affordable, and safe for every animal lover across
            the globe.
          </p>
        </div>

        <div>
          <h5 className="mb-4 text-sm font-bold text-white">Platform</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/how-it-works" className="hover:text-primary">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                Safety Measures
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                Community Points
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-4 text-sm font-bold text-white">Company</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-primary">
                Our Story
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Careers
              </a>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-4 text-sm font-bold text-white">Contact</h5>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden />
              <span>hello@pawtaker.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
              <span>San Francisco, CA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        © {year} PawTaker Inc. All rights reserved. Built with love for paws.
      </div>
    </footer>
  );
}

