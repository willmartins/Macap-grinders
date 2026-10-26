import type { ArticleCard, FaqItem, Grinder, Shell } from "@/lib/content/types";
import { specEntries } from "@/lib/specs";
import { getSiteUrl, siteName } from "@/lib/site";

export type JsonLdNode = Record<string, unknown>;

function defined(value: Record<string, unknown>): JsonLdNode {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""),
  );
}

export function organisationJsonLd(shell: Shell): JsonLdNode {
  const org = shell.settings.organisation;
  return defined({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name || siteName,
    legalName: org.legalName || undefined,
    url: org.url || getSiteUrl(),
    email: org.email || shell.settings.email || undefined,
    telephone: org.telephone || shell.settings.phone || undefined,
    address: org.address
      ? { "@type": "PostalAddress", streetAddress: org.address }
      : undefined,
    sameAs: org.sameAs.length ? org.sameAs : undefined,
  });
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
    inLanguage: "en-GB",
    publisher: { "@type": "Organization", name: siteName },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, getSiteUrl()).toString(),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]): JsonLdNode | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function productJsonLd(grinder: Grinder): JsonLdNode {
  return defined({
    "@context": "https://schema.org",
    "@type": "Product",
    name: grinder.name,
    description: grinder.answerFirst || grinder.shortDescription,
    brand: { "@type": "Brand", name: siteName },
    category: grinder.groupName || "Coffee grinder",
    image: grinder.imageUrl || undefined,
    url: new URL(`/grinders/${grinder.slug}`, getSiteUrl()).toString(),
    additionalProperty: specEntries(grinder).map((row) => ({
      "@type": "PropertyValue",
      name: row.label,
      value: row.value,
    })),
  });
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string | null;
  authorName: string;
  imageUrl?: string | null;
}): JsonLdNode {
  return defined({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    inLanguage: "en-GB",
    author: { "@type": "Organization", name: input.authorName || siteName },
    publisher: { "@type": "Organization", name: siteName },
    image: input.imageUrl || undefined,
    mainEntityOfPage: new URL(`/knowledge/${input.slug}`, getSiteUrl()).toString(),
  });
}

export function collectionJsonLd(input: {
  name: string;
  description: string;
  slug: string;
  grinders: Array<{ name: string; slug: string }>;
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: new URL(`/collections/${input.slug}`, getSiteUrl()).toString(),
    inLanguage: "en-GB",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.grinders.map((grinder, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: grinder.name,
        url: new URL(`/grinders/${grinder.slug}`, getSiteUrl()).toString(),
      })),
    },
  };
}

export function articleCardsJsonLd(posts: ArticleCard[], path: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Knowledge",
    url: new URL(path, getSiteUrl()).toString(),
    inLanguage: "en-GB",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: new URL(`/knowledge/${post.slug}`, getSiteUrl()).toString(),
      })),
    },
  };
}
