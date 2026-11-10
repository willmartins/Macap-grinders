import { FaqList } from "@/components/grinders/faq-list";
import { DownloadIcon } from "@/components/site/icons";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import type { FaqItem, Grinder } from "@/lib/content/types";
import { specEntries, type SpecRow } from "@/lib/specs";

/** Audience and status are not specifications. Features get their own row with a list. */
const leftOut = new Set(["Audience", "Status", "Features"]);

/** Rows for the product page table. An output range joins the output row, so the figure appears once. */
function tableRows(grinder: Grinder): SpecRow[] {
  const rows = specEntries(grinder).filter((row) => !leftOut.has(row.label));
  const output = rows.find((row) => row.label === "Output");
  const range = rows.find((row) => /^output range$/i.test(row.label));
  if (!output || !range) return rows;
  return rows
    .filter((row) => row !== range)
    .map((row) => (row === output ? { label: "Output", value: `${output.value}, range ${range.value}` } : row));
}

export function SpecSection({
  grinder,
  faqs,
}: {
  grinder: Grinder;
  faqs?: FaqItem[];
}) {
  const downloadHref = grinder.catalogueUrl || null;
  const rows = tableRows(grinder);
  const features = grinder.specs.features;
  const questions = faqs || [];

  return (
    <section
      id="specifications"
      className="section border-b border-silver bg-light-grey"
      aria-labelledby="specs-heading"
    >
      <div className="frame">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left column: one specification table, hairline rows */}
          <div className="lg:col-span-7">
            <SectionHeader
              id="specs-heading"
              eyebrow="Technical Data"
              title="Specifications"
              description={`Operational figures, electrical ratings, and dimensions for the ${grinder.name}.`}
              action={
                <a
                  href={downloadHref || `/contact?subject=Specification+Sheet+Request+-+${encodeURIComponent(grinder.name)}`}
                  className="btn btn-secondary btn-no-arrow"
                  data-analytics="download"
                  data-slug={grinder.slug}
                  {...(downloadHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  Download spec sheet
                  <DownloadIcon />
                </a>
              }
            />

            <table className="datasheet mt-8 border-t border-silver">
              <caption className="sr-only">{grinder.name} specifications</caption>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.label}-${index}`}>
                    <th scope="row">{row.label}</th>
                    <td className="type-mono">{row.value}</td>
                  </tr>
                ))}
                {features.length ? (
                  <tr>
                    <th scope="row" className="align-top">
                      Features
                    </th>
                    <td>
                      <ul className="grid gap-1.5">
                        {features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Right column: questions on hairlines, then the one boxed call-out */}
          <div className="lg:col-span-5">
            {questions.length ? (
              <>
                <SectionHeader
                  id="faq-heading"
                  eyebrow="Support"
                  title="Frequently asked questions"
                  description="Operational advice, routine maintenance, and counter installation."
                />
                <div className="mt-8">
                  <FaqList faqs={questions} />
                </div>
              </>
            ) : null}

            <div className={`border border-silver bg-white p-5 ${questions.length ? "mt-8" : ""}`.trim()}>
              <p className="type-body font-semibold text-black">Need sales or technical support?</p>
              <p className="mt-1.5 type-body text-grey">
                Our Venice team and regional distribution partners are here to assist with machine selection, installation requirements, and commercial quotes.
              </p>
              <div className="mt-3.5">
                <TextLink href="/contact" className="type-body font-semibold text-black link-underline">
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
