import { Chapter, Rules, Specimen, Swatch } from "@/components/design-system/parts";
import { DownloadIcon, MailIcon, PinIcon } from "@/components/site/icons";
import { ArrowText, TextLink } from "@/components/site/text-link";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildMetadata({
    title: "Design system | Macap",
    description: "Colour, type, spacing, buttons and links for the Macap website. Internal reference.",
    path: "/design-system",
    noIndex: true,
  });
}

const chapters = [
  { id: "colour", label: "Colour" },
  { id: "type", label: "Type" },
  { id: "spacing", label: "Spacing" },
  { id: "surfaces", label: "Surfaces" },
  { id: "actions", label: "Buttons and links" },
  { id: "voice", label: "Voice" },
];

/** Outside the main palette. Values match the tokens in globals.css. */
const specialColours = [
  { name: "sky", light: "#e0f2fe", mid: "#7dd3fc", dark: "#075985" },
  { name: "emerald", light: "#d1fae5", mid: "#6ee7b7", dark: "#065f46" },
  { name: "violet", light: "#ede9fe", mid: "#c4b5fd", dark: "#5b21b6" },
];

/** Phone sizes step by a minor third. Desktop sizes step by a perfect fourth. Both start from the body size. */
const typeBase = 15;
const phoneRatio = 1.2;
const desktopRatio = 4 / 3;

function stepSize(step: number, ratio: number): number {
  return Math.round(typeBase * ratio ** step);
}

/** Styles on the scale, largest first. */
const scaleStyles = [
  { step: 7, name: "Display", code: "type-display", weight: 600, tracking: "-0.04em", sample: "Supra 68", use: "Model name in the hero. One per page." },
  { step: 5, name: "Heading 1", code: "type-h1", weight: 600, tracking: "-0.035em", sample: "Coffee grinders since 1930", use: "Page title, closing banner." },
  { step: 4, name: "Heading 2", code: "type-h2", weight: 600, tracking: "-0.03em", sample: "Specifications", use: "Section title." },
  { step: 2, name: "Heading 3", code: "type-h3", weight: 600, tracking: "-0.02em", sample: "Flat burrs, 68 mm", use: "Card title, sub-section, key figures." },
  { step: 1, name: "Lead", code: "type-lead", weight: 400, tracking: "-0.005em", sample: "The Supra 68 is a commercial espresso grinder.", use: "One paragraph under a title." },
  { step: 0, name: "Body", code: "type-body", weight: 400, tracking: "0", sample: "Flat burrs, 68 mm. Motor 550 W.", use: "Running text, card text, answers." },
];

/** Every step from 7 to 0, with the style that uses it. A step without a style is spare. */
const scaleSteps = [7, 6, 5, 4, 3, 2, 1, 0].map((step) => ({
  step,
  phone: stepSize(step, phoneRatio),
  desktop: stepSize(step, desktopRatio),
  style: scaleStyles.find((style) => style.step === step),
}));

/** Labels are fixed sizes. A scale would shrink them below a readable size. */
const labelStyles = [
  { name: "Navigation", code: "nav-link", size: "15px", weight: 600, tracking: "+0.04em, capitals", sample: "Professional", use: "Header links, the menu button and the header button." },
  { name: "Mono", code: "type-mono", size: "13 to 14px", weight: 400, tracking: "-0.01em", sample: "244 × 354 × 638 mm", use: "Specification values only. Space Mono." },
  { name: "Eyebrow", code: "type-eyebrow", size: "12px", weight: 600, tracking: "+0.08em, capitals", sample: "Technical data", use: "Label above a title or a figure." },
];

const spacing = [
  { token: "--space-tight", phone: "2.75rem", desktop: "3.5rem", use: "Padding for a short section." },
  { token: "--space-standard", phone: "4.5rem", desktop: "6rem", use: "Padding for a section. The default." },
  { token: "--space-hero", phone: "6rem", desktop: "8rem", use: "Padding for an opening or closing section." },
  { token: "--gap-block", phone: "2rem", desktop: "2.5rem", use: "Gap between blocks inside a section." },
  { token: "--gap-inner", phone: "1.25rem", desktop: "1.5rem", use: "Gap between cards in a grid." },
  { token: "--frame-inset", phone: "1.25rem", desktop: "2rem, then centred at 90rem", use: "Page edge. Header, footer and text share it." },
];

