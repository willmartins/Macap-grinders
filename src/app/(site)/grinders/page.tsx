import { Suspense } from "react";

import { FilterBar } from "@/components/grinders/filters";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { RangeGrid } from "@/components/grinders/range-card";
import { SplitHero } from "@/components/site/bleed-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SampleBanner } from "@/components/site/sample-banner";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { compareHref } from "@/lib/compare";
import { applyFilters, readFilters } from "@/lib/filters";
import { pageShots } from "@/lib/imagery";
import { buildMetadata } from "@/lib/metadata";
import { audiencePages } from "@/lib/paths";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrindersIndex, loadGrinderCards, loadRanges } from "@/sanity/lib/load";

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
  const [page, catalogue, { ranges, sample: sampleRanges }] = await Promise.all([
    loadGrindersIndex(perspective),
    loadGrinderCards(perspective),
    loadRanges(perspective),
  ]);
  const grinders = applyFilters(catalogue.grinders, filters);
  const burrs = [
    ...new Set(
      catalogue.grinders
        .map((grinder) => grinder.burrDiameterMm)
        .filter((size): size is number => size != null),
    ),
  ].sort((a, b) => a - b);
  const audiences = (["home", "business"] as const).map((audience) => ({
    ...audiencePages[audience],
    ranges: ranges.filter((range) => range.audience === audience || range.audience === "both"),
  }));

  return (
    <article>
      {page.sample || catalogue.sample || sampleRanges ? <SampleBanner /> : null}

      {/* Two doors: the audience pages. */}
      <SplitHero
        crumbs={<Breadcrumbs bare items={[{ name: "Grinders", path: "/grinders" }]} />}
        eyebrow={page.title}
        title="For the home or for the bar."
        homeImage={pageShots.homeSplit.src}
        homeAlt={pageShots.homeSplit.alt}
        homeFocus={pageShots.homeSplit.focus}
        proImage={pageShots.professionalSplit.src}
        proAlt={pageShots.professionalSplit.alt}
        proFocus={pageShots.professionalSplit.focus}
      />

      {/* Every range, under its audience. */}
      <section className="section border-b border-silver bg-white" aria-labelledby="ranges-heading">
        <div className="frame">
          <SectionHeader id="ranges-heading" eyebrow="Ranges" title="Every range" description={page.introduction} />
          {audiences.map((audience) =>
            audience.ranges.length ? (
              <div key={audience.path} className="mt-[var(--space-tight)]">
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-silver pt-4">
                  <h3 className="type-h3 text-black">{audience.label}</h3>
                  <TextLink href={audience.path} className="tap type-body font-semibold text-black link-underline">
                    {`See ${audience.label.toLowerCase()}`}
                  </TextLink>
                </div>
                <RangeGrid ranges={audience.ranges} />
              </div>
            ) : null,
          )}
        </div>
      </section>

      {/* Every model, with filters. */}
      <section id="all-models" className="section scroll-mt-[var(--chrome-h,4.5rem)]" aria-labelledby="models-heading">
        <div className="frame">
          <SectionHeader id="models-heading" eyebrow="Models" title="Every model" className="mb-8" />
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
