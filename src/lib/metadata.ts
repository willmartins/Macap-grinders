import type { Metadata } from "next";
import { headers } from "next/headers";

import { isIndexingAllowed } from "@/lib/indexing";
import { getSiteUrl, openGraphLocale, siteName } from "@/lib/site";

export async function robotsForRequest(pageNoIndex = false): Promise<Metadata["robots"]> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  if (!isIndexingAllowed(host)) return { index: false, follow: false };
  if (pageNoIndex) return { index: false, follow: true };
  return { index: true, follow: true };
}

export async function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  canonical?: string | null;
  image?: string | null;
  type?: "website" | "article";
}): Promise<Metadata> {
  const canonical = input.canonical || new URL(input.path, getSiteUrl()).toString();
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: {
      canonical,
      languages: { "en-GB": canonical },
    },
    robots: await robotsForRequest(input.noIndex),
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      locale: openGraphLocale,
      siteName,
      type: input.type || "website",
      ...(input.image ? { images: [{ url: input.image }] } : {}),
    },
  };
}
