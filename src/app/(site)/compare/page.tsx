import { Suspense } from "react";

import { CompareTable } from "@/components/grinders/spec-table";
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
      <header className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
        <h1 className="text-4xl font-medium tracking-tight md:text-6xl">Compare</h1>
        <p className="mt-6 max-w-2xl text-lg">
          Choose two or three grinders. The table is the specification. The notes describe the difference.
        </p>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        {grinders.length >= 2 ? (
          <>
            <CompareTable grinders={grinders} />
            <h2 className="mt-12 text-2xl font-medium">What is different</h2>
            <ul className="mt-4 grid max-w-3xl gap-3 text-sm leading-relaxed">
              {explainDifferences(grinders).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Add another grinder. Two is enough. Three is the maximum.</p>
        )}
        {grinders.length ? (
          <ul className="mt-8 flex flex-wrap gap-4 text-sm">
            {grinders.map((grinder) => (
              <li key={grinder.id}>
                <a
                  href={compareHref(grinders.map((item) => item.slug).filter((slug) => slug !== grinder.slug))}
                  className="underline underline-offset-4"
                >
                  Remove {grinder.name}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {grinders.length < 3 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-medium">{grinders.length ? "Add a grinder" : "Start with a grinder"}</h2>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {choices.map((grinder) => (
                <li key={grinder.id}>
                  <a
                    href={compareHref([...grinders.map((item) => item.slug), grinder.slug])}
                    className="underline underline-offset-4"
                  >
                    {grinder.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Remove one to add another.</p>
        )}
      </div>
    </article>
  );
}

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <CompareContent searchParams={searchParams} />
    </Suspense>
  );
}
