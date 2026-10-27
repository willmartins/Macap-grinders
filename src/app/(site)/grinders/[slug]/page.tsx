import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GrinderModel } from "@/components/grinders/model";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { ThemeLock } from "@/components/site/theme-frame";
import { TrackGrinderView } from "@/components/site/trackers";
import { grinderFaqs } from "@/lib/faqs";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrinder, loadGrinderCards } from "@/sanity/lib/load";

export async function generateStaticParams() {
  const { grinders } = await loadGrinderCards("published");
  return grinders.map((grinder) => ({ slug: grinder.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadGrinder(slug, "published");
  if (!loaded) return {};
  const { grinder } = loaded;
  return buildMetadata({
    title: grinder.seo.title || `${grinder.name} coffee grinder`,
    description: grinder.seo.description || grinder.answerFirst || grinder.shortDescription,
    path: `/grinders/${grinder.slug}`,
    noIndex: grinder.seo.noIndex || grinder.status === "discontinued",
    canonical: grinder.seo.canonical,
    image: grinder.seo.imageUrl || grinder.imageUrl,
  });
}

async function GrinderContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const perspective = await draftPerspective();
  const [loaded, catalogue] = await Promise.all([loadGrinder(slug, perspective), loadGrinderCards(perspective)]);
  if (!loaded) notFound();
  const { grinder, sample } = loaded;
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
      <GrinderModel grinder={grinder} sample={sample} faqs={faqs} siblings={related} />
      <JsonLd data={productJsonLd(grinder)} />
      <JsonLd data={faqJsonLd(faqs)} />
    </article>
  );
}

export default function GrinderPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <GrinderContent params={params} />
    </Suspense>
  );
}
