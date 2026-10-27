# Modules

Page sections share one name in code and in Sanity Studio. They are rendered by `src/components/modules/page-builder.tsx`.

| Name | Component file | Sanity schema type | Where used | Description |
| --- | --- | --- | --- | --- |
| heroBanner | src/components/modules/page-builder.tsx | heroBanner | Home, journeys, about, knowledge | Full-bleed photograph, large headline, short line, up to two links. |
| richText | src/components/modules/page-builder.tsx | richText | About, legal, any page | Heading plus portable text. |
| imageText | src/components/modules/page-builder.tsx | imageText | Home, about | Full-width photograph beside a short explanation and an optional link. |
| grinderGrid | src/components/modules/page-builder.tsx | grinderGrid | Journeys, collections, groups, related models | A grid of grinder cards. Each card is one link. |
| collectionCarousel | src/components/modules/page-builder.tsx | collectionCarousel | Journeys | A sideways list of collections. |
| featureList | src/components/modules/page-builder.tsx | featureList | Journeys | Three or more short points, such as brew, burr and noise. |
| specTable | src/components/modules/page-builder.tsx | specTable | Any page section | A real HTML specification table for one grinder. |
| comparisonTable | src/components/modules/page-builder.tsx | comparisonTable | Journeys | Side-by-side specifications and plain-language differences. |
| faqAccordion | src/components/modules/page-builder.tsx | faqAccordion | Journeys, grinders, articles | Questions and answers, using disclosure elements. |
| ctaBanner | src/components/modules/page-builder.tsx | ctaBanner | Journeys | A next step, such as compare or contact. |
| videoEmbed | src/components/modules/page-builder.tsx | videoEmbed | Any page section | A YouTube film. Other addresses are shown as links. |
| kbPostGrid | src/components/modules/page-builder.tsx | kbPostGrid | Journeys, knowledge | A short list of knowledge articles. |
| quote | src/components/modules/page-builder.tsx | quote | Home | A short quotation with an attribution. |
| contactBlock | src/components/modules/page-builder.tsx | contactBlock | Contact, professional journey | The enquiry form, inline. |

Document types that are not page sections: `siteSettings`, `homePage`, `aboutPage`, `contactPage`, `knowledgeHubPage`, `grindersIndexPage`, `journeyPage`, `grinderGroup`, `grinder`, `grinderCollection`, `author`, `kbTopic`, `kbPost`, `legalPage`, `redirect`, `distributor`. Shared objects: `seo`, `link`, `faq`, `blockContent`, `grinderSpecs`.

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

`GrinderCardView` in `src/components/grinders/grinder-card.tsx` is the shared card for the catalogue, collections, groups, home and professional journeys, related models, and knowledge articles.

The whole card is one link to the model. There is no second link inside it. The photograph sits on a neutral plinth inside a hairline frame. The footer shows the line, the model name, up to two figures from that grinder (burr size, then motor power, or grind type when the motor is not set), and `View model` with the button arrow. That arrow is the card's arrow.

On a pointer that can hover, the border and surface change, the photograph scales slightly inside the plinth, and the arrow nudges. Keyboard focus uses the same arrow nudge and the yellow focus ring. Reduced motion turns the scale and the nudge off. On a touch screen the frame, plinth, and `View model` are enough to show that the card is clickable.

Cards stretch to one height in a grid and in a mobile swipe row. A missing figure is left out. Nothing is invented.

## Grinder questions

`grinder.faqs` is an array of `faq` (question and answer), edited on the grinder document. Maximum six. The product page renders them in an accordion and adds FAQPage JSON-LD for the questions that are shown.

If the array is empty, the page builds up to three questions from that grinder's own fields: burr type and diameter, grind adjustment, and home or professional use with output or hopper when those figures exist. A question is left out when the figure is missing. Nothing is invented.
