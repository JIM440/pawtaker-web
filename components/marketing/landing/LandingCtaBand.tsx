import { getTranslations } from "next-intl/server";
import { LandingCtaStoreRow } from "@/components/marketing/landing/StoreButtons";

export async function LandingCtaBand() {
  const t = await getTranslations("marketing.landing.cta");

  return (
    <section
      id="download"
      className="w-full bg-[#ede6e7] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px] xl:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="rounded-[28px] bg-[#8c4a60] px-6 py-16 sm:px-10 lg:px-[80px] lg:py-16">
          <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 text-center">
            <h2 className="font-wobblite font-bold tracking-[-0.5px] text-[#e1e2c7] block text-[clamp(2.5rem,12vw,6.25rem)] leading-[0.8] xl:text-[100px] xl:leading-[80px] max-w-full wrap-break-word">
              {t("headingLine1")} <br />
              {t("headingLine2")}
            </h2>
            <div className="max-w-xl text-[18px] font-normal leading-6 tracking-[-0.25px] text-[#e1e2c7]">
              <p className="mb-0">{t("subtitleLine1")}</p>
              <p>{t("subtitleLine2")}</p>
            </div>
            <LandingCtaStoreRow />
          </div>
        </div>
      </div>
    </section>
  );
}
