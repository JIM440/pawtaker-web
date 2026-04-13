import Image from 'next/image';
import type { Locale } from '@/lib/i18n/config';
import { HomeBlogSection } from '@/components/marketing/landing/HomeBlogSection';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';
import { LandingCtaStoreRow, StoreButtonRow } from '@/components/marketing/landing/StoreButtons';
import { getHomeContent } from '@/components/marketing/pawtaker/content';

function DisplayTitle({
  lines,
  className,
  mutedIndex,
}: {
  lines: string[];
  className: string;
  mutedIndex?: number[];
}) {
  return (
    <h2 className={className}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`block ${mutedIndex?.includes(index) ? 'text-[#d5c2c6]' : ''}`}
        >
          {line}
        </span>
      ))}
    </h2>
  );
}

export async function MarketingLandingPage({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);
  const differentItemsByImage = new Map(
    content.different.items.map((item) => [item.image, item] as const)
  );
  const orderedDifferentItems = [
    differentItemsByImage.get('/images/local-pet-care.svg'),
    differentItemsByImage.get('/images/visible-signs-of-reliability.svg'),
    differentItemsByImage.get('/images/familiar-face-over-time.svg'),
    differentItemsByImage.get('/images/community-built-around-real-help.svg'),
  ].filter((item): item is (typeof content.different.items)[number] => Boolean(item));

  return (
    <>
      <LandingNavbar />
      <main className="overflow-x-clip bg-[#f5f0f0]">
        <section className="bg-[#8c4a60] px-5 pb-10 pt-6 text-[#e1e2c7] sm:px-8 sm:pt-8 min-[900px]:max-h-[1200px] lg:px-10 xl:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 min-[900px]:grid-cols-2 min-[900px]:gap-12">
            <div className="min-w-0">
              <DisplayTitle
                lines={content.hero.title}
                className="font-wobblite text-[56px] leading-[0.82] tracking-[-0.5px] text-[#e1e2c7] sm:text-[72px] xl:text-[100px]"
              />
              <p className="mt-6 text-[18px] leading-7 tracking-[-0.1px] text-[#e1e2c7] xl:text-[22px]">
                {content.hero.body}
              </p>
              <div className="mt-6">
                <StoreButtonRow
                  gridMode="hero"
                  className="mx-auto grid w-full max-w-[688px] grid-cols-1 gap-2 sm:grid-cols-2 min-[900px]:mx-0 min-[900px]:max-w-none"
                />
              </div>
            </div>
            <div className="flex min-w-0 justify-center">
              <Image
                src="/hero_img_1.png"
                alt="PawTaker hero dog"
                width={563}
                height={654}
                priority
                sizes="(max-width: 899px) 90vw, 45vw"
                className="animate-float-scale-soft h-auto w-full max-w-[563px]"
              />
            </div>
          </div>
        </section>

        <SectionReveal delayMs={40}>
        <section className="bg-[#ede6e7] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto max-w-[776px] text-center">
              <DisplayTitle
                lines={content.careIntro.title}
                mutedIndex={[2, 3]}
                className="font-wobblite text-[48px] leading-[0.82] tracking-[-0.5px] text-[#8c4a60] sm:text-[64px] xl:text-[100px]"
              />
              <p className="mx-auto mt-6 max-w-[776px] text-[18px] leading-7 tracking-[-0.1px] text-[#665459] xl:text-[22px]">
                {content.careIntro.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {content.careCards.map((card) => (
                <article
                  key={card.title}
                  className="flex min-h-[356px] flex-col items-center rounded-[20px] bg-[#faf2f4] px-10 pb-10 pt-[72px] text-center"
                >
                  <Image src={card.icon} alt="" width={80} height={80} className="mb-3 h-[79px] w-auto" unoptimized />
                  <h3 className="text-[22px] font-bold leading-7 tracking-[-0.1px] text-[#665459] xl:text-[28px] xl:leading-9 xl:tracking-[-0.5px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[18px] leading-7 tracking-[-0.1px] text-[#665459] xl:text-[22px]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delayMs={70}>
        <section className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto max-w-[650px] text-center">
              <DisplayTitle
                lines={content.howItWorks.title}
                className="font-wobblite text-[48px] leading-[0.82] tracking-[-0.5px] text-[#8c4a60] sm:text-[64px] xl:text-[100px]"
              />
              <p className="mt-6 text-[18px] leading-7 tracking-[-0.1px] text-[#665459] xl:text-[22px]">
                {content.howItWorks.subtitle}
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {content.howItWorks.cards.map((card, index) => (
                <article
                  key={card.title}
                  className="grid items-center gap-8 rounded-[20px] bg-[#fffafa] px-8 py-8 lg:grid-cols-2 lg:px-12"
                >
                  <div className={card.imageLeft ? 'lg:order-2' : ''}>
                    <h3 className="max-w-[445px] text-[24px] font-bold leading-8 tracking-[-0.1px] text-[#8c4a60] xl:text-[32px] xl:leading-10">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-[540px] text-base leading-6 tracking-[-0.2px] text-[#665459] xl:text-[18px]">
                      {card.body}
                    </p>
                  </div>
                  <div className={`flex justify-center ${card.imageLeft ? 'lg:order-1' : ''}`}>
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      width={527}
                      height={320}
                      className={`animate-float-scale-soft h-auto w-full max-w-[527px] ${
                        index === 1 ? 'animate-delay-1' : ''
                      } ${index >= 2 ? 'animate-delay-2' : ''} ${index === 2 ? 'max-h-[320px]' : ''}`}
                      unoptimized
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delayMs={90}>
        <section className="bg-[#497A89] px-5 py-[120px] text-center text-[#e1e2c7] sm:px-8 lg:px-10 xl:px-[80px]">
          <div className="mx-auto max-w-[739px]">
            <DisplayTitle
              lines={content.pawPoints.title}
              className="font-wobblite text-[48px] leading-[0.82] tracking-[-0.5px] text-[#e1e2c7] sm:text-[64px] xl:text-[100px]"
            />
            <p className="mt-6 text-[18px] font-bold leading-7 tracking-[-0.1px] text-[#e1e2c7] xl:text-[22px]">
              {content.pawPoints.eyebrow}
            </p>
            <p className="mx-auto mt-6 max-w-[704px] text-[18px] leading-7 tracking-[-0.1px] text-[#e1e2c7] xl:text-[22px]">
              {content.pawPoints.body}
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <Image
              src={content.pawPoints.image}
              alt="What PawPoints mean"
              width={537}
              height={204}
              className="h-auto w-full max-w-[537px]"
              unoptimized
            />
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delayMs={110}>
        <section id="why-pawtaker" className="bg-[#74565f] px-5 py-[120px] text-center sm:px-8 lg:px-10 xl:px-[80px]">
          <div className="mx-auto max-w-[815px]">
            <DisplayTitle
              lines={content.different.title}
              className="font-wobblite text-[48px] leading-[0.82] tracking-[-0.5px] text-[#ffdcc1] sm:text-[64px] xl:text-[100px]"
            />
            <p className="mt-6 text-[18px] font-bold leading-7 tracking-[-0.1px] text-[#ffdcc1] xl:text-[22px]">
              {content.different.eyebrow}
            </p>
            <p className="mx-auto mt-6 max-w-[704px] text-[18px] leading-7 tracking-[-0.1px] text-[#ffdcc1] xl:text-[22px]">
              {content.different.body}
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 gap-6 xl:grid-cols-4">
            {orderedDifferentItems.map((item) => (
              <div key={item.label} className="flex items-center justify-center">
                <Image src={item.image} alt={item.alt} width={210} height={140} className="h-auto w-full max-w-[210px]" unoptimized />
              </div>
            ))}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delayMs={130}>
        <HomeBlogSection locale={locale} title={content.blogs.heading} />
        </SectionReveal>

        <SectionReveal delayMs={150}>
        <section id="download" className="bg-[#ede6e7] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px] xl:py-20">
          <div className="mx-auto max-w-[1440px] rounded-[28px] bg-[#8c4a60] px-6 py-16 text-center sm:px-10 lg:px-[80px]">
            <div className="mx-auto max-w-[900px]">
              <DisplayTitle
                lines={content.cta.title}
                className="font-wobblite text-[48px] leading-[0.82] tracking-[-0.5px] text-[#e1e2c7] sm:text-[64px] xl:text-[100px]"
              />
              <p className="mx-auto mt-6 max-w-xl text-[18px] leading-6 tracking-[-0.25px] text-[#e1e2c7]">
                {content.cta.subtitle}
              </p>
              <div className="mt-6">
                <LandingCtaStoreRow />
              </div>
            </div>
          </div>
        </section>
        </SectionReveal>
      </main>
    </>
  );
}
