import { Suspense } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { EnquiryGrinderProvider } from "@/components/contact/enquiry-context";
import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadContact, loadGrinder } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadContact("published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/contact",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function ContactContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const slug = typeof search.grinder === "string" ? search.grinder : "";
  const perspective = await draftPerspective();
  const [page, loaded] = await Promise.all([
    loadContact(perspective),
    slug ? loadGrinder(slug, perspective) : Promise.resolve(null),
  ]);
  const hasForm = page.sections.some((section) => section._type === "contactBlock");
  const grinder = loaded
    ? {
        slug: loaded.grinder.slug,
        name: loaded.grinder.name,
        imageUrl: loaded.grinder.imageUrl,
        imageAlt: loaded.grinder.imageAlt,
      }
    : null;
  return (
    <EnquiryGrinderProvider grinder={grinder}>
      <ContentPage page={page} />
      {hasForm ? null : (
        <div className="frame section-tight">
          <ContactForm />
        </div>
      )}
    </EnquiryGrinderProvider>
  );
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <ContactContent searchParams={searchParams} />
    </Suspense>
  );
}
