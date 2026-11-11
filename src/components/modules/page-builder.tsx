import Image from "next/image";

import { ContactForm } from "@/components/contact/contact-form";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { CollectionGrid, RangeGrid } from "@/components/grinders/range-card";
import { CompareTable, SpecTable } from "@/components/grinders/spec-table";
import { BleedHero, SplitHero } from "@/components/site/bleed-hero";
import { PhotoSlot } from "@/components/site/photo-slot";
import { RichTextBody } from "@/components/site/rich-text";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { explainDifferences } from "@/lib/compare";
import type { CollectionCard, GrinderCard, RangeCard, Section } from "@/lib/content/types";
import { collectionShot, focusFor, pageShots } from "@/lib/imagery";
import { audiencePages, collectionPath } from "@/lib/paths";
import { safeHref } from "@/lib/security";

/**
 * Data a section takes from its page rather than from its own fields:
 * the range grid lists the page's ranges and collections, and collection models lists the collection's grinders.
 */
export type PageBuilderContext = {
  ranges?: RangeCard[];
  collections?: CollectionCard[];
  grinders?: GrinderCard[];
};

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || null;
    if (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || null;
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function ButtonLink({
  href,
  label,
  journey,
  step,
  className = "btn",
}: {
  href: string;
  label: string;
  journey?: string;
  step?: string;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      data-analytics={journey ? "journey" : undefined}
      data-journey={journey}
      data-step={step || label}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

/** A section opening. The journey step number, when there is one, sits in the eyebrow. */
function SectionIntro({ heading, intro, step }: { heading?: string; intro?: string; step?: string | null }) {
  if (heading) {
    return <SectionHeader eyebrow={step || undefined} title={heading} description={intro} className="mb-8" />;
  }
  if (intro) return <p className="type-lead mb-8 max-w-2xl text-grey">{intro}</p>;
  return null;
}

/**
 * The ground a module sits on, from the design system: white by default,
 * light grey for reference content, off-black for the closing banner.
 */
function groundFor(section: Section, isLast: boolean): string {
  if (section._type === "specTable" || section._type === "comparisonTable") return "bg-light-grey";
  if (section._type === "ctaBanner" && isLast) return "bg-off-black text-white";
  return "bg-white";
}

export function PageBuilder({
  sections,
  journey,
  context = {},
}: {
  sections: Section[];
  journey?: string;
  context?: PageBuilderContext;
}) {
  // A hairline closes each module. The last one has none, because the footer draws its own.
  const rule = (index: number) => (index === sections.length - 1 ? "" : "border-b border-silver");
  return (
    <div>
      {sections.map((section, sectionIndex) => {
        if (section._type === "heroBanner") {
          const hrefs = section.links.map((link) => link.href);
          // Links to both audience pages make the front page's two-door hero. Old addresses still count.
          const home = hrefs.includes(audiencePages.home.path) || hrefs.includes("/home-grinders");
          const professional = hrefs.includes(audiencePages.business.path) || hrefs.includes("/professional");
          if (home && professional) {
            return (
              <SplitHero
                key={section._key}
                homeImage={pageShots.homeSplit.src}
                homeAlt={pageShots.homeSplit.alt}
                homeFocus={pageShots.homeSplit.focus}
                proImage={pageShots.professionalSplit.src}
                proAlt={pageShots.professionalSplit.alt}
                proFocus={pageShots.professionalSplit.focus}
              />
            );
          }
          const links = section.links.map((link, index) => (
            <ButtonLink
              key={link._key}
              href={link.href}
              label={link.label}
              journey={journey}
              step={link.label}
              className={index === 0 ? "btn" : "btn btn-secondary"}
            />
          ));
          if (section.imageUrl) {
            return (
              <BleedHero
                key={section._key}
                imageUrl={section.imageUrl}
                alt={section.imageAlt || ""}
                blur={section.imageLqip}
                eyebrow={section.eyebrow}
                title={section.heading}
                text={section.text}
                focus={focusFor(section.imageUrl)}
              >
                {section.links.length ? links : null}
              </BleedHero>
            );
          }
          return (
            <header key={section._key} id={section._key} className="section-tight border-b border-silver">
              <div className="frame">
                {section.eyebrow ? <p className="type-eyebrow mb-3 text-grey">{section.eyebrow}</p> : null}
                <h1 className="type-h1 max-w-5xl text-black">{section.heading}</h1>
                {section.text ? <p className="type-lead mt-5 max-w-2xl text-grey">{section.text}</p> : null}
                {section.links.length ? <div className="mt-8 flex flex-wrap gap-3">{links}</div> : null}
              </div>
            </header>
          );
        }

        if (section._type === "imageText") {
          const step = journey
            ? String(sections.slice(0, sectionIndex).filter((item) => item._type === "imageText").length + 1).padStart(2, "0")
            : null;
          const next = journey
            ? sections
                .slice(sectionIndex + 1)
                .find((item) => item._type === "imageText" || item._type === "grinderGrid" || item._type === "rangeGrid")
            : undefined;
          const flip = section.imagePosition === "right";
          return (
            <section key={section._key} id={section._key} className={`section bg-white ${rule(sectionIndex)}`.trim()}>
              <div
                className={`frame grid items-center gap-[var(--gap-block)] ${
                  flip ? "md:grid-cols-[0.85fr_1.15fr]" : "md:grid-cols-[1.15fr_0.85fr]"
                }`}
              >
                {section.imageUrl ? (
                  <div className={flip ? "editorial-media md:order-2" : "editorial-media"}>
                    <Image
                      src={section.imageUrl}
                      alt={section.imageAlt}
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      placeholder={section.imageLqip ? "blur" : "empty"}
                      blurDataURL={section.imageLqip || undefined}
                      className="object-cover"
                      style={{ objectPosition: focusFor(section.imageUrl) }}
                    />
                  </div>
                ) : null}
                <div className="flex flex-col justify-center">
                  {step ? <p className="type-eyebrow mb-2.5 tabular-nums text-grey">{step}</p> : null}
                  <h2 className="type-h2 max-w-xl text-black">{section.heading}</h2>
                  <p className="type-lead mt-5 max-w-md text-grey">{section.text}</p>
                  {section.link ? (
                    <p className="mt-8">
                      <ButtonLink href={section.link.href} label={section.link.label} journey={journey} />
                    </p>
                  ) : next ? (
                    <p className="mt-8">
                      <TextLink href={`#${next._key}`} className="type-body font-semibold text-black link-underline">
                        {next.heading}
                      </TextLink>
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          );
        }

        const isLast = sectionIndex === sections.length - 1;
        const dark = section._type === "ctaBanner" && isLast;
        return (
          <section
            key={section._key}
            id={section._key}
            className={`section ${groundFor(section, isLast)} ${rule(sectionIndex)}`.trim()}
          >
            <div className="frame">
              {section._type === "richText" ? (
                <>
                  {section.heading ? <h2 className="type-h2 max-w-3xl text-black">{section.heading}</h2> : null}
                  <RichTextBody value={section.body} />
                </>
              ) : null}

              {section._type === "grinderGrid" ? (
                <>
                  <SectionIntro
                    heading={section.heading}
                    intro={section.intro}
                    step={journey && section.heading === "Find your grinder" ? "03" : null}
                  />
                  <GrinderGrid grinders={section.grinders} />
                </>
              ) : null}

              {section._type === "collectionCarousel" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  <ul className="grid gap-[var(--gap-block)] sm:grid-cols-2 lg:grid-cols-3">
                    {section.collections.map((collection) => {
                      const shot = collectionShot(collection.slug);
                      return (
                        <li key={collection.slug} className="border border-silver bg-white">
                          {shot ? (
                            <a href={collectionPath(collection.slug)} className="block">
                              <PhotoSlot
                                imageUrl={shot.src}
                                alt={shot.alt}
                                ratio="16/9"
                                sizes="(min-width: 1024px) 30rem, 100vw"
                              />
                            </a>
                          ) : null}
                          <div className="p-5">
                            <h3 className="type-h3 text-black">
                              <TextLink href={collectionPath(collection.slug)} className="link-underline">
                                {collection.name}
                              </TextLink>
                            </h3>
                            <p className="type-body mt-2 text-grey">{collection.summary}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : null}

              {section._type === "rangeGrid" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  {context.ranges?.length ? (
                    <RangeGrid ranges={context.ranges} />
                  ) : (
                    <p className="type-body text-grey">Ranges to follow.</p>
                  )}
                  {context.collections?.length ? (
                    <div className="mt-[var(--space-tight)]">
                      <SectionHeader eyebrow="Collections" title="Across the ranges" className="mb-8" />
                      <CollectionGrid collections={context.collections} />
                    </div>
                  ) : null}
                  <p className="mt-10">
                    <TextLink href="/grinders#all-models" className="tap type-body font-semibold text-black link-underline">
                      See every model
                    </TextLink>
                  </p>
                </>
              ) : null}

              {section._type === "collectionModels" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  <GrinderGrid grinders={context.grinders || []} />
                </>
              ) : null}

              {section._type === "featureList" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  <ol className="module-grid">
                    {section.features.map((feature) => (
                      <li key={feature._key} className="border-t border-silver pt-5">
                        <h3 className="type-h3 text-black">{feature.title}</h3>
                        <p className="type-body mt-3 max-w-sm text-grey">{feature.text}</p>
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}

              {section._type === "specTable" && section.grinder ? (
                <>
                  {section.heading ? <SectionHeader title={section.heading} className="mb-8" /> : null}
                  <SpecTable grinder={section.grinder} />
                </>
              ) : null}

              {section._type === "comparisonTable" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  <CompareTable grinders={section.grinders} />
                  <ul className="type-body mt-10 grid max-w-3xl gap-4 text-black">
                    {explainDifferences(section.grinders).map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {section._type === "faqAccordion" ? (
                <>
                  <SectionHeader title={section.heading} className="mb-8" />
                  <div className="max-w-3xl divide-y divide-silver border-y border-silver">
                    {section.faqs.map((faq) => (
                      <details key={faq._key} className="group">
                        <summary className="cursor-pointer justify-between gap-6 py-4">
                          <h3 className="type-body font-semibold text-black">{faq.question}</h3>
                          <span className="type-h3 shrink-0 font-normal text-grey" aria-hidden="true">
                            <span className="group-open:hidden">+</span>
                            <span className="hidden group-open:inline">−</span>
                          </span>
                        </summary>
                        <p className="type-body max-w-prose pb-5 text-grey">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </>
              ) : null}

              {section._type === "ctaBanner" ? (
                <div className="max-w-3xl">
                  <h2 className={`type-h2 ${dark ? "text-white" : "text-black"}`}>{section.heading}</h2>
                  {section.text ? (
                    <p className={`type-lead mt-5 max-w-2xl ${dark ? "text-white/80" : "text-grey"}`}>{section.text}</p>
                  ) : null}
                  <p className="mt-8">
                    <ButtonLink
                      href={section.link.href}
                      label={section.link.label}
                      journey={journey}
                      step={section.step}
                      className={dark ? "btn btn-on-photo" : "btn"}
                    />
                  </p>
                </div>
              ) : null}

              {section._type === "videoEmbed" ? (
                <VideoBlock url={section.url} heading={section.heading} caption={section.caption} />
              ) : null}

              {section._type === "kbPostGrid" ? (
                <>
                  <SectionIntro heading={section.heading} intro={section.intro} />
                  <ul className="divide-y divide-silver border-y border-silver">
                    {section.posts.map((post) => (
                      <li key={post.slug} className="grid gap-2 py-6">
                        <div>
                          <h3 className="type-h3 text-black">
                            <TextLink href={`/knowledge/${post.slug}`} className="link-underline">
                              {post.title}
                            </TextLink>
                          </h3>
                          <p className="type-body mt-2 max-w-xl text-grey">{post.excerpt}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {section._type === "quote" ? (
                <figure>
                  <blockquote className="type-h2 max-w-4xl text-black">{section.quote}</blockquote>
                  <figcaption className="type-body mt-6 text-grey">
                    <span className="block">{section.attribution}</span>
                    {section.role ? <span className="block">{section.role}</span> : null}
                  </figcaption>
                </figure>
              ) : null}

              {section._type === "contactBlock" ? (
                <div className="grid gap-12 md:grid-cols-2">
                  <div>
                    <h2 className="type-h2 text-black">{section.heading}</h2>
                    {section.text ? <p className="type-lead mt-5 max-w-md text-grey">{section.text}</p> : null}
                  </div>
                  <ContactForm />
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function VideoBlock({ url, heading, caption }: { url: string; heading?: string; caption?: string }) {
  const id = youtubeId(url);
  const safe = safeHref(url);
  return (
    <div>
      {heading ? <SectionHeader title={heading} className="mb-8" /> : null}
      {id ? (
        <div className="relative aspect-video max-w-4xl bg-silver">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
            title={heading || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : safe ? (
        <p>
          <TextLink href={safe} className="type-body font-semibold text-black link-underline">
            Watch the video
          </TextLink>
        </p>
      ) : null}
      {caption ? <p className="type-body mt-3 text-grey">{caption}</p> : null}
    </div>
  );
}
