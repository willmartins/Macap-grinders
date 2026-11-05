import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Mono } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";

import { consentBootstrap } from "@/components/site/analytics-scripts";
import { defaultDescription, getSiteUrl, siteName } from "@/lib/site";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";
import "./contain.css";

const macap = localFont({
  src: [
    {
      path: "../../public/fonts/elza/Elza-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/elza/Elza-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/elza/Elza-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/elza/Elza-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-macap",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: `${siteName} coffee grinders`, template: "%s | Macap" },
  description: defaultDescription,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${macap.variable} ${spaceMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-black antialiased">
        <Script id="consent-mode" strategy="beforeInteractive">
          {consentBootstrap}
        </Script>
        {children}
        <Suspense fallback={null}>
          <SanityLive includeDrafts={false} />
        </Suspense>
      </body>
    </html>
  );
}
