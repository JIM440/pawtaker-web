import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit, Roboto } from "next/font/google";
import "./globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawtaker-web.vercel.app";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PawTaker",
  description: "Start sharing the joy of pet care with your neighbours today.",
  keywords: [
    "PawTaker",
    "pawtaker",
    "pet care",
    "pet sitting",
    "dog sitter",
    "cat sitter",
    "community pet care",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    title: "PawTaker",
    description: "Start sharing the joy of pet care with your neighbours today.",
    url: SITE_URL,
    siteName: "PawTaker",
    type: "website",
    images: ["/logos/primary-logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PawTaker",
    description: "Start sharing the joy of pet care with your neighbours today.",
    images: ["/logos/primary-logo.svg"],
  },
  icons: {
    icon: "/logos/coloured-favicon.svg",
    apple: "/logos/coloured-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${geistMono.variable} ${roboto.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PawTaker",
              url: SITE_URL,
              logo: `${SITE_URL}/logos/primary-logo.svg`,
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
