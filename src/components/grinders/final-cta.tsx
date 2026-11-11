import { Enquire } from "@/components/contact/enquire";
import { PinIcon } from "@/components/site/icons";
import { TextLink } from "@/components/site/text-link";
import type { Grinder } from "@/lib/content/types";

export function FinalCtaSection({ grinder }: { grinder: Grinder }) {
  return (
    <section className="relative isolate overflow-hidden bg-off-black py-20 sm:py-28 text-white border-t border-silver" aria-labelledby="cta-heading">
      {/* Background radial gradient for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-radial-[circle_at_50%_40%] from-white/6 to-transparent to-70%"
        aria-hidden="true"
      />

      <div className="frame relative z-10">
        <div className="max-w-4xl">
          {/* Same eyebrow, title and lead spacing as SectionHeader, in white for the dark ground. */}
          <p className="type-eyebrow text-yellow mb-2.5">Macap Venice • Est. 1930</p>

          <h2 id="cta-heading" className="type-h1 text-white">
            Ready to specify the {grinder.name} for your counter?
          </h2>

          <p className="mt-3 type-lead text-white/80 max-w-2xl">
            Whether planning a multi-site café rollout or selecting the centrepiece for a single specialty bar,
            our Venetian technical team and authorised international distributor network are at your service.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Enquire
              variant="photo"
              grinder={{
                slug: grinder.slug,
              groupSlug: grinder.groupSlug,
                name: grinder.name,
                imageUrl: grinder.imageUrl,
                imageAlt: grinder.imageAlt,
              }}
            />
            <a
              href="/contact"
              className="btn btn-secondary btn-on-photo"
            >
              <PinIcon />
              Locate a distributor
            </a>
            {grinder.catalogueUrl ? (
              <TextLink
                href={grinder.catalogueUrl}
                className="type-body font-semibold text-white/80 hover:text-white link-underline ml-2"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="download"
                data-slug={grinder.slug}
              >
                Download spec sheet
              </TextLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
