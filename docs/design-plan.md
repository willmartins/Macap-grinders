# Macap visual direction

This is a vibe pass, not the formal design system. The subject is a coffee grinder: a machined object, made in the Venice area since 1930, sold to a person choosing a machine for a counter or a bar. The primary references are Polestar, Teenage Engineering, On Running and New Balance. The feel stays a high-performance machine brand. The object fills the frame. Colour is a stripe, not a wash. Type is a plate on the chassis, not a poster. Nothing below is a copy of those four.

Will's rules win where they meet this note: arrows on buttons and on text links, yellow as trim only, framed grinder cards, mobile swipe rows, questions, the first screen of a model page, the enquiry flow, and the official logo.

## Colour

Six named values. Page grounds are only black and white.

| Name | Hex | Role |
| --- | --- | --- |
| Black | `#000000` | Professional ground. Type on white. |
| White | `#FFFFFF` | Home and neutral ground. Type on black and on photographs. |
| Signal | `#FFC600` | Pantone 7548 C. Trim only. |
| Steel | `#5C5C5C` | Secondary type on white. |
| Alloy | `#E4E4E4` | Frames, plinths and lines on white. |
| Ash | `#A3A3A3` | Secondary type on black. |

Lines on a black page are white at 18 percent. The plinth under a machine on a black page is white at 8 percent. Those are mixes of Black and White, not extra brand colours.

Signal is the focus ring, the active underline, text selection, the selected enquiry choice, the invalid-field mark, the cookie notice edge, and the seam on the home split. It is never a fill and never body type.

## Type

The brand faces are not licensed yet.

| Brand face | Role | Stand-in now |
| --- | --- | --- |
| Aristotelica | Display. Model names. The two lines on the home split. | Schibsted Grotesk, weight 500, tight, on `--font-macap`. |
| Graphik | Interface. Navigation, buttons, indexes. | Schibsted Grotesk, weight 500, sentence case, no tracking. |
| Neue Haas Grotesk | Reading. Introductions, articles, form help. | Schibsted Grotesk, weight 400, about 1.125rem, line-height 1.5, measure under 65 characters. |

One grotesque does all three jobs until the files arrive. They are all grotesques, so a second stand-in would be a costume. IBM Plex Mono leaves the interface. It is not a Macap face, and tracked capitals were doing the work of a label rather than the work of a specification.

The wordmark stays the official V12 drawing. It is not set in type.

Buttons and navigation are sentence case in the grotesque. The arrow stays. Figures use tabular numbers in the same face. A unit sits beside the figure at the text size, not in capitals.

## Layout

Left aligned. Not centred, not justified. The existing frame stays. The header height and the logo clear space stay.

The memorable place is the home split, and only that. Two full-bleed photographs. The line of type sits low and left, at the scale of the machine. A 3px Signal seam cuts the pair, vertical on a wide screen and horizontal when the panels stack. That seam is the one structural use of yellow. It marks the cut between home and the bar.

```
HOME  (wide)
+----------------------+--+----------------------+
| photograph           ||| photograph           |
|                      |||                      |
| For the home.        ||| For the bar.         |
| one line             ||| one line             |
| [Home grinders →]    ||| [Professional →]     |
+----------------------+--+----------------------+
        Signal seam, 3px, full height

HOME  (narrow)
+---------------------------+
| photograph                |
| For the home.             |
| [Home grinders →]         |
+---------------------------+
============= Signal =======
+---------------------------+
| photograph                |
| For the bar.              |
| [Professional →]          |
+---------------------------+
```

A journey is a sequence, so it may carry a numeral. The numeral is part of the heading, in the grotesque, with no dash and no yellow tick. The photograph is the left or right half. The copy is the other half. Then the framed cards, then the questions.

```
JOURNEY
+----------------------------------------------+
| photograph                          crumbs   |
| 01                                           |
| How you brew                                 |
| one or two sentences                         |
| [How much you grind →]                       |
+----------------------------------------------+
| 02                    | photograph           |
| How you dose          |                      |
+-----------------------+----------------------+
| 03                                           |
| Find your grinder                            |
| [framed card] [framed card] [framed card]    |
+----------------------------------------------+
| Questions                                    |
| row                                          |
| row                                          |
+----------------------------------------------+
```

A model page opens on the machine. Name, one line, the key figures, Enquire and Compare, all on the first screen. Below that, burrs, drive and setting as chapters you can swipe on a phone. The specification table is a datasheet, with a rule per row. The framed cards of the rest of the line stay a swipe row on a phone.

```
GRINDER
+----------------------------------------------+
| photograph                                   |
| crumbs                                       |
| Supra                                        |
| Supra 68                                     |
| one line                                     |
| 68 mm    550 W    1.5 kg    3.8 g/s          |
| [Enquire →]  [Compare →]                     |
+----------------------------------------------+
| burrs photo | Flat                           |
|             | 68 mm                          |
+----------------------------------------------+
| Drive       | motor photo                    |
| 550 W       |                                |
+----------------------------------------------+
| Specifications                               |
| Burrs            68 mm                       |
| Motor            550 W                       |
+----------------------------------------------+
```

The knowledge base is a shelf, not a card grid. A short photograph, the title, then topics as a plain list and articles as a title, one line, and the date on its own line.

```
KNOWLEDGE
+----------------------------------------------+
| photograph                                   |
| Knowledge                                    |
| one line                                     |
+----------------------------------------------+
| Topics                                       |
| Choosing a grinder                           |
| one line                                     |
+----------------------------------------------+
| Flat burrs and conical burrs          date   |
| one line                                     |
+----------------------------------------------+
```

## References

