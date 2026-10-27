import Image from "next/image";
import type { ReactNode } from "react";

import { GrinderGrid } from "@/components/grinders/grinder-card";
import { SpecTable } from "@/components/grinders/spec-table";
import { BleedHero } from "@/components/site/bleed-hero";
import { compareHref } from "@/lib/compare";
import { formatDate, formatNumber } from "@/lib/format";
import { focusFor } from "@/lib/imagery";
import { performanceFigures } from "@/lib/specs";
import type { GalleryImage, Grinder } from "@/lib/content/types";

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

function Index({ n, title }: { n: string; title: string }) {
  return (
    <div>
      <p className="label">
        <span className="trim" />
        {n}
      </p>
      <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">{title}</h2>
    </div>
  );
}

function Plate({
  image,
  flip,
  children,
}: {
  image?: GalleryImage | null;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`editorial reveal border-t border-line ${flip ? "is-flip" : ""}`}>
      {image?.url ? (
        <div className="editorial-media">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
            style={{ objectPosition: focusFor(image.url) }}
          />
        </div>
      ) : null}
      <div className="editorial-copy">{children}</div>
    </section>
  );
}

export function GrinderModel({ grinder }: { grinder: Grinder; sample: boolean }) {
  const figures = performanceFigures(grinder);
  const relatedCompare = compareHref([grinder.slug, ...grinder.relatedGrinders.map((item) => item.slug)]);
  const status = grinder.status === "new" ? "New" : grinder.status === "discontinued" ? "Discontinued" : "";
  const eyebrow = [grinder.groupName || "Macap", status].filter(Boolean).join("  /  ");
  const specs = grinder.specs;
  const [burrShot, motorShot, ...rest] = grinder.gallery;
  const gallery = rest.length ? rest : grinder.gallery;

  return (
    <>
      {grinder.imageUrl ? (
        <BleedHero
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          eyebrow={eyebrow}
          title={grinder.name}
          text={positionLine(grinder.answerFirst)}
          focus={focusFor(grinder.imageUrl)}
          figures={figures}
        >
          <a href={relatedCompare} className="btn btn-on-photo">
            Compare
          </a>
        </BleedHero>
      ) : (
        <header className="frame pb-8 pt-16 md:pt-24">
          <p className="label">
            <span className="trim" />
            {eyebrow}
          </p>
          <h1 className="display mt-4">{grinder.name}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{positionLine(grinder.answerFirst)}</p>
        </header>
      )}

      <Plate image={burrShot || (grinder.imageUrl ? { _key: "hero", url: grinder.imageUrl, alt: grinder.imageAlt || grinder.name } : null)}>
        <Index n="01  /  Burrs" title={specs.burrType ? burrLabel[specs.burrType] || specs.burrType : "Burrs"} />
        {specs.burrDiameterMm != null ? (
          <p className="stat mt-8">
            {formatNumber(specs.burrDiameterMm)}
            <span className="label ml-3 text-muted">mm</span>
          </p>
        ) : null}
        <p className="mt-6 max-w-md text-lg leading-relaxed">{grinder.shortDescription}</p>
        {specs.grindType ? (
          <p className="label mt-8 text-muted">{grindLabel[specs.grindType] || specs.grindType}</p>
        ) : null}
      </Plate>

      {specs.motorPowerW != null || specs.rpm != null ? (
        <Plate image={motorShot || burrShot} flip>
          <Index n="02  /  Motor" title="Drive" />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
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
          <p className="mt-8 max-w-md leading-relaxed text-muted">{grinder.answerFirst}</p>
        </Plate>
      ) : null}

      {specs.adjustment || specs.display || specs.features.length ? (
        <section className="frame reveal border-t border-line py-20 md:py-28">
          <Index n="03  /  Control" title="How it is set" />
          <ul className="module-grid mt-12">
            {specs.adjustment ? (
              <li>
                <p className="label text-muted">01  Adjustment</p>
                <p className="mt-4 text-2xl font-medium tracking-tight">{specs.adjustment}</p>
              </li>
            ) : null}
            {specs.display ? (
              <li>
                <p className="label text-muted">02  Display</p>
                <p className="mt-4 text-2xl font-medium tracking-tight">{specs.display}</p>
              </li>
            ) : null}
            {specs.features.map((feature, index) => (
              <li key={feature}>
                <p className="label text-muted">{String(index + 3).padStart(2, "0")}  Feature</p>
                <p className="mt-4 text-2xl font-medium tracking-tight">{feature}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {gallery.length ? (
        <ul className="gallery-strip grid md:grid-cols-2">
          {gallery.map((image) =>
            image.url ? (
              <li key={image._key} className="relative min-h-[70vw] md:min-h-[78vh]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: focusFor(image.url) }}
                />
              </li>
            ) : null,
          )}
        </ul>
      ) : null}

      <section className="frame reveal py-20 md:py-32">
        <Index n="04  /  Data" title="Specifications" />
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

      {grinder.faqs.length ? (
        <section className="frame reveal pb-20">
          <h2 className="text-4xl font-medium tracking-tight">Questions</h2>
          <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {grinder.faqs.map((faq) => (
              <details key={faq._key} className="group py-5">
                <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {grinder.relatedGrinders.length ? (
        <section className="frame reveal pb-20">
          <h2 className="mb-8 text-4xl font-medium tracking-tight">Related models</h2>
          <GrinderGrid grinders={grinder.relatedGrinders} />
        </section>
      ) : null}

      {grinder.relatedArticles.length ? (
        <section className="frame reveal pb-24">
          <h2 className="mb-8 text-4xl font-medium tracking-tight">Related reading</h2>
          <ul className="divide-y divide-line border-y border-line">
            {grinder.relatedArticles.map((post, index) => (
              <li key={post.slug} className="grid gap-2 py-6 md:grid-cols-12">
                <p className="label text-muted md:col-span-2">{String(index + 1).padStart(2, "0")}</p>
                <div className="md:col-span-7">
                  <h3 className="text-2xl font-medium tracking-tight">
                    <a href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                      {post.title}
                    </a>
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
