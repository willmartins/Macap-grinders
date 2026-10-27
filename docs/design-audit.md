# Design audit

27 October 2026. Scored after the reference pass in `docs/design-plan.md`. Evidence is a screenshot of each template at 375 and 1440, plus measured hit areas and contrast. Shots: home, Home journey, Professional, Supra collection, Supra group (`/grinders?group=supra`), Supra 68, compare, knowledge hub, a post, about, contact, the enquiry dialog, privacy policy, the 404, the phone menu, and the footer.

Scores are 1 to 5. Five is the standard we want.

| Template | UI practice | Looks | References | Flow | Generic traits |
| --- | --- | --- | --- | --- | --- |
| Home | 3 | 5 | 5 | 4 | 5 |
| Home journey | 3 | 4 | 4 | 5 | 5 |
| Professional | 3 | 5 | 5 | 5 | 5 |
| Collection | 3 | 4 | 3 | 2 | 5 |
| Group | 3 | 4 | 3 | 2 | 5 |
| Grinder | 3 | 5 | 5 | 4 | 5 |
| Compare | 2 | 3 | 3 | 4 | 5 |
| Knowledge hub | 3 | 4 | 4 | 4 | 5 |
| Post | 3 | 4 | 4 | 3 | 5 |
| About | 3 | 4 | 3 | 2 | 5 |
| Contact | 4 | 4 | 4 | 5 | 5 |
| Enquiry dialog | 4 | 4 | 4 | 5 | 5 |
| Legal | 3 | 3 | 2 | 2 | 5 |
| 404 | 3 | 4 | 4 | 4 | 5 |
| Header and menu | 2 | 4 | 4 | 4 | 5 |
| Footer | 2 | 4 | 3 | 4 | 5 |

Looks means smart, modern and clean. References means Polestar, Teenage Engineering, On Running and New Balance, translated, not copied. Generic traits means the skill's default list. Five means those tells are not running the page.

## What holds

Light pages are White. Professional is Black `#000000`. Signal is the seam, the focus ring, the active underline and the selected choice. It is not a fill. Schibsted Grotesk is sentence case. The home split is the one large gesture, and the load motion is the only one. Grinder cards stay framed. The model page still opens with the name, the figures, Enquire and Compare. Steel on white and Ash on black both clear WCAG AA for normal text (about 7:1 and 8:1). Buttons and fields are already 44px tall. The enquiry dialog is the same form, with a visible Close.

Breadcrumb slashes (`Macap / Grinders / Supra 68`) are the trail. They are not a meta string. They stay.

## Findings

### High

**H1. Header, menu and footer controls are under 44px.**

At 375 the Menu control measures 36 by 66. Footer links, the phone number, the email and Cookie settings measure 18 to 26px tall. Desktop navigation uses the same `.nav-link` with no padding, so those items are the height of one line. The logo in the header is inside the 4.5rem bar, so that one is fine.

Fix. Give navigation links, the menu control, footer links and Cookie settings a 44px hit area, without growing the header past the logo bar and without changing the drawn logo.

**H2. A question is a control, and the summary is under 44px.**

The row has padding on the `details` element. The clickable `summary` is only the line of type, about 28px. This is on journeys, model pages and posts.

Fix. Put the 44px target on the summary itself.

**H3. Compare is a list of text links at about 20px.**

Adding or removing a model is the job of the page. Those links are `text-sm` with no hit padding. At 375 the page reported more short controls than any other template.

Fix. Each compare choice and each Remove link gets a 44px target. Keep them as text links with arrows.

### Medium

**M1. Breadcrumb links are under 44px.**

On Supra 68, the collection, the post and legal, the trail is a small line over the photograph or under the header.

Fix. The same 44px target as the navigation, including on the photograph.

**M2. A collection and a group stop at the grid.**

Supra the collection and Supra the group show the machines and then the footer. Nothing on the page names a next decision. Polestar and On both make the next step obvious.

Fix. Under the grid, one link: Compare these grinders. It opens compare with up to three models from that page.

**M3. About, a legal page and a post do not name a next page.**

About ends on the workshop chapter. Legal ends on the placeholder. A post ends on the related machines when it has them, and on the prose when it does not. The footer is chrome, not the page's next step.

Fix. About links to Home grinders and Professional. Legal links to Contact us. A post links to the knowledge hub.

**M4. The home quote does not lead on.**

The split and the two chapters already name the journeys. The quote is a close, in the New Balance sense of a line of brand voice. It is not a dead task.

No change. Recorded so it is not "fixed" by deleting it.

### Low

Inline links inside a paragraph stay inline. Stretching them to 44px would break the measure and the arrow. The 404 is clear and already links home. The enquiry dialog's fields and choices already meet 44px.

## Generic traits

| Trait | On these templates |
| --- | --- |
| Cream ground | Gone. White. |
| All-caps tracked mono | Gone. |
| Eyebrow on every heading | Gone, except a journey numeral and a line name. |
| Hairline broadsheet | Gone, except the card frame, the datasheet, question rows and the solid header edge. |
| Identical cards everywhere | Grinder cards only. |
| Scattered fade-up | Gone. One load on the home split. |
| Tinted near-black | Gone. `#000000`. |
| Middle-dot meta | Gone. Breadcrumb slashes stay, as a trail. |
| Arrow on every control | Kept, because Will asked for it. |

## What changed

Filled in after the second pass.
