import {
  sampleAbout,
  sampleCollections,
  sampleContact,
  sampleGrinders,
  sampleGrindersIndex,
  sampleGroups,
  sampleHomeJourney,
  sampleHomePage,
  sampleKnowledgeHub,
  sampleLegal,
  samplePosts,
  sampleProfessionalJourney,
  sampleShell,
  sampleTopics,
} from "@/lib/content/sample";
import type {
  ArticleCard,
  Collection,
  Grinder,
  GrinderCard,
  Group,
  Journey,
  LegalPage,
  PageDocument,
  Post,
  Shell,
  Topic,
} from "@/lib/content/types";
import { sanityFetch } from "@/sanity/lib/live";
import type { Perspective } from "@/sanity/lib/draft";
import {
  groupsFromCards,
  mapArticleCard,
  mapCard,
  mapCollection,
  mapGrinder,
  mapJourney,
  mapLegal,
  mapPage,
  mapPost,
  mapShell,
  mapSitemap,
  mapTopic,
  type SitemapEntry,
} from "@/sanity/lib/map";
import {
  COLLECTION_QUERY,
  GRINDER_QUERY,
  GRINDERS_QUERY,
  HOME_QUERY,
  JOURNEY_QUERY,
  LEGAL_QUERY,
  POST_QUERY,
  POSTS_QUERY,
  SHELL_QUERY,
  SIMPLE_PAGE_QUERY,
  SITEMAP_QUERY,
  TOPICS_QUERY,
} from "@/sanity/lib/queries";

async function read<const Query extends string>(options: {
  query: Query;
  params?: Record<string, string>;
  perspective: Perspective;
  tags: string[];
}): Promise<unknown> {
  const result = await sanityFetch({
    query: options.query,
    params: options.params,
    perspective: options.perspective,
    stega: options.perspective === "drafts",
    tags: options.tags,
  });
  return result.data;
}

export async function loadShell(perspective: Perspective): Promise<Shell> {
  "use cache";
  try {
    const data = await read({
      query: SHELL_QUERY,
      perspective,
      tags: ["siteSettings", "grinderCollection", "legalPage"],
    });
    return mapShell(data, sampleShell) ?? sampleShell;
  } catch (error) {
    console.error("Macap content: site settings", error);
    return sampleShell;
  }
}

export async function loadHome(perspective: Perspective): Promise<PageDocument> {
  "use cache";
  try {
    const data = await read({
      query: HOME_QUERY,
      perspective,
      tags: ["homePage", "grinder", "grinderCollection", "kbPost"],
    });
    return mapPage(data) ?? sampleHomePage;
  } catch (error) {
    console.error("Macap content: home", error);
    return sampleHomePage;
  }
}

export async function loadJourney(slug: string, perspective: Perspective): Promise<Journey> {
  "use cache";
  const sample = slug === "professional" ? sampleProfessionalJourney : sampleHomeJourney;
  try {
    const data = await read({
      query: JOURNEY_QUERY,
      params: { slug },
      perspective,
      tags: ["journeyPage", `journeyPage:${slug}`, "grinder", "grinderCollection", "kbPost"],
    });
    return mapJourney(data) ?? sample;
  } catch (error) {
    console.error("Macap content: journey", error);
    return sample;
  }
}

async function loadSimple(
  id: string,
  perspective: Perspective,
  sample: PageDocument,
): Promise<PageDocument> {
  "use cache";
  try {
    const data = await read({
      query: SIMPLE_PAGE_QUERY,
      params: { id },
      perspective,
      tags: [id, "grinder", "grinderCollection", "kbPost"],
    });
    return mapPage(data) ?? sample;
  } catch (error) {
    console.error(`Macap content: ${id}`, error);
    return sample;
  }
}

export function loadAbout(perspective: Perspective) {
  return loadSimple("aboutPage", perspective, sampleAbout);
}

export function loadContact(perspective: Perspective) {
  return loadSimple("contactPage", perspective, sampleContact);
}

export function loadKnowledgeHub(perspective: Perspective) {
  return loadSimple("knowledgeHubPage", perspective, sampleKnowledgeHub);
}

export function loadGrindersIndex(perspective: Perspective) {
  return loadSimple("grindersIndexPage", perspective, sampleGrindersIndex);
}

export async function loadGrinderCards(
  perspective: Perspective,
): Promise<{ sample: boolean; grinders: GrinderCard[]; groups: Group[] }> {
  "use cache";
  try {
    const data = await read({ query: GRINDERS_QUERY, perspective, tags: ["grinder", "grinderGroup"] });
    const grinders = Array.isArray(data)
      ? data.flatMap((item) => {
          const card = mapCard(item);
          return card ? [card] : [];
        })
      : [];
    if (!grinders.length) {
      return { sample: true, grinders: sampleGrinders, groups: sampleGroups };
    }
    return { sample: false, grinders, groups: groupsFromCards(grinders) };
  } catch (error) {
    console.error("Macap content: grinders", error);
    return { sample: true, grinders: sampleGrinders, groups: sampleGroups };
  }
}

