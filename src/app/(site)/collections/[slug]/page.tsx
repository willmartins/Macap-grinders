import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageBuilder } from "@/components/modules/page-builder";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { ThemeLock } from "@/components/site/theme-frame";
import { collectionJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadCollection, loadShell } from "@/sanity/lib/load";

export async function generateStaticParams() {
  const shell = await loadShell("published");
  return shell.collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadCollection(slug, "published");
  if (!loaded) return {};
  const { collection } = loaded;
  return buildMetadata({
    title: collection.seo.title || collection.name,
    description: collection.seo.description || collection.answerFirst || collection.summary,
    path: `/collections/${collection.slug}`,
    noIndex: collection.seo.noIndex,
    canonical: collection.seo.canonical,
  });
}

async function CollectionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadCollection(slug, await draftPerspective());
  if (!loaded) notFound();
  const { collection, sample } = loaded;
  const theme =
    collection.audience === "business" ? "professional" : collection.audience === "home" ? "home" : "neutral";
  return (
    <article>
      <ThemeLock theme={theme} />
      {sample ? <SampleBanner /> : null}
      <Breadcrumbs items={[{ name: collection.name, path: `/collections/${collection.slug}` }]} />
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="text-4xl font-medium tracking-tight md:text-6xl">{collection.name}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{collection.answerFirst || collection.summary}</p>
      </header>
      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <GrinderGrid grinders={collection.grinders} />
      </div>
      <PageBuilder sections={collection.sections} />
      <JsonLd
        data={collectionJsonLd({
          name: collection.name,
          description: collection.answerFirst || collection.summary,
          slug: collection.slug,
          grinders: collection.grinders,
        })}
      />
    </article>
  );
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <CollectionContent params={params} />
    </Suspense>
  );
}
