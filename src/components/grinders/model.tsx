import Image from "next/image";

import { Enquire } from "@/components/contact/enquire";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { SpecTable } from "@/components/grinders/spec-table";
import { BleedHero } from "@/components/site/bleed-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TextLink } from "@/components/site/text-link";
import { compareHref } from "@/lib/compare";
import type { FaqItem, GalleryImage, Grinder, GrinderCard } from "@/lib/content/types";
import { formatDate, formatNumber } from "@/lib/format";
import { focusFor } from "@/lib/imagery";
import { performanceFigures } from "@/lib/specs";

const burrLabel: Record<string, string> = { flat: "Flat", conical: "Conical" };
const grindLabel: Record<string, string> = {
  espresso: "Espresso",
  filter: "Filter",
  both: "Espresso and filter",
};

function positionLine(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div>
      {kicker ? <p className="label text-muted">{kicker}</p> : null}
      <h2 className={`${kicker ? "mt-4" : ""} text-3xl font-medium tracking-tight md:text-5xl`}>{title}</h2>
    </div>
  );
}

function CardImage({ image }: { image?: GalleryImage | null }) {
  if (!image?.url) return null;
  return (
    <div className="editorial-media">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 58vw, 86vw"
        className="object-cover"
        style={{ objectPosition: focusFor(image.url) }}
      />
    </div>
  );
}

