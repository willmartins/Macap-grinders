# White redesign

White is the site-wide ground, including Professional. Yellow stays trim: the home seam, focus, and the active underline.

A grinder page is the exception. The first screen is a full-bleed photograph. The name sits on the photograph. Burr, Motor, Output and Hopper sit in one horizontal row along the bottom, with Enquire and Compare on that same screen. The scrim keeps the type readable. Below that, the engineering chapters, gallery, specifications and questions stay on white, with photographs inside a fixed frame.

Everywhere else, a photograph is a framed block in the content width. It does not run under the header, and it does not spill into the next section. Home is a white introduction and two choices, each with its own complete photograph. Journeys, collections and knowledge use the same calm opening: type, then one framed image.

The header is solid white on every template, including over the product photograph.

Every photograph that uses a filled image sits in a frame with a real height, `position: relative`, and `overflow: hidden`. Those rules also live in `src/app/contain.css`, loaded after the main sheet, so a fill image cannot attach to the page and cover the next section. The build fails if that CSS is missing from the production bundle.
