import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
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
          {/* Left Column: High-Density Technical Spec Grid */}
          <div className="lg:col-span-7">
            <SectionHeader
              id="specs-heading"
              eyebrow="Technical Data"
              title="Specifications"
              description={`Operational figures, electrical ratings, and dimensions for the ${grinder.name}.`}
              action={
                <a
                  href={downloadHref || `/contact?subject=Specification+Sheet+Request+-+${encodeURIComponent(grinder.name)}`}
                  className="btn btn-secondary"
                  data-analytics="download"
                  data-slug={grinder.slug}
                  {...(downloadHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  Download brochure & specs
                </a>
              }
            />

            {/* 2-column architectural spec grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 gap-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col justify-between border border-line bg-surface p-4"
                >
                  <span className="type-eyebrow text-muted">
                    {row.label}
                  </span>
                  <span className="mt-2 type-mono text-fg">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Open FAQs & Support Card */}
          <div className="lg:col-span-5" aria-labelledby="faq-heading">
            <SectionHeader
              id="faq-heading"
              eyebrow="Support"
              title="Frequently asked questions"
              description="Operational advice, routine maintenance, and counter installation."
            />

            {/* All FAQs permanently open (no accordion) */}
            <div className="mt-8 divide-y divide-line border border-line bg-surface px-6">
              {displayFaqs.map((faq) => (
                <div key={faq._key} className="py-5">
                  <h3 className="text-base font-semibold text-fg leading-snug">
                    {faq.question}
                  </h3>
                  <p className="mt-2 type-body text-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Generic Sales & Technical Support Card */}
            <div className="mt-6 border border-line bg-surface p-5">
              <p className="font-semibold text-fg">Need sales or technical support?</p>
              <p className="mt-1.5 type-body text-muted">
                Our Venice team and regional distribution partners are here to assist with machine selection, installation requirements, and commercial quotes.
              </p>
              <div className="mt-3.5">
                <TextLink href="/contact" className="type-body font-semibold text-fg hover:shadow-[inset_0_-1px_0_var(--accent)]">
                  Contact sales & support team
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
