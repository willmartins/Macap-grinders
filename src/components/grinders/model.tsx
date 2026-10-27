import { PhotoSlot } from "@/components/site/photo-slot";
import { BleedHero } from "@/components/site/bleed-hero";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { SpecTable } from "@/components/grinders/spec-table";
import { compareHref } from "@/lib/compare";
import { formatDate, formatNumber } from "@/lib/format";
import { performanceFigures } from "@/lib/specs";
import type { Grinder } from "@/lib/content/types";

const burrLabel: Record<string, string> = { flat: "Flat", conical: "Conical" };
const grindLabel: Record<string, string> = {
  espresso: "Espresso",
  filter: "Filter",
  both: "Espresso and filter",
};

function Index({ n, title }: { n: string; title: string }) {
  return (
    <div>
      <p className="label">
        <span className="trim" />
        {n}
      </p>
      <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
    </div>
  );
}

export function GrinderModel({ grinder, sample }: { grinder: Grinder; sample: boolean }) {
  const figures = performanceFigures(grinder);
  const relatedCompare = compareHref([grinder.slug, ...grinder.relatedGrinders.map((item) => item.slug)]);
  const status =
    grinder.status === "new" ? "New" : grinder.status === "discontinued" ? "Discontinued" : "";
  const eyebrow = [grinder.groupName || "Macap", status].filter(Boolean).join("  /  ");
  const specs = grinder.specs;

  return (
    <>
      {grinder.imageUrl ? (
        <BleedHero
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          eyebrow={eyebrow}
          title={grinder.name}
          text={grinder.answerFirst}
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
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{grinder.answerFirst}</p>
          <p className="mt-8">
            <a href={relatedCompare} className="btn">
              Compare
            </a>
          </p>
        </header>
      )}

      {figures.length ? (
        <div className="figure-rail">
          <ul className="frame">
            {figures.map((figure) => (
              <li key={figure.label}>
                <p className="label text-muted">{figure.label}</p>
                <p className="stat mt-3">
                  {figure.value}
                  <span className="label ml-2 text-muted">{figure.unit}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="frame reveal grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <Index n="01" title="Engineering" />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-2xl font-medium leading-snug tracking-tight">{grinder.answerFirst}</p>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{grinder.shortDescription}</p>
        </div>
      </section>

      {specs.burrType || specs.burrDiameterMm != null ? (
        <section className="border-t border-line">
          <div className="frame reveal grid gap-10 py-20 md:grid-cols-12 md:py-28">
            <div className="md:col-span-4">
              <Index n="02" title="Burrs" />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {specs.burrDiameterMm != null ? (
                <p className="stat">
                  {formatNumber(specs.burrDiameterMm)}
                  <span className="label ml-2 text-muted">mm</span>
                </p>
              ) : null}
              <p className="mt-5 max-w-xl text-lg leading-relaxed">
                {specs.burrType ? `${burrLabel[specs.burrType] || specs.burrType} burrs.` : "Burrs."}
                {specs.grindType ? ` ${grindLabel[specs.grindType] || specs.grindType}.` : ""}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {specs.motorPowerW != null || specs.rpm != null ? (
        <section className="border-t border-line">
          <div className="frame reveal grid gap-10 py-20 md:grid-cols-12 md:py-28">
            <div className="md:col-span-4">
              <Index n="03" title="Motor" />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="grid gap-8 sm:grid-cols-2">
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
            </div>
          </div>
        </section>
      ) : null}

      {specs.adjustment || specs.display || specs.features.length ? (
        <section className="border-t border-line">
          <div className="frame reveal grid gap-10 py-20 md:grid-cols-12 md:py-28">
            <div className="md:col-span-4">
              <Index n="04" title="Control" />
            </div>
            <ul className="module-grid md:col-span-7 md:col-start-6">
              {specs.adjustment ? (
                <li>
                  <p className="label text-muted">Adjustment</p>
                  <p className="mt-3 text-lg">{specs.adjustment}</p>
                </li>
              ) : null}
              {specs.display ? (
                <li>
                  <p className="label text-muted">Display</p>
                  <p className="mt-3 text-lg">{specs.display}</p>
                </li>
              ) : null}
              {specs.features.map((feature) => (
                <li key={feature}>
                  <p className="label text-muted">Feature</p>
                  <p className="mt-3 text-lg">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {grinder.gallery.length ? (
        <ul className="grid md:grid-cols-2">
          {grinder.gallery.map((image) => (
            <li key={image._key} className="relative min-h-80 border-t border-line">
              <PhotoSlot
                imageUrl={image.url}
                alt={image.alt}
                ratio="16/9"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <section className="frame reveal py-20 md:py-28">
        <Index n="05" title="Specifications" />
        <div className="mt-10">
          <SpecTable grinder={grinder} caption={sample ? "Sample figures. Confirm before launch." : undefined} />
        </div>
        {grinder.catalogueUrl ? (
          <p className="mt-8">
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
