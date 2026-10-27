import Image from "next/image";

import { ContactForm } from "@/components/contact/contact-form";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { CompareTable, SpecTable } from "@/components/grinders/spec-table";
import { BleedHero } from "@/components/site/bleed-hero";
import { PhotoSlot } from "@/components/site/photo-slot";
import { RichTextBody } from "@/components/site/rich-text";
import { explainDifferences } from "@/lib/compare";
import type { Section } from "@/lib/content/types";
import { collectionShot } from "@/lib/imagery";
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

function TextLink({
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

function SectionIntro({ heading, intro }: { heading?: string; intro?: string }) {
  if (!heading && !intro) return null;
  return (
    <div className="mb-10 max-w-3xl">
      {heading ? <h2 className="display-sm">{heading}</h2> : null}
      {intro ? <p className="mt-4 max-w-xl text-lg text-muted">{intro}</p> : null}
    </div>
  );
}

export function PageBuilder({ sections, journey }: { sections: Section[]; journey?: string }) {
  return (
    <div>
      {sections.map((section) => {
        if (section._type === "heroBanner") {
          const links = section.links.map((link, index) => (
            <TextLink
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
              >
                {section.links.length ? links : null}
              </BleedHero>
            );
          }
          return (
            <header key={section._key} id={section._key} className="frame pb-6 pt-16 md:pt-24">
              {section.eyebrow ? (
                <p className="label">
                  <span className="trim" />
                  {section.eyebrow}
                </p>
              ) : null}
              <h1 className="display mt-5 max-w-5xl">{section.heading}</h1>
              {section.text ? <p className="mt-6 max-w-xl text-lg leading-relaxed">{section.text}</p> : null}
              {section.links.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {section.links.map((link, index) => (
                    <TextLink
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
          const media = (
            <div className={`relative min-h-[70vw] overflow-hidden md:min-h-[80svh] ${section.imagePosition === "right" ? "md:order-2" : ""}`}>
              {section.imageUrl ? (
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover media-img media-drift"
                />
              ) : (
                <p className="label absolute bottom-6 left-6 text-muted">Photography to follow</p>
              )}
            </div>
          );
          return (
            <section key={section._key} id={section._key} className="reveal grid border-t border-line md:grid-cols-2">
              {media}
              <div className="flex flex-col justify-end px-5 py-14 md:px-16 md:py-20">
                <h2 className="display-sm max-w-xl">{section.heading}</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed">{section.text}</p>
                {section.link ? (
                  <p className="mt-8">
                    <TextLink href={section.link.href} label={section.link.label} journey={journey} />
                  </p>
                ) : null}
              </div>
            </section>
          );
        }

        return (
          <section key={section._key} id={section._key} className="frame reveal py-20 md:py-28">
            {section._type === "richText" ? (
              <>
                {section.heading ? <h2 className="display-sm">{section.heading}</h2> : null}
                <RichTextBody value={section.body} />
              </>
            ) : null}

            {section._type === "grinderGrid" ? (
              <>
                <SectionIntro heading={section.heading} intro={section.intro} />
                <GrinderGrid grinders={section.grinders} />
              </>
            ) : null}

            {section._type === "collectionCarousel" ? (
              <>
                <SectionIntro heading={section.heading} intro={section.intro} />
                <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {section.collections.map((collection, index) => {
                    const shot = collectionShot(collection.slug);
                    return (
                      <li key={collection.slug} className="bg-bg">
                        {shot ? (
                          <a href={`/collections/${collection.slug}`} className="block">
                            <PhotoSlot imageUrl={shot.src} alt={shot.alt} ratio="16/9" sizes="(min-width: 1024px) 30rem, 100vw" />
                          </a>
                        ) : null}
                        <div className="p-5">
                          <p className="label text-muted">{String(index + 1).padStart(2, "0")}</p>
                          <h3 className="mt-3 text-2xl font-medium tracking-tight">
                            <a href={`/collections/${collection.slug}`} className="underline-offset-4 hover:underline">
                              {collection.name}
                            </a>
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
                  {section.features.map((feature, index) => (
                    <li key={feature._key}>
                      <p className="label">
                        <span className="trim" />
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-4 text-2xl font-medium tracking-tight">{feature.title}</h3>
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
                  {explainDifferences(section.grinders).map((note, index) => (
                    <li key={note} className="grid grid-cols-[3rem_1fr] gap-3 border-t border-line pt-4">
                      <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <span>{note}</span>
                    </li>
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
              <div className="border-t-2 border-accent pt-10">
                <h2 className="display-sm max-w-3xl">{section.heading}</h2>
                {section.text ? <p className="mt-5 max-w-xl text-lg">{section.text}</p> : null}
                <p className="mt-8">
                  <TextLink href={section.link.href} label={section.link.label} journey={journey} step={section.step} />
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
                  {section.posts.map((post, index) => (
                    <li key={post.slug} className="grid gap-2 py-6 md:grid-cols-12">
                      <p className="label text-muted md:col-span-2">{String(index + 1).padStart(2, "0")}</p>
                      <div className="md:col-span-10">
                        <h3 className="text-2xl font-medium tracking-tight">
                          <a href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                            {post.title}
                          </a>
                        </h3>
                        <p className="mt-2 max-w-2xl text-muted">{post.excerpt}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {section._type === "quote" ? (
              <figure className="border-t-2 border-accent pt-8">
                <blockquote className="display-sm max-w-4xl">{section.quote}</blockquote>
                <figcaption className="label mt-8 text-muted">
                  {section.attribution}
                  {section.role ? ` / ${section.role}` : ""}
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
          <a href={safe} className="underline underline-offset-4" rel="noreferrer">
            Watch the video
          </a>
        </p>
      ) : null}
      {caption ? <p className="mt-3 text-sm text-muted">{caption}</p> : null}
    </div>
  );
}
