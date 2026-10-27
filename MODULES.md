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
