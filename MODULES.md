# Modules

Page sections share one name in code and in Sanity Studio. They are rendered by `src/components/modules/page-builder.tsx`.

| Name | Component file | Sanity schema type | Where used | Description |
| --- | --- | --- | --- | --- |
| heroBanner | src/components/modules/page-builder.tsx | heroBanner | Home, journeys, about, knowledge | Full-bleed photograph, large headline, short line, up to two links. |
| richText | src/components/modules/page-builder.tsx | richText | About, legal, any page | Heading plus portable text. |
| imageText | src/components/modules/page-builder.tsx | imageText | Home, about | Full-width photograph beside a short explanation and an optional link. |
| grinderGrid | src/components/modules/page-builder.tsx | grinderGrid | Journeys, collections | A grid of grinders chosen in Studio. |
| collectionCarousel | src/components/modules/page-builder.tsx | collectionCarousel | Journeys | A sideways list of collections. |
| featureList | src/components/modules/page-builder.tsx | featureList | Journeys | Three or more short points, such as brew, burr and noise. |
| specTable | src/components/modules/page-builder.tsx | specTable | Any page section | A real HTML specification table for one grinder. |
| comparisonTable | src/components/modules/page-builder.tsx | comparisonTable | Journeys | Side-by-side specifications and plain-language differences. |
| faqAccordion | src/components/modules/page-builder.tsx | faqAccordion | Journeys, grinders, articles | Questions and answers, using disclosure elements. |
| ctaBanner | src/components/modules/page-builder.tsx | ctaBanner | Journeys | A next step, such as compare or contact. |
| videoEmbed | src/components/modules/page-builder.tsx | videoEmbed | Any page section | A YouTube film. Other addresses are shown as links. |
| kbPostGrid | src/components/modules/page-builder.tsx | kbPostGrid | Journeys, knowledge | A short list of knowledge articles. |
| quote | src/components/modules/page-builder.tsx | quote | Home | A short quotation with an attribution. |
| contactBlock | src/components/modules/page-builder.tsx | contactBlock | Contact, professional journey | The contact form. |

Document types that are not page sections: `siteSettings`, `homePage`, `aboutPage`, `contactPage`, `knowledgeHubPage`, `grindersIndexPage`, `journeyPage`, `grinderGroup`, `grinder`, `grinderCollection`, `author`, `kbTopic`, `kbPost`, `legalPage`, `redirect`. Shared objects: `seo`, `link`, `faq`, `blockContent`, `grinderSpecs`.

## Text links

Standalone text links use `TextLink` from `src/components/site/text-link.tsx`. The same rule is in `AGENTS.md`.

The arrow is the button glyph (`→`), hidden from assistive technology, kept on the same line as the last word, and nudged slightly on hover and keyboard focus. Reduced motion turns the nudge off. An `http` or `https` address uses a north-east arrow (`↗`) and opens in a new tab. `mailto` and `tel` keep the horizontal arrow.

Use it for card titles, view-all and read-more lines, collection, group and model links, knowledge links, compare links, footer links, legal links, contact links, and links inside portable text.

Leave these without `TextLink`: buttons (`.btn` already has an arrow), the header navigation, the logo, breadcrumbs, the skip link, and any link that wraps a whole image card which already shows an arrow. A link that only wraps a photograph does not take an arrow.

## Grinder questions

`grinder.faqs` is an array of `faq` (question and answer), edited on the grinder document. Maximum six. The product page renders them in an accordion and adds FAQPage JSON-LD for the questions that are shown.

If the array is empty, the page builds up to three questions from that grinder's own fields: burr type and diameter, grind adjustment, and home or professional use with output or hopper when those figures exist. A question is left out when the figure is missing. Nothing is invented.
