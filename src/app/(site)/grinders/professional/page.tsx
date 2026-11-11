import { Suspense } from "react";

import { JsonLd } from "@/components/site/json-ld";
import { ContentPage } from "@/components/site/content-page";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { audiencePages } from "@/lib/paths";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadJourney, loadRanges, loadShell } from "@/sanity/lib/load";

const audience = "business" as const;
const page = audiencePages[audience];

export async function generateMetadata() {
  const journey = await loadJourney("professional", "published");
  return buildMetadata({
    title: journey.seo.title || journey.title,
    description: journey.seo.description || journey.introduction,
    path: page.path,
    noIndex: journey.seo.noIndex,
    canonical: journey.seo.canonical,
  });
}

async function AudienceContent() {
  const perspective = await draftPerspective();
  const [journey, { ranges }, shell] = await Promise.all([
    loadJourney("professional", perspective),
    loadRanges(perspective),
    loadShell(perspective),
  ]);
  const rangeSlugs = new Set(ranges.map((range) => range.slug));
  return (
    <>
      <ContentPage
        page={journey}
        journey="professional"
        context={{
          ranges: ranges.filter((range) => range.audience === audience || range.audience === "both"),
          // A collection that shares a range's slug is shadowed by the range, so it is left out.
          collections: shell.collections.filter(
            (item) => (item.audience === audience || item.audience === "both") && !rangeSlugs.has(item.slug),
          ),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Macap", path: "/" },
          { name: "Grinders", path: "/grinders" },
          { name: page.label, path: page.path },
        ])}
      />
    </>
  );
}

export default function ProfessionalGrindersPage() {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <AudienceContent />
    </Suspense>
  );
}
