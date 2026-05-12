import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';

/** Figma: outline M3 button — 14px medium, px-24 py-14; CTAs hug content width */
const outlineBtnSmall =
  'inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[#d5c2c6] border-solid px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#8c4a60] transition-colors hover:bg-[#8c4a60]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a60]/30';

const outlineBtnWide =
  'inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[#d5c2c6] border-solid px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#8c4a60] transition-colors hover:bg-[#8c4a60]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a60]/30';

export async function LandingWhyPawtaker() {
  const t = await getTranslations('marketing.landing.why');

  return (
    <section
      id="why-pawtaker"
      className="w-full bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px] xl:py-16"
      aria-labelledby="why-pawtaker-heading"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 md:gap-20">
        <SectionReveal>
          <div className="mx-auto flex max-w-[900px] flex-col gap-6 text-center">
            <h2
              id="why-pawtaker-heading"
              className="font-wobblite text-[clamp(2.5rem,12vw,6.25rem)] font-bold leading-[0.8] tracking-[-0.5px] text-[#8c4a60] xl:text-[100px] xl:leading-[80px]"
            >
              {t('heading')}
            </h2>
            <p className="whitespace-pre-wrap text-[18px] font-normal leading-6 tracking-[-0.25px] text-[#665459]">
              {t('intro')}
            </p>
          </div>
        </SectionReveal>

        {/* Feature 1 — narrow: single column centered; 800px+: two cols as before */}
        <SectionReveal delayMs={80}>
          <div className="flex min-h-[320px] flex-col gap-16 rounded-xl max-[799px]:items-center min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between min-[800px]:gap-20">
            <div className="flex w-full max-w-[540px] flex-col gap-4 text-center min-[800px]:text-left">
              <h3 className="text-[32px] font-bold leading-10 tracking-[-0.5px] text-[#8c4a60]">{t('kindnessTitle')}</h3>
              <p className="whitespace-pre-wrap text-base font-normal leading-6 tracking-[-0.2px] text-[#665459]">
                {t('kindnessBody')}
              </p>
              <Link href="/#download" className={`${outlineBtnSmall} max-[799px]:mx-auto min-[800px]:mx-0`}>
                {t('kindnessCta')}
              </Link>
            </div>
            <div className="relative mx-auto h-[240px] w-full max-w-[527px] sm:h-[280px] min-[800px]:mx-0 min-[800px]:h-[320px] min-[800px]:min-h-[319px]">
              <Image
                src="/images/feature-img-one.svg"
                alt=""
                fill
                className="animate-float-y-slow object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 528px"
              />
            </div>
          </div>
        </SectionReveal>

        {/* Feature 2 — image | text */}
        <SectionReveal delayMs={120}>
          <div className="flex min-h-[320px] flex-col gap-16 rounded-xl max-[799px]:items-center min-[800px]:flex-row-reverse min-[800px]:items-center min-[800px]:justify-between min-[800px]:gap-20">
            <div className="flex w-full max-w-[540px] flex-col gap-4 text-center min-[800px]:text-left">
              <h3 className="text-[32px] font-bold leading-10 tracking-[-0.5px] text-[#8c4a60]">{t('freedomTitle')}</h3>
              <p className="text-base font-normal leading-6 tracking-[-0.2px] text-[#665459]">{t('freedomBody')}</p>
              <Link href="/#download" className={`${outlineBtnSmall} max-[799px]:mx-auto min-[800px]:mx-0`}>
                {t('freedomCta')}
              </Link>
            </div>
            <div className="relative mx-auto h-[240px] w-full max-w-[527px] sm:h-[280px] min-[800px]:mx-0 min-[800px]:h-[320px] min-[800px]:min-h-[319px]">
              <Image
                src="/images/feature-img-two.svg"
                alt=""
                fill
                className="animate-float-y-slow animate-delay-1 object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 528px"
              />
            </div>
          </div>
        </SectionReveal>

        {/* Feature 3 — text | image */}
        <SectionReveal delayMs={160}>
          <div className="flex min-h-[320px] flex-col gap-16 rounded-xl max-[799px]:items-center min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between min-[800px]:gap-20">
            <div className="flex w-full max-w-[540px] flex-col gap-4 text-center min-[800px]:text-left">
              <h3 className="text-[32px] font-bold leading-10 tracking-[-0.5px] text-[#8c4a60]">{t('trustTitle')}</h3>
              <p className="whitespace-pre-wrap text-base font-normal leading-6 tracking-[-0.2px] text-[#665459]">
                {t('trustBody')}
              </p>
              <Link href="/how-it-works" className={`${outlineBtnWide} max-[799px]:mx-auto min-[800px]:mx-0`}>
                {t('trustCta')}
              </Link>
            </div>
            <div className="relative mx-auto h-[240px] w-full max-w-[527px] sm:h-[280px] min-[800px]:mx-0 min-[800px]:h-[320px] min-[800px]:min-h-[319px]">
              <Image
                src="/images/feature-img-three.svg"
                alt=""
                fill
                className="animate-float-y-slow animate-delay-2 object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 528px"
              />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
