import { defaultLocale } from "@/i18n/locales";
import { canonicalOrigin } from "@/lib/indexing";

export const siteName = "Macap";

export const defaultDescription =
  "Macap designs and manufactures coffee grinders in Italy, for the home and for the bar.";

/** Canonical origin for links, sitemap and Open Graph. Never a Vercel preview host. */
export function getSiteUrl(): string {
  return canonicalOrigin();
}

export const htmlLang = defaultLocale;

/** Published company details from macap.it. Editors can override the address, phone and email in Studio. */
export const publicOffice = {
  fax: "+39 041 5030477",
  legal:
    "Macap SRL. P.IVA, CF and Reg. Imprese VE 03336810274. REA VE 299890. Share capital €50,000 fully paid.",
} as const;

/** Open Graph locale uses an underscore. */
export const openGraphLocale = "en_GB";
