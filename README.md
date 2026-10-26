# Macap

English website for Macap coffee grinders. Next.js App Router, Sanity Studio at `/studio`, and sample content so the pages render before the catalogue is published.

The voice for all copy is in [AGENTS.md](AGENTS.md), under Tone of voice. British English. Short sentences. Specifications first. No hype.

## What is in v1

- Logo links to `/`. Primary navigation is Home (`/home-grinders`), Professional (`/professional`) and Contact us (`/contact`).
- Home grinders use a light page with a yellow accent. Professional uses black and white. A professional grinder page uses the same black page.
- Catalogue, collections, knowledge, about, compare and legal stay out of the main navigation. They are linked from the footer and from the journeys.
- English only (`en-GB`). Every document has a language field so Italian can be added later. There is no `/it` route in this version.
- Leo stays in the range. Labo, Barline and tampers are out of scope and old URLs for them redirect to `/grinders`.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

`pnpm typecheck`, `pnpm lint` and `pnpm build` should pass. The build runs `pnpm typegen` first. Generated query types live in `src/sanity/types.ts`. `schema.json` is local and is not committed.

## Environment

See `.env.example`.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Set this in production. Previews must not advertise `https://macap.it`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project. Defaults to `u5o31ts3` when unset. |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset. Defaults to `production`. |
| `SANITY_API_READ_TOKEN` | Server-only read token. Required for drafts and for a private dataset. Not sent to the browser. |
| `SANITY_API_WRITE_TOKEN` | Server-only. Used by `pnpm import:content` only. |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the Sanity webhook. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Contact form. If any is missing, the visitor is told to email info@macap.it. The missing name is not shown. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement id. Do not hard-code it. |
| `NEXT_PUBLIC_GTM_ID` | Optional GTM container. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional shared rate limit. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional bot check. Set both or neither. |

## Vercel

Create a Vercel project for this repository. Set the environment variables above for Production and Preview. `NEXT_PUBLIC_SITE_URL` on Production should be the public origin once DNS is ready. Preview deployments can leave it unset: the site then uses the Vercel host, not macap.it.

Vercel Web Analytics and Speed Insights are cookieless and load on the public site. Enable them on the Vercel project.

## Sanity

CORS origins to add in the Sanity project: `http://localhost:3000`, the production origin, and `https://*.vercel.app` if editors use preview deployments. Studio is embedded, so the site origin must be allowed.

The dataset can stay private. The read token stays on the server. Presentation uses `/api/draft-mode/enable`. A browser token is not configured.

### Webhook

Create a Sanity webhook for the production dataset:

- URL: `https://<your-host>/api/revalidate`
- Trigger on create, update and delete.
- Secret: the same value as `SANITY_REVALIDATE_SECRET`.
- Projection:

```groq
{ _type, "slug": slug.current, "tags": [_type, _type + ":" + coalesce(slug.current, _id)] }
```

The route checks the signature and calls `revalidateTag(tag, { expire: 0 })`. Published pages also listen through Sanity Live. The cache life is one year. The webhook and Live are the real update path.

### Redirects

Old Macap URLs are mapped in `src/lib/redirects/legacy.ts` and applied in `src/proxy.ts`. Editors can add more as `redirect` documents. Those are read with a short memory cache of about 15 seconds, because the proxy does not use the Next data cache. A Sanity redirect can take that long to appear.

### Import

`data/seed/example.json` is one group, one grinder and one article. It is not the catalogue.

```bash
SANITY_API_WRITE_TOKEN=... pnpm import:content
```

The script replaces documents with the same `_id`. It does not fetch the old site.

## Content fallback

If a document or list is missing, empty, or the API is unreachable, the page renders the sample in `src/lib/content/sample.ts` and shows: "Sample content. This is not the final Macap catalogue."

Supra 68 uses figures published on macap.it. Other models are sample figures. Confirm them before launch. Product photographs are empty frames labelled "Photography to follow." Three Unsplash photographs are used as layout placeholders only, on the home, about and knowledge pages.

