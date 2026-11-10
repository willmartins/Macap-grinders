import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TextLink } from "@/components/site/text-link";
import { RichTextBody } from "@/components/site/rich-text";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";
import { sampleLegal } from "@/lib/content/sample";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadLegal } from "@/sanity/lib/load";

export async function generateStaticParams() {
  return sampleLegal.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadLegal(slug, "published");
  if (!loaded) return {};
  const { page } = loaded;
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.title,
    path: `/legal/${page.slug}`,
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

function bodyText(page: { body: Array<{ children?: Array<{ text?: string }> }> }): string {
  return page.body
    .flatMap((block) => block.children?.map((child) => child.text || "") || [])
    .join(" ");
}

async function LegalContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadLegal(slug, await draftPerspective());
  if (!loaded) notFound();
  const { page, sample } = loaded;
  const placeholder = sample || bodyText(page).includes("PLACEHOLDER");
  return (
    <article>
      <Breadcrumbs items={[{ name: page.title, path: `/legal/${page.slug}` }]} />
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <h1 className="type-h1 max-w-4xl text-black">{page.title}</h1>
          {page.effectiveDate ? (
            <p className="type-eyebrow mt-5 text-grey">Effective {formatDate(page.effectiveDate)}</p>
          ) : null}
          {placeholder ? (
            <p className="type-body mt-6 max-w-2xl border border-silver bg-white p-5 text-black">
              Placeholder for legal review.
            </p>
          ) : null}
        </div>
      </header>
      <div className="section">
        <div className="frame">
          <RichTextBody value={page.body} />
          <p className="mt-10">
            <TextLink href="/contact" className="tap link-underline font-semibold">
              Contact us
            </TextLink>
          </p>
        </div>
      </div>
    </article>
  );
}

export default function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <LegalContent params={params} />
    </Suspense>
  );
}
