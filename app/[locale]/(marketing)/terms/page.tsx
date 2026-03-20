import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Terms of Service — pawtaker',
  description: 'pawtaker Terms of Service and usage rules.',
};

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('legal.terms');
  const locale = params?.locale ?? 'en';
  const date = new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US');

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-primary mb-2">{t('title')}</h1>
      <p className="text-sm text-gray-500 mb-10">{t('lastUpdated', { date })}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section1Title')}</h2>
          <p>{t('section1Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section2Title')}</h2>
          <p>{t('section2Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section3Title')}</h2>
          <p>{t('section3Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section4Title')}</h2>
          <p>{t('section4Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section5Title')}</h2>
          <p>{t('section5Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section6Title')}</h2>
          <p>{t('section6Body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">{t('section7Title')}</h2>
          <p>{t('section7Body')}</p>
        </section>
      </div>
    </main>
  );
}
