# Modules

Page sections share one name in code and in Sanity Studio. They are rendered by `src/components/modules/page-builder.tsx`.

| Name | Component file | Sanity schema type | Where used | Description |
| --- | --- | --- | --- | --- |
| heroBanner | src/components/modules/page-builder.tsx | heroBanner | Home, journeys, about, knowledge | Full-bleed photograph, large headline, short line, up to two links. |
| richText | src/components/modules/page-builder.tsx | richText | About, legal, any page | Heading plus portable text. |
| imageText | src/components/modules/page-builder.tsx | imageText | Home, about | Full-width photograph beside a short explanation and an optional link. |
| grinderGrid | src/components/modules/page-builder.tsx | grinderGrid | Audience pages, collections, related models | A grid of grinder cards. Each card is one link. |
| collectionCarousel | src/components/modules/page-builder.tsx | collectionCarousel | Audience pages | A sideways list of collections. |
| rangeGrid | src/components/modules/page-builder.tsx | rangeGrid | Home grinders and Professional grinders only, required | The page audience's ranges as cards, then its collections. Filled from the ranges, so it has no list to pick. |
| collectionModels | src/components/modules/page-builder.tsx | collectionModels | Collections only, required | The collection's grinders as cards, in the collection's order. |
| featureList | src/components/modules/page-builder.tsx | featureList | Journeys | Three or more short points, such as brew, burr and noise. |
| specTable | src/components/modules/page-builder.tsx | specTable | Any page section | A real HTML specification table for one grinder. |
| comparisonTable | src/components/modules/page-builder.tsx | comparisonTable | Journeys | Side-by-side specifications and plain-language differences. |
| faqAccordion | src/components/modules/page-builder.tsx | faqAccordion | Journeys, grinders, articles | Questions and answers, using disclosure elements. |
| ctaBanner | src/components/modules/page-builder.tsx | ctaBanner | Journeys | A next step, such as compare or contact. |
| videoEmbed | src/components/modules/page-builder.tsx | videoEmbed | Any page section | A YouTube film. Other addresses are shown as links. |
| kbPostGrid | src/components/modules/page-builder.tsx | kbPostGrid | Journeys, knowledge | A short list of knowledge articles. |
| quote | src/components/modules/page-builder.tsx | quote | Home | A short quotation with an attribution. |
| contactBlock | src/components/modules/page-builder.tsx | contactBlock | Contact, professional journey | The enquiry form, inline. |

Document types that are not page sections: `siteSettings`, `homePage`, `aboutPage`, `contactPage`, `knowledgeHubPage`, `grindersIndexPage`, `journeyPage` (Audience page), `grinderGroup` (Range), `grinder`, `grinderCollection`, `author`, `kbTopic`, `kbPost`, `legalPage`, `redirect`, `distributor`. Shared objects: `seo`, `link`, `faq`, `blockContent`, `grinderSpecs`.

## Site structure

Addresses are built in `src/lib/paths.ts`. Do not write a grinder, range or collection address by hand.

| Address | Page | Content | Layout |
| --- | --- | --- | --- |
| `/grinders` | Grinders index | `grindersIndexPage` | Two doors to the audience pages, every range by audience, every model with filters. |
| `/grinders/home` | Home grinders | `journeyPage` with slug `home-grinders` | Page builder. A `rangeGrid` is required. |
| `/grinders/professional` | Professional grinders | `journeyPage` with slug `professional` | Page builder. A `rangeGrid` is required. |
| `/grinders/<range>` | Range, such as Supra | `grinderGroup` | Fixed: header, models, about the range, feature cards, collections, other ranges. Empty parts are left out. |
| `/grinders/<collection>` | Collection, such as G Series | `grinderCollection` | Page builder. A `collectionModels` section is required. |
| `/grinders/<range>/<model>` | Grinder | `grinder` | Fixed. |

A grinder belongs to exactly one range, and its address sits under that range. A grinder can be in any number of collections. A collection is a landing page about something models share, such as a technology, and can span ranges and audiences.

Ranges and collections share `/grinders/<slug>`. Studio keeps their slugs unique across both and keeps `home` and `professional` free. If a clash reaches the site anyway, the range wins.

A range's or collection's audience (Home, Professional or Both) sets which audience page lists it. It does not change its address.

