import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
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
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="text-4xl font-medium tracking-tight md:text-6xl">{page.title}</h1>
        {page.effectiveDate ? (
          <p className="mt-4 text-sm text-muted">Effective {formatDate(page.effectiveDate)}</p>
        ) : null}
        {placeholder ? (
          <p className="mt-6 max-w-2xl border border-line p-4 text-sm">Placeholder for legal review.</p>
        ) : null}
      </header>
      <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <RichTextBody value={page.body} />
      </div>
    </article>
  );
}

export default function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <LegalContent params={params} />
    </Suspense>
  );
}
