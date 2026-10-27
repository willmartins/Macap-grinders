# Sanity, SEO and answer-engine audit

Audited against the Sanity Agent Toolkit skills pinned at `571a2d077554bd1272f31c345ecb7719889e7957`: `sanity-best-practices`, `content-modeling-best-practices`, `seo-aeo-best-practices` and `content-experimentation-best-practices`.

Nothing was deleted. The old project `xb4mqxnu` was not used. The live project id in code is `u5o31ts3`.

Status is **met** (already in place), **fixed** (changed in this pass), or **flagged** (left for Will).

## Install

| Item | Status | Where |
| --- | --- | --- |
| Agent skills | Fixed | `.agents/skills/`, copied with `npx skills add sanity-io/agent-toolkit` for Cursor |
| Pin | Fixed | `skills-lock.json` `ref` and `AGENTS.md`. Update with the command in `AGENTS.md`, then write the new commit into `ref` |
| Sanity MCP | Fixed | `.cursor/mcp.json` points at `https://mcp.sanity.io`. No token is committed. Sign-in is OAuth |
| Agent instruction | Fixed | `AGENTS.md` requires the skills before Sanity, schema, GROQ, SEO or content-model work |

## Sanity

| Rule | Status | What it means here |
| --- | --- | --- |
| `defineType`, `defineField`, `defineArrayMember` | Met, and fixed for rich text | Documents and objects already used the helpers. Portable Text image and text blocks now use `defineArrayMember`. |
| Validation and editor help | Met | Required fields, slug shape, alt text when an image is set, SEO length warnings, and descriptions on the fields editors use. |
| Icons and previews | Met | Documents and objects have an icon and a preview. |
| Field groups | Fixed | Grinder: Content, Images, Specifications, Related, Search. Knowledge post: Content, Image, Related, Search. Shorter documents stay on one form so editors are not clicking through empty tabs. |
| No presentation-shaped fields | Flagged | `eyebrow`, `imagePosition` and `step` describe layout. They are still in use on the journeys. They were not removed. Will can confirm before any deprecation. |
| References against embedded objects | Met | Groups, collections, topics, authors and related grinders are references. SEO, specifications, questions and page sections are objects because they belong to one document. |
| Taxonomies | Met | `grinderGroup` is the line, `grinderCollection` is a curated set, `kbTopic` is the knowledge taxonomy. A grinder has one group and can sit in several collections. |
| TypeGen and `defineQuery` | Met | Every GROQ query uses `defineQuery`. `pnpm build` runs `pnpm typegen`. `sanity.cli.ts` has `typegen.enabled`. |
| Sanity Live and tag revalidation | Met | `sanityFetch` tags, `use cache`, and the webhook call `revalidateTag(tag, { expire: 0 })`. |
| Visual Editing | Met | Presentation tool, draft mode at `/api/draft-mode/enable`, and `VisualEditing`. Stega is on only when the perspective is drafts. |
| Stega off for metadata and JSON-LD | Fixed | Metadata is loaded with the published perspective and passed through `stegaClean`. JSON-LD is cleaned in the script tag, including a draft preview. |
| Images | Fixed | Hotspot and crop stay on the image object passed to the URL builder. Alt text is required when an asset is set. Queries now request `metadata.lqip`, and heroes use it as a blur placeholder. `sizes` is set on the image components. The first screen image uses `priority`. |
| Portable Text | Met | `RichTextBody` renders normal, h2, h3, strong, emphasis, links and images. Headings in an article start at h2 because the page title is the h1. |
| Studio structure | Met | Singletons for site settings, front page, about, contact, the knowledge hub and the grinders index. Journeys, grinders, knowledge, legal and redirects are grouped for editors. |
| Document actions | Met | Singletons cannot be duplicated, deleted or unpublished, and they are hidden from the global create menu. |
| Italian later | Met, no content added | Document-level. Each document has `language`, currently read-only `en-GB`. Italian will be a second document with the same slug and routes under `/it`. `localePlan` in `src/i18n/locales.ts` records `it` as not live. No Italian documents or routes. |

## SEO