Old addresses redirect in `src/proxy.ts`: `/home-grinders`, `/professional`, `/collections/<slug>` and `/grinders/<model>`. The old-site table in `src/lib/redirects/legacy.ts` points straight at the new addresses.

Primary navigation: Home grinders, Professional grinders, then Knowledge and About, then the Contact button. The logo links to `/`.

## Design system

`/design-system` is the internal reference for the agreed parts of the site: colour, type, spacing, surfaces, buttons and links, and voice. It is `noindex`, and it is not in the sitemap or the navigation. Its examples render the real styles, so it cannot drift from the site. Sample text on that page is labelled. A part is added once it is settled.

Colours are named for what they look like: `black`, `off-black`, `grey`, `silver`, `light-grey`, `white`, `sand`, `dark-sand`, `yellow`. They are set once in `src/app/globals.css` and used as Tailwind names, such as `bg-yellow` or `text-grey`, or as `var(--yellow)` in CSS. There are no role names such as `fg` or `muted`.

Special colours sit outside that palette: `sky`, `emerald` and `violet`, each with a `light-` fill and a `dark-` text tone. They are for special circumstances and for tools and apps, such as telling models apart in the compare tool. Do not use them in general page design.

Type sizes sit on one scale that starts from the 15px body size: a minor third (1.2) on a phone and a perfect fourth (1.333) on a desktop, set as `--type-0` to `--type-7` in `src/app/globals.css`. Display is step 7, Heading 1 step 5, Heading 2 step 4, Heading 3 step 2, Lead step 1 and Body step 0. Steps 3 and 6 are spare. The type classes sit in Tailwind's components layer, so a utility on the same element wins, such as `type-body font-semibold`. Navigation, mono and eyebrow are fixed label sizes off the scale. A new size takes a spare step. Do not set a font size by hand.

Buttons use `.btn`, with `.btn-secondary`, `.btn-on-photo` and `.btn-yellow`. An icon is an `svg` inside the button, from `src/components/site/icons.tsx`. `.btn-no-arrow` removes the arrow when a trailing icon takes its place. A text link that stands on its own can add `.link-underline`.

Shared components that are not yet on that page: `SectionHeader` (src/components/site/section-header.tsx), `FeatureCard` (src/components/site/feature-card.tsx, three versions chosen by the content: image, icon on a colour ground, or text only), `FaqList` (src/components/grinders/faq-list.tsx).

## Enquiries

The form lives in `src/components/contact/contact-form.tsx`. The contact page shows it inline and has no product field. A grinder page uses `Enquire` (`src/components/contact/enquire.tsx`): Enquire is the primary action, Compare stays secondary. Enquire opens the same form in a native dialog. Escape closes it, focus stays inside while it is open, and focus returns to Enquire. On a phone the dialog is a full-screen sheet. Without JavaScript, Enquire is a link to `/contact?grinder=<slug>`. That page shows the grinder and submits its slug. There is no product picker.

Fields, in order: what you do, country, a distributor note when one applies, message, email, phone, mailing list, then Send. The country control is a combobox. United Kingdom is listed first. Typing filters the list.

A distributor is a Sanity document (`distributor`), edited under Distributors. Macap adds the partners. The production list stays empty until they do. The document fields are `name`, `countries` (ISO codes, such as `GB`), `enquiryEmail`, optional `website`, `isPrimary`, `active`, and an optional internal `note`. The note is not queried. The browser only receives the partner's name, and only when the role is Cafe, Roastery / coffee supplier or Home barista and the country matches an active partner. If several match, the primary one is used. The note says the message will be shared, with an unchecked box "Only send my message to Macap". Equipment supplier / distributor and Other never see the note. The enquiry email is read on the server when the form is sent. Nothing is imported. A clearly labelled example partner for the United Kingdom exists only in the development fixture (`src/server/distributors.ts`). It is used only when `NODE_ENV` is `development` and Studio has no active partners.

Mail goes to `CONTACT_TO_EMAIL` with the role, country, grinder, and whether the sender kept the message with Macap. When a partner matches and the box is unchecked, a separate email goes to that partner, with the enquirer as reply-to and Macap copied by `CONTACT_DISTRIBUTOR_COPY` (`cc` or `bcc`). The enquirer gets a short confirmation. A mailing-list opt-in is not sent to a provider. Consent (time and page) is recorded in the Macap email, the subject says "Mailing list sign-up", and the body starts with that block. `src/server/mailing-list.ts` holds the provider slot for later. Enquiries are not stored in Sanity. A sent enquiry fires `generate_lead` (role, country, grinder) through Vercel Analytics, and through GA4 only after analytics consent.

