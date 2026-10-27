import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BleedHero } from "@/components/site/bleed-hero";
import { PageBuilder } from "@/components/modules/page-builder";
import { collectionShot } from "@/lib/imagery";
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
  const shot = collectionShot(collection.slug);
  return (
    <article>
      <ThemeLock theme={theme} />
      {sample ? <SampleBanner /> : null}
      {shot ? (
        <BleedHero
          imageUrl={shot.src}
          alt={shot.alt}
          title={collection.name}
          text={collection.answerFirst || collection.summary}
          short
          crumbs={
            <Breadcrumbs overlay items={[{ name: collection.name, path: `/collections/${collection.slug}` }]} />
          }
        />
      ) : (
        <>
          <Breadcrumbs items={[{ name: collection.name, path: `/collections/${collection.slug}` }]} />
          <header className="frame section-tight">
            <h1 className="display">{collection.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed">{collection.answerFirst || collection.summary}</p>
          </header>
        </>
      )}
      <div className="frame section">
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
