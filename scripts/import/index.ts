/**
 * Idempotent Sanity import. Pass a JSON file of documents, or use the example.
 * Requires SANITY_API_WRITE_TOKEN. Does not read the old website.
 *
 *   pnpm import:content
 *   pnpm import:content data/seed/example.json
 */
import { readFile } from "node:fs/promises";

import { createClient } from "next-sanity";

type SeedDocument = { _id: string; _type: string } & Record<string, unknown>;

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_API_WRITE_TOKEN before running the import.");
  process.exit(1);
}

const file = process.argv[2] || "data/seed/example.json";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "u5o31ts3";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const raw = JSON.parse(await readFile(file, "utf8")) as { documents?: SeedDocument[] };
const documents = raw.documents || [];
if (!documents.length) {
  console.error("No documents in the file.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  token,
  useCdn: false,
});

for (const document of documents) {
  if (!document._id || !document._type) {
    console.error("Each document needs _id and _type.");
    process.exit(1);
  }
  await client.createOrReplace(document);
  console.log(`Replaced ${document._type} ${document._id}`);
}