## Text links

Standalone text links use `TextLink` from `src/components/site/text-link.tsx`. The same rule is in `AGENTS.md`.

The arrow is the button glyph (`→`), hidden from assistive technology, kept on the same line as the last word, and nudged slightly on hover and keyboard focus. Reduced motion turns the nudge off. An `http` or `https` address uses a north-east arrow (`↗`) and opens in a new tab. `mailto` and `tel` keep the horizontal arrow.

Use it for view-all and read-more lines, collection links, knowledge links, compare links, footer links, legal links, contact links, and links inside portable text.

Leave these without `TextLink`: buttons (`.btn` already has an arrow), the header navigation, the logo, breadcrumbs, the skip link, and a grinder card. The card is one link and already shows `View model` with the arrow.

## Grinder cards

`GrinderCardView` in `src/components/grinders/grinder-card.tsx` is the shared card for the catalogue, collections, ranges, audience pages, related models, and knowledge articles. `RangeCardView` and `CollectionCardView` in `src/components/grinders/range-card.tsx` use the same frame, plinth and foot, with `View range` and `View collection`. A range's own picture is a photograph and fills the plinth. Without one, the first current model's cut-out stands in. `ArticleCardView` in `src/components/knowledge/article-card.tsx` is the same card for a knowledge article: its photograph, the topic and date, the title, the excerpt and `Read article`. The knowledge hub, topic pages and the end of each article use it.

The whole card is one link to the model. There is no second link inside it. The photograph sits on a neutral plinth inside a hairline frame. The footer shows the line, the model name, up to two figures from that grinder (burr size, then motor power, or grind type when the motor is not set), and `View model` with the button arrow. That arrow is the card's arrow.

On a pointer that can hover, the border and surface change, the photograph scales slightly inside the plinth, and the arrow nudges. Keyboard focus uses the same arrow nudge and the yellow focus ring. Reduced motion turns the scale and the nudge off. On a touch screen the frame, plinth, and `View model` are enough to show that the card is clickable.

Cards stretch to one height in a grid and in a mobile swipe row. A missing figure is left out. Nothing is invented.

## Knowledge articles

An article page opens with the answer-first introduction under "In short", then the author and date. A body with three or more Heading 2 sections gets a contents list: beside the text on a wide screen, and a closed list above it on a narrow one. Heading 2 has an anchor from its text. Consecutive images in the body sit side by side, up to three. The page ends with questions, related grinders and up to three more articles from the same topic.

Body headings: Heading 2 for a section, Heading 3 for a step or a sub-point. Do not set a heading as a bold paragraph.

## Grinder questions

`grinder.faqs` is an array of `faq` (question and answer), edited on the grinder document. Maximum six. The product page renders them in an accordion and adds FAQPage JSON-LD for the questions that are shown.

If the array is empty, the page builds up to three questions from that grinder's own fields: burr type and diameter, grind adjustment, and home or professional use with output or hopper when those figures exist. A question is left out when the figure is missing. Nothing is invented.

## Spacing and alignment

Check every template at 375, 768, 1280 and 1440.

- Section padding uses `--space-tight`, `--space-standard` or `--space-hero`. Inner gaps use `--gap-inner`. Blocks use `--gap-block`.
- `.frame` and `--frame-inset` are the same inset: 1.25rem below 768, and 2rem from 768 until the 90rem cap, then half the leftover. Header, footer and page text share that left edge.
- A split chapter uses the same inset. Text on the left lines up with the header. Text on the right ends on the header's right edge. The photograph can run to the edge of its half.
- Body copy stays under 80 characters. Headlines can be larger and shorter.
- Grinder cards use `--gap-inner`. Collection rows use `--gap-block`.
- A phone swipe row is inset by `--frame-inset`, with a gap, and the next card peeks. The text inside that row does not add a second inset.
- The logo clear space in the header stays as set. Arrows sit on the same line as the last word, and nudge only on hover or focus. Reduced motion keeps them still.
