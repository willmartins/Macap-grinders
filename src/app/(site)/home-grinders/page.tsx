import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadJourney } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadJourney("home-grinders", "published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/home-grinders",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function JourneyContent() {
  const page = await loadJourney("home-grinders", await draftPerspective());
  return <ContentPage page={page} journey="home" />;
}

export default function HomeGrindersPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <JourneyContent />
    </Suspense>
  );
}
