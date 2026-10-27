import { stegaClean } from "next-sanity";

import type {
  ArticleCard,
  Audience,
  AudienceFilter,
  BurrType,
  Collection,
  CollectionCard,
  ExtraSpec,
  FaqItem,
  FeatureItem,
  GalleryImage,
  GrindType,
  Grinder,
  GrinderCard,
  GrinderStatus,
  Group,
  Journey,
  LegalPage,
  LinkItem,
  PageDocument,
  Post,
  RichText,
  Section,
  SeoFields,
  Shell,
  SiteSettings,
  Specs,
  Topic,
} from "@/lib/content/types";
import { safeHref } from "@/lib/security";
import { imageUrl } from "@/sanity/lib/image";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function display(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function logic(value: unknown): string {
  return typeof value === "string" ? stegaClean(value).trim() : "";
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && stegaClean(value).trim()) {
    const parsed = Number(stegaClean(value));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function audience(value: unknown): Audience {
  return logic(value) === "business" ? "business" : "home";
}

function audienceFilter(value: unknown): AudienceFilter {
  const text = logic(value);
  if (text === "home" || text === "business" || text === "both") return text;
  return "both";
}

function status(value: unknown): GrinderStatus {
  const text = logic(value);
  if (text === "new" || text === "current" || text === "discontinued") return text;
  return "current";
}

function burr(value: unknown): BurrType | null {
  const text = logic(value);
  if (text === "flat" || text === "conical") return text;
  return null;
}

function grind(value: unknown): GrindType | null {
  const text = logic(value);
  if (text === "espresso" || text === "filter" || text === "both") return text;
  return null;
}

function mapSeo(value: unknown, image?: string | null): SeoFields {
  const record = isRecord(value) ? value : {};
  return {
    title: display(record.seoTitle),
    description: display(record.seoDescription),
    noIndex: record.noIndex === true,
    canonical: logic(record.canonical) || null,
    imageUrl: image || null,
  };
}

export function mapLink(value: unknown): LinkItem | null {
  if (!isRecord(value)) return null;
  const href = safeHref(logic(value.href));
  const label = display(value.label).trim();
  if (!href || !label) return null;
  return { _key: logic(value._key) || href, label, href };
}

function mapLinks(value: unknown): LinkItem[] {
  return list(value).flatMap((item) => {
    const link = mapLink(item);
    return link ? [link] : [];
  });
}

function mapFaqs(value: unknown): FaqItem[] {
  return list(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const question = display(item.question).trim();
    const answer = display(item.answer).trim();
    if (!question || !answer) return [];
    return [{ _key: logic(item._key) || question, question, answer }];
  });
}

function mapFeatures(value: unknown): FeatureItem[] {
  return list(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const title = display(item.title).trim();
    const text = display(item.text).trim();
    if (!title || !text) return [];
    return [{ _key: logic(item._key) || title, title, text }];
  });
}

function mapExtra(value: unknown): ExtraSpec[] {
  return list(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const label = display(item.label).trim();
    const specValue = display(item.value).trim();
    if (!label || !specValue) return [];
    return [{ _key: logic(item._key) || label, label, value: specValue }];
  });
}

function mapStrings(value: unknown): string[] {
  return list(value).flatMap((item) => {
    const text = display(item).trim();
    return text ? [text] : [];
  });
}

export function mapSpecs(value: unknown, extra: unknown): Specs {
  const spec = isRecord(value) ? value : {};
  return {
    burrType: burr(spec.burrType),
    burrDiameterMm: numberValue(spec.burrDiameterMm),
    motorPowerW: numberValue(spec.motorPowerW),
    rpm: numberValue(spec.rpm),
    hopperCapacityG: numberValue(spec.hopperCapacityG),
    outputGPerS: numberValue(spec.outputGPerS),
    adjustment: display(spec.adjustment).trim() || null,
    widthMm: numberValue(spec.widthMm),
    depthMm: numberValue(spec.depthMm),
    heightMm: numberValue(spec.heightMm),
    weightKg: numberValue(spec.weightKg),
    voltage: display(spec.voltage).trim() || null,
    display: display(spec.display).trim() || null,
    grindType: grind(spec.grindType),
    features: mapStrings(spec.features),
    extra: mapExtra(extra),
  };
}

