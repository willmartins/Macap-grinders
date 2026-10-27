import { blockTypes } from "@/sanity/schemaTypes/blocks";
import { documentTypes } from "@/sanity/schemaTypes/documents";
import { blockContent, faq, grinderSpecs, link, seo } from "@/sanity/schemaTypes/objects";

export const schemaTypes = [
  seo,
  link,
  faq,
  blockContent,
  grinderSpecs,
  ...blockTypes,
  ...documentTypes,
];

export const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "contactPage",
  "knowledgeHubPage",
  "grindersIndexPage",
] as const;
