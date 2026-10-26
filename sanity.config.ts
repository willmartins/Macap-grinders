import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletons = new Set<string>(singletonTypes);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default defineConfig({
  name: "macap",
  title: "Macap",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: siteUrl,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        locations: {
          homePage: defineLocations({
            select: { title: "title" },
            resolve: () => ({
              locations: [{ title: "Front page", href: "/" }],
            }),
          }),
          aboutPage: defineLocations({
            select: { title: "title" },
            resolve: () => ({ locations: [{ title: "About", href: "/about" }] }),
          }),
          contactPage: defineLocations({
            select: { title: "title" },
            resolve: () => ({ locations: [{ title: "Contact", href: "/contact" }] }),
          }),
          journeyPage: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Journey",
                  href: doc?.slug ? `/${doc.slug}` : "/",
                },
              ],
            }),
          }),
          grinder: defineLocations({
            select: { title: "name", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || "Grinder", href: `/grinders/${doc?.slug || ""}` },
                { title: "All grinders", href: "/grinders" },
              ],
            }),
          }),
          grinderCollection: defineLocations({
            select: { title: "name", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Collection",
                  href: `/collections/${doc?.slug || ""}`,
                },
              ],
            }),
          }),
          kbPost: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || "Article", href: `/knowledge/${doc?.slug || ""}` },
                { title: "Knowledge", href: "/knowledge" },
              ],
            }),
          }),
          kbTopic: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Topic",
                  href: `/knowledge/topic/${doc?.slug || ""}`,
                },
              ],
            }),
          }),
          legalPage: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || "Legal", href: `/legal/${doc?.slug || ""}` },
              ],
            }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: "2026-02-01" }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previous, context) =>
      singletons.has(context.schemaType)
        ? previous.filter(
            (item) =>
              item.action !== "duplicate" &&
              item.action !== "delete" &&
              item.action !== "unpublish",
          )
        : previous,
    newDocumentOptions: (previous, { creationContext }) =>
      creationContext.type === "global"
        ? previous.filter((template) => !singletons.has(template.templateId))
        : previous,
  },
});