Studied for what they do well. The Macap choice is the translation. The layout, type and colour of those sites stay theirs.

**Polestar.** Restraint, scale, and product storytelling that behaves like a configurator. One decision, the consequence in view, then the next decision. Chrome is almost absent. Type and the object share a scale.

Macap. The home split is the only large gesture: two machines, two places, a 3px seam. A journey is three decisions in order, not a magazine feature. Each chapter names the next chapter. The fast path on the photograph still jumps to the machines. There is no configurator, no studio black that is not true black, and no borrowed wordmark.

**Teenage Engineering.** Playful precision. The product is an object you could pick up. Technical detail is drawn so it is pleasant to read. Labels are few and exact. Interaction feels like handling the thing.

Macap. The grinder sits on a plain plinth inside a frame. Figures sit beside the object. A card answers the pointer, because that is how you know the frame is the machine. No borrowed orange, no toy grid, no joke in the interface.

**On Running.** Bold product-led pages. One performance idea at a time, explained in plain language, with a pace from section to section. The shoe leads. Motion carries you forward.

Macap. One decision per journey chapter. The next chapter is a link with the name of that chapter. Performance figures stay on the first screen of the model. Motion stays the single load on the home split. No gradient mesh, no scroll hijack, no campaign line.

**New Balance.** Confident editorial type. Heritage and the current shoe in the same voice. A clear path from a category into a product.

Macap. Since 1930 and the Venice workshop use the same sentences as 68 mm and 550 W. Knowledge is a shelf of articles. Primary navigation stays Home, Professional and Contact. A line is reached from the journey and the footer, not from a shop menu copied from a footwear site.

## Principles

Spend the boldness on the home split. Everything else is quiet: black or white, one grotesque, space instead of rules, sentence case.

A rule stays only where it is the object. The grinder card frame is the object. A datasheet row is the object. A question row is the object. A header edge, when the bar is solid, separates the chrome from the page.

Motion is one moment. On load, the two home lines settle onto the seam. The seam itself does not animate, so the cut does not shift the layout. Nothing else fades in as you scroll. A card may still answer the pointer, because that shows the frame is a link. Reduced motion removes the load moment, the photograph scale and the arrow nudge.

Copy stays short, specific and British. No em dashes. A button names the place it opens.

## Review

The first draft of this plan kept the warm paper, the tracked mono labels and a yellow rule on every call to action. That is the page this process would produce for a magazine, a studio portfolio or a software product. Macap is none of those. The revision is below.

What changed, and why:

- The ground on light pages moved from warm paper to White. Cream is the default "quiet editorial" ground, and it fights the machine. Home stays light. Light here means White.
- Professional moved from a tinted near-black to Black, and the type on it from a warm off-white to White.
- IBM Plex Mono and the capital labels came out. The brand faces are grotesques. Capitals were labelling every block whether or not it needed a label.
- The yellow dash in front of labels came out. Signal is trim, and a dash on every heading spends it everywhere.
- The home split lost "01 / Home" and "02 / Professional". The headline is the choice. A number there is decoration.
- Journey numerals stayed, and moved into the heading. Those pages are a sequence: how you brew or how much you grind, how you dose or how the room is used, then the grinder.
- Hairline columns, the mosaic gaps, and the yellow bar on quotes and calls to action came out. They made every template a broadsheet.
- Scroll fade and the slow image drift came out. The load moment on the home split is the only one.
- Slashes joining a line and a status, or a topic and a date, came out. Those strings are the same device as a middle dot. The date, the topic and a status each sit on their own.

The reference set then moved from Rocket Espresso, Ferrari and Bugatti to Polestar, Teenage Engineering, On Running and New Balance. The machine-brand feel stays. What changed because of that:

- The home seam and the white or black grounds stay. They already match Polestar's restraint and On's product-led first screen. Ferrari's stripe and Bugatti's theatre were the risk. They are not the brief now.
- Journey chapters name the next chapter. That is the configurator-like flow, without a configurator. On's pace is a link, not another animation.
- Heritage stays in the same voice as the figures. New Balance's editorial confidence is the knowledge shelf and the large grotesque, not a heritage campaign.
- Teenage Engineering's object-on-a-field is the framed card and the plinth. Their playfulness is the pointer response on that card, not a second colour.

## Generic traits

| Trait on the site now | Decision | Why |
| --- | --- | --- |
| Cream background | Change | Warm paper is the editorial default. The light ground is White. |
| All-caps tracked mono labels | Change | Not a brand face, and capitals on every label are a generated tell. Sentence case in the grotesque. |
| Eyebrows above headings | Change, with one keep | Remove decorative eyebrows and the home split indexes. Keep a numeral on a journey step, and a line name on a model, because those name a sequence or a category. |
| Hairline broadsheet rules | Change, with a keep | Remove column rules, section rules and yellow section bars. Keep the card frame, the datasheet, the question rows and the solid header edge. |
| Identical cards | Keep the grinder card only | Will asked for the framed card. Do not use that frame for articles, topics or chapters. |
| Scattered fade-up | Change | Remove scroll fades and image drift. One load moment on the home split. The card still answers the pointer. |
| Tinted near-black | Change | Black is `#000000`. Type on it is White. |
| Middle-dot meta strings | Change | The site used slashes the same way. Topic, date, line and status separate. |
| Arrow on buttons and text links | Keep | Will's rule. The skill lists the arrow as a default. Here it is the specified link. |

## What this pass does not do

It does not load Aristotelica, Graphik or Neue Haas. It does not redraw the logo. It does not change the enquiry flow, the swipe rows, the questions, or what sits on the first screen of a model. The spacing tokens and the header clearance stay. A component library comes later.