| Rule | Status | What it means here |
| --- | --- | --- |
| Reusable `seo` object | Met | Title, description, sharing image, noindex and canonical override. Fallbacks are the page title and the answer-first introduction. |
| `generateMetadata` on every route | Met | Each `page.tsx` builds metadata from Sanity, with a written fallback. The 404 keeps the root robots default, which does not index. |
| Canonical on `https://macap.it` | Met | `canonicalOrigin()` defaults to `https://macap.it` and never uses a preview host. |
| Open Graph and Twitter | Fixed | Cards are `summary_large_image`, 1200 by 630. An editor sharing image wins. Otherwise a grinder or a post generates a black card with the name and the answer-first line. Other routes keep the site card. |
| Sitemap | Fixed | `lastmod` comes from `_updatedAt`, including the singletons and the two journeys. Grinders and posts add an image URL when one exists. `noindex` and discontinued grinders stay out. |
| Robots | Met | Indexing stays opt-in through `isIndexingAllowed`. Studio and API stay disallowed when indexing is on. The sitemap URL is the apex. |
| Redirects | Met | Editors manage `redirect` documents. The 420-path legacy map in `src/lib/redirects/legacy.ts` still applies in the proxy. Sanity wins when both exist. |
| Breadcrumbs, internal links, headings | Met | BreadcrumbList JSON-LD follows the visible trail. Related grinders, the next journey chapter, compare and topic links are real links. The home split has one h1. Article headings start at h2. |
| Core Web Vitals | Fixed | Heroes are priority. The font uses `display: swap` through `next/font`. LQIP blur and reserved image boxes limit layout shift. |
| hreflang | Fixed | `en-GB` and `x-default` point at the English canonical. Italian is listed in `localePlan` with `live: false`, so no `/it` URL is emitted. |

## Answer engines

| Rule | Status | What it means here |
| --- | --- | --- |
| Organization and WebSite | Met, graph fixed | One JSON-LD graph in the site layout: Organization with the logo and `sameAs`, and WebSite. |
| Product | Fixed | Brand, `model`, image, URL and `additionalProperty` from the visible specification table. No offer, price, review or rating. |
| CollectionPage and ItemList | Met | Collections and the knowledge hub. |
| Article | Fixed | Headline, dates, image and a Person author with role, bio and profile links when they exist. |
| FAQPage | Met | Emitted only for questions that are on the page. An empty list emits nothing. |
| `llms.txt` and `llms-full.txt` | Met | Built from the published grinders, collections and posts. Sample figures are labelled in the full file. |
| Answer first and specification tables | Met | Grinders and articles lead with `answerFirst`. Specifications are an HTML table, not a picture of a table. |
| Author signals | Fixed | The article shows the name, role, dates and bio. The author document can store https profile links. |
| URLs | Met | `/grinders/supra-68`, `/collections/supra`, `/knowledge/flat-burrs-and-conical-burrs`. |

`scripts/check-structured-data.ts` (`pnpm check:seo`) checks the graph, forbids invented offers and reviews, checks the schema names, and checks that metadata strips stega.

## Experimentation

| Rule | Status | What it means here |
| --- | --- | --- |
| Foundation only | Fixed | New `experiment` document: name, hypothesis, metric and up to two variant notes. Status is stuck on draft. |
| No live test | Met | The site does not query experiments, set a cookie, or assign a visitor. Studio labels the list "Experiments (not live)". |

## Needs Will

- Confirm whether `eyebrow`, `imagePosition` and `step` should be deprecated later. They were not removed.
- Run `sanity schema deploy` against project `u5o31ts3` (not `xb4mqxnu`) so Content Lake and MCP see the new `experiment` type, the author `sameAs` field, and the field groups. The embedded Studio in this app already uses the code.
- No existing document has to be edited. `sameAs` is optional. Experiment documents do not exist until someone creates one, and the site ignores them.
- Italian stays off until there are `it-IT` documents and `/it` routes.

## Checks

`pnpm check:seo`, `pnpm typecheck`, `pnpm lint`, `pnpm check:overlap` and `pnpm build` are the gates for this pass.
