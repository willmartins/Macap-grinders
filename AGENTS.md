<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Macap website

Nizatto policy for this repository. Version 1.1, October 2026. British English in the interface, comments, docs and commit messages. Code identifiers stay in the spelling the framework uses.

## Project

- Next.js App Router and React Server Components. TypeScript strict. No `any` unless a comment says why.
- pnpm only.
- Sanity, with typed GROQ via Sanity TypeGen. Run `pnpm typegen` after a schema or query change and commit `src/sanity/types.ts`.
- English (`en-GB`) only in v1. Documents already have `language`. Italian later is document-level internationalisation and routes under `/it`. Do not add Italian content or routes now.
- Primary navigation is Home, Professional and Contact us. The logo links to `/`. Catalogue, collections, knowledge, about and legal stay in the footer and in the journeys.
- Leo stays. Labo, Barline and tampers do not.
- Page sections are registered in `MODULES.md`. One name in code and in Studio.
- Sample content is allowed so pages render without Sanity. Label it. Do not present sample specifications as final.
- After a change, run `pnpm typecheck` and `pnpm lint`.

## Tone of voice

Match the current Macap English site: confident and simple.

Write short, clear sentences. Be technically assured. British English.

Lead with the product and the specification. "The Supra 68 is a commercial espresso grinder. Flat burrs, 68 mm. Motor 550 W." "Macap has made coffee grinders in the Venice area since 1930."

Do not hype. Do not fill. Do not use "unbeatable", "the future of", "café-quality" or "perform under pressure".

No em dashes in user-facing copy, including buttons, errors, empty states, legal placeholders and sample text.

Mark unfinished legal and company history as PLACEHOLDER. Mark unpublished specifications as sample figures.

This applies to sample content, microcopy, journey pages, Studio descriptions and anything an editor will copy.

## Studio

Plain titles and descriptions. Validate required fields. Singletons stay pinned. Do not offer duplicate or delete on a singleton.

## SEO

`generateMetadata` on every route, from Sanity, with a fallback. JSON-LD for the organisation, website, products, articles, FAQs, breadcrumbs and collections. No invented prices. Real HTML specification tables. An answer-first introduction on grinders and articles. Canonical URLs and `en-GB` hreflang. Discontinued grinders are `noindex` and stay out of the sitemap.

## Images

`next/image` and the Sanity image URL builder. Alt text is required when an image is set. No AI-generated images. Use only the new logo.

Sample photography is real Macap photography from the previous site, listed in `src/lib/imagery.ts`. Swap the URLs there when the files move into the new Sanity project. Do not use a portrait or a frame with Italian words set in the picture. An empty frame ("Photography to follow") is only for a grinder that has no chosen photograph.

## Security

Validate input. Rate-limit the contact form. Security headers on responses. Least privilege: the read token stays on the server, and there is no browser token. Never commit secrets or `.env` files. `.env.example` only.

## Cache

Loaders that call `sanityFetch` are marked `use cache`. Draft mode is read outside that boundary. Revalidate with `revalidateTag(tag, { expire: 0 })`. The long cache life is a backstop. Sanity Live and the webhook are how published content updates.
