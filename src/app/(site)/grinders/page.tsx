import { Suspense } from "react";

import { FilterBar } from "@/components/grinders/filters";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
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
      <Breadcrumbs items={[{ name: "Grinders", path: "/grinders" }]} />
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <p className="type-eyebrow text-grey">Catalogue</p>
          <h1 className="type-h1 mt-3 text-black">{page.title}</h1>
          <p className="type-lead mt-5 max-w-2xl text-grey">{page.introduction}</p>
        </div>
      </header>
      <section className="section border-b border-silver" aria-label="Grinders">
        <div className="frame">
          <FilterBar groups={catalogue.groups} burrs={burrs} filters={filters} />
          {/* The count sits on a hairline, as a label above the grid. */}
          <p className="type-eyebrow mt-10 border-t border-silver pt-4 text-grey">
            {grinders.length} {grinders.length === 1 ? "grinder" : "grinders"}
          </p>
          <div className="mt-6">
            <GrinderGrid grinders={grinders} />
          </div>
          {grinders.length > 1 ? (
            <p className="mt-8">
              <TextLink
                href={compareHref(grinders.slice(0, 3).map((grinder) => grinder.slug))}
                className="tap type-body font-semibold text-black link-underline"
              >
                Compare these grinders
              </TextLink>
            </p>
          ) : null}
        </div>
      </section>
    </article>
  );
}

export default function GrindersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <GrindersContent searchParams={searchParams} />
    </Suspense>
  );
}
