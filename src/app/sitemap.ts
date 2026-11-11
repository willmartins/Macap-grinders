import type { MetadataRoute } from "next";

import { audiencePages, grinderPath } from "@/lib/paths";
import { getSiteUrl } from "@/lib/site";
import { loadSitemap } from "@/sanity/lib/load";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await loadSitemap();
  const fixed = ["", audiencePages.home.path, audiencePages.business.path, "/grinders", "/compare", "/knowledge", "/about", "/contact"];
  const pageUpdated = new Map(data.pages.map((page) => [page.path, page.updatedAt]));
  const entries: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: new URL(path || "/", base).toString(),
    lastModified: pageUpdated.get(path || "/") || undefined,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  const add = (
    prefix: string,
    items: Array<{ slug: string; updatedAt: string; image?: string | null }>,
    priority: number,
  ) => {
    for (const item of items) {
      entries.push({
        url: new URL(`${prefix}/${item.slug}`, base).toString(),
        lastModified: item.updatedAt || undefined,
        changeFrequency: "weekly",
        priority,
        ...(item.image ? { images: [item.image] } : {}),
      });
    }
  };
  // A grinder sits under its range. Ranges and collections share /grinders/<slug>; a range wins a shared slug.
  for (const grinder of data.grinders) {
    entries.push({
      url: new URL(grinderPath(grinder), base).toString(),
      lastModified: grinder.updatedAt || undefined,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(grinder.image ? { images: [grinder.image] } : {}),
    });
  }
  const rangeSlugs = new Set(data.ranges.map((range) => range.slug));
  add("/grinders", data.ranges, 0.7);
  add("/grinders", data.collections.filter((collection) => !rangeSlugs.has(collection.slug)), 0.6);
  add("/knowledge", data.posts, 0.6);
  add("/knowledge/topic", data.topics, 0.5);
  add("/legal", data.legal, 0.3);
  return entries;
}
