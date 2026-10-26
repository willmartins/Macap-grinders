import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GrinderGrid } from "@/components/grinders/grinder-card";
import { SpecTable } from "@/components/grinders/spec-table";
import { PhotoSlot } from "@/components/site/photo-slot";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { ThemeLock } from "@/components/site/theme-frame";
import { TrackGrinderView } from "@/components/site/trackers";
import { compareHref } from "@/lib/compare";
import { formatDate } from "@/lib/format";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadGrinder, loadGrinderCards } from "@/sanity/lib/load";

export async function generateStaticParams() {
  const { grinders } = await loadGrinderCards("published");
  return grinders.map((grinder) => ({ slug: grinder.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadGrinder(slug, "published");
  if (!loaded) return {};
  const { grinder } = loaded;
  return buildMetadata({
    title: grinder.seo.title || `${grinder.name} coffee grinder`,
    description: grinder.seo.description || grinder.answerFirst || grinder.shortDescription,
    path: `/grinders/${grinder.slug}`,
    noIndex: grinder.seo.noIndex || grinder.status === "discontinued",
    canonical: grinder.seo.canonical,
    image: grinder.seo.imageUrl || grinder.imageUrl,
  });
}

async function GrinderContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadGrinder(slug, await draftPerspective());
  if (!loaded) notFound();
  const { grinder, sample } = loaded;
  const relatedCompare = compareHref([grinder.slug, ...grinder.relatedGrinders.map((item) => item.slug)]);
  return (
    <article>
      <ThemeLock theme={grinder.audience === "business" ? "professional" : "home"} />
      <TrackGrinderView slug={grinder.slug} name={grinder.name} audience={grinder.audience} />
      {sample ? <SampleBanner /> : null}
      <Breadcrumbs
        items={[
          { name: "Grinders", path: "/grinders" },
          { name: grinder.name, path: `/grinders/${grinder.slug}` },
        ]}
      />
      <header className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-sm text-muted">
            {grinder.groupName || "Macap"}
            {grinder.status === "new" ? " · New" : ""}
            {grinder.status === "discontinued" ? " · Discontinued" : ""}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{grinder.name}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{grinder.answerFirst}</p>
          <p className="mt-4 max-w-xl text-muted">{grinder.shortDescription}</p>
          <p className="mt-8">
            <a href={relatedCompare} className="btn">
              Compare
            </a>
          </p>
        </div>
        <PhotoSlot
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          sizes="(min-width: 768px) 40rem, 100vw"
          priority
        />
      </header>
      {grinder.gallery.length ? (
        <ul className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-2 md:px-8">
          {grinder.gallery.map((image) => (
            <li key={image._key}>
              <PhotoSlot imageUrl={image.url} alt={image.alt} sizes="(min-width: 768px) 36rem, 100vw" />
            </li>
          ))}
        </ul>
      ) : null}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-medium tracking-tight">Specifications</h2>
        <div className="mt-6">
          <SpecTable
            grinder={grinder}
            caption={sample ? "Sample figures. Confirm before launch." : undefined}
          />
        </div>
        {grinder.catalogueUrl ? (
          <p className="mt-6">
            <a
              href={grinder.catalogueUrl}
              className="underline underline-offset-4"
              data-analytics="download"
              data-slug={grinder.slug}
            >
              {grinder.catalogueLabel || "Download the catalogue"}
            </a>
          </p>
        ) : null}
      </section>
      {grinder.faqs.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <h2 className="text-3xl font-medium tracking-tight">Questions</h2>
          <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
            {grinder.faqs.map((faq) => (
              <details key={faq._key} className="py-4">
                <summary className="cursor-pointer text-base font-medium">{faq.question}</summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
      {grinder.relatedGrinders.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <h2 className="mb-6 text-3xl font-medium tracking-tight">Related grinders</h2>
          <GrinderGrid grinders={grinder.relatedGrinders} />
        </section>
      ) : null}
      {grinder.relatedArticles.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
          <h2 className="mb-6 text-3xl font-medium tracking-tight">Related reading</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {grinder.relatedArticles.map((post) => (
              <li key={post.slug} className="border border-line p-5">
                <h3 className="text-lg font-medium">
                  <a href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                {post.publishedAt ? (
                  <p className="mt-3 text-sm text-muted">{formatDate(post.publishedAt)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <JsonLd data={productJsonLd(grinder)} />
      <JsonLd data={faqJsonLd(grinder.faqs)} />
    </article>
  );
}

export default function GrinderPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <GrinderContent params={params} />
    </Suspense>
  );
}
