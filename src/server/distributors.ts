import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";

export type DistributorRecord = {
  name: string;
  countries: string[];
  email: string;
  isPrimary: boolean;
};

/**
 * Development only. Macap adds real partners in Studio.
 * This example is never written to the dataset, and it is not used when NODE_ENV is production.
 * United Kingdom is covered so the enquiry notice can be reviewed before a published partner exists.
 */
const developmentDistributors: DistributorRecord[] = [
  {
    name: "Example partner (development only)",
    countries: ["GB"],
    email: "partner@example.test",
    isPrimary: true,
  },
];

const query = `*[_type == "distributor" && active == true]{
  name,
  isPrimary,
  countries,
  "email": enquiryEmail
}`;

export function pickDistributor(records: DistributorRecord[], country: string): DistributorRecord | null {
  const matches = records.filter(
    (record) => record.name && record.email && record.countries.includes(country),
  );
  matches.sort(
    (a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)) || a.name.localeCompare(b.name, "en-GB"),
  );
  return matches[0] ?? null;
}

export async function lookupDistributor(country: string): Promise<DistributorRecord | null> {
  let records: DistributorRecord[] | null = null;
  try {
    const rows = await client
      .withConfig({
        useCdn: false,
        token: readToken || undefined,
        perspective: "published",
        stega: false,
      })
      .fetch<DistributorRecord[]>(query);
    records = Array.isArray(rows) ? rows : [];
  } catch {
    console.error("Distributor lookup failed.");
    if (process.env.NODE_ENV !== "development") return null;
  }

  const listIsEmpty = !records || records.length === 0;
  if (listIsEmpty && process.env.NODE_ENV === "development") {
    records = developmentDistributors;
  }
  if (!records) return null;
  return pickDistributor(records, country);
}