function picture(value: unknown, width: number): { url: string | null; alt: string } {
  if (!isRecord(value)) return { url: null, alt: "" };
  return {
    url: imageUrl(value, width),
    alt: display(value.alt || value.imageAlt),
  };
}

export function mapCard(value: unknown): GrinderCard | null {
  if (!isRecord(value)) return null;
  const slug = logic(value.slug);
  const name = display(value.name).trim();
  if (!slug || !name) return null;
  const image = picture(value.heroImage, 1200);
  return {
    id: logic(value._id) || slug,
    name,
    slug,
    audience: audience(value.audience),
    status: status(value.status),
    shortDescription: display(value.shortDescription),
    groupName: display(value.groupName).trim() || null,
    groupSlug: logic(value.groupSlug) || null,
    burrDiameterMm: numberValue(value.burrDiameterMm),
    burrType: burr(value.burrType),
    grindType: grind(value.grindType),
    motorPowerW:
      numberValue(value.motorPowerW) ??
      (isRecord(value.specs) ? numberValue(value.specs.motorPowerW) : null),
    imageUrl: image.url,
    imageAlt: image.alt || display(value.imageAlt),
  };
}

function mapCards(value: unknown): GrinderCard[] {
  return list(value).flatMap((item) => {
    const card = mapCard(item);
    return card ? [card] : [];
  });
}

function mapDetail(value: unknown): Grinder | null {
  const card = mapCard(value);
  if (!card || !isRecord(value)) return null;
  const image = picture(value.heroImage, 1600);
  return {
    ...card,
    imageUrl: image.url || card.imageUrl,
    imageAlt: image.alt || card.imageAlt,
    answerFirst: display(value.answerFirst),
    gallery: mapGallery(value.gallery),
    specs: mapSpecs(value.specs, value.extraSpecs),
    faqs: mapFaqs(value.faqs),
    relatedGrinders: mapCards(value.relatedGrinders),
    relatedArticles: mapArticleCards(value.relatedArticles),
    catalogueUrl: safeHref(logic(value.catalogueUrl)),
    catalogueLabel: display(value.catalogueLabel).trim() || null,
    seo: mapSeo(value, image.url),
  };
}

function mapGallery(value: unknown): GalleryImage[] {
  return list(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const image = picture(item, 1600);
    return [{ _key: logic(item._key) || image.alt || "image", url: image.url, alt: image.alt }];
  });
}

export function mapArticleCard(value: unknown): ArticleCard | null {
  if (!isRecord(value)) return null;
  const slug = logic(value.slug);
  const title = display(value.title).trim();
  if (!slug || !title) return null;
  return {
    title,
    slug,
    excerpt: display(value.excerpt),
    publishedAt: logic(value.publishedAt),
    topicTitle: display(value.topicTitle).trim() || null,
    topicSlug: logic(value.topicSlug) || null,
  };
}

function mapArticleCards(value: unknown): ArticleCard[] {
  return list(value).flatMap((item) => {
    const card = mapArticleCard(item);
    return card ? [card] : [];
  });
}

function mapCollectionCards(value: unknown): CollectionCard[] {
  return list(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const slug = logic(item.slug);
    const name = display(item.name).trim();
    if (!slug || !name) return [];
    return [
      {
        name,
        slug,
        summary: display(item.summary),
        audience: audienceFilter(item.audience),
      },
    ];
  });
}

function richText(value: unknown): RichText {
  return Array.isArray(value) ? (value as RichText) : [];
}

