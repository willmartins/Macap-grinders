import {
  CaseIcon,
  CogIcon,
  ComposeIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  LinkIcon,
  OlistIcon,
  TagIcon,
  UserIcon,
} from "@/sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { languageField, seoField } from "@/sanity/schemaTypes/objects";
import { sectionsField } from "@/sanity/schemaTypes/blocks";

const audienceOptions = [
  { title: "Home", value: "home" },
  { title: "Professional", value: "business" },
];

const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
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
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Macap",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("logo", "Logo", "Optional override. The site uses the new Macap logo if this is empty."),
    defineField({
      name: "navigation",
      title: "Main navigation",
      type: "array",
      description: "The approved menu is Home, Professional and Contact us. The logo always links to the front page.",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "email",
      title: "Public email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({ name: "phone", title: "Public phone", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "organisation",
      title: "Organisation details",
      type: "object",
      description: "Used for the site-wide structured data (JSON-LD).",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Macap" }),
        defineField({ name: "legalName", title: "Legal name", type: "string" }),
        defineField({ name: "url", title: "Website", type: "url" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "telephone", title: "Telephone", type: "string" }),
        defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
        defineField({
          name: "sameAs",
          title: "Profile URLs",
          type: "array",
          of: [defineArrayMember({ type: "url" })],
          description: "Social or directory profiles, one full URL per row.",
        }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Front page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
      description: "A short answer to what Macap is. Used if the search description is empty.",
    }),
    sectionsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Front page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
    }),
    sectionsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    sectionsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});

export const knowledgeHubPage = defineType({
  name: "knowledgeHubPage",
  title: "Knowledge hub page",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    sectionsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Knowledge hub" }) },
});

export const grindersIndexPage = defineType({
  name: "grindersIndexPage",
  title: "Grinders index page",
  type: "document",
  icon: OlistIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    sectionsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Grinders" }) },
});

export const journeyPage = defineType({
  name: "journeyPage",
  title: "Journey",
  type: "document",
  icon: TransferIconSafe(),
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Use home-grinders or professional. Those are the live routes.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;
          if (!current) return "Add a slug.";
          if (current === "home-grinders" || current === "professional") return true;
          return "Use home-grinders or professional. Other slugs do not have a page yet.";
        }),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Home uses the light layout and yellow accent. Professional uses black and white.",
      options: { list: audienceOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    sectionsField,
    seoField,
  ],
  preview: {
    select: { title: "title", subtitle: "audience" },
  },
});

function TransferIconSafe() {
  return CaseIcon;
}

export const grinderGroup = defineType({
  name: "grinderGroup",
  title: "Grinder group",
  type: "document",
  icon: TagIcon,
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The product line, for example Supra, Pro, Leo or Studio.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: {
        list: [
          ...audienceOptions,
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("image", "Image"),
    seoField,
  ],
  preview: { select: { title: "name", subtitle: "audience" } },
});

export const grinder = defineType({
  name: "grinder",
  title: "Grinder",
  type: "document",
  icon: CaseIcon,
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "reference",
      to: [{ type: "grinderGroup" }],
      description: "The product line this grinder belongs to. A grinder has one group.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: { list: audienceOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "current",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Current", value: "current" },
          { title: "Discontinued", value: "discontinued" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 4,
      description:
        "One or two sentences that answer what this grinder is and who it is for. Shown at the top of the page and used by search and answer engines.",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("heroImage", "Main image"),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "grinderSpecs",
    }),
    defineField({
      name: "extraSpecs",
      title: "Other specifications",
      type: "array",
      description: "Use this for anything that does not fit the fields above. Label and value, for example “Doser: Yes”.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      description:
        "Questions visitors ask about this model. Add up to six. If you leave this empty, the page writes up to three short answers from the burrs, the adjustment, and whether the grinder is for home or the bar. It only uses figures you have entered.",
      type: "array",
      of: [defineArrayMember({ type: "faq" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "relatedGrinders",
      title: "Related grinders",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "kbPost" }] })],
    }),
    defineField({
      name: "catalogue",
      title: "Catalogue PDF",
      type: "file",
      options: { accept: "application/pdf" },
      fields: [
        defineField({
          name: "label",
          title: "Link label",
          type: "string",
          initialValue: "Download the catalogue",
        }),
      ],
    }),
    seoField,
  ],
  preview: {
    select: { title: "name", subtitle: "group.name", media: "heroImage" },
  },
});

export const grinderCollection = defineType({
  name: "grinderCollection",
  title: "Collection",
  type: "document",
  icon: StackIconSafe(),
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: {
        list: [...audienceOptions, { title: "Both", value: "both" }],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "grinders",
      title: "Grinders",
      type: "array",
      description: "The order here is the order on the page. A grinder can sit in more than one collection.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
    }),
    sectionsField,
    seoField,
  ],
  preview: { select: { title: "name", subtitle: "audience" } },
});

function StackIconSafe() {
  return OlistIcon;
}

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    imageWithAlt("image", "Photo"),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

export const kbTopic = defineType({
  name: "kbTopic",
  title: "Topic",
  type: "document",
  icon: TagIcon,
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    seoField,
  ],
  preview: { select: { title: "title" } },
});

export const kbPost = defineType({
  name: "kbPost",
  title: "Knowledge base post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "reference",
      to: [{ type: "kbTopic" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated",
      type: "datetime",
      description: "Leave blank if the article has not been revised.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 4,
      description: "The direct answer, before the longer article. Shown at the top of the page.",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("image", "Image"),
    defineField({
      name: "body",
      title: "Article",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faq" })],
    }),
    defineField({
      name: "relatedGrinders",
      title: "Related grinders",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
    }),
    seoField,
  ],
  preview: {
    select: { title: "title", subtitle: "topic.title", media: "image" },
  },
});

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "effectiveDate",
      title: "Effective date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    seoField,
  ],
  preview: { select: { title: "title", subtitle: "effectiveDate" } },
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "source",
      title: "From",
      type: "string",
      description: "The old path, starting with /. Example: /en/old-page",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true;
          if (!value.startsWith("/")) return "Start with /";
          if (value.startsWith("//")) return "Do not use a protocol-relative address.";
          return true;
        }),
    }),
    defineField({
      name: "destination",
      title: "To",
      type: "string",
      description: "A site path such as /grinders, or a full https address.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent",
      type: "boolean",
      description: "On sends a permanent redirect (301). Off sends a temporary redirect (302).",
      initialValue: true,
    }),
    defineField({
      name: "isEnabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      if (!doc) return true;
      const source = doc.source;
      const destination = doc.destination;
      if (typeof source === "string" && source === destination) {
        return "The from and to addresses cannot be the same.";
      }
      return true;
    }),
  preview: {
    select: { title: "source", subtitle: "destination" },
  },
});

export const documentTypes = [
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  knowledgeHubPage,
  grindersIndexPage,
  journeyPage,
  grinderGroup,
  grinder,
  grinderCollection,
  author,
  kbTopic,
  kbPost,
  legalPage,
  redirect,
];
