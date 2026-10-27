import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { connection } from "next/server";
import { Suspense } from "react";

import { AnalyticsScripts } from "@/components/site/analytics-scripts";
import { CookieConsent } from "@/components/site/cookie-consent";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { ClickTracker } from "@/components/site/trackers";
import { ThemeFrame } from "@/components/site/theme-frame";
import { organisationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { loadShell } from "@/sanity/lib/load";

async function IndexingMarker() {
  await connection();
  return null;
}

async function DraftTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <VisualEditing />;
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const shell = await loadShell("published");
  return (
    <ThemeFrame>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Header links={shell.settings.navigation} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer shell={shell} />
      <CookieConsent />
      <JsonLd data={organisationJsonLd(shell)} />
      <JsonLd data={websiteJsonLd()} />
      <AnalyticsScripts />
      <ClickTracker />
      <Suspense fallback={null}>
        <IndexingMarker />
      </Suspense>
      <Suspense fallback={null}>
        <DraftTools />
      </Suspense>
    </ThemeFrame>
  );
}
