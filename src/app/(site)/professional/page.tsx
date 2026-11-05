import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadJourney } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadJourney("professional", "published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/professional",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function JourneyContent() {
  const page = await loadJourney("professional", await draftPerspective());
  return <ContentPage page={page} journey="professional" />;
}

export default function ProfessionalPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <JourneyContent />
    </Suspense>
  );
}
