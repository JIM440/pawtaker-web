import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawtaker-web.vercel.app";

const ROUTES = ["/", "/privacy", "/terms"] as const;
const LOCALES = ["en", "fr"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${route === "/" ? "" : route}`,
      lastModified,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.7,
    }))
  );
}
