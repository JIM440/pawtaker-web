import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
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
  title: "PawTaker",
  description: "Pet care and community platform",
  openGraph: {
    title: "PawTaker",
    description: "Pet care and community platform",
    images: ["/app_preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PawTaker",
    description: "Pet care and community platform",
    images: ["/app_preview.png"],
  },
  icons: {
    icon: "/logos/coloured-favicon.png",
    apple: "/logos/coloured-favicon.png",
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
        className={`${outfit.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
