import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { defaultDescription } from "@/lib/site";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadHome } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadHome("published");
  return buildMetadata({
    title: page.seo.title || "Macap coffee grinders",
    description: page.seo.description || page.introduction || defaultDescription,
    path: "/",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
    image: page.seo.imageUrl,
  });
}

async function HomeContent() {
  const page = await loadHome(await draftPerspective());
  return <ContentPage page={page} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <HomeContent />
    </Suspense>
  );
}
