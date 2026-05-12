import type { ReactNode } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';
import type { PublicBlogSummary as BlogPostSummary } from '@/lib/blogs';

const adminAvatarSrc = 'https://www.figma.com/api/mcp/asset/dedf0bf9-a532-4ab7-a520-93b2e70690aa';

export function PawtakerLogo({ variant = 'lime' }: { variant?: 'lime' | 'plum' }) {
  const src = variant === 'lime' ? '/logos/primary-variant.svg' : '/logos/primary-logo.svg';
  const alt = 'PawTaker';

  return (
    <Link href="/" className="block w-fit shrink-0">
      <img src={src} alt={alt} className="h-auto w-[180px] md:w-[230px] lg:w-[310px]" />
    </Link>
  );
}

function StoreButton({
  href,
  label,
  icon,
  variant,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant: 'filled' | 'outline';
}) {
  const baseClass =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-medium tracking-[-0.2px] transition-transform duration-200 hover:-translate-y-0.5';
  const variantClass =
    variant === 'filled'
      ? 'bg-[#ffd9e2] text-[#703348]'
      : 'border border-[#d5c2c6] text-[#f4eed1]';

  return (
    <a href={href} {...externalLinkProps(href)} className={`${baseClass} ${variantClass}`}>
      {icon}
      <span>{label}</span>
    </a>
  );
}

export function PawtakerStoreButtons({ centered = false }: { centered?: boolean }) {
  const { ios, android } = getAppStoreUrls();

  return (
    <div className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : 'justify-start'}`}>
      <StoreButton
        href={ios}
        label="Download on the App Store"
        variant="filled"
        icon={<img src="/images/ios-icon.svg" alt="" className="h-[18px] w-[18px]" />}
      />
      <StoreButton
        href={android}
        label="Get it on Play Store"
        variant="outline"
        icon={<img src="/images/playstore-icon.svg" alt="" className="h-[18px] w-[18px]" />}
      />
    </div>
  );
}

export function PawtakerTopNav() {
  return (
    <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-5 pt-[52px] sm:px-8 lg:px-[80px]">
      <PawtakerLogo />
      <div className="hidden items-center gap-2 md:flex">
        <PawtakerStoreButtons />
        <div className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium tracking-[0.1px] text-[#f4eed1]">
          EN
        </div>
      </div>
    </header>
  );
}

export function PawtakerBlogCard({
  post,
}: {
  post: BlogPostSummary;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block w-[300px] shrink-0 snap-start rounded-[20px] bg-[#fffafa] p-1 min-[500px]:w-[280px] sm:w-[320px] lg:w-[360px]"
    >
      <div className="overflow-hidden rounded-[16px] rounded-bl-[4px] rounded-br-[4px]">
        <img
          src={post.imageSrc}
          alt={post.title}
          className="h-[236px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-3 px-5 py-5">
        <h3 className="text-[20px] font-bold leading-[1.08] tracking-[-0.6px] text-[#3d2d32] group-hover:underline sm:text-[22px]">
          {post.title}
        </h3>
        <p className="text-[14px] leading-6 tracking-[-0.2px] text-[#665459]">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-[14px] font-medium tracking-[-0.2px] text-[#8a767c]">
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export function PawtakerFooter() {
  const { ios, android } = getAppStoreUrls();

  return (
    <footer className="border-t border-[#d5c2c6] bg-[#f5f0f0]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(220px,389px)_1fr] lg:px-[80px] lg:py-16">
        <PawtakerLogo variant="plum" />
        <div className="grid gap-8 text-[#665459] sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <h2 className="pb-1 text-base font-bold leading-[18px] tracking-[-0.2px]">The App</h2>
            <div className="space-y-3 text-base leading-6 tracking-[-0.2px]">
              <a href={ios} {...externalLinkProps(ios)} className="block hover:text-[#8c4a60]">
                Download on App Store
              </a>
              <a href={android} {...externalLinkProps(android)} className="block hover:text-[#8c4a60]">
                Get it on Play Store
              </a>
              <a href="/blog" className="block hover:text-[#8c4a60]">
                Blogs
              </a>
              <a href="#why-pawtaker" className="block hover:text-[#8c4a60]">
                Why Pawtaker?
              </a>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="pb-1 text-base font-bold leading-[18px] tracking-[-0.2px]">Legal</h2>
            <div className="space-y-3 text-base leading-6 tracking-[-0.2px]">
              <Link href="/privacy" className="block hover:text-[#8c4a60]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-[#8c4a60]">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="pb-1 text-base font-bold leading-[18px] tracking-[-0.2px]">Contact</h2>
            <div className="space-y-3 text-base leading-6 tracking-[-0.2px]">
              <a href="mailto:support@pawtaker.ca" className="block break-all hover:text-[#8c4a60]">
                support@pawtaker.ca
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-6 sm:px-8 lg:px-[80px]">
        <div className="border-t border-[#d5c2c6] pt-4 text-center text-xs font-medium tracking-[0.02em] text-[#665459]/70">
          Copyright 2026 All rights reserved
        </div>
      </div>
    </footer>
  );
}

export function BlogAuthorRow({ date }: { date: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[#3d2d32]">
      <span className="text-[22px] leading-7 tracking-[-0.1px] text-[#837377]">{date}</span>
    </div>
  );
}
