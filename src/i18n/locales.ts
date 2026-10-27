/**
 * English (UK) is the only public locale in v1.
 * Italian (it-IT) can be added later under a `/it` prefix without changing
 * the content model: every Sanity document already carries `language`.
 */
export const locales = ["en-GB"] as const;

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
