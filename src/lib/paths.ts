import type { Audience } from "@/lib/content/types";

/**
 * Page addresses for the grinder catalogue. Every link to a grinder, range, collection or
 * audience page goes through here, so the structure is set in one place.
 *
 * /grinders                      all grinders
 * /grinders/home                 Home grinders
 * /grinders/professional         Professional grinders
 * /grinders/<range>              a range, such as Supra
 * /grinders/<collection>         a collection, such as G Series (shares the range addresses)
 * /grinders/<range>/<model>      a grinder
 */

export const grindersPath = "/grinders";

export const audiencePages: Record<Audience, { path: string; label: string; slug: "home-grinders" | "professional" }> = {
  home: { path: "/grinders/home", label: "Home grinders", slug: "home-grinders" },
  business: { path: "/grinders/professional", label: "Professional grinders", slug: "professional" },
};

export function rangePath(slug: string): string {
  return `/grinders/${slug}`;
}

export function collectionPath(slug: string): string {
  return `/grinders/${slug}`;
}

/** A grinder sits under its range. A grinder with no range keeps the short address. */
export function grinderPath(grinder: { slug: string; groupSlug?: string | null }): string {
  return grinder.groupSlug ? `/grinders/${grinder.groupSlug}/${grinder.slug}` : `/grinders/${grinder.slug}`;
}
