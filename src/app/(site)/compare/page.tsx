import { Suspense } from "react";

import { CompareTable } from "@/components/grinders/spec-table";
import { PhotoSlot } from "@/components/site/photo-slot";
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
      <header className="frame pt-16 md:pt-24">
        <p className="label">
          <span className="trim" />
          Two or three models
        </p>
        <h1 className="display mt-5">Compare</h1>
        <p className="mt-6 max-w-2xl text-lg">
          Choose two or three grinders. The table is the specification. The notes describe the difference.
        </p>
      </header>
      <div className="frame py-12">
        {grinders.length >= 2 ? (
          <>
            <ul className="mb-12 grid gap-8 md:grid-cols-3">
              {grinders.map((grinder) => (
                <li key={grinder.id}>
                  <PhotoSlot
                    imageUrl={grinder.imageUrl}
                    alt={grinder.imageAlt || grinder.name}
                    ratio="16/9"
                    sizes="(min-width: 768px) 30rem, 100vw"
                  />
                  <p className="label mt-4 text-muted">{grinder.groupName || "Macap"}</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight">
                    <TextLink href={`/grinders/${grinder.slug}`} className="underline-offset-4 hover:underline">
                      {grinder.name}
                    </TextLink>
                  </h2>
                </li>
              ))}
            </ul>
            <CompareTable grinders={grinders} />
            <h2 className="display-sm mt-16">What is different</h2>
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
                <TextLink
                  href={compareHref(grinders.map((item) => item.slug).filter((slug) => slug !== grinder.slug))}
                  className="underline underline-offset-4"
                >
                  Remove {grinder.name}
                </TextLink>
              </li>
            ))}
          </ul>
        ) : null}
        {grinders.length < 3 ? (
          <div className="mt-12">
            <h2 className="text-3xl font-medium tracking-tight">{grinders.length ? "Add a grinder" : "Start with a grinder"}</h2>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {choices.map((grinder) => (
                <li key={grinder.id}>
                  <TextLink
                    href={compareHref([...grinders.map((item) => item.slug), grinder.slug])}
                    className="underline underline-offset-4"
                  >
                    {grinder.name}
                  </TextLink>
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
