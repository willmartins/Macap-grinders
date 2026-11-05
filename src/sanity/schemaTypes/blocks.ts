import {
  BlockContentIcon,
  BlockquoteIcon,
  BoltIcon,
  ComposeIcon,
  HelpCircleIcon,
  ImageIcon,
  InlineIcon,
  PlayIcon,
  StackCompactIcon,
  ThListIcon,
  TransferIcon,
  UlistIcon,
} from "@/sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const previewText = (subtitle: string) => ({
  select: { title: "heading" },
  prepare({ title }: { title?: string }) {
    return {
      title: title || "Untitled",
      subtitle,
    };
  },
});

export const heroBanner = defineType({
  name: "heroBanner",
  title: "Hero banner",
  type: "object",
  icon: BoltIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
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
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: previewText("Hero banner"),
});

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Rich text", subtitle: "Rich text" };
    },
  },
});

export const imageText = defineType({
  name: "imageText",
  title: "Image and text",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      initialValue: "right",
      options: {
        list: [
          { title: "Image on the left", value: "left" },
          { title: "Image on the right", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "link", title: "Link", type: "link" }),
  ],
  preview: previewText("Image and text"),
});

export const grinderGrid = defineType({
  name: "grinderGrid",
  title: "Grinder grid",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "grinders",
      title: "Grinders",
      type: "array",
      description: "Choose the grinders to show, in the order they should appear.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: previewText("Grinder grid"),
});

export const collectionCarousel = defineType({
  name: "collectionCarousel",
  title: "Collection carousel",
  type: "object",
  icon: StackCompactIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinderCollection" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: previewText("Collection carousel"),
});

export const featureList = defineType({
  name: "featureList",
  title: "Feature list",
  type: "object",
  icon: UlistIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: previewText("Feature list"),
});

export const specTable = defineType({
  name: "specTable",
  title: "Spec table",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "grinder",
      title: "Grinder",
      type: "reference",
      to: [{ type: "grinder" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", grinder: "grinder.name" },
    prepare({ title, grinder }: { title?: string; grinder?: string }) {
      return { title: title || grinder || "Spec table", subtitle: "Spec table" };
    },
  },
});

export const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison table",
  type: "object",
  icon: TransferIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "grinders",
      title: "Grinders",
      type: "array",
      description: "Choose two or three grinders.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
      validation: (rule) => rule.required().min(2).max(3),
    }),
  ],
  preview: previewText("Comparison table"),
});

export const faqAccordion = defineType({
  name: "faqAccordion",
  title: "FAQ accordion",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faq" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: previewText("FAQ accordion"),
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Call to action",
  type: "object",
  icon: BoltIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "step",
      title: "Journey step name",
      type: "string",
      description: "Optional. Used to name this click in analytics, for example “compare”.",
    }),
  ],
  preview: previewText("Call to action"),
});

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "url",
      title: "YouTube or Vimeo URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }).custom((value) => {
          if (!value) return true;
          if (/youtube\.com|youtu\.be|vimeo\.com/.test(value)) return true;
          return "Use a YouTube or Vimeo link.";
        }),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "url" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || "Video", subtitle: subtitle || "Video" };
    },
  },
});

export const kbPostGrid = defineType({
  name: "kbPostGrid",
  title: "Knowledge base posts",
  type: "object",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "posts",
      title: "Posts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "kbPost" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: previewText("Knowledge base posts"),
});

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || "Quote", subtitle: subtitle || "Quote" };
    },
  },
});

export const contactBlock = defineType({
  name: "contactBlock",
  title: "Contact block",
  type: "object",
  icon: InlineIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
  ],
  preview: previewText("Contact block"),
});

export const pageBuilderMembers = [
  defineArrayMember({ type: "heroBanner" }),
  defineArrayMember({ type: "richText" }),
  defineArrayMember({ type: "imageText" }),
  defineArrayMember({ type: "grinderGrid" }),
  defineArrayMember({ type: "collectionCarousel" }),
  defineArrayMember({ type: "featureList" }),
  defineArrayMember({ type: "specTable" }),
  defineArrayMember({ type: "comparisonTable" }),
  defineArrayMember({ type: "faqAccordion" }),
  defineArrayMember({ type: "ctaBanner" }),
  defineArrayMember({ type: "videoEmbed" }),
  defineArrayMember({ type: "kbPostGrid" }),
  defineArrayMember({ type: "quote" }),
  defineArrayMember({ type: "contactBlock" }),
];

export const sectionsField = defineField({
  name: "sections",
  title: "Page sections",
  type: "array",
  of: pageBuilderMembers,
  description: "Add, remove and reorder the sections on this page.",
});

export const blockTypes = [
  heroBanner,
  richText,
  imageText,
  grinderGrid,
  collectionCarousel,
  featureList,
  specTable,
  comparisonTable,
  faqAccordion,
  ctaBanner,
  videoEmbed,
  kbPostGrid,
  quote,
  contactBlock,
];
