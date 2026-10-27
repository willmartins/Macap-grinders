import Image from "next/image";

import { ContactForm } from "@/components/contact/contact-form";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { CompareTable, SpecTable } from "@/components/grinders/spec-table";
import { BleedHero, SplitHero } from "@/components/site/bleed-hero";
import { PhotoSlot } from "@/components/site/photo-slot";
import { RichTextBody } from "@/components/site/rich-text";
import { TextLink } from "@/components/site/text-link";
import { explainDifferences } from "@/lib/compare";
import type { Section } from "@/lib/content/types";
import { collectionShot, focusFor, pageShots } from "@/lib/imagery";
import { safeHref } from "@/lib/security";

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

function SectionIntro({ heading, intro, step }: { heading?: string; intro?: string; step?: string | null }) {
  if (!heading && !intro) return null;
  return (
    <div className="stack-block max-w-3xl">
      {step ? <p className="step-index mb-4">{step}</p> : null}
      {heading ? <h2 className="display-sm">{heading}</h2> : null}
      {intro ? <p className="mt-4 max-w-xl text-lg text-muted">{intro}</p> : null}
    </div>
  );
}

export function PageBuilder({ sections, journey }: { sections: Section[]; journey?: string }) {
  return (
    <div>
      {sections.map((section, sectionIndex) => {
        if (section._type === "heroBanner") {
          const hrefs = section.links.map((link) => link.href);
          if (hrefs.includes("/home-grinders") && hrefs.includes("/professional")) {
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
              className={index === 0 ? "btn btn-on-photo" : "btn btn-secondary btn-on-photo"}
            />
          ));
          if (section.imageUrl) {
            return (
              <BleedHero
                key={section._key}
                imageUrl={section.imageUrl}
                alt={section.imageAlt || ""}
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
            <header key={section._key} id={section._key} className="frame section-tight">
              {section.eyebrow ? <p className="label text-muted">{section.eyebrow}</p> : null}
              <h1 className="display mt-5 max-w-5xl">{section.heading}</h1>
              {section.text ? <p className="mt-6 max-w-xl text-lg leading-relaxed">{section.text}</p> : null}
              {section.links.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {section.links.map((link, index) => (
                    <ButtonLink
                      key={link._key}
                      href={link.href}
                      label={link.label}
                      journey={journey}
                      step={link.label}
                      className={index === 0 ? "btn" : "btn btn-secondary"}
                    />
                  ))}
                </div>
              ) : null}
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
                .find((item) => item._type === "imageText" || item._type === "grinderGrid")
            : undefined;
          return (
            <section key={section._key} id={section._key} className={`editorial ${section.imagePosition === "right" ? "is-flip" : ""}`}>
              {section.imageUrl ? (
                <div className="editorial-media">
                  <Image
                    src={section.imageUrl}
                    alt={section.imageAlt}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: focusFor(section.imageUrl) }}
                  />
                </div>
              ) : null}
              <div className="editorial-copy">
                {step ? <p className="step-index">{step}</p> : null}
                <h2 className="display-sm mt-4 max-w-xl">{section.heading}</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed">{section.text}</p>
                {section.link ? (
                  <p className="mt-8">
                    <ButtonLink href={section.link.href} label={section.link.label} journey={journey} />
                  </p>
                ) : next ? (
                  <p className="mt-8">
                    <TextLink href={`#${next._key}`}>{next.heading}</TextLink>
                  </p>
                ) : null}
              </div>
            </section>
          );
        }

        return (
          <section key={section._key} id={section._key} className="frame section">
            {section._type === "richText" ? (
              <>
                {section.heading ? <h2 className="display-sm">{section.heading}</h2> : null}
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
                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {section.collections.map((collection) => {
                    const shot = collectionShot(collection.slug);
                    return (
                      <li key={collection.slug} className="bg-bg">
                        {shot ? (
                          <a href={`/collections/${collection.slug}`} className="block">
                            <PhotoSlot imageUrl={shot.src} alt={shot.alt} ratio="16/9" sizes="(min-width: 1024px) 30rem, 100vw" />
                          </a>
                        ) : null}
                        <div className="p-5">
                          <h3 className="text-2xl font-medium tracking-tight">
                            <TextLink
                              href={`/collections/${collection.slug}`}
                              className="underline-offset-4 hover:underline"
                            >
                              {collection.name}
                            </TextLink>
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted">{collection.summary}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}

            {section._type === "featureList" ? (
              <>
                <SectionIntro heading={section.heading} intro={section.intro} />
                <ol className="module-grid">
                  {section.features.map((feature) => (
                    <li key={feature._key}>
                      <h3 className="text-2xl font-medium tracking-tight">{feature.title}</h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{feature.text}</p>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}

            {section._type === "specTable" && section.grinder ? (
              <>
                {section.heading ? <h2 className="display-sm mb-8">{section.heading}</h2> : null}
                <SpecTable grinder={section.grinder} />
              </>
            ) : null}

            {section._type === "comparisonTable" ? (
              <>
                <SectionIntro heading={section.heading} intro={section.intro} />
                <CompareTable grinders={section.grinders} />
                <ul className="mt-10 grid max-w-3xl gap-4 text-sm leading-relaxed">
                  {explainDifferences(section.grinders).map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {section._type === "faqAccordion" ? (
              <>
                <h2 className="display-sm">{section.heading}</h2>
                <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
                  {section.faqs.map((faq) => (
                    <details key={faq._key} className="py-5">
                      <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </>
            ) : null}

            {section._type === "ctaBanner" ? (
              <div>
                <h2 className="display-sm max-w-3xl">{section.heading}</h2>
                {section.text ? <p className="mt-5 max-w-xl text-lg">{section.text}</p> : null}
                <p className="mt-8">
                  <ButtonLink href={section.link.href} label={section.link.label} journey={journey} step={section.step} />
                </p>
              </div>
            ) : null}

            {section._type === "videoEmbed" ? (
              <VideoBlock url={section.url} heading={section.heading} caption={section.caption} />
            ) : null}

            {section._type === "kbPostGrid" ? (
              <>
                <SectionIntro heading={section.heading} intro={section.intro} />
                <ul className="divide-y divide-line border-y border-line">
                  {section.posts.map((post) => (
                    <li key={post.slug} className="grid gap-2 py-6">
                      <div>
                        <h3 className="text-2xl font-medium tracking-tight">
                          <TextLink href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                            {post.title}
                          </TextLink>
                        </h3>
                        <p className="mt-2 max-w-2xl text-muted">{post.excerpt}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {section._type === "quote" ? (
              <figure>
                <blockquote className="display-sm max-w-4xl">{section.quote}</blockquote>
                <figcaption className="mt-6 text-muted">
                  <span className="block">{section.attribution}</span>
                  {section.role ? <span className="block">{section.role}</span> : null}
                </figcaption>
              </figure>
            ) : null}

            {section._type === "contactBlock" ? (
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <h2 className="display-sm">{section.heading}</h2>
                  {section.text ? <p className="mt-5 max-w-md text-lg">{section.text}</p> : null}
                </div>
                <ContactForm />
              </div>
            ) : null}
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
      {heading ? <h2 className="display-sm mb-8">{heading}</h2> : null}
      {id ? (
        <div className="relative aspect-video max-w-4xl">
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
          <TextLink href={safe} className="underline underline-offset-4">
            Watch the video
          </TextLink>
        </p>
      ) : null}
      {caption ? <p className="mt-3 text-sm text-muted">{caption}</p> : null}
    </div>
  );
}
