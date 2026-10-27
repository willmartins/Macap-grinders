import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";
import { loadSitemap } from "@/sanity/lib/load";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await loadSitemap();
  const fixed = ["", "/home-grinders", "/professional", "/grinders", "/compare", "/knowledge", "/about", "/contact"];
  const entries: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: new URL(path || "/", base).toString(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  const add = (prefix: string, items: Array<{ slug: string; updatedAt: string }>, priority: number) => {
    for (const item of items) {
      entries.push({
        url: new URL(`${prefix}/${item.slug}`, base).toString(),
        lastModified: item.updatedAt || undefined,
        changeFrequency: "weekly",
        priority,
      });
    }
  };
  add("/grinders", data.grinders, 0.7);
  add("/collections", data.collections, 0.6);
  add("/knowledge", data.posts, 0.6);
  add("/knowledge/topic", data.topics, 0.5);
  add("/legal", data.legal, 0.3);
  return entries;
}
