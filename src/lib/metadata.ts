import type { Metadata } from "next";

import { getSiteUrl, openGraphLocale, siteName } from "@/lib/site";

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  canonical?: string | null;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const canonical = input.canonical || new URL(input.path, getSiteUrl()).toString();
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: {
      canonical,
      languages: { "en-GB": canonical },
    },
    robots: input.noIndex ? { index: false, follow: true } : { index: true, follow: true },
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