function mapSection(value: unknown): Section | null {
  if (!isRecord(value)) return null;
  const type = logic(value._type);
  const key = logic(value._key) || type;
  const heading = display(value.heading);
  const image = picture(value.image, 1600);

  if (type === "heroBanner") {
    if (!heading.trim()) return null;
    return {
      _key: key,
      _type: "heroBanner",
      eyebrow: display(value.eyebrow) || undefined,
      heading,
      text: display(value.text) || undefined,
      links: mapLinks(value.links),
      imageUrl: image.url,
      imageAlt: image.alt,
    };
  }
  if (type === "richText") {
    return { _key: key, _type: "richText", heading: heading || undefined, body: richText(value.body) };
  }
  if (type === "imageText") {
    const position = logic(value.imagePosition) === "left" ? "left" : "right";
    return {
      _key: key,
      _type: "imageText",
      heading,
      text: display(value.text),
      imageUrl: image.url,
      imageAlt: image.alt,
      imagePosition: position,
      link: mapLink(value.link) || undefined,
    };
  }
  if (type === "grinderGrid") {
    return {
      _key: key,
      _type: "grinderGrid",
      heading,
      intro: display(value.intro) || undefined,
      grinders: mapCards(value.grinders),
    };
  }
  if (type === "collectionCarousel") {
    return {
      _key: key,
      _type: "collectionCarousel",
      heading,
      intro: display(value.intro) || undefined,
      collections: mapCollectionCards(value.collections),
    };
  }
  if (type === "featureList") {
    return {
      _key: key,
      _type: "featureList",
      heading,
      intro: display(value.intro) || undefined,
      features: mapFeatures(value.features),
    };
  }
  if (type === "specTable") {
    return { _key: key, _type: "specTable", heading: heading || undefined, grinder: mapDetail(value.specGrinder) };
  }
  if (type === "comparisonTable") {
    return {
      _key: key,
      _type: "comparisonTable",
      heading,
      intro: display(value.intro) || undefined,
      grinders: list(value.detailGrinders).flatMap((item) => {
        const grinder = mapDetail(item);
        return grinder ? [grinder] : [];
      }),
    };
  }
  if (type === "faqAccordion") {
    return { _key: key, _type: "faqAccordion", heading, faqs: mapFaqs(value.faqs) };
  }
  if (type === "ctaBanner") {
    const link = mapLink(value.link);
    if (!link) return null;
    return {
      _key: key,
      _type: "ctaBanner",
      heading,
      text: display(value.text) || undefined,
      link,
      step: logic(value.step) || undefined,
    };
  }
  if (type === "videoEmbed") {
    const url = safeHref(logic(value.url));
    if (!url) return null;
    return {
      _key: key,
      _type: "videoEmbed",
      heading: heading || undefined,
      url,
      caption: display(value.caption) || undefined,
    };
  }
  if (type === "kbPostGrid") {
    return {
      _key: key,
      _type: "kbPostGrid",
      heading,
      intro: display(value.intro) || undefined,
      posts: mapArticleCards(value.posts),
    };
  }
  if (type === "quote") {
    const quote = display(value.quote).trim();
    if (!quote) return null;
    return {
      _key: key,
      _type: "quote",
      quote,
      attribution: display(value.attribution),
      role: display(value.role) || undefined,
    };
  }
  if (type === "contactBlock") {
    return { _key: key, _type: "contactBlock", heading, text: display(value.text) || undefined };
  }
  return null;
}

export function mapSections(value: unknown): Section[] {
  return list(value).flatMap((item) => {
    const section = mapSection(item);
    return section ? [section] : [];
  });
}

export function mapPage(value: unknown): PageDocument | null {
  if (!isRecord(value) || !display(value.title).trim()) return null;
  return {
    sample: false,
    title: display(value.title),
    introduction: display(value.introduction),
    sections: mapSections(value.sections),
    seo: mapSeo(value),
  };
}

export function mapJourney(value: unknown): Journey | null {
  const page = mapPage(value);
  if (!page || !isRecord(value)) return null;
  const slug = logic(value.slug);
  if (slug !== "home-grinders" && slug !== "professional") return null;
  return { ...page, slug, audience: audience(value.audience) };
}

export function mapShell(value: unknown, fallback: Shell): Shell | null {
  if (!isRecord(value) || !isRecord(value.settings)) return null;
  const settings = value.settings;
  const organisation = isRecord(settings.organisation) ? settings.organisation : {};
  const navigation = mapLinks(settings.navigation);
  const mapped: SiteSettings = {
    siteName: display(settings.siteName).trim() || fallback.settings.siteName,
    navigation: navigation.length ? navigation : fallback.settings.navigation,
    footerNavigation: mapLinks(settings.footerNavigation),
    socials: mapLinks(settings.socials),
    email: display(settings.email).trim() || fallback.settings.email,
    phone: display(settings.phone).trim() || fallback.settings.phone,
    address: display(settings.address).trim() || fallback.settings.address,
    organisation: {
      name: display(organisation.name).trim() || fallback.settings.organisation.name,
      legalName: display(organisation.legalName).trim() || fallback.settings.organisation.legalName,
      url: logic(organisation.url) || fallback.settings.organisation.url,
      email: display(organisation.email).trim() || fallback.settings.organisation.email,
      telephone: display(organisation.telephone).trim() || fallback.settings.organisation.telephone,
      address: display(organisation.address).trim() || fallback.settings.organisation.address,
      sameAs: mapStrings(organisation.sameAs).filter((item) => safeHref(item)),
    },
    seo: {
      title: display(settings.seoTitle) || fallback.settings.seo.title,
      description: display(settings.seoDescription) || fallback.settings.seo.description,
    },
  };
  const collections = mapCollectionCards(value.collections);
  const legal = list(value.legal).flatMap((item) => {
    if (!isRecord(item)) return [];
    const slug = logic(item.slug);
    const title = display(item.title).trim();
    return slug && title ? [{ title, slug }] : [];
  });
  return {
    sample: false,
    settings: mapped,
    collections: collections.length ? collections : fallback.collections,
    legal: legal.length ? legal : fallback.legal,
  };
}