export function GrinderModel({
  grinder,
  faqs,
  siblings,
}: {
  grinder: Grinder;
  sample: boolean;
  faqs: FaqItem[];
  siblings: GrinderCard[];
}) {
  const figures = performanceFigures(grinder);
  const relatedCompare = compareHref([grinder.slug, ...siblings.map((item) => item.slug)]);
  const status = grinder.status === "new" ? "New" : grinder.status === "discontinued" ? "Discontinued" : "";
  const eyebrow = [grinder.groupName, status].filter(Boolean).join(" ");
  const specs = grinder.specs;
  const [burrShot, motorShot, ...rest] = grinder.gallery;
  const gallery = rest.length ? rest : grinder.gallery;
  const crumbs = (
    <Breadcrumbs
      overlay
      items={[
        { name: "Grinders", path: "/grinders" },
        { name: grinder.name, path: `/grinders/${grinder.slug}` },
      ]}
    />
  );
  const sameLine =
    siblings.length > 0 && siblings.every((item) => item.groupSlug && item.groupSlug === grinder.groupSlug);

  return (
    <>
      {grinder.imageUrl ? (
        <BleedHero
          product
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          eyebrow={eyebrow}
          title={grinder.name}
          text={positionLine(grinder.answerFirst)}
          focus={focusFor(grinder.imageUrl)}
          figures={figures}
          crumbs={crumbs}
        >
          <Enquire
            grinder={{
              slug: grinder.slug,
              name: grinder.name,
              imageUrl: grinder.imageUrl,
              imageAlt: grinder.imageAlt,
            }}
          />
          <a href={relatedCompare} className="btn btn-secondary btn-on-photo">
            Compare
          </a>
        </BleedHero>
      ) : (
        <>
          <Breadcrumbs
            items={[
              { name: "Grinders", path: "/grinders" },
              { name: grinder.name, path: `/grinders/${grinder.slug}` },
            ]}
          />
          <header className="frame section-tight">
            {eyebrow ? <p className="label text-muted">{eyebrow}</p> : null}
            <h1 className="display mt-4">{grinder.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">{positionLine(grinder.answerFirst)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Enquire
                variant="plain"
                grinder={{
                  slug: grinder.slug,
                  name: grinder.name,
                  imageUrl: grinder.imageUrl,
                  imageAlt: grinder.imageAlt,
                }}
              />
              <a href={relatedCompare} className="btn btn-secondary">
                Compare
              </a>
            </div>
          </header>
        </>
      )}

      <section className="feature-rail" aria-labelledby="engineering-heading">
        <h2 id="engineering-heading" className="sr-only">
          Engineering
        </h2>
        <div className="snap-row feature-snap" tabIndex={0} aria-label="Burrs, motor and control">
          <article className="feature-card editorial">
            <CardImage
              image={
                burrShot ||
                (grinder.imageUrl
                  ? { _key: "hero", url: grinder.imageUrl, alt: grinder.imageAlt || grinder.name }
                  : null)
              }
            />
            <div className="editorial-copy">
              <SectionTitle
                kicker={specs.burrType ? "Burrs" : undefined}
                title={specs.burrType ? burrLabel[specs.burrType] || specs.burrType : "Burrs"}
              />
              {specs.burrDiameterMm != null ? (
                <p className="stat mt-6 md:mt-8">
                  {formatNumber(specs.burrDiameterMm)}
                  <span className="label ml-3 text-muted">mm</span>
                </p>
              ) : null}
              <p className="mt-4 max-w-md text-lg leading-relaxed md:mt-6">{grinder.shortDescription}</p>
              {specs.grindType ? (
                <p className="label mt-6 text-muted">{grindLabel[specs.grindType] || specs.grindType}</p>
              ) : null}
            </div>
          </article>

          {specs.motorPowerW != null || specs.rpm != null ? (
            <article className="feature-card editorial is-flip">
              <CardImage image={motorShot || burrShot} />
              <div className="editorial-copy">
                <SectionTitle title="Drive" />
                <div className="mt-6 grid gap-8 sm:grid-cols-2 md:mt-10">
                  {specs.motorPowerW != null ? (
                    <p>
                      <span className="label text-muted">Power</span>
                      <span className="stat mt-3 block">
                        {formatNumber(specs.motorPowerW)}
                        <span className="label ml-2 text-muted">W</span>
                      </span>
                    </p>
                  ) : null}
                  {specs.rpm != null ? (
                    <p>
                      <span className="label text-muted">Speed</span>
                      <span className="stat mt-3 block">
                        {formatNumber(specs.rpm)}
                        <span className="label ml-2 text-muted">rpm</span>
                      </span>
                    </p>
                  ) : null}
                </div>
                <p className="mt-6 max-w-md leading-relaxed text-muted">{grinder.answerFirst}</p>
              </div>
            </article>
          ) : null}

          {specs.adjustment || specs.display || specs.features.length ? (
            <article className="feature-card is-control">
              <div className="editorial-copy">
                <SectionTitle title="How it is set" />
                <ul className="module-grid mt-8">
                  {specs.adjustment ? (
                    <li>
                      <p className="label text-muted">Adjustment</p>
                      <p className="mt-4 text-2xl font-medium tracking-tight">{specs.adjustment}</p>
                    </li>
                  ) : null}
                  {specs.display ? (
                    <li>
                      <p className="label text-muted">Display</p>
                      <p className="mt-4 text-2xl font-medium tracking-tight">{specs.display}</p>
                    </li>
                  ) : null}
                  {specs.features.map((feature) => (
                    <li key={feature}>
                      <p className="text-2xl font-medium tracking-tight">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      {gallery.length ? (
        <ul className="gallery-strip snap-row" tabIndex={0} aria-label="Photographs">
          {gallery.map((image) =>
            image.url ? (
              <li key={image._key}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 86vw"
                  className="object-cover"
                  style={{ objectPosition: focusFor(image.url) }}
                />
              </li>
            ) : null,
          )}
        </ul>
      ) : null}

      <section className="frame section">
        <SectionTitle title="Specifications" />
        <div className="mt-12 max-w-4xl">
          <SpecTable grinder={grinder} />
        </div>
        {grinder.catalogueUrl ? (
          <p className="mt-10">
            <a href={grinder.catalogueUrl} className="btn" data-analytics="download" data-slug={grinder.slug}>
              {grinder.catalogueLabel || "Download the catalogue"}
            </a>
          </p>
        ) : null}
      </section>

      {faqs.length ? (
        <section className="frame section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-4xl font-medium tracking-tight">
            Questions
          </h2>
          <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq._key} className="group py-5">
                <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {siblings.length ? (
        <section className="section" aria-labelledby="siblings-heading">
          <div className="frame">
            <h2 id="siblings-heading" className="text-4xl font-medium tracking-tight">
              {sameLine && grinder.groupName ? `The ${grinder.groupName} line` : "Related models"}
            </h2>
          </div>
          <div className="frame mt-8">
            <GrinderGrid grinders={siblings} snap />
          </div>
        </section>
      ) : null}

      {grinder.relatedArticles.length ? (
        <section className="frame section">
          <h2 className="stack-block text-4xl font-medium tracking-tight">Related reading</h2>
          <ul className="divide-y divide-line border-y border-line">
            {grinder.relatedArticles.map((post) => (
              <li key={post.slug} className="grid gap-2 py-6 md:grid-cols-12">
                <div className="md:col-span-9">
                  <h3 className="text-2xl font-medium tracking-tight">
                    <TextLink href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                      {post.title}
                    </TextLink>
                  </h3>
                  <p className="mt-2 max-w-xl text-muted">{post.excerpt}</p>
                </div>
                {post.publishedAt ? (
                  <p className="label text-muted md:col-span-3 md:text-right">{formatDate(post.publishedAt)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
