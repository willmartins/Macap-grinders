import { Enquire } from "@/components/contact/enquire";
import type { Grinder } from "@/lib/content/types";

export function FinalCtaSection({ grinder }: { grinder: Grinder }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0a] py-20 sm:py-28 text-white border-t border-line" aria-labelledby="cta-heading">
      {/* Background radial gradient for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="frame relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-accent mb-6">
            <span>Macap Venice</span>
            <span>•</span>
            <span>Est. 1930</span>
          </div>

          <h2
            id="cta-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
          >
            Ready to specify the {grinder.name} for your counter?
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl font-light">
            Whether planning a multi-site café rollout or selecting the centerpiece for a single specialty bar,
            our Venetian technical team and authorised international distributor network are at your service.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Enquire
              variant="plain"
              grinder={{
                slug: grinder.slug,
                name: grinder.name,
                imageUrl: grinder.imageUrl,
                imageAlt: grinder.imageAlt,
              }}
            />
            <a
              href="/contact"
              className="btn btn-secondary text-white border-white/30 hover:border-white transition-colors"
            >
              Locate a distributor
            </a>
            {grinder.catalogueUrl ? (
              <a
                href={grinder.catalogueUrl}
                className="text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download catalogue (PDF) →
              </a>
            ) : null}
          </div>

          {/* Direct contact footnote */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs text-white/60">
            <div>
              <span className="font-semibold text-white/90">Direct trade enquiries:</span>{" "}
              <a href="mailto:info@macap.it" className="hover:text-white underline underline-offset-2">
                info@macap.it
              </a>
            </div>
            <div>
              <span className="font-semibold text-white/90">Venice Headquarters:</span>{" "}
              <span className="text-white/80">+39 041 5700211</span>
            </div>
            <div>
              <span>Via L. Da Vinci, 19, Maerne di Martellago (VE), Italy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