export function mapGrinder(value: unknown): Grinder | null {
  return mapDetail(value);
}

export function mapCollection(value: unknown): Collection | null {
  if (!isRecord(value)) return null;
  const slug = logic(value.slug);
  const name = display(value.name).trim();
  if (!slug || !name) return null;
  return {
    id: logic(value._id) || slug,
    name,
    slug,
    summary: display(value.summary),
    audience: audienceFilter(value.audience),
    answerFirst: display(value.answerFirst),
    grinders: mapCards(value.grinders),
    sections: mapSections(value.sections),
    seo: mapSeo(value),
  };
}

export function mapPost(value: unknown): Post | null {
  const card = mapArticleCard(value);
  if (!card || !isRecord(value)) return null;
  const image = picture(value.image, 1600);
  return {
    ...card,
    updatedAt: logic(value.updatedAt) || null,
    answerFirst: display(value.answerFirst),
    author: {
      name: display(value.authorName).trim() || "Macap",
      slug: logic(value.authorSlug) || "macap",
      role: display(value.authorRole),
      bio: display(value.authorBio),
    },
    body: richText(value.body),
    faqs: mapFaqs(value.faqs),
    relatedGrinders: mapCards(value.relatedGrinders),
    imageUrl: image.url,
    imageAlt: image.alt,
    seo: mapSeo(value, image.url),
  };
}

export function mapTopic(value: unknown): Topic | null {
  if (!isRecord(value)) return null;
  const slug = logic(value.slug);
  const title = display(value.title).trim();
  if (!slug || !title) return null;
  return {
    title,
    slug,
    description: display(value.description),
    seo: mapSeo(value),
  };
}

export function mapLegal(value: unknown): LegalPage | null {
  if (!isRecord(value)) return null;
  const slug = logic(value.slug);
  const title = display(value.title).trim();
  if (!slug || !title) return null;
  return {
    title,
    slug,
    effectiveDate: logic(value.effectiveDate),
    body: richText(value.body),
    seo: mapSeo(value),
  };
}

export type SitemapEntry = { slug: string; updatedAt: string };

export function mapSitemap(value: unknown): {
  grinders: SitemapEntry[];
  collections: SitemapEntry[];
  posts: SitemapEntry[];
  topics: SitemapEntry[];
  legal: SitemapEntry[];
} {
  const empty = { grinders: [], collections: [], posts: [], topics: [], legal: [] };
  if (!isRecord(value)) return empty;
  const read = (key: string): SitemapEntry[] =>
    list(value[key]).flatMap((item) => {
      if (!isRecord(item)) return [];
      const slug = logic(item.slug);
      if (!slug) return [];
      return [{ slug, updatedAt: logic(item._updatedAt) }];
    });
  return {
    grinders: read("grinders"),
    collections: read("collections"),
    posts: read("posts"),
    topics: read("topics"),
    legal: read("legal"),
  };
}

export function groupsFromCards(cards: GrinderCard[]): Group[] {
  const groups = new Map<string, Group>();
  for (const card of cards) {
    if (!card.groupSlug || groups.has(card.groupSlug)) continue;
    groups.set(card.groupSlug, {
      id: card.groupSlug,
      name: card.groupName || card.groupSlug,
      slug: card.groupSlug,
      summary: "",
      audience: card.audience,
    });
  }
  return [...groups.values()];
}
