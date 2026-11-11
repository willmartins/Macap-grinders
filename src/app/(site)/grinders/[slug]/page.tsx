import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";

import { RangePage } from "@/components/grinders/range-page";
import { PageBuilder } from "@/components/modules/page-builder";
import { BleedHero } from "@/components/site/bleed-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { ThemeLock } from "@/components/site/theme-frame";
import type { Collection, Section, ThemeName } from "@/lib/content/types";
import { collectionShot } from "@/lib/imagery";
import { collectionJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { collectionPath, grinderPath, rangePath } from "@/lib/paths";
import { draftPerspective } from "@/sanity/lib/draft";
import {
  loadCollection,
  loadGrinder,
  loadGrinderPathOwner,
  loadRange,
  loadRanges,
  loadShell,
} from "@/sanity/lib/load";

/**
 * /grinders/<slug> is a range or a collection. They share the address space, and Studio
 * keeps their slugs apart. If both exist, the range wins. An old short grinder address
 * (/grinders/<model>) moves to the model's page under its range.
 */

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const [{ ranges }, shell] = await Promise.all([loadRanges("published"), loadShell("published")]);
  const slugs = new Set([...ranges.map((range) => range.slug), ...shell.collections.map((item) => item.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

function themeFor(audience: string): ThemeName {
  if (audience === "business") return "professional";
  if (audience === "home") return "home";
  return "neutral";
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const owner = await loadGrinderPathOwner(slug, "published");
  if (owner?.kind === "range") {
    const loaded = await loadRange(slug, "published");
    if (!loaded) return {};
    const { range } = loaded;
    return buildMetadata({
      title: range.seo.title || `${range.name} grinders`,
      description: range.seo.description || range.answerFirst || range.summary,
      path: rangePath(range.slug),
      noIndex: range.seo.noIndex,
      canonical: range.seo.canonical,
      image: range.seo.imageUrl,
    });
  }
  if (owner?.kind === "collection") {
    const loaded = await loadCollection(slug, "published");
    if (!loaded) return {};
    const { collection } = loaded;
    return buildMetadata({
      title: collection.seo.title || collection.name,
      description: collection.seo.description || collection.answerFirst || collection.summary,
      path: collectionPath(collection.slug),
      noIndex: collection.seo.noIndex,
      canonical: collection.seo.canonical,
    });
  }
  return {};
}

/** A collection always shows its models. If the editor left the section out, it goes last. */
function collectionSections(collection: Collection): Section[] {
  if (collection.sections.some((section) => section._type === "collectionModels")) return collection.sections;
  return [...collection.sections, { _key: "collection-models", _type: "collectionModels", heading: "The models" }];
}

async function RangeContent({ slug }: { slug: string }) {
  const perspective = await draftPerspective();
  const [loaded, { ranges }] = await Promise.all([loadRange(slug, perspective), loadRanges(perspective)]);
  if (!loaded) notFound();
  const { range, sample } = loaded;
  const otherRanges = ranges.filter(
    (item) =>
      item.slug !== range.slug &&
      (range.audience === "both" || item.audience === range.audience || item.audience === "both"),
  );
  return (
    <article>
      <ThemeLock theme={themeFor(range.audience)} />
      {sample ? <SampleBanner /> : null}
      <RangePage range={range} otherRanges={otherRanges} />
      <JsonLd
        data={collectionJsonLd({
          name: range.name,
          description: range.answerFirst || range.summary,
          slug: range.slug,
          grinders: range.grinders.filter((grinder) => grinder.status !== "discontinued"),
        })}
      />
    </article>
  );
}

async function CollectionContent({ slug }: { slug: string }) {
  const loaded = await loadCollection(slug, await draftPerspective());
  if (!loaded) notFound();
  const { collection, sample } = loaded;
  const sections = collectionSections(collection);
  const leadsWithHero = sections[0]?._type === "heroBanner";
  const shot = collection.imageUrl
    ? { src: collection.imageUrl, alt: collection.imageAlt || "" }
    : collectionShot(collection.slug);
  const crumbs = [
    { name: "Grinders", path: "/grinders" },
    { name: collection.name, path: collectionPath(collection.slug) },
  ];
  return (
    <article>
      <ThemeLock theme={themeFor(collection.audience)} />
      {sample ? <SampleBanner /> : null}
      {leadsWithHero ? null : shot ? (
        <BleedHero
          imageUrl={shot.src}
          alt={shot.alt}
          eyebrow="Collection"
          title={collection.name}
          text={collection.answerFirst || collection.summary}
          short
          crumbs={<Breadcrumbs bare items={crumbs} />}
        />
      ) : (
        <>
          <Breadcrumbs items={crumbs} />
          <header className="section-tight border-b border-silver">
            <div className="frame">
              <p className="type-eyebrow text-grey">Collection</p>
              <h1 className="type-h1 mt-3 text-black">{collection.name}</h1>
              <p className="type-lead mt-5 max-w-2xl text-grey">{collection.answerFirst || collection.summary}</p>
            </div>
          </header>
        </>
      )}
      <PageBuilder sections={sections} context={{ grinders: collection.grinders }} />
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

async function GrinderPathContent({ params }: { params: Params }) {
  const { slug } = await params;
  const owner = await loadGrinderPathOwner(slug, await draftPerspective());
  if (owner?.kind === "range") return <RangeContent slug={slug} />;
  if (owner?.kind === "collection") return <CollectionContent slug={slug} />;
  if (owner?.kind === "grinder") {
    const loaded = await loadGrinder(slug, "published");
    if (loaded?.grinder.groupSlug) permanentRedirect(grinderPath(loaded.grinder));
  }
  notFound();
}

export default function GrinderPathPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <GrinderPathContent params={params} />
    </Suspense>
  );
}
