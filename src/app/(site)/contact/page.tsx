import { Suspense } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { ContentPage } from "@/components/site/content-page";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadContact } from "@/sanity/lib/load";

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

async function ContactContent() {
  const page = await loadContact(await draftPerspective());
  const hasForm = page.sections.some((section) => section._type === "contactBlock");
  return (
    <>
      <ContentPage page={page} />
      {hasForm ? null : (
        <div className="frame section-tight">
          <ContactForm />
        </div>
      )}
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <ContactContent />
    </Suspense>
  );
}
