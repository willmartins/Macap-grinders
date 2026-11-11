import Image from "next/image";

import { GrinderGrid } from "@/components/grinders/grinder-card";
import { CollectionGrid, RangeGrid } from "@/components/grinders/range-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FeatureCard } from "@/components/site/feature-card";
import { RichTextBody } from "@/components/site/rich-text";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { compareHref } from "@/lib/compare";
import type { Range, RangeCard } from "@/lib/content/types";
import { audiencePages, grinderPath, rangePath } from "@/lib/paths";

/** The audience page a range belongs to. A range for both audiences goes back to the catalogue. */
function audiencePage(range: RangeCard) {
  if (range.audience === "home" || range.audience === "business") return audiencePages[range.audience];
  return { path: "/grinders", label: "Grinders" };
}

/**
 * The range page. A fixed layout, so every range reads the same way:
 * header, models, about the range, feature cards, collections, other ranges.
 * Sections without content are left out.
 */
export function RangePage({ range, otherRanges }: { range: Range; otherRanges: RangeCard[] }) {
  const parent = audiencePage(range);
  const current = range.grinders.filter((grinder) => grinder.status !== "discontinued");
  const discontinued = range.grinders.filter((grinder) => grinder.status === "discontinued");
  const compare = current.length > 1 ? compareHref(current.slice(0, 3).map((grinder) => grinder.slug)) : null;
  // The trail follows the address, as on a model page: Grinders, then the range.
  const crumbs = [
    { name: "Grinders", path: "/grinders" },
    { name: range.name, path: rangePath(range.slug) },
  ];
  const sections = [
    current.length || discontinued.length ? "models" : null,
    range.story.length ? "story" : null,
    range.features.length ? "features" : null,
    range.collections.length ? "collections" : null,
    otherRanges.length ? "others" : null,
  ].filter(Boolean);
  // A hairline closes each section. The last one has none, because the footer draws its own.
  const rule = (name: string) => (sections[sections.length - 1] === name ? "" : "border-b border-silver");

  return (
    <>
      {/* Header: a split chapter. Text on the left, the range's picture running to the right edge. */}
      <header className="border-b border-silver bg-white">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 px-[var(--frame-inset)] pt-6 pb-10 md:pr-10 md:pb-14 md:pl-[var(--frame-inset)]">
            <Breadcrumbs bare items={crumbs} />
            <div>
              <p className="type-eyebrow text-grey">
                {parent.path !== "/grinders" ? (
                  <a href={parent.path} className="hover:text-black">
                    {parent.label}
                  </a>
                ) : (
                  "Range"
                )}
              </p>
              <h1 className="type-h1 mt-3 max-w-xl text-black">{range.name}</h1>
              {range.answerFirst || range.summary ? (
                <p className="type-lead mt-5 max-w-xl text-grey">{range.answerFirst || range.summary}</p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {current.length ? (
                  <a href="#models" className="btn">
                    See the models
                  </a>
                ) : null}
                {compare ? (
                  <a href={compare} className="btn btn-secondary">
                    Compare
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className={`relative order-first aspect-[4/3] md:order-none md:aspect-auto md:min-h-[min(36rem,70dvh)] ${
              range.imageKind === "cutout" ? "bg-silver" : "bg-light-grey"
            }`}
          >
            {range.imageUrl ? (
              <Image
                src={range.imageUrl}
                alt={range.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className={range.imageKind === "cutout" ? "object-contain p-[8%]" : "object-cover"}
              />
            ) : (
              <p className="type-eyebrow absolute inset-0 grid place-items-center text-grey">Photography to follow</p>
            )}
          </div>
        </div>
      </header>

      {sections.includes("models") ? (
        <section id="models" className={`section bg-white ${rule("models")}`.trim()} aria-labelledby="models-heading">
          <div className="frame">
            <SectionHeader
              id="models-heading"
              eyebrow={range.name}
              title="Models"
              className="mb-8"
              action={
                compare ? (
                  <TextLink href={compare} className="tap type-body font-semibold text-black link-underline">
                    Compare these models
                  </TextLink>
                ) : undefined
              }
            />
            {current.length ? <GrinderGrid grinders={current} /> : null}
            {discontinued.length ? (
              <div className={current.length ? "mt-12" : ""}>
                <p className="type-eyebrow border-t border-silver pt-4 text-grey">No longer made</p>
                <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {discontinued.map((grinder) => (
                    <li key={grinder.id}>
                      <TextLink href={grinderPath(grinder)} className="tap type-body font-semibold text-black link-underline">
                        {grinder.name}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {sections.includes("story") ? (
        <section className={`section bg-light-grey ${rule("story")}`.trim()} aria-labelledby="story-heading">
          <div className="frame grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader id="story-heading" eyebrow={range.name} title="About the range" />
            </div>
            <div className="lg:col-span-7">
              <RichTextBody value={range.story} />
            </div>
          </div>
        </section>
      ) : null}

      {sections.includes("features") ? (
        <section className={`section bg-white ${rule("features")}`.trim()} aria-labelledby="features-heading">
          <div className="frame">
            <SectionHeader id="features-heading" eyebrow={range.name} title="What the range shares" className="mb-8" />
            <ul className="grid gap-[var(--gap-inner)] sm:grid-cols-2 lg:grid-cols-3">
              {range.features.map((feature) => (
                <li key={feature._key} className="flex">
                  <FeatureCard feature={feature} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {sections.includes("collections") ? (
        <section className={`section bg-white ${rule("collections")}`.trim()} aria-labelledby="collections-heading">
          <div className="frame">
            <SectionHeader
              id="collections-heading"
              eyebrow="Collections"
              title={`Models from ${range.name} also appear in`}
              className="mb-8"
            />
            <CollectionGrid collections={range.collections} />
          </div>
        </section>
      ) : null}

      {sections.includes("others") ? (
        <section className={`section bg-white ${rule("others")}`.trim()} aria-labelledby="others-heading">
          <div className="frame">
            <SectionHeader
              id="others-heading"
              eyebrow={parent.label}
              title="Other ranges"
              className="mb-8"
              action={
                <TextLink href={parent.path} className="tap type-body font-semibold text-black link-underline">
                  {parent.path === "/grinders" ? "All grinders" : `All ${parent.label.toLowerCase()}`}
                </TextLink>
              }
            />
            <RangeGrid ranges={otherRanges} />
          </div>
        </section>
      ) : null}
    </>
  );
}
