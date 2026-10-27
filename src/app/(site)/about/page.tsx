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
      <nav className="frame pb-[var(--space-standard)]" aria-label="Ranges">
        <p className="flex flex-wrap gap-x-8">
          <TextLink href="/home-grinders" className="tap">
            Home grinders
          </TextLink>
          <TextLink href="/professional" className="tap">
            Professional
          </TextLink>
        </p>
      </nav>
    </>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <AboutContent />
    </Suspense>
  );
}
