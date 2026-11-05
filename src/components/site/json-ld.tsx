import { stegaClean } from "next-sanity";

import type { JsonLdNode } from "@/lib/jsonld";

function clean(value: unknown): unknown {
  if (typeof value === "string") return stegaClean(value);
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, clean(entry)]));
  }
  return value;
}

export function JsonLd({ data }: { data: JsonLdNode | null }) {
  if (!data) return null;
  const json = JSON.stringify(clean(data)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
