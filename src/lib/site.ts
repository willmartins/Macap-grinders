import { defaultLocale } from "@/i18n/locales";

export const siteName = "Macap";

export const defaultDescription =
  "Macap designs and manufactures coffee grinders in Italy, for the home and for the bar.";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
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

export const unsplash = {
  beans:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=80",
  cup: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80",
  espresso:
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=2000&q=80",
} as const;
