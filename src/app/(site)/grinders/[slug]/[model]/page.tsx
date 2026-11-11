import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";

import { GrinderModel } from "@/components/grinders/model";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { ThemeLock } from "@/components/site/theme-frame";
import { TrackGrinderView } from "@/components/site/trackers";
import { grinderFaqs } from "@/lib/faqs";
import { faqJsonLd, jsonLdGraph, productJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { grinderPath } from "@/lib/paths";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrinder, loadGrinderCards } from "@/sanity/lib/load";

type Params = Promise<{ slug: string; model: string }>;

/** Every grinder, under its range. A grinder with no range keeps /grinders/<model>, served by the range route. */
export async function generateStaticParams() {
  const { grinders } = await loadGrinderCards("published");
  return grinders.flatMap((grinder) => (grinder.groupSlug ? [{ slug: grinder.groupSlug, model: grinder.slug }] : []));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { model } = await params;
  const loaded = await loadGrinder(model, "published");
  if (!loaded) return {};
  const { grinder } = loaded;
  return buildMetadata({
    title: grinder.seo.title || `${grinder.name} coffee grinder`,
    description: grinder.seo.description || grinder.answerFirst || grinder.shortDescription,
    path: grinderPath(grinder),
    noIndex: grinder.seo.noIndex || grinder.status === "discontinued",
    canonical: grinder.seo.canonical,
    image: grinder.seo.imageUrl,
  });
}

async function GrinderContent({ params }: { params: Params }) {
  const { slug, model } = await params;
  const perspective = await draftPerspective();
  const [loaded, catalogue] = await Promise.all([loadGrinder(model, perspective), loadGrinderCards(perspective)]);
  if (!loaded) notFound();
  const { grinder, sample } = loaded;
  // The model moved range, or the address names the wrong one.
  if (grinder.groupSlug !== slug) permanentRedirect(grinderPath(grinder));
  const siblings = catalogue.grinders.filter(
    (item) => item.groupSlug && item.groupSlug === grinder.groupSlug && item.slug !== grinder.slug,
  );
  const related = siblings.length ? siblings : grinder.relatedGrinders;
  const faqs = grinderFaqs(grinder);
  return (
    <article>
      <ThemeLock theme={grinder.audience === "business" ? "professional" : "home"} />
      <TrackGrinderView slug={grinder.slug} name={grinder.name} audience={grinder.audience} />
      {sample ? <SampleBanner /> : null}
      <GrinderModel
        grinder={grinder}
        sample={sample}
        faqs={faqs}
        siblings={related}
        allGrinders={catalogue.grinders}
      />
      <JsonLd data={jsonLdGraph([productJsonLd(grinder), faqJsonLd(faqs)])} />
    </article>
  );
}

export default function GrinderPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-grey">Loading.</p>}>
      <GrinderContent params={params} />
    </Suspense>
  );
}