export default function DesignSystemPage() {
  return (
    <article>
      <header className="section border-b border-silver">
        <div className="frame">
          <p className="type-eyebrow text-grey">Internal reference</p>
          <h1 className="type-h1 mt-3 text-black">Design system</h1>
          <p className="type-lead mt-5 max-w-2xl text-grey">
            The agreed parts of the Macap website. Every example is the real style, so this page changes when the site
            does. Sample text is labelled. A part is added here once it is settled.
          </p>
          <nav aria-label="Design system chapters" className="mt-8">
            <ul className="flex flex-wrap gap-x-8 gap-y-1">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <TextLink href={`#${chapter.id}`} className="tap font-semibold">
                    {chapter.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <Chapter
        id="colour"
        eyebrow="Foundations"
        title="Colour"
        intro="Nine colours, each named for what it looks like. Use the name in a class, such as bg-yellow or text-grey."
      >
        <Specimen name="Black to white">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            <Swatch name="black" hex="#000000" use="Text and the main button." />
            <Swatch name="off-black" hex="#0c0c0c" use="Dark grounds: hero, closing banner, dark cards." />
            <Swatch name="grey" hex="#5c5c5c" use="Secondary text and labels." />
            <Swatch name="silver" hex="#e4e4e4" use="Hairlines, borders, and the ground behind a cut-out photograph." />
            <Swatch name="light-grey" hex="#f9f9f9" use="Quiet section ground." />
            <Swatch name="white" hex="#ffffff" use="Page ground and cards." />
          </ul>
        </Specimen>
        <Specimen name="Sand and yellow">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            <Swatch name="sand" hex="#f2ede4" use="Warm section ground." />
            <Swatch name="dark-sand" hex="#e5dfd2" use="A rule or border on sand." />
            <Swatch name="yellow" hex="#ffc600" use="The brand colour. Markers, focus, and the yellow button on dark. Not for text on white." />
          </ul>
        </Specimen>
        <Specimen
          name="Special colours"
          note="For special circumstances and for tools and apps, such as telling models apart in the compare tool. They are not for general page design. Each has a light fill, a mid tone for borders and a dark tone for text."
        >
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-[var(--gap-block)]">
            {specialColours.map((colour) => (
              <div key={colour.name}>
                <ul className="grid grid-cols-3 gap-4">
                  <Swatch name={`light-${colour.name}`} hex={colour.light} use="Fill." />
                  <Swatch name={colour.name} hex={colour.mid} use="Border." />
                  <Swatch name={`dark-${colour.name}`} hex={colour.dark} use="Text." />
                </ul>
                <p className="mt-5">
                  <span
                    className="inline-block border px-1.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: colour.light, borderColor: colour.mid, color: colour.dark }}
                  >
                    Supra 83
                  </span>
                  <span className="type-body ml-3 text-grey">In use, as a model chip.</span>
                </p>
              </div>
            ))}
          </div>
        </Specimen>
      </Chapter>

      <Chapter
        id="type"
        eyebrow="Foundations"
        title="Type"
        intro="One typeface, Elza, on one scale. Titles are weight 600. Text is weight 400."
      >
        <Specimen name="The scale">
          <dl className="grid gap-[var(--gap-inner)] sm:grid-cols-3">
            <div className="border-t-2 border-black pt-4">
              <dt className="type-eyebrow text-grey">Starts from</dt>
              <dd className="type-h2 mt-2 text-black">15px</dd>
              <dd className="type-body mt-2 text-grey">The body size. Step 0 on every screen.</dd>
            </div>
            <div className="border-t-2 border-black pt-4">
              <dt className="type-eyebrow text-grey">On a phone</dt>
              <dd className="type-h2 mt-2 text-black">Minor third</dd>
              <dd className="type-body mt-2 text-grey">Each step is 1.2 times the one below it.</dd>
            </div>
            <div className="border-t-2 border-black pt-4">
              <dt className="type-eyebrow text-grey">On a desktop</dt>
              <dd className="type-h2 mt-2 text-black">Perfect fourth</dd>
              <dd className="type-body mt-2 text-grey">Each step is 1.333 times the one below it.</dd>
            </div>
          </dl>
          <p className="type-body mt-6 max-w-2xl text-grey">
            A style keeps its step on every screen. Between 375 and 1440 pixels wide it grows evenly from its phone
            size to its desktop size. A new size is the next spare step, not a number picked by eye.
          </p>
        </Specimen>

        <Specimen name="Steps" note="Sizes in pixels, rounded. Set in globals.css as --type-0 to --type-7.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-silver">
                  <th scope="col" className="py-3 pr-6 type-eyebrow text-grey">Step</th>
                  <th scope="col" className="py-3 pr-6 type-eyebrow text-grey">Phone, × 1.2</th>
                  <th scope="col" className="py-3 pr-6 type-eyebrow text-grey">Desktop, × 1.333</th>
                  <th scope="col" className="py-3 pr-6 type-eyebrow text-grey">Style</th>
                  <th scope="col" className="py-3 type-eyebrow text-grey">Class</th>
                </tr>
              </thead>
              <tbody>
                {scaleSteps.map((row) => (
                  <tr key={row.step} className="border-b border-silver">
                    <th scope="row" className="py-3 pr-6 type-mono font-normal text-black">
                      {row.step}
                    </th>
                    <td className="py-3 pr-6 type-mono text-black">{row.phone}</td>
                    <td className="py-3 pr-6 type-mono text-black">{row.desktop}</td>
                    <td className={`py-3 pr-6 ${row.style ? "font-semibold text-black" : "text-grey"}`}>
                      {row.style ? row.style.name : "Spare"}
                    </td>
                    <td className="py-3 type-mono text-grey">{row.style ? `.${row.style.code}` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Specimen>

        <Specimen name="Styles on the scale">
          <div className="divide-y divide-silver border-b border-silver">
            {scaleStyles.map((style) => {
              const phone = stepSize(style.step, phoneRatio);
              const desktop = stepSize(style.step, desktopRatio);
              return (
                <div key={style.code} className="grid items-baseline gap-3 py-6 first:pt-0 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3">
                    <p className="font-semibold text-black">{style.name}</p>
                    <p className="type-mono mt-1 text-grey">
                      Step {style.step}, {phone === desktop ? `${phone}px` : `${phone} to ${desktop}px`}
                    </p>
                    <p className="type-mono mt-1 text-grey">
                      {style.weight}, {style.tracking}
                    </p>
                    <p className="type-body mt-1 text-grey">{style.use}</p>
                  </div>
                  <p className={`${style.code} min-w-0 text-black md:col-span-9`}>{style.sample}</p>
                </div>
              );
            })}
          </div>
        </Specimen>

        <Specimen
          name="Labels, off the scale"
          note="Three small styles keep a fixed size on every screen. Navigation and eyebrow are set in capitals."
        >
          <div className="divide-y divide-silver border-b border-silver">
            {labelStyles.map((style) => (
              <div key={style.code} className="grid items-baseline gap-3 py-6 first:pt-0 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <p className="font-semibold text-black">{style.name}</p>
                  <p className="type-mono mt-1 text-grey">{style.size}</p>
                  <p className="type-mono mt-1 text-grey">
                    {style.weight}, {style.tracking}
                  </p>
                  <p className="type-body mt-1 text-grey">{style.use}</p>
                </div>
                <p className={`${style.code} min-w-0 text-black md:col-span-9`}>{style.sample}</p>
              </div>
            ))}
          </div>
        </Specimen>
      </Chapter>

      <Chapter
        id="spacing"
        eyebrow="Foundations"
        title="Spacing and layout"
        intro="Six tokens set the rhythm. Check every template at 375, 768, 1280 and 1440 pixels wide."
      >
        <table className="datasheet border-t border-silver">
          <caption className="sr-only">Spacing tokens</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <td className="pr-4 font-medium text-grey">Phone</td>
              <td className="pr-4 font-medium text-grey">From 768px</td>
              <td className="hidden font-medium text-grey md:table-cell">Use</td>
            </tr>
          </thead>
          <tbody>
            {spacing.map((item) => (
              <tr key={item.token}>
                <th scope="row" className="align-top type-mono">
                  {item.token}
                </th>
                <td className="pr-4 align-top type-mono">{item.phone}</td>
                <td className="pr-4 align-top type-mono">{item.desktop}</td>
                <td className="hidden md:table-cell">{item.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Specimen name="Section padding, to scale" note="Each bar is the height of the padding at this screen width.">
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Tight", token: "--space-tight" },
              { name: "Standard", token: "--space-standard" },
              { name: "Hero", token: "--space-hero" },
            ].map((item) => (
              <li key={item.token}>
                <div className="w-full bg-silver" style={{ height: `var(${item.token})` }} />
                <p className="mt-2 font-semibold text-black">{item.name}</p>
                <p className="type-mono text-grey">{item.token}</p>
              </li>
            ))}
          </ul>
        </Specimen>
        <Rules
          items={[
            { rule: "One page edge", detail: "Use .frame. Header, footer and page text share the same left edge." },
            { rule: "Line length", detail: "Body copy stays under 80 characters. Headlines can be shorter." },
            { rule: "Phone rows", detail: "A swipe row is inset by the frame, and the next card peeks." },
          ]}
        />
      </Chapter>

      <Chapter
        id="surfaces"
        eyebrow="Foundations"
        title="Surfaces"
        intro="A section sits on one of four grounds."
      >
        <ul className="grid gap-[var(--gap-inner)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "White", code: "bg-white", ground: "bg-white", use: "The default." },
            { name: "Light grey", code: "bg-light-grey", ground: "bg-light-grey", use: "Reference content." },
            { name: "Sand", code: "bg-sand", ground: "bg-sand", use: "Finishes and materials." },
            { name: "Off-black", code: "bg-off-black", ground: "bg-off-black text-white", use: "Hero and closing banner." },
          ].map((surface) => (
            <li key={surface.code} className={`border border-silver p-6 ${surface.ground}`}>
              <p className="type-h3">{surface.name}</p>
              <p className="type-mono mt-2 opacity-70">{surface.code}</p>
              <p className="type-body mt-6 opacity-80">{surface.use}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter
        id="actions"
        eyebrow="Components"
        title="Buttons and links"
        intro="A button is for the main action in view. Everything else is a text link."
      >
        <Specimen
          name="On a light ground"
          code=".btn  .btn-secondary"
          note="The arrow is drawn by the class. On hover the fill eases one step lighter and the arrow moves, the same way a text link arrow does. Nothing inverts."
        >
          <div className="flex flex-wrap items-center gap-4">
            <a href="#actions" className="btn">
              Enquire
            </a>
            <a href="#actions" className="btn btn-secondary">
              Compare
            </a>
          </div>
        </Specimen>
        <Specimen
          name="On a dark ground"
          code=".btn-yellow  .btn-on-photo"
          note="Yellow with black text, white, or an outline. Use one filled button in a group."
        >
          <div className="flex flex-wrap items-center gap-4 bg-off-black p-6 sm:p-8">
            <a href="#actions" className="btn btn-yellow">
              Enquire
            </a>
            <a href="#actions" className="btn btn-on-photo">
              Enquire
            </a>
            <a href="#actions" className="btn btn-secondary btn-on-photo">
              Compare
            </a>
          </div>
        </Specimen>
        <Specimen
          name="With an icon"
          code=".btn svg  .btn-no-arrow"
          note="An icon can sit before the label, with the arrow kept. Or it can sit after the label and take the place of the arrow."
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <a href="#actions" className="btn">
                <MailIcon />
                Enquire
              </a>
              <a href="#actions" className="btn btn-secondary">
                <PinIcon />
                Find a distributor
              </a>
              <a href="#actions" className="btn btn-secondary btn-no-arrow">
                Download spec sheet
                <DownloadIcon />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-off-black p-6 sm:p-8">
              <a href="#actions" className="btn btn-yellow">
                <MailIcon />
                Enquire
              </a>
              <a href="#actions" className="btn btn-secondary btn-on-photo btn-no-arrow">
                Download spec sheet
                <DownloadIcon />
              </a>
            </div>
          </div>
        </Specimen>
        <Specimen
          name="Text links"
          code="<TextLink>  .link-underline"
          note="A link that is not a button ends with an arrow. The arrow stays with the last word and moves on hover. Add the yellow underline where a link stands on its own. A link that leaves the site uses the north-east arrow and opens a new tab."
        >
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              <div>
                <p className="type-eyebrow mb-2 text-grey">Arrow only</p>
                <TextLink href="#actions" className="type-body font-semibold text-black">
                  View specifications
                </TextLink>
              </div>
              <div>
                <p className="type-eyebrow mb-2 text-grey">Yellow underline on hover</p>
                <TextLink href="#actions" className="link-underline type-body font-semibold text-black">
                  View specifications
                </TextLink>
              </div>
              <div>
                <p className="type-eyebrow mb-2 text-grey">Leaves the site</p>
                <span className="text-link link-underline type-body font-semibold text-black">
                  <ArrowText external>Leaves the site</ArrowText>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 bg-off-black p-6 sm:p-8">
              <TextLink href="#actions" className="link-underline type-body font-semibold text-white">
                View specifications
              </TextLink>
            </div>
          </div>
        </Specimen>
        <Rules
          items={[
            { rule: "No arrow on", detail: "Header navigation, the logo, breadcrumbs, the skip link, or a grinder card." },
            { rule: "Focus", detail: "A yellow outline with a black edge. On a dark ground the outline is white." },
            { rule: "Tap size", detail: "At least 44 pixels high. Add .tap to a text link that stands alone." },
            { rule: "Reduced motion", detail: "The arrow stays still and the fill changes at once." },
          ]}
        />
      </Chapter>

      <Chapter id="voice" eyebrow="Behaviour" title="Voice" intro="Confident and simple. British English.">
        <Rules
          items={[
            { rule: "Lead with the product", detail: "“The Supra 68 is a commercial espresso grinder. Flat burrs, 68 mm. Motor 550 W.”" },
            { rule: "Short sentences", detail: "One fact each. Technically assured, without filler." },
            { rule: "No hype", detail: "Do not use “unbeatable”, “the future of”, “café-quality” or “perform under pressure”." },
            { rule: "Punctuation", detail: "No em dashes in anything a visitor reads. Sentence case for titles." },
            { rule: "Unfinished content", detail: "Mark legal text and history as PLACEHOLDER. Mark unpublished figures as sample figures." },
          ]}
        />
      </Chapter>
    </article>
  );
}
