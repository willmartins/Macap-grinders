import { Enquire } from "@/components/contact/enquire";
import { ColourVisualiser } from "@/components/grinders/colour-visualiser";
import { CompareSection } from "@/components/grinders/compare-section";
import { FeaturesSwipe } from "@/components/grinders/features-swipe";
import { FinalCtaSection } from "@/components/grinders/final-cta";
import { FlexibleGallery } from "@/components/grinders/flexible-gallery";
import { ProductHero } from "@/components/grinders/product-hero";
import { ProductOverview } from "@/components/grinders/product-overview";
import { SpecSection } from "@/components/grinders/spec-section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TextLink } from "@/components/site/text-link";
import { compareHref } from "@/lib/compare";
import type { FaqItem, Grinder, GrinderCard } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { performanceFigures } from "@/lib/specs";

function positionLine(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

export function GrinderModel({
  grinder,
  faqs,
  siblings,
  allGrinders,
}: {
  grinder: Grinder;
  sample?: boolean;
  faqs: FaqItem[];
  siblings: GrinderCard[];
  allGrinders?: GrinderCard[];
}) {
  const figures = performanceFigures(grinder);
  const relatedCompare = compareHref([grinder.slug, ...siblings.map((item) => item.slug)]);
  const status = grinder.status === "new" ? "New" : grinder.status === "discontinued" ? "Discontinued" : "";
  const eyebrow = [grinder.groupName, status].filter(Boolean).join(" • ");

  const crumbs = (
    <Breadcrumbs
      overlay
      bare
      items={[
        { name: "Grinders", path: "/grinders" },
        { name: grinder.name, path: `/grinders/${grinder.slug}` },
      ]}
    />
  );

  return (
    <>
      {/* 1. HERO: Sized for 100vh (taking menu into consideration) without cutting off the grinder */}
      {grinder.imageUrl ? (
        <ProductHero
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          blur={grinder.imageLqip}
          eyebrow={eyebrow}
          title={grinder.name}
          text={positionLine(grinder.answerFirst)}
          figures={figures}
          crumbs={crumbs}
        >
          <Enquire
            variant="photo"
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
        </ProductHero>
      ) : (
        <header className="frame section-tight">
          <Breadcrumbs
            items={[
              { name: "Grinders", path: "/grinders" },
              { name: grinder.name, path: `/grinders/${grinder.slug}` },
            ]}
          />
          {eyebrow ? <p className="label text-muted mt-4">{eyebrow}</p> : null}
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
      )}

      {/* 2. PRODUCT OVERVIEW: Two-column design with image on left and title, written copy & download button on right */}
      <ProductOverview grinder={grinder} />

      {/* 3. FEATURES SWIPE: Swiping cards with image, icon, or bold typographic high-impact styling when neither */}
      <FeaturesSwipe grinder={grinder} />

      {/* 4. COLOUR OPTION SELECTOR & VISUALISER */}
      <ColourVisualiser grinder={grinder} />

      {/* 5. IMAGE GALLERY: Super flexible, single row on desktop, slow infinite auto-scroll on mobile */}
      <FlexibleGallery gallery={grinder.gallery} modelName={grinder.name} />

      {/* 6. SPECIFICATIONS & FAQS: Integrated side-by-side section with spec table on left & FAQs on right */}
      <SpecSection grinder={grinder} faqs={faqs} />

      {/* 7. COMPARE TOOL SECTION: 3-4 cards across on big monitor */}
      <CompareSection grinder={grinder} siblings={siblings} allGrinders={allGrinders} />

      {/* Optional: Related Reading */}
      {grinder.relatedArticles && grinder.relatedArticles.length > 0 ? (
        <section className="frame section border-b border-line">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Related reading</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
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

      {/* 8. FINAL CTA SECTION: High-impact banner before the footer */}
      <FinalCtaSection grinder={grinder} />
    </>
  );
}
