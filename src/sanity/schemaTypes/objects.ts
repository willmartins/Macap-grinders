import { HelpCircleIcon, LinkIcon, SearchIcon } from "@/sanity/icons";
import { defineField, defineType } from "sanity";

import { defaultLocale } from "@/i18n/locales";

export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  description:
    "English (UK) only for this version. Italian will be a separate document later. Do not translate this one.",
  initialValue: defaultLocale,
  readOnly: true,
  options: {
    list: [{ title: "English (UK)", value: defaultLocale }],
  },
  validation: (rule) => rule.required(),
});

export const seo = defineType({
  name: "seo",
  title: "Search and sharing",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Shown in the browser tab and in search results. Leave blank to use the page title.",
      validation: (rule) => rule.max(70).warning("Keep the title under 70 characters."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A short summary for search results and social posts. Leave blank to use the introduction.",
      validation: (rule) => rule.max(160).warning("Keep the description under 160 characters."),
    }),
    defineField({
      name: "image",
      title: "Sharing image",
      type: "image",
      description: "Used when the page is shared. 1200 by 630 pixels works well. Alt text is required.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for someone who cannot see it.",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && !alt) return "Alt text is required.";
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Turn this on for drafts or pages that should not appear in Google.",
      initialValue: false,
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      description: "Optional. Only set this if the preferred address is different from this page.",
    }),
  ],
});

export const seoField = defineField({
  name: "seo",
  title: "Search and sharing",
  type: "seo",
  description: "Optional. The page heading and introduction are used when these fields are empty.",
});

function isSafeHref(value: string | undefined) {
  if (!value) return "Add a link.";
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return true;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return true;
  } catch {
    return "Use a site path starting with /, or a full https address.";
  }
  return "Use a site path starting with /, or a full https address.";
}

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "A site path such as /grinders/supra-68, or a full https address.",
      validation: (rule) => rule.required().custom(isSafeHref),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

export const faq = defineType({
  name: "faq",
  title: "Question",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      description: "Write the answer in plain sentences. This text is also used for FAQ search results.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});

const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the image for someone who cannot see it.",
  validation: (rule) =>
    rule.custom((alt, context) => {
      const parent = context.parent as { asset?: unknown } | undefined;
      if (parent?.asset && !alt) return "Alt text is required when an image is set.";
      return true;
    }),
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Link",
                type: "string",
                validation: (rule) => rule.required().custom(isSafeHref),
              }),
            ],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [altField],
    },
  ],
});

export const grinderSpecs = defineType({
  name: "grinderSpecs",
  title: "Specifications",
  type: "object",
  fields: [
    defineField({
      name: "burrType",
      title: "Burr type",
      type: "string",
      options: {
        list: [
          { title: "Flat", value: "flat" },
          { title: "Conical", value: "conical" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "burrDiameterMm",
      title: "Burr diameter (mm)",
      type: "number",
      validation: (rule) => rule.min(1).max(200),
    }),
    defineField({
      name: "grindType",
      title: "Grind type",
      type: "string",
      description: "What this grinder is set up to brew.",
      options: {
        list: [
          { title: "Espresso", value: "espresso" },
          { title: "Filter", value: "filter" },
          { title: "Espresso and filter", value: "both" },
        ],
      },
    }),
    defineField({
      name: "motorPowerW",
      title: "Motor power (W)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "rpm",
      title: "Speed (rpm)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "hopperCapacityG",
      title: "Hopper capacity (g)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "outputGPerS",
      title: "Output (g per second)",
      type: "number",
      description: "Approximate grinding speed. Used on the compare page.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "adjustment",
      title: "Adjustment",
      type: "string",
      description: "For example: stepless, stepped, or grind-by-weight.",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions (mm)",
      type: "object",
      fields: [
        defineField({ name: "widthMm", title: "Width", type: "number" }),
        defineField({ name: "depthMm", title: "Depth", type: "number" }),
        defineField({ name: "heightMm", title: "Height", type: "number" }),
      ],
    }),
    defineField({
      name: "weightKg",
      title: "Weight (kg)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({ name: "voltage", title: "Voltage", type: "string" }),
    defineField({
      name: "display",
      title: "Display",
      type: "string",
      description: "Leave blank if the grinder has no display.",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Short feature names, one per row.",
    }),
  ],
});
