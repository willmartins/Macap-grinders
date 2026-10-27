import type { Metadata } from "next";
import { headers } from "next/headers";
import { stegaClean } from "next-sanity";

import { localePlan } from "@/i18n/locales";
import { isIndexingAllowed } from "@/lib/indexing";
import { getSiteUrl, openGraphLocale, siteName } from "@/lib/site";

function plain(value: string): string {
  return stegaClean(value).replace(/\s+/g, " ").trim();
}

/** Live locales only. Italian stays in `localePlan` until it is public. */
export function hreflangAlternates(canonical: string): Record<string, string> {
  const languages: Record<string, string> = { "x-default": canonical };
  for (const locale of localePlan) {
    if (locale.live) languages[locale.hreflang] = canonical;
  }
  return languages;
}

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
  const canonical = plain(input.canonical || new URL(input.path, getSiteUrl()).toString());
  const title = plain(input.title);
  const description = plain(input.description);
  const image = input.image ? plain(input.image) : "";
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: hreflangAlternates(canonical),
    },
    robots: await robotsForRequest(input.noIndex),
    openGraph: {
      title,
      description,
      url: canonical,
      locale: openGraphLocale,
      siteName,
      type: input.type || "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
