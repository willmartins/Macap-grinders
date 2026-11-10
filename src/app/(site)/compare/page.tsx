import { Suspense } from "react";

import { CompareTable, modelColour } from "@/components/grinders/spec-table";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PhotoSlot } from "@/components/site/photo-slot";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { SampleBanner } from "@/components/site/sample-banner";
import { TrackCompare } from "@/components/site/trackers";
import { compareHref, explainDifferences } from "@/lib/compare";
import { readCompareSlugs } from "@/lib/filters";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrinder, loadGrinderCards } from "@/sanity/lib/load";

export async function generateMetadata() {
  return buildMetadata({
    title: "Compare Macap grinders",
    description: "Compare two or three Macap coffee grinders. Specifications, then the differences in plain language.",
    path: "/compare",
  });
}

async function CompareContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const slugs = readCompareSlugs(search.m);
  const perspective = await draftPerspective();
  const catalogue = await loadGrinderCards(perspective);
  const loaded = [];
  for (const slug of slugs) {
    const item = await loadGrinder(slug, perspective);
    if (item) loaded.push(item);
  }
  const grinders = loaded.map((item) => item.grinder);
  const sample = catalogue.sample || loaded.some((item) => item.sample);
  const selected = new Set(grinders.map((grinder) => grinder.slug));
  const choices = catalogue.grinders.filter(
    (grinder) => grinder.status !== "discontinued" && !selected.has(grinder.slug),
  );

  return (
    <article>
      <TrackCompare models={grinders.map((grinder) => grinder.slug).join(",")} />
      {sample ? <SampleBanner /> : null}
      <Breadcrumbs items={[{ name: "Compare", path: "/compare" }]} />
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <p className="type-eyebrow text-grey">Grinders</p>
          <h1 className="type-h1 mt-3 text-black">Compare</h1>
          <p className="type-lead mt-5 max-w-2xl text-grey">
            Choose two or three grinders. The table is the specification. The notes describe the difference.
          </p>
        </div>
      </header>
      <section className="section border-b border-silver" aria-label="Comparison">
        <div className="frame">
          {grinders.length >= 2 ? (
            <>
              {/* Each model keeps its colour, matching its column in the table below. */}
              <ul className="mb-12 grid gap-[var(--gap-inner)] md:grid-cols-3">
                {grinders.map((grinder, index) => (
                  <li key={grinder.id} className={`border-t-2 ${modelColour(index).border} pt-4`}>
                    <PhotoSlot
                      imageUrl={grinder.imageUrl}
                      alt={grinder.imageAlt || grinder.name}
                      ratio="16/9"
                      sizes="(min-width: 768px) 30rem, 100vw"
                    />
                    <p className="type-eyebrow mt-4 text-grey">{grinder.groupName || "Macap"}</p>
                    <h2 className="type-h3 mt-2 text-black">
                      <TextLink href={`/grinders/${grinder.slug}`} className="tap link-underline">
                        {grinder.name}
                      </TextLink>
                    </h2>
                  </li>
                ))}
              </ul>
              <CompareTable grinders={grinders} />
              <SectionHeader title="What is different" className="mt-16" />
              <ul className="mt-8 max-w-3xl border-t border-silver">
                {explainDifferences(grinders).map((note) => (
                  <li key={note} className="type-body border-b border-silver py-4 text-black">
                    {note}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="type-body text-black">Add another grinder. Two is enough. Three is the maximum.</p>
          )}
          {grinders.length ? (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {grinders.map((grinder) => (
                <li key={grinder.id}>
                  <TextLink
                    href={compareHref(grinders.map((item) => item.slug).filter((slug) => slug !== grinder.slug))}
                    className="tap type-body font-semibold text-black link-underline"
                  >
                    Remove {grinder.name}
                  </TextLink>
                </li>
              ))}
            </ul>
          ) : null}
          {grinders.length < 3 ? (
            <div className="mt-12 border-t border-silver pt-8">
              <h2 className="type-h3 text-black">{grinders.length ? "Add a grinder" : "Start with a grinder"}</h2>
              <ul className="mt-6 grid gap-x-[var(--gap-inner)] sm:grid-cols-2 lg:grid-cols-3">
                {choices.map((grinder) => (
                  <li key={grinder.id} className="border-b border-silver">
                    <TextLink
                      href={compareHref([...grinders.map((item) => item.slug), grinder.slug])}
                      className="tap type-body text-black link-underline"
                    >
                      {grinder.name}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="type-body mt-8 text-grey">Remove one to add another.</p>
          )}
        </div>
      </section>
    </article>
  );
}

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <CompareContent searchParams={searchParams} />
    </Suspense>
  );
}
