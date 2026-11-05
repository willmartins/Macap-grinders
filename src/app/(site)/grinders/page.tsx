import { Suspense } from "react";

import { FilterBar } from "@/components/grinders/filters";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { SampleBanner } from "@/components/site/sample-banner";
import { TextLink } from "@/components/site/text-link";
import { compareHref } from "@/lib/compare";
import { applyFilters, readFilters } from "@/lib/filters";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrindersIndex, loadGrinderCards } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadGrindersIndex("published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/grinders",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function GrindersContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = readFilters(await searchParams);
  const perspective = await draftPerspective();
  const [page, catalogue] = await Promise.all([
    loadGrindersIndex(perspective),
    loadGrinderCards(perspective),
  ]);
  const grinders = applyFilters(catalogue.grinders, filters);
  const burrs = [
    ...new Set(
      catalogue.grinders
        .map((grinder) => grinder.burrDiameterMm)
        .filter((size): size is number => size != null),
    ),
  ].sort((a, b) => a - b);

  return (
    <article>
      {page.sample || catalogue.sample ? <SampleBanner /> : null}
      <header className="frame section-tight">
        <h1 className="display">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{page.introduction}</p>
      </header>
      <div className="frame section-tight">
        <FilterBar groups={catalogue.groups} burrs={burrs} filters={filters} />
        <p className="mt-8 text-sm text-muted">
          {grinders.length} {grinders.length === 1 ? "grinder" : "grinders"}
        </p>
        <div className="mt-6">
          <GrinderGrid grinders={grinders} />
        </div>
        {grinders.length > 1 ? (
          <p className="mt-10">
            <TextLink href={compareHref(grinders.slice(0, 3).map((grinder) => grinder.slug))} className="tap">
              Compare these grinders
            </TextLink>
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function GrindersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <GrindersContent searchParams={searchParams} />
    </Suspense>
  );
}
