import { Suspense } from "react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { WorldDots } from "@/components/site/world-dots";
import { countryName } from "@/lib/countries";
import { buildMetadata } from "@/lib/metadata";
import { listDistributors } from "@/server/distributors";

const title = "Macap distributors";
const description = "Macap grinders are sold and serviced through distributors. Find the partner for your country.";

export async function generateMetadata() {
  return buildMetadata({ title, description, path: "/distributors" });
}

async function DistributorList() {
  const partners = await listDistributors();

  if (partners.length === 0) {
    return (
      <p className="type-body max-w-xl text-grey">
        The distributor list is not published yet. Send an enquiry and Macap will put you in touch with the partner for
        your country.
      </p>
    );
  }

  return (
    <ul className="grid gap-[var(--gap-inner)] sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <li key={partner.name} className="flex flex-col gap-3 border border-silver bg-white p-6">
          <h2 className="type-h3 text-black">{partner.name}</h2>
          <p className="type-body text-grey">
            {partner.countries.map((code) => countryName(code)).join(", ")}
          </p>
          {partner.website ? (
            <p className="mt-auto pt-2">
              <TextLink href={partner.website} className="type-body font-semibold text-black link-underline">
                Visit website
              </TextLink>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function DistributorsPage() {
  return (
    <article>
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <div className="mb-6">
            <Breadcrumbs bare items={[{ name: "Distributors", path: "/distributors" }]} />
          </div>
          <div className="grid items-center gap-[var(--gap-block)] md:grid-cols-2">
            <div>
              <p className="type-eyebrow text-grey">Distributors</p>
              <h1 className="type-h1 mt-3 max-w-xl text-black">Find your local distributor.</h1>
              <p className="type-lead mt-5 max-w-md text-grey">{description}</p>
              <p className="mt-8">
                <a href="/contact" className="btn">
                  Send an enquiry
                </a>
              </p>
            </div>
            <div className="border border-silver bg-white p-6 text-black sm:p-8">
              <WorldDots className="w-full" />
            </div>
          </div>
        </div>
      </header>

      <section className="section border-b border-silver bg-white" aria-labelledby="partners-heading">
        <div className="frame">
          <SectionHeader
            id="partners-heading"
            eyebrow="By country"
            title="Partners"
            description="Macap adds each partner in Studio. The enquiry address stays private, so use the enquiry form to reach one."
            className="mb-8"
          />
          <Suspense fallback={<p className="type-body text-grey">Loading.</p>}>
            <DistributorList />
          </Suspense>
        </div>
      </section>
    </article>
  );
}
