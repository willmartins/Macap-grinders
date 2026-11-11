import {
  BoltIcon,
  CaseIcon,
  CogIcon,
  ComposeIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  LinkIcon,
  OlistIcon,
  PinIcon,
  TagIcon,
  UserIcon,
} from "@/sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { countries, isCountryCode } from "@/lib/countries";
import { languageField, seoField } from "@/sanity/schemaTypes/objects";
import { audienceSectionsField, collectionSectionsField, sectionsField } from "@/sanity/schemaTypes/blocks";

const audienceOptions = [
  { title: "Home", value: "home" },
  { title: "Professional", value: "business" },
];

/** Addresses under /grinders that a range or collection cannot take. */
const reservedGrinderSlugs = new Set(["home", "professional"]);

/**
 * Ranges and collections share /grinders/<slug>, so a slug must be unique across both,
 * and must not be one of the audience pages.
 */
const grinderPathSlug = defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  description: "The page address, /grinders/<slug>. Unique across ranges and collections.",
  options: { source: "name", maxLength: 96 },
  validation: (rule) =>
    rule.required().custom(async (slug, context) => {
      const current = slug?.current;
      if (!current) return true;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) return "Use lower case letters, numbers and hyphens.";
      if (reservedGrinderSlugs.has(current)) return `/grinders/${current} is an audience page. Choose another slug.`;
      const id = (context.document?._id || "").replace(/^drafts\./, "");
      const client = context.getClient({ apiVersion: "2026-02-01" });
      const taken = await client.fetch<number>(
        `count(*[_type in ["grinderGroup", "grinderCollection"] && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
        { slug: current, id },
      );
      return taken === 0 || "A range or collection already uses this slug.";
    }),
});

const imageWithAlt = (name: string, title: string, description?: string, group?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    ...(group ? { group } : {}),
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
      description: "The approved menu is Home grinders, Professional grinders, Knowledge, About and Contact. The logo always links to the front page.",
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
  title: "Audience page",
  description: "The Home grinders and Professional grinders pages, at /grinders/home and /grinders/professional.",
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
      description: "home-grinders is the page at /grinders/home. professional is the page at /grinders/professional.",
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
      description: "Sets which ranges and collections the range grid lists.",
      options: { list: audienceOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    audienceSectionsField,
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
  title: "Range",
  description: "A product line, such as Supra or Leo. Every grinder belongs to one range, and its address sits under it.",
  type: "document",
  icon: TagIcon,
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The range name as written in copy, for example Supra or Leo. Not in capitals.",
      validation: (rule) => rule.required(),
    }),
    grinderPathSlug,
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One short line for range cards, for example on the Professional grinders page.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 4,
      description:
        "One or two sentences that say what the range is and who it is for. Shown at the top of the range page and used by search and answer engines.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "number",
      description: "Sets the order of ranges on the audience pages. Lower comes first.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Which audience page lists this range. Both lists it on Home grinders and Professional grinders.",
      options: {
        list: [
          ...audienceOptions,
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    imageWithAlt(
      "image",
      "Main image",
      "The picture at the top of the range page and on its card. If empty, the first model's photograph is used.",
    ),
    defineField({
      name: "story",
      title: "About the range",
      type: "blockContent",
      description: "A few short paragraphs on what the models share. Optional.",
    }),
    defineField({
      name: "features",
      title: "Feature cards",
      type: "array",
      description:
        "Optional. Up to six cards. A card with an image is an image card. A card with an icon and no image is an icon card. A card with neither is a text card.",
      validation: (rule) => rule.max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "rangeFeature",
          title: "Feature card",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(240),
            }),
            imageWithAlt("image", "Image"),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Used when there is no image.",
              options: {
                list: [
                  { title: "Burrs", value: "burrs" },
                  { title: "Motor", value: "motor" },
                  { title: "Dial", value: "dial" },
                  { title: "Screen", value: "screen" },
                  { title: "Scale", value: "scale" },
                  { title: "Cooling", value: "cooling" },
                ],
              },
            }),
            defineField({
              name: "ground",
              title: "Icon ground",
              type: "string",
              description: "The colour behind the icon. Light grey if empty.",
              hidden: ({ parent }) => !(parent as { icon?: string } | undefined)?.icon,
              options: {
                list: [
                  { title: "Light grey", value: "light-grey" },
                  { title: "Sand", value: "sand" },
                  { title: "Dark sand", value: "dark-sand" },
                  { title: "Silver", value: "silver" },
                  { title: "Off-black", value: "off-black" },
                ],
              },
            }),
            defineField({ name: "link", title: "Link", type: "link", description: "Optional." }),
          ],
          preview: { select: { title: "title", subtitle: "text", media: "image" } },
        }),
      ],
    }),
    seoField,
  ],
  orderings: [
    {
      title: "Position",
      name: "position",
      by: [
        { field: "position", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "name", subtitle: "audience", media: "image" } },
});

export const grinder = defineType({
  name: "grinder",
  title: "Grinder",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Images" },
    { name: "specs", title: "Specifications" },
    { name: "related", title: "Related" },
    { name: "search", title: "Search" },
  ],
  fields: [
    { ...languageField, group: "content" },
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The model name, for example Supra 68.",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The address of the model page. Lower case, with hyphens.",
      group: "content",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "group",
      group: "content",
      title: "Range",
      type: "reference",
      to: [{ type: "grinderGroup" }],
      description: "The range this grinder belongs to. It sets the page address: /grinders/<range>/<model>.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      group: "content",
      options: { list: audienceOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
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
      group: "content",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "One or two sentences that answer what this grinder is and who it is for. Shown at the top of the page and used by search and answer engines.",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("heroImage", "Main image", "The photograph at the top of the model page.", "media"),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
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
      group: "specs",
    }),
    defineField({
      name: "extraSpecs",
      title: "Other specifications",
      type: "array",
      group: "specs",
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
      group: "related",
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
      group: "related",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      group: "related",
      of: [defineArrayMember({ type: "reference", to: [{ type: "kbPost" }] })],
    }),
    defineField({
      name: "catalogue",
      title: "Catalogue PDF",
      type: "file",
      group: "media",
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
    { ...seoField, group: "search" },
  ],
  preview: {
    select: { title: "name", subtitle: "group.name", media: "heroImage" },
  },
});

export const grinderCollection = defineType({
  name: "grinderCollection",
  title: "Collection",
  description:
    "A landing page for grinders that share something, such as a technology, across ranges. A grinder can be in several collections. Its address stays under its range.",
  type: "document",
  icon: StackIconSafe(),
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "For example G Series.",
      validation: (rule) => rule.required(),
    }),
    grinderPathSlug,
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
      description: "Which audience page features this collection. Both features it on Home grinders and Professional grinders.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "grinders",
      title: "Grinders",
      type: "array",
      description: "The order here is the order on the page. A grinder can sit in more than one collection.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    imageWithAlt("image", "Card image", "The picture on the collection's card on the audience pages. Optional."),
    collectionSectionsField,
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
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Shown under the name on an article, and used as the author job title.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      description: "A short note on why this person can write about the subject. Shown on the article.",
    }),
    defineField({
      name: "sameAs",
      title: "Profile links",
      type: "array",
      description: "Public https profiles for this author. Leave empty when the author is Macap itself.",
      of: [defineArrayMember({ type: "url" })],
    }),
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
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Image" },
    { name: "related", title: "Related" },
    { name: "search", title: "Search" },
  ],
  fields: [
    { ...languageField, group: "content" },
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "reference",
      group: "content",
      to: [{ type: "kbTopic" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated",
      type: "datetime",
      group: "content",
      description: "Leave blank if the article has not been revised.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "answerFirst",
      title: "Answer-first introduction",
      type: "text",
      rows: 4,
      group: "content",
      description: "The direct answer, before the longer article. Shown at the top of the page.",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("image", "Image", "The photograph at the top of the article.", "media"),
    defineField({
      name: "body",
      title: "Article",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      group: "related",
      description: "Only questions that are shown on the page. These become the FAQ details for this article.",
      of: [defineArrayMember({ type: "faq" })],
    }),
    defineField({
      name: "relatedGrinders",
      title: "Related grinders",
      type: "array",
      group: "related",
      of: [defineArrayMember({ type: "reference", to: [{ type: "grinder" }] })],
    }),
    { ...seoField, group: "search" },
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

export const distributor = defineType({
  name: "distributor",
  title: "Distributor",
  type: "document",
  icon: PinIcon,
  description:
    "A partner who can receive enquiries for the countries they cover. Macap adds these in Studio. The enquiry email and the note stay off the website.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "countries",
      title: "Countries",
      type: "array",
      description: "Countries this partner covers. Each value is an ISO code, such as GB. The site shows the partner name only.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: countries.map((country) => ({ title: country.name, value: country.code })),
      },
      validation: (rule) =>
        rule.required().min(1).custom((value) => {
          if (!Array.isArray(value)) return true;
          const unknown = value.filter((code) => typeof code !== "string" || !isCountryCode(code));
          return unknown.length ? "Choose each country from the list." : true;
        }),
    }),
    defineField({
      name: "enquiryEmail",
      title: "Enquiry email",
      type: "string",
      description: "Private. Used only to deliver an enquiry. It is never shown on the website.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "isPrimary",
      title: "Primary",
      type: "boolean",
      description: "Used when more than one active partner covers the same country.",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Inactive partners are ignored by the enquiry form. A partner must be active to receive enquiries.",
      initialValue: true,
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 3,
      description: "Internal. Not shown on the website and not included in enquiry emails.",
    }),
  ],
  preview: {
    select: { title: "name", countries: "countries", active: "active", isPrimary: "isPrimary" },
    prepare({ title, countries: covered, active, isPrimary }) {
      const count = Array.isArray(covered) ? covered.length : 0;
      const detail = [
        isPrimary ? "Primary" : "",
        active === false ? "Inactive" : "Active",
        count ? `${count} ${count === 1 ? "country" : "countries"}` : "No countries",
      ]
        .filter(Boolean)
        .join(" / ");
      return { title, subtitle: detail };
    },
  },
});

export const experiment = defineType({
  name: "experiment",
  title: "Experiment",
  type: "document",
  icon: BoltIcon,
  description:
    "A place to write a hypothesis later. The website does not read these documents and does not assign a visitor to a variant.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hypothesis",
      title: "Hypothesis",
      type: "text",
      rows: 3,
      description: "What you expect to change, and for whom.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      readOnly: true,
      description: "Stays on draft. Nothing on the site is running a test.",
      options: {
        list: [{ title: "Draft", value: "draft" }],
        layout: "radio",
      },
    }),
    defineField({
      name: "metric",
      title: "Metric",
      type: "string",
      description: "The one number that would decide the test, for example enquiries started.",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "text",
              rows: 3,
              description: "What would change. This is not published.",
            }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (rule) => rule.max(2).warning("Two variants are enough when a test is eventually run."),
    }),
  ],
  preview: { select: { title: "name", subtitle: "status" } },
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
  distributor,
  experiment,
];