## Routes

| Path | Document |
| --- | --- |
| `/` | `homePage` |
| `/home-grinders` | `journeyPage` slug `home-grinders` |
| `/professional` | `journeyPage` slug `professional` |
| `/contact` | `contactPage` |
| `/about` | `aboutPage` |
| `/grinders` | `grindersIndexPage` plus every `grinder` |
| `/grinders/[slug]` | `grinder` |
| `/collections/[slug]` | `grinderCollection` |
| `/compare?m=a,b` | two or three grinders |
| `/knowledge` | `knowledgeHubPage` |
| `/knowledge/[slug]` | `kbPost` |
| `/knowledge/topic/[slug]` | `kbTopic` |
| `/legal/[slug]` | `legalPage` |
| `/studio` | Sanity Studio |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` | generated |

Filters on `/grinders` are `audience`, `group`, `burr`, `grind` and `status`. Discontinued grinders are hidden unless a status is chosen. They are `noindex` and they are left out of the sitemap.

## Analytics

Events are sent to Vercel custom events always. They are sent to GA4 only after the visitor accepts analytics. If GTM is configured, the same event is pushed to `dataLayer`.

| Event | When | Properties |
| --- | --- | --- |
| `contact_form_submit` | Contact form result | `status`: `success` or `error` |
| `compare_tool_used` | Compare page with at least two models | `models` (comma-separated slugs), `count` |
| `grinder_viewed` | Grinder page | `slug`, `name`, `audience` |
| `journey_step_click` | A link on the Home or Professional journey | `journey`, `step`, `href` |
| `grinder_filter` | Show grinders is used | `audience`, `group`, `burr`, `grind`, `status` |
| `catalogue_download` | A catalogue or PDF link | `slug`, `label` |
| `outbound_click` | A link to another site | `href` |
| `contact_click` | `mailto:` or `tel:` | `kind` (`email` or `phone`), `href` |

### Cookie consent

Google Consent Mode v2 defaults to denied for analytics and ads storage before any tag runs. The choice is stored in `localStorage` under `macap-cookie-consent` (`granted` or `denied`). Accepting turns on `analytics_storage` only. Ads storage stays denied. Rejecting keeps analytics denied. Cookie settings in the footer opens the choice again. The cookie policy is at `/legal/cookie-policy`.

Vercel Analytics and Speed Insights do not use cookies and are not gated on consent.

If both `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GTM_ID` are set, use only one of them to send page views. Otherwise GA4 is counted twice.

## Design

- Colours: black `#000000`, white `#FFFFFF`, yellow `#FFC600`. Yellow is a button and rule colour with black text.
- Type: Schibsted Grotesk, via `next/font`, on the token `--font-macap`. Replace that one token when the Graphik or Neue Haas Grotesk licence is available. The wordmark is drawn in the logo SVG, not set in type.
- Logos in `public/brand/` were traced from the V12 page render. They are not the master artwork. Use only these files until V12 delivers the masters. Do not use the old logo.

## Security

- Contact form: Zod validation, a honeypot field, five messages in ten minutes, optional Turnstile. A filled honeypot returns the success message and sends nothing.
- Security headers include `nosniff`, a referrer policy, a permissions policy, HSTS and a Content-Security-Policy. The policy allows Studio, Analytics, Turnstile and YouTube. Tighten the host list once production is fixed.
- Redirect targets must be a single-slash path or an `http`/`https` URL.
- Do not commit `.env`, `.env.local` or tokens.

## Still needed

- Vercel project and the environment variables above.
- Sanity read token, write token and revalidate secret. CORS origins.
- Resend domain and the contact inbox.
- GA4 measurement id, if Macap still wants Google Analytics.
- Master logo files and the licensed typefaces from V12.
- Real catalogue copy, photography and legal text. The pages marked placeholder are not ready to publish.
