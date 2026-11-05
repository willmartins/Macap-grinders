import type { FaqItem, Grinder } from "@/lib/content/types";
import { specEntries } from "@/lib/specs";

export function SpecSection({
  grinder,
  faqs,
}: {
  grinder: Grinder;
  faqs?: FaqItem[];
}) {
  const downloadHref = grinder.catalogueUrl || null;
  const rows = specEntries(grinder);

  const displayFaqs: FaqItem[] =
    faqs && faqs.length > 0
      ? faqs
      : [
          {
            _key: "faq-audience",
            question: `Is the ${grinder.name} designed for home or commercial bar use?`,
            answer:
              grinder.audience === "business"
                ? `The ${grinder.name} is a dedicated commercial espresso grinder engineered for continuous café service and intense rush-hour throughput.`
                : `The ${grinder.name} is built for home baristas who demand commercial-grade grind consistency on a domestic kitchen counter.`,
          },
          {
            _key: "faq-calibration",
            question: "How do I maintain my grind setting during burr cleaning?",
            answer:
              "Macap grinders feature a fast-opening micrometric collar. You can inspect or brush the burr chamber and return the collar to your exact dialled-in setting without losing recipe calibration.",
          },
          {
            _key: "faq-burrs",
            question: `What burr set comes installed in the ${grinder.name}?`,
            answer: `It is fitted with ${grinder.specs.burrDiameterMm || 68} mm Italian ${
              grinder.specs.burrType || "flat"
            } burrs machined from hardened steel for prolonged edge retention and uniform extraction.`,
          },
        ];

  return (
    <section
      id="specifications"
      className="section border-b border-line bg-light-grey"
      style={{ backgroundColor: "var(--light-grey, #f9f9f9)" }}
      aria-labelledby="specs-heading"
    >
      <div className="frame">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Modern High-Density Spec Grid (No wasted space) */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="specs-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Specifications
                </h2>
                <p className="mt-2 text-muted text-sm sm:text-base">
                  Operational figures, electrical ratings, and dimensions for the {grinder.name}.
                </p>
              </div>
              <a
                href={downloadHref || `/contact?subject=Specification+Sheet+Request+-+${encodeURIComponent(grinder.name)}`}
                className="btn btn-secondary text-xs"
                data-analytics="download"
                data-slug={grinder.slug}
                {...(downloadHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Download brochure & specs
              </a>
            </div>

            {/* Smart, modern 2-column spec grid: dense, clean, zero dead space */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 gap-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col justify-between rounded-xl border border-line bg-surface p-3.5 sm:p-4 shadow-sm"
                >
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted">
                    {row.label}
                  </span>
                  <span className="mt-1.5 text-sm sm:text-base font-normal text-fg tracking-tight font-mono">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Dedicated Brochure & Specs Download Banner */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-fg">Brochure & technical specifications</p>
                <p className="text-xs text-muted mt-0.5">
                  Official dimensional drawings, electrical schematics, and catalogue options.
                </p>
              </div>
              <a
                href={downloadHref || `/contact?subject=Specification+Sheet+Request+-+${encodeURIComponent(grinder.name)}`}
                className="btn text-xs whitespace-nowrap"
                data-analytics="download"
                data-slug={grinder.slug}
                {...(downloadHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Download brochure & specs (PDF)
              </a>
            </div>
          </div>

          {/* Right Column: Open FAQs (All open, not accordion) & Generic Help Card */}
          <div className="lg:col-span-5" aria-labelledby="faq-heading">
            <div>
              <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-2 text-muted text-sm sm:text-base">
                Operational advice, routine maintenance, and counter installation.
              </p>
            </div>

            {/* All FAQs permanently open (no accordion) */}
            <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface px-6 shadow-sm">
              {displayFaqs.map((faq) => (
                <div key={faq._key} className="py-5">
                  <h3 className="text-base font-semibold text-fg leading-snug">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Generic Sales & Technical Support Card */}
            <div className="mt-6 rounded-xl border border-line bg-white/80 p-5 text-sm text-muted shadow-sm">
              <p className="font-semibold text-fg">Need sales or technical support?</p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">
                Our Venice team and regional distribution partners are here to assist with machine selection, installation requirements, and commercial quotes.
              </p>
              <a href="/contact" className="mt-3.5 inline-block text-xs font-semibold text-fg underline underline-offset-4 hover:text-accent">
                Contact sales & support team →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
