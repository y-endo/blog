import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { SmoothAnchorScroll } from "@/app/_components/smooth-anchor-scroll";
import { openGraphImage, siteDescription, siteName, siteUrl } from "@/lib/site";

import "./globals.scss";

const googleAnalyticsId = "G-PBP3D9REL3";

const notoSansJp = Noto_Sans_JP({
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

const notoSerifJp = Noto_Serif_JP({
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-jp",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description: siteDescription,
  metadataBase: siteUrl,
  openGraph: {
    description: siteDescription,
    locale: "ja_JP",
    siteName,
    title: siteName,
    type: "website",
    url: "/",
  },
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [openGraphImage],
    title: siteName,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} ${notoSerifJp.variable}`}>
        <SmoothAnchorScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `}
      </Script>
    </html>
  );
}
