import { Enquire } from "@/components/contact/enquire";
import { TextLink } from "@/components/site/text-link";
import type { Grinder } from "@/lib/content/types";

export function FinalCtaSection({ grinder }: { grinder: Grinder }) {
  return (
    <section className="relative isolate overflow-hidden bg-off-black py-20 sm:py-28 text-white border-t border-silver" aria-labelledby="cta-heading">
      {/* Background radial gradient for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="frame relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 type-eyebrow text-yellow mb-6">
            <span>Macap Venice</span>
            <span>•</span>
            <span>Est. 1930</span>
          </div>

          <h2 id="cta-heading" className="type-h1 text-white">
            Ready to specify the {grinder.name} for your counter?
          </h2>

          <p className="mt-6 type-lead text-white/80 max-w-2xl">
            Whether planning a multi-site café rollout or selecting the centrepiece for a single specialty bar,
            our Venetian technical team and authorised international distributor network are at your service.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Enquire
              variant="photo"
              grinder={{
                slug: grinder.slug,
                name: grinder.name,
                imageUrl: grinder.imageUrl,
                imageAlt: grinder.imageAlt,
              }}
            />
            <a
              href="/contact"
              className="btn btn-secondary btn-on-photo"
            >
              Locate a distributor
            </a>
            {grinder.catalogueUrl ? (
              <TextLink
                href={grinder.catalogueUrl}
                className="type-body font-semibold text-white/80 hover:text-white ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download catalogue (PDF)
              </TextLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
