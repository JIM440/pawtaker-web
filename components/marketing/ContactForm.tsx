'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

type ContactFormState = {
  name: string;
  email: string;
  city: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  city: '',
  subject: '',
  message: '',
};

export function ContactForm() {
  const t = useTranslations('marketing.contact');
  const locale = useLocale();
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function updateField<Key extends keyof ContactFormState>(key: Key, value: ContactFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          locale,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? t('errors.generic'));
      }

      setForm(initialState);
      setStatus({ type: 'success', message: t('success') });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : t('errors.generic'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-16">
      <div className="hidden overflow-hidden lg:block">
        <div className="relative min-h-[320px] p-10 sm:min-h-[420px] lg:h-full lg:min-h-[760px]">
          <Image
            src="/images/contact.png"
            alt={t('title')}
            fill
            priority
            className="animate-float-y-slow object-contain"
            sizes="(max-width: 1024px) 100vw, 48vw"
            style={{ maxWidth: '450px', marginInline: 'auto' }}
          />
        </div>
      </div>


      <div className="mx-auto w-full max-w-[720px] lg:max-w-none">
        <div className="mb-8 text-left">
          <h1 className="max-w-2xl text-3xl font-bold tracking-[-0.03em] text-[#2d1f24] sm:text-4xl">
            Contact Us
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2d1f24]">{t('form.nameLabel')}</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-[#d9c8cc] bg-[#fffaf8] px-4 py-3 text-sm text-[#2d1f24] outline-none transition focus:border-[#8c4a60] focus:ring-4 focus:ring-[#8c4a60]/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2d1f24]">{t('form.emailLabel')}</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder={t('form.emailPlaceholder')}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-[#d9c8cc] bg-[#fffaf8] px-4 py-3 text-sm text-[#2d1f24] outline-none transition focus:border-[#8c4a60] focus:ring-4 focus:ring-[#8c4a60]/10"
              />
            </label>
          </div>

          <div className="grid gap-x-3 gap-y-5 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2d1f24]">{t('form.cityLabel')}</span>
              <input
                type="text"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder={t('form.cityPlaceholder')}
                autoComplete="address-level2"
                className="w-full rounded-2xl border border-[#d9c8cc] bg-[#fffaf8] px-4 py-3 text-sm text-[#2d1f24] outline-none transition focus:border-[#8c4a60] focus:ring-4 focus:ring-[#8c4a60]/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2d1f24]">{t('form.subjectLabel')}</span>
              <input
                type="text"
                value={form.subject}
                onChange={(event) => updateField('subject', event.target.value)}
                placeholder={t('form.subjectPlaceholder')}
                required
                className="w-full rounded-2xl border border-[#d9c8cc] bg-[#fffaf8] px-4 py-3 text-sm text-[#2d1f24] outline-none transition focus:border-[#8c4a60] focus:ring-4 focus:ring-[#8c4a60]/10"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#2d1f24]">{t('form.messageLabel')}</span>
            <textarea
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder={t('form.messagePlaceholder')}
              required
              rows={7}
              className="w-full resize-none rounded-3xl border border-[#d9c8cc] bg-[#fffaf8] px-4 py-3 text-sm leading-6 text-[#2d1f24] outline-none transition focus:border-[#8c4a60] focus:ring-4 focus:ring-[#8c4a60]/10"
            />
          </label>

          {status ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                status.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#8c4a60] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7b4255] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t('form.submitting') : t('form.submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
