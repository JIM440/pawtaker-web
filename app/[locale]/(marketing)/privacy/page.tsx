import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';

export const metadata: Metadata = {
  title: 'Privacy policy — PawTaker',
  description: 'PawTaker privacy policy and data practices.',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('legal.privacy');
  const date = new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US');
  const tocLabel = locale === 'fr' ? 'Sommaire' : 'Contents';
  const sections = [
    { id: 'section-1', title: t('section1Title'), body: t('section1Body') },
    { id: 'section-2', title: t('section2Title'), body: t('section2Body') },
    { id: 'section-3', title: t('section3Title'), body: t('section3Body') },
    { id: 'section-4', title: t('section4Title'), body: t('section4Body') },
    { id: 'section-5', title: t('section5Title'), body: t('section5Body') },
    { id: 'section-6', title: t('section6Title'), body: t('section6Body') },
    { id: 'section-7', title: t('section7Title'), body: t('section7Body') },
    { id: 'section-8', title: t('section8Title'), body: t('section8Body') },
    { id: 'section-9', title: t('section9Title'), body: t('section9Body') },
  ];

  return (
    <>
      <LandingNavbar />
      <section className="w-full bg-[#f5f0f0] px-5 pb-16 pt-36 sm:px-8 lg:px-10 xl:px-[80px]">
        <main className="mx-auto w-full max-w-[1440px] font-sans text-on-surface">
          <div className="w-full max-w-4xl">
            <h1 className="mb-2 text-4xl font-bold text-primary">{t('title')}</h1>
            <p className="mb-10 text-sm text-on-surface/70">{t('lastUpdated', { date })}</p>

            <nav aria-label={tocLabel} className="mb-10">
              <h2 className="mb-3 text-base font-semibold text-on-surface">{tocLabel}</h2>
              <ol className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-8 text-base leading-7 text-on-surface">
              {sections.map((section) => (
                <section id={section.id} key={section.id} className="scroll-mt-24">
                  <h2 className="mb-2 text-xl font-semibold text-on-surface">{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
