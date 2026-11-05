import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  articleJsonLd,
  breadcrumbJsonLd,
  collectionJsonLd,
  faqJsonLd,
  jsonLdGraph,
  organisationJsonLd,
  productJsonLd,
  websiteJsonLd,
} from "../src/lib/jsonld";
import type { Grinder, Shell } from "../src/lib/content/types";
import { schemaTypes } from "../src/sanity/schemaTypes";

let failed = 0;

function check(condition: boolean, message: string) {
  if (!condition) {
    failed += 1;
    console.error(`fail: ${message}`);
  }
}

function fieldNames(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) fieldNames(item, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      found.push(key);
      fieldNames(entry, found);
    }
  }
  return found;
}

const forbidden = ["offers", "aggregateRating", "review", "reviewRating"];

const grinder = {
  id: "supra-68",
  name: "Supra 68",
  slug: "supra-68",
  audience: "business",
  status: "current",
  shortDescription: "A commercial espresso grinder.",
  groupName: "Supra",
  groupSlug: "supra",
  burrDiameterMm: 68,
  burrType: "flat",
  grindType: "espresso",
  motorPowerW: 550,
  imageUrl: "https://cdn.sanity.io/images/example/supra.jpg",
  imageAlt: "Supra 68",
  answerFirst: "The Supra 68 is a commercial espresso grinder. Flat burrs, 68 mm.",
  gallery: [],
  specs: {
    burrType: "flat",
    burrDiameterMm: 68,
    motorPowerW: 550,
    rpm: null,
    hopperCapacityG: null,
    outputGPerS: null,
    adjustment: null,
    widthMm: null,
    depthMm: null,
    heightMm: null,
    weightKg: null,
    voltage: null,
    display: null,
    grindType: "espresso",
    features: [],
    extra: [],
  },
  faqs: [{ _key: "q", question: "What burrs does it use?", answer: "Flat burrs, 68 mm." }],
  relatedGrinders: [],
  relatedArticles: [],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: { title: "", description: "", noIndex: false, canonical: null, imageUrl: null },
} satisfies Grinder;

const product = productJsonLd(grinder);
check(product["@type"] === "Product", "Product @type");
check(Boolean(product.model), "Product model");
check(Boolean(product.brand), "Product brand");
check(Array.isArray(product.additionalProperty) && product.additionalProperty.length > 0, "Product additionalProperty");
const productKeys = fieldNames(product);
for (const key of forbidden) check(!productKeys.includes(key), `Product must not include ${key}`);

const article = articleJsonLd({
  title: "Flat burrs and conical burrs",
  description: "Flat burrs grind more evenly for espresso.",
  slug: "flat-burrs-and-conical-burrs",
  publishedAt: "2026-01-01",
  updatedAt: "2026-02-01",
  authorName: "Alex Editor",
  authorRole: "Product editor",
  authorBio: "Writes the Macap knowledge notes.",
  authorSameAs: ["https://macap.it"],
  imageUrl: null,
});
const author = article.author as { "@type"?: string; jobTitle?: string };
check(article["@type"] === "Article", "Article @type");
check(author["@type"] === "Person", "Article author is a person");
check(author.jobTitle === "Product editor", "Article author job title");
check(typeof article.datePublished === "string" && typeof article.dateModified === "string", "Article dates");

const faqs = faqJsonLd(grinder.faqs);
check(faqs?.["@type"] === "FAQPage", "FAQPage");
check(faqJsonLd([]) === null, "FAQPage is omitted when nothing is visible");

const collection = collectionJsonLd({
  name: "Supra",
  description: "Commercial flat-burr grinders.",
  slug: "supra",
  grinders: [{ name: "Supra 68", slug: "supra-68" }],
});
check(collection["@type"] === "CollectionPage", "CollectionPage");
check((collection.mainEntity as { "@type"?: string })["@type"] === "ItemList", "ItemList");

const crumbs = breadcrumbJsonLd([
  { name: "Grinders", path: "/grinders" },
  { name: "Supra 68", path: "/grinders/supra-68" },
]);
check(crumbs["@type"] === "BreadcrumbList", "BreadcrumbList");

const shell = {
  sample: true,
  settings: {
    siteName: "Macap",
    navigation: [],
    footerNavigation: [],
    socials: [],
    email: "info@macap.it",
    phone: "",
    address: "",
    organisation: {
      name: "Macap",
      legalName: "Macap SRL",
      url: "https://macap.it",
      email: "info@macap.it",
      telephone: "",
      address: "",
      sameAs: ["https://www.instagram.com/macap.it"],
    },
    seo: { title: "", description: "", noIndex: false, canonical: null },
  },
  collections: [],
  legal: [],
} satisfies Shell;

const graph = jsonLdGraph([organisationJsonLd(shell), websiteJsonLd(), product, faqs]);
check(graph?.["@context"] === "https://schema.org", "graph context");
check(Array.isArray(graph?.["@graph"]) && (graph["@graph"] as unknown[]).length === 4, "graph members");
const graphKeys = fieldNames(graph);
for (const key of forbidden) check(!graphKeys.includes(key), `graph must not include ${key}`);

const names = schemaTypes.map((type) => String(type.name));
for (const name of ["seo", "grinder", "grinderGroup", "grinderCollection", "kbTopic", "kbPost", "author", "redirect", "experiment"]) {
  check(names.includes(name), `schema includes ${name}`);
}
const seo = schemaTypes.find((type) => type.name === "seo");
const seoFields = new Set(
  (seo && "fields" in seo && Array.isArray(seo.fields) ? seo.fields : []).map((field) =>
    field && typeof field === "object" && "name" in field ? String(field.name) : "",
  ),
);
for (const field of ["title", "description", "image", "noIndex", "canonical"]) {
  check(seoFields.has(field), `seo.${field}`);
}

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return pages(path);
    return entry === "page.tsx" ? [path] : [];
  });
}

for (const path of pages("src/app")) {
  if (path.includes("/studio/")) continue;
  const source = readFileSync(path, "utf8");
  check(source.includes("generateMetadata"), `${path} generateMetadata`);
}

const robots = readFileSync("src/app/robots.txt/route.ts", "utf8");
check(robots.includes("isIndexingAllowed"), "robots keeps the indexing gate");
const load = readFileSync("src/sanity/lib/load.ts", "utf8");
check(load.includes('stega: options.perspective === "drafts"'), "stega is off unless the request is a draft");
const metadata = readFileSync("src/lib/metadata.ts", "utf8");
check(metadata.includes("stegaClean"), "metadata strips stega");
check(metadata.includes('"x-default"'), "hreflang includes x-default");
check(!metadata.includes('"/it"'), "Italian hreflang is not emitted");

if (failed) {
  console.error(`${failed} structured data checks failed`);
  process.exit(1);
}
console.log("structured data checks passed");
