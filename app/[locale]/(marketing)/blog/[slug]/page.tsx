import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';
import { MarketingFooter } from '@/components/marketing/Footer';
import { BlogRail } from '@/components/marketing/pawtaker/BlogRail';
import { ShareButton } from '@/components/marketing/pawtaker/ShareButton';
import {
  BlogAuthorRow,
  PawtakerBlogCard,
} from '@/components/marketing/pawtaker/PawtakerMarketingPrimitives';
import { getBlogContent } from '@/components/marketing/pawtaker/content';
import { getPublishedBlogBySlug, getPublishedBlogs } from '@/lib/blogs';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pawtaker-web.vercel.app';

function resolveLocale(locale: string): Locale {
  return locale === 'fr' || locale === 'en' ? locale : 'en';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const post = await getPublishedBlogBySlug(resolvedLocale, slug);

  if (!post) {
    return {};
  }

  const url = `${baseUrl}/${resolvedLocale}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      images: [
        {
          url: post.imageSrc,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageSrc],
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const post = await getPublishedBlogBySlug(resolvedLocale, slug);
  const fallbackLabels = getBlogContent(resolvedLocale);

  if (!post) {
    notFound();
  }

  const blogPosts = (await getPublishedBlogs(resolvedLocale)).filter((blogPost) => blogPost.slug !== post.slug);
  const shareUrl = `${baseUrl}/${resolvedLocale}/blog/${post.slug}`;

  return (
    <>
      <LandingNavbar />
      <main className="overflow-x-clip bg-[#f5f0f0]">
        <SectionReveal delayMs={40}>
        <section className="bg-[#ede6e7] px-5 py-14 sm:px-8 lg:px-[80px] lg:py-16">
          <div className="mx-auto max-w-[800px] space-y-8 sm:space-y-10">
            <div className="space-y-6 px-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <BlogAuthorRow date={post.date} />
                <ShareButton title={post.title} text={post.excerpt} url={shareUrl} />
              </div>

              <div>
                <h1 className="font-wobblite text-[38px] leading-[0.92] tracking-[-0.5px] text-[#665459] sm:text-[48px] lg:text-[56px]">
                  {post.title}
                </h1>
                <p className="mt-4 text-[20px] leading-7 tracking-[-0.1px] text-[#665459] sm:text-[22px]">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[18px] leading-7 tracking-[-0.1px] text-[#837377] sm:text-[22px]">
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px]">
              <img src={post.imageSrc} alt={post.title} className="h-auto w-full object-cover" />
            </div>

            <article
              className="blog-content space-y-8 px-1 text-[#3d2d32]"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            <div className="flex flex-col gap-4 border-t border-[#d5c2c6] px-1 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <BlogAuthorRow date={post.date} />
              <ShareButton title={post.title} text={post.excerpt} url={shareUrl} />
            </div>
          </div>
        </section>
        </SectionReveal>

        {blogPosts.length > 0 ? (
          <SectionReveal delayMs={90}>
          <section className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-[80px] lg:py-16">
            <BlogRail title={fallbackLabels.otherBlogs}>
              {blogPosts.map((blogPost) => (
                <PawtakerBlogCard key={blogPost.slug} post={blogPost} />
              ))}
            </BlogRail>
          </section>
          </SectionReveal>
        ) : null}
      </main>
      <MarketingFooter />
    </>
  );
}
