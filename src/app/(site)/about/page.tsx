import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadAbout } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadAbout("published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/about",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function AboutContent() {
  const page = await loadAbout(await draftPerspective());
  return <ContentPage page={page} />;
}

export default function AboutPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <AboutContent />
    </Suspense>
  );
}
