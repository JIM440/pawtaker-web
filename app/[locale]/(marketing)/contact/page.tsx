import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact PawTaker',
  description: 'Get in touch with the PawTaker team.',
};

export default async function ContactPage() {
  return (
    <>
      <LandingNavbar />
      <section className="bg-[#f5f0f0] px-5 pb-18 pt-34 sm:px-8 sm:pb-22 lg:px-10 xl:px-[80px]">
        <div className="mx-auto max-w-[1440px]">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
