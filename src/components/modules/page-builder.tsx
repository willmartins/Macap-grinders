import { ContactForm } from "@/components/contact/contact-form";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { CompareTable, SpecTable } from "@/components/grinders/spec-table";
import { PhotoSlot } from "@/components/site/photo-slot";
import { RichTextBody } from "@/components/site/rich-text";
import { explainDifferences } from "@/lib/compare";
import type { Section } from "@/lib/content/types";
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

function SectionIntro({ heading, intro, id }: { heading?: string; intro?: string; id?: string }) {
  if (!heading && !intro) return null;
  return (
    <div className="mb-8 max-w-2xl">
      {heading ? (
        <h2 id={id} className="text-3xl font-medium tracking-tight">
          {heading}
        </h2>
      ) : null}
      {intro ? <p className="mt-3 text-muted">{intro}</p> : null}
    </div>
  );
}

export function PageBuilder({ sections, journey }: { sections: Section[]; journey?: string }) {
  return (
    <div>
      {sections.map((section) => (
        <section key={section._key} id={section._key} className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          {section._type === "heroBanner" ? (
            <div className="-mx-5 -mt-16 grid items-end gap-10 px-5 md:-mx-8 md:px-8 md:grid-cols-2">
              <div className="py-8">
                {section.eyebrow ? <p className="mb-4 text-sm">{section.eyebrow}</p> : null}
                <h1 className="max-w-xl text-4xl font-medium tracking-tight md:text-6xl">{section.heading}</h1>
                {section.text ? <p className="mt-6 max-w-md text-lg leading-relaxed">{section.text}</p> : null}
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
              </div>
              <PhotoSlot
                imageUrl={section.imageUrl}
                alt={section.imageAlt || ""}
                sizes="(min-width: 768px) 40rem, 100vw"
                priority
              />
            </div>
          ) : null}

          {section._type === "richText" ? (
            <>
              {section.heading ? <h2 className="text-3xl font-medium tracking-tight">{section.heading}</h2> : null}
              <RichTextBody value={section.body} />
            </>
          ) : null}

          {section._type === "imageText" ? (
            <div className={`grid items-center gap-8 md:grid-cols-2 ${section.imagePosition === "left" ? "" : ""}`}>
              <div className={section.imagePosition === "right" ? "md:order-2" : ""}>
                <PhotoSlot imageUrl={section.imageUrl} alt={section.imageAlt} sizes="(min-width: 768px) 36rem, 100vw" />
              </div>
              <div>
                <h2 className="text-3xl font-medium tracking-tight">{section.heading}</h2>
                <p className="mt-4 max-w-md leading-relaxed">{section.text}</p>
                {section.link ? (
                  <p className="mt-6">
                    <TextLink href={section.link.href} label={section.link.label} journey={journey} />
                  </p>
                ) : null}
              </div>
            </div>
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
              <ul className="flex snap-x gap-4 overflow-x-auto pb-2">
                {section.collections.map((collection) => (
                  <li key={collection.slug} className="w-72 shrink-0 snap-start border border-line p-5">
                    <h3 className="text-lg font-medium">
                      <a href={`/collections/${collection.slug}`} className="underline-offset-4 hover:underline">
                        {collection.name}
                      </a>
                    </h3>
                    <p className="mt-3 text-sm text-muted">{collection.summary}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {section._type === "featureList" ? (
            <>
              <SectionIntro heading={section.heading} intro={section.intro} />
              <ul className="grid gap-8 md:grid-cols-3">
                {section.features.map((feature) => (
                  <li key={feature._key}>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {section._type === "specTable" && section.grinder ? (
            <>
              {section.heading ? <h2 className="mb-6 text-3xl font-medium tracking-tight">{section.heading}</h2> : null}
              <SpecTable grinder={section.grinder} />
            </>
          ) : null}

          {section._type === "comparisonTable" ? (
            <>
              <SectionIntro heading={section.heading} intro={section.intro} />
              <CompareTable grinders={section.grinders} />
              <ul className="mt-8 grid max-w-3xl gap-3 text-sm leading-relaxed">
                {explainDifferences(section.grinders).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          ) : null}

          {section._type === "faqAccordion" ? (
            <>
              <h2 className="mb-6 text-3xl font-medium tracking-tight">{section.heading}</h2>
              <div className="max-w-3xl divide-y divide-line border-y border-line">
                {section.faqs.map((faq) => (
                  <details key={faq._key} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-medium">{faq.question}</summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </>
          ) : null}

          {section._type === "ctaBanner" ? (
            <div className="border border-line p-8 md:p-12">
              <h2 className="max-w-xl text-3xl font-medium tracking-tight">{section.heading}</h2>
              {section.text ? <p className="mt-4 max-w-xl">{section.text}</p> : null}
              <p className="mt-6">
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
              <ul className="grid gap-6 md:grid-cols-3">
                {section.posts.map((post) => (
                  <li key={post.slug} className="border border-line p-5">
                    <h3 className="text-lg font-medium">
                      <a href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {section._type === "quote" ? (
            <figure className="max-w-3xl">
              <blockquote className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                {section.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                {section.attribution}
                {section.role ? `, ${section.role}` : ""}
              </figcaption>
            </figure>
          ) : null}

          {section._type === "contactBlock" ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-medium tracking-tight">{section.heading}</h2>
                {section.text ? <p className="mt-4 max-w-md">{section.text}</p> : null}
              </div>
              <ContactForm />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function VideoBlock({ url, heading, caption }: { url: string; heading?: string; caption?: string }) {
  const id = youtubeId(url);
  const safe = safeHref(url);
  return (
    <div>
      {heading ? <h2 className="mb-6 text-3xl font-medium tracking-tight">{heading}</h2> : null}
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
