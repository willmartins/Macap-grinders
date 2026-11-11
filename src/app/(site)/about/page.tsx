import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { TextLink } from "@/components/site/text-link";
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
  return (
    <>
      <ContentPage page={page} />
      <nav className="frame section-tight" aria-label="Ranges">
        <p className="flex flex-wrap gap-x-8">
          <TextLink href="/grinders/home" className="tap link-underline font-semibold">
            Home grinders
          </TextLink>
          <TextLink href="/grinders/professional" className="tap link-underline font-semibold">
            Professional
          </TextLink>
        </p>
      </nav>
    </>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <AboutContent />
    </Suspense>
  );
}
