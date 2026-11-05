import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";

import { consentBootstrap } from "@/components/site/analytics-scripts";
import { defaultDescription, getSiteUrl, siteName } from "@/lib/site";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

const macap = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-macap",
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
    <html lang="en-GB" className={`${macap.variable} h-full`}>
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
