import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';

export async function LandingCareGap() {
  const t = await getTranslations('marketing.landing.careGap');

  const cards = [
    {
      icon: '/images/clock.svg',
      title: t('timeTitle'),
      stat: t('timeStat'),
      body: t('timeBody'),
    },
    {
      icon: '/images/paw.svg',
      title: t('socialTitle'),
      stat: t('socialStat'),
      body: t('socialBody'),
    },
    {
      icon: '/images/eye.svg',
      title: t('trustTitle'),
      stat: t('trustStat'),
      body: t('trustBody'),
    },
  ] as const;

  return (
    <section
      className="w-full bg-[#ede6e7] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px] xl:py-16"
      aria-labelledby="care-gap-heading"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12">
        <SectionReveal>
          <div className="flex w-full max-w-[583px] flex-col gap-6 text-center">
            <h2
              id="care-gap-heading"
              className="font-wobblite text-[clamp(2.5rem,12vw,6.25rem)] font-bold leading-[0.8] tracking-[-0.5px] text-[#8c4a60] xl:text-[100px] xl:leading-[80px]"
            >
              {t('heading')}
            </h2>
            <p className="text-[18px] font-normal leading-6 tracking-[-0.25px] text-[#665459]">{t('intro')}</p>
          </div>
        </SectionReveal>
        <div className="grid w-full grid-cols-1 gap-8 min-[780px]:grid-cols-2 min-[1000px]:grid-cols-3">
          {cards.map((c, index) => (
            <SectionReveal key={c.title} delayMs={80 * (index + 1)}>
              <article className="flex min-h-[356px] min-w-0 flex-col items-center gap-3 rounded-xl bg-[#faf2f4] px-10 pb-10 pt-[72px] text-center min-[1000px]:min-w-[300px]">
                <Image src={c.icon} alt="" width={56} height={56} className="size-14 shrink-0" />
                <h3 className="text-[22px] font-bold leading-7 tracking-[-0.1px] text-[#665459]">{c.title}</h3>
                <p className="font-wobblite text-[56px] font-bold leading-[52px] text-[#665459]">{c.stat}</p>
                <p className="text-[18px] font-normal leading-6 tracking-[-0.25px] text-[#665459]">{c.body}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