export async function loadGrinder(
  slug: string,
  perspective: Perspective,
): Promise<{ sample: boolean; grinder: Grinder } | null> {
  "use cache";
  try {
    const data = await read({
      query: GRINDER_QUERY,
      params: { slug },
      perspective,
      tags: ["grinder", `grinder:${slug}`],
    });
    const grinder = mapGrinder(data);
    if (grinder) return { sample: false, grinder };
  } catch (error) {
    console.error("Macap content: grinder", error);
  }
  const sample = sampleGrinders.find((item) => item.slug === slug);
  return sample ? { sample: true, grinder: sample } : null;
}

export async function loadCollection(
  slug: string,
  perspective: Perspective,
): Promise<{ sample: boolean; collection: Collection } | null> {
  "use cache";
  try {
    const data = await read({
      query: COLLECTION_QUERY,
      params: { slug },
      perspective,
      tags: ["grinderCollection", `grinderCollection:${slug}`, "grinder"],
    });
    const collection = mapCollection(data);
    if (collection) return { sample: false, collection };
  } catch (error) {
    console.error("Macap content: collection", error);
  }
  const sample = sampleCollections.find((item) => item.slug === slug);
  return sample ? { sample: true, collection: sample } : null;
}

export async function loadPosts(
  perspective: Perspective,
): Promise<{ sample: boolean; posts: ArticleCard[] }> {
  "use cache";
  try {
    const data = await read({ query: POSTS_QUERY, perspective, tags: ["kbPost", "kbTopic"] });
    const posts = Array.isArray(data)
      ? data.flatMap((item) => {
          const card = mapArticleCard(item);
          return card ? [card] : [];
        })
      : [];
    if (posts.length) return { sample: false, posts };
  } catch (error) {
    console.error("Macap content: posts", error);
  }
  return { sample: true, posts: samplePosts };
}

export async function loadPost(
  slug: string,
  perspective: Perspective,
): Promise<{ sample: boolean; post: Post } | null> {
  "use cache";
  try {
    const data = await read({
      query: POST_QUERY,
      params: { slug },
      perspective,
      tags: ["kbPost", `kbPost:${slug}`],
    });
    const post = mapPost(data);
    if (post) return { sample: false, post };
  } catch (error) {
    console.error("Macap content: post", error);
  }
  const sample = samplePosts.find((item) => item.slug === slug);
  return sample ? { sample: true, post: sample } : null;
}

export async function loadTopics(perspective: Perspective): Promise<{ sample: boolean; topics: Topic[] }> {
  "use cache";
  try {
    const data = await read({ query: TOPICS_QUERY, perspective, tags: ["kbTopic"] });
    const topics = Array.isArray(data)
      ? data.flatMap((item) => {
          const topic = mapTopic(item);
          return topic ? [topic] : [];
        })
      : [];
    if (topics.length) return { sample: false, topics };
  } catch (error) {
    console.error("Macap content: topics", error);
  }
  return { sample: true, topics: sampleTopics };
}

export async function loadLegal(
  slug: string,
  perspective: Perspective,
): Promise<{ sample: boolean; page: LegalPage } | null> {
  "use cache";
  try {
    const data = await read({
      query: LEGAL_QUERY,
      params: { slug },
      perspective,
      tags: ["legalPage", `legalPage:${slug}`],
    });
    const page = mapLegal(data);
    if (page) return { sample: false, page };
  } catch (error) {
    console.error("Macap content: legal", error);
  }
  const sample = sampleLegal.find((item) => item.slug === slug);
  return sample ? { sample: true, page: sample } : null;
}

export async function loadSitemap(): Promise<{
  sample: boolean;
  grinders: SitemapEntry[];
  collections: SitemapEntry[];
  posts: SitemapEntry[];
  topics: SitemapEntry[];
  legal: SitemapEntry[];
}> {
  "use cache";
  const sample = {
    sample: true,
    grinders: sampleGrinders
      .filter((item) => item.status !== "discontinued")
      .map((item) => ({ slug: item.slug, updatedAt: "2026-10-01" })),
    collections: sampleCollections.map((item) => ({ slug: item.slug, updatedAt: "2026-10-01" })),
    posts: samplePosts.map((item) => ({ slug: item.slug, updatedAt: item.updatedAt || item.publishedAt })),
    topics: sampleTopics.map((item) => ({ slug: item.slug, updatedAt: "2026-10-01" })),
    legal: sampleLegal.map((item) => ({ slug: item.slug, updatedAt: item.effectiveDate })),
  };
  try {
    const data = await read({
      query: SITEMAP_QUERY,
      perspective: "published",
      tags: ["grinder", "grinderCollection", "kbPost", "kbTopic", "legalPage"],
    });
    const mapped = mapSitemap(data);
    const count =
      mapped.grinders.length +
      mapped.collections.length +
      mapped.posts.length +
      mapped.topics.length +
      mapped.legal.length;
    if (!count) return sample;
    return {
      sample: false,
      grinders: mapped.grinders,
      collections: mapped.collections,
      posts: mapped.posts,
      topics: mapped.topics,
      legal: mapped.legal,
    };
  } catch (error) {
    console.error("Macap content: sitemap", error);
    return sample;
  }
}
