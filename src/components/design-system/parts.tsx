import type { ReactNode } from "react";

/** One chapter of the design system page. The heading uses the same styles it documents. */
export function Chapter({
  id,
  eyebrow,
  title,
  intro,
  children,
  ground = "bg-white",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  ground?: string;
}) {
  return (
    <section id={id} className={`section border-b border-silver ${ground}`} aria-labelledby={`${id}-heading`}>
      <div className="frame">
        <div className="max-w-2xl">
          <p className="type-eyebrow mb-2.5 text-grey">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="type-h2 text-black">
            {title}
          </h2>
          {intro ? <p className="type-lead mt-3 text-grey">{intro}</p> : null}
        </div>
        <div className="mt-10 grid gap-12">{children}</div>
      </div>
    </section>
  );
}

/** A named example. A hairline and a label above it, with no frame around the example. */
export function Specimen({
  name,
  code,
  note,
  children,
}: {
  name: string;
  /** Class or component name, set in the mono face. */
  code?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-silver pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="type-eyebrow text-black">{name}</h3>
        {code ? <code className="type-mono text-grey">{code}</code> : null}
      </div>
      {note ? <p className="type-body mt-2 max-w-2xl text-grey">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function Swatch({
  name,
  hex,
  use,
}: {
  /** The colour name. Also the Tailwind name, as in bg-yellow. */
  name: string;
  hex: string;
  use: string;
}) {
  return (
    <li>
      <div className="h-20 w-full border border-silver" style={{ backgroundColor: hex }} />
      <p className="mt-3 font-semibold text-black">{name}</p>
      <p className="type-mono text-grey">{hex}</p>
      <p className="type-body mt-1 text-grey">{use}</p>
    </li>
  );
}

/** Short rules, one per hairline row. */
export function Rules({ items }: { items: Array<{ rule: string; detail: string }> }) {
  return (
    <dl className="max-w-3xl divide-y divide-silver border-y border-silver">
      {items.map((item) => (
        <div key={item.rule} className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
          <dt className="font-semibold text-black sm:col-span-4">{item.rule}</dt>
          <dd className="type-body text-grey sm:col-span-8">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
