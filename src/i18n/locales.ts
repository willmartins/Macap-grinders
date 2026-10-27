/**
 * English (UK) is the only public locale.
 * Italian is document-level later: a new document with `language: "it-IT"`,
 * the same slug, and routes under `/it`. Do not add Italian documents or
 * hreflang targets until that locale is in `locales`. `x-default` stays English.
 */
export const locales = ["en-GB"] as const;

/** Planned, not published. `live` is what hreflang is allowed to emit. */
export const localePlan = [
  { hreflang: "en-GB", language: "en-GB", prefix: "", live: true },
  { hreflang: "it", language: "it-IT", prefix: "/it", live: false },
] as const;

export const defaultLocale = "en-GB" as const;

export type Locale = (typeof locales)[number];

/** Future: `{ "it-IT": "/it" }`. English stays unprefixed. */
export const localePrefix: Record<Locale, string> = {
  "en-GB": "",
};

export function localePath(locale: Locale, path: string): string {
  const prefix = localePrefix[locale];
  if (!prefix) return path;
  if (path === "/") return prefix;
  return `${prefix}${path}`;
}
