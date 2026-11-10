"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { compareHref, explainDifferences } from "@/lib/compare";
import type { Grinder, GrinderCard } from "@/lib/content/types";
import { formatNumber } from "@/lib/format";

type ModelColorTheme = {
  id: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder?: string;
  highlightBg: string;
  highlightText: string;
  cardBorder: string;
};

const THEMES: ModelColorTheme[] = [
  // Model 1 (Active/Current Model): Brand Yellow
  {
    id: "yellow",
    badgeBg: "bg-yellow",
    badgeText: "text-black",
    badgeBorder: "border-yellow",
    highlightBg: "bg-yellow",
    highlightText: "text-black",
    cardBorder: "border-yellow",
  },
  // Model 2: Sky Blue
  {
    id: "sky",
    badgeBg: "bg-light-sky",
    badgeText: "text-dark-sky",
    badgeBorder: "border-sky",
    highlightBg: "bg-light-sky",
    highlightText: "text-dark-sky",
    cardBorder: "border-sky",
  },
  // Model 3: Emerald Green
  {
    id: "emerald",
    badgeBg: "bg-light-emerald",
    badgeText: "text-dark-emerald",
    badgeBorder: "border-emerald",
    highlightBg: "bg-light-emerald",
    highlightText: "text-dark-emerald",
    cardBorder: "border-emerald",
  },
  // Model 4: Violet
  {
    id: "violet",
    badgeBg: "bg-light-violet",
    badgeText: "text-dark-violet",
    badgeBorder: "border-violet",
    highlightBg: "bg-light-violet",
    highlightText: "text-dark-violet",
    cardBorder: "border-violet",
  },
];

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(
  text: string,
  modelMap: Map<string, ModelColorTheme>,
): ReactNode {
  // Extract category prefix like "Burrs:", "Output:", "Capacity:"
  const match = text.match(/^([A-Za-z\s]+:)\s*(.*)$/);
  const prefix = match ? match[1] : "";
  const body = match ? match[2] : text;

  const modelNames = Array.from(modelMap.keys()).sort(
    (a, b) => b.length - a.length,
  );

  const parts = modelNames.length
    ? body.split(
        new RegExp(
          `(${modelNames.map((name) => escapeRegExp(name)).join("|")})`,
          "g",
        ),
      )
    : [body];

  return (
    <>
      {prefix ? (
        <strong className="font-semibold text-black mr-1.5">{prefix}</strong>
      ) : null}
      {parts.map((part, index) => {
        const theme = modelMap.get(part);
        if (theme) {
          return (
            <span
              key={index}
              className={`inline-block px-1.5 py-0.5 text-xs font-semibold mx-1 border ${
                theme.badgeBorder || "border-transparent"
              } ${theme.highlightBg} ${theme.highlightText} whitespace-nowrap align-baseline`}
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

function TypedDifferenceCard({
  note,
  status,
  onComplete,
  modelMap,
}: {
  note: string;
  status: "waiting" | "typing" | "completed";
  onComplete: () => void;
  modelMap: Map<string, ModelColorTheme>;
}) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (status !== "typing") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeoutId = setTimeout(() => {
        setDisplayedChars(note.length);
        onCompleteRef.current();
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    let charCount = 0;
    const interval = setInterval(() => {
      charCount += 1;
      setDisplayedChars(charCount);

      if (charCount >= note.length) {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteRef.current();
        }, 180);
      }
    }, 18);

    return () => {
      clearInterval(interval);
    };
  }, [status, note.length]);

  // If already completed previously, show entire note
  const visibleChars = status === "completed" ? note.length : status === "typing" ? displayedChars : 0;
  const isTypingActive = status === "typing" && displayedChars < note.length;
  const visibleText = note.slice(0, visibleChars);

  return (
    <li className="flex items-start gap-3 border border-silver bg-silver/30 p-4 min-h-[4.5rem]">
      <span className="text-black font-bold shrink-0 mt-0.5">→</span>
      <div className="type-body min-h-[1.5rem] w-full">
        {visibleText ? renderHighlightedText(visibleText, modelMap) : null}
        {isTypingActive && (
          <span
            className="inline-block w-1.5 h-4 ml-1 bg-yellow animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </li>
  );
}

type CompareColumn = {
  slug: string;
  name: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  current: boolean;
  theme: ModelColorTheme;
  values: string[];
};

const phoneRowLabels = ["Burrs", "Motor", "Grind", "Use"];

/** The same four rows for every model. A missing figure says so. Nothing is filled in. */
function phoneValues(model: {
  burrDiameterMm?: number | null;
  burrType?: string | null;
  motorPowerW?: number | null;
  grindType?: string | null;
  audience: string;
}): string[] {
  const burrs = [model.burrDiameterMm != null ? `${formatNumber(model.burrDiameterMm)} mm` : "", model.burrType || ""]
    .filter(Boolean)
    .join(" ");
  const grind = model.grindType === "both" ? "Espresso and filter" : model.grindType || "";
  return [
    burrs || "Not listed",
    model.motorPowerW != null ? `${formatNumber(model.motorPowerW)} W` : "Not listed",
    grind ? grind.charAt(0).toUpperCase() + grind.slice(1) : "Not listed",
    model.audience === "business" ? "Professional" : "Home",
  ];
}

/**
 * Phone comparison. Models are columns, so the figures sit side by side
 * and nothing has to be remembered between swipes. Each label has its own
 * line above its values, which leaves the full width for the columns.
 */
function PhoneCompareTable({ columns, caption }: { columns: CompareColumn[]; caption: string }) {
  // A row that no model has a figure for is left out.
  const rows = phoneRowLabels
    .map((label, index) => ({ label, index }))
    .filter(({ index }) => columns.some((column) => column.values[index] !== "Not listed"));
  return (
    <table className="w-full table-fixed border-collapse text-left sm:hidden">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.slug}
              scope="col"
              className={`border-t-2 px-1.5 pt-3 pb-4 align-top font-normal first:pl-0 last:pr-0 ${
                column.current ? "border-yellow" : "border-silver"
              }`}
            >
              {column.imageUrl ? (
                <div className="relative h-24 w-full">
                  <Image
                    src={column.imageUrl}
                    alt={column.imageAlt || column.name}
                    fill
                    sizes="33vw"
                    className="object-contain"
                  />
                </div>
              ) : null}
              <span
                className={`mt-3 inline-block border px-1.5 py-0.5 text-xs font-semibold ${
                  column.theme.badgeBorder || "border-transparent"
                } ${column.theme.highlightBg} ${column.theme.highlightText}`}
              >
                {column.name}
              </span>
              <span className="mt-1.5 block type-eyebrow text-grey">{column.current ? "This model" : "\u00a0"}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ label, index: row }) => (
          <Fragment key={label}>
            <tr className="border-t border-silver">
              <th scope="rowgroup" colSpan={columns.length} className="pt-3 type-eyebrow text-grey">
                {label}
              </th>
            </tr>
            <tr>
              {columns.map((column) => (
                <td key={column.slug} className="px-1.5 pt-1 pb-3 align-top type-mono text-black first:pl-0 last:pr-0">
                  {column.values[row]}
                </td>
              ))}
            </tr>
          </Fragment>
        ))}
        <tr className="border-y border-silver">
          {columns.map((column) => (
            <td key={column.slug} className="px-1.5 py-1 align-top first:pl-0 last:pr-0">
              {column.current ? null : (
                <TextLink
                  href={`/grinders/${column.slug}`}
                  aria-label={`View ${column.name}`}
                  className="inline-block py-3 text-sm font-semibold text-black"
                >
                  View
                </TextLink>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export function CompareSection({
  grinder,
  siblings,
  allGrinders,
}: {
  grinder: Grinder;
  siblings: GrinderCard[];
  allGrinders?: GrinderCard[];
}) {
  const diffSectionRef = useRef<HTMLDivElement>(null);
  const [diffInView, setDiffInView] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Candidate models to compare against
  const others = (siblings && siblings.length > 0 ? siblings : allGrinders || []).filter(
    (g) => g.slug !== grinder.slug,
  );

  // Take up to 3 comparison models to make 4 cards in total on big monitors
  const comparisonModels = others.slice(0, 3);

  // Observe viewport entry for the key differences cards
  useEffect(() => {
    const el = diffSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDiffInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (comparisonModels.length === 0) {
    return null;
  }

  // Build model theme map for text highlighting
  const modelThemeMap = new Map<string, ModelColorTheme>();
  modelThemeMap.set(grinder.name, THEMES[0]);
  comparisonModels.forEach((model, idx) => {
    const theme = THEMES[(idx + 1) % THEMES.length];
    modelThemeMap.set(model.name, theme);
  });

  // Generate full comparison link with all models shown
  const fullCompareHref = compareHref([
    grinder.slug,
    ...comparisonModels.map((m) => m.slug),
  ]);

  // Synthetic comparison notes
  const syntheticGrinders: Grinder[] = [
    grinder,
    ...comparisonModels.map((m) => ({
      ...grinder,
      id: m.id,
      name: m.name,
      slug: m.slug,
      audience: m.audience,
      status: m.status,
      shortDescription: m.shortDescription,
      groupName: m.groupName,
      groupSlug: m.groupSlug,
      burrDiameterMm: m.burrDiameterMm,
      burrType: m.burrType,
      grindType: m.grindType,
      motorPowerW: m.motorPowerW,
      imageUrl: m.imageUrl,
      imageAlt: m.imageAlt,
      specs: {
        ...grinder.specs,
        burrDiameterMm: m.burrDiameterMm,
        burrType: m.burrType,
        motorPowerW: m.motorPowerW,
        grindType: m.grindType,
      },
    })),
  ];

  const notes = explainDifferences(syntheticGrinders);

  // Phone table: this model and up to two others fit side by side at 375px.
  const phoneColumns: CompareColumn[] = [
    {
      slug: grinder.slug,
      name: grinder.name,
      imageUrl: grinder.imageUrl,
      imageAlt: grinder.imageAlt,
      current: true,
      theme: THEMES[0],
      values: phoneValues({ ...grinder.specs, audience: grinder.audience }),
    },
    ...comparisonModels.slice(0, 2).map((model, idx) => ({
      slug: model.slug,
      name: model.name,
      imageUrl: model.imageUrl,
      imageAlt: model.imageAlt,
      current: false,
      theme: THEMES[(idx + 1) % THEMES.length],
      values: phoneValues(model),
    })),
  ];

  return (
    <section className="section border-b border-silver bg-white" aria-labelledby="compare-heading">
      <div className="frame">
        <SectionHeader
          id="compare-heading"
          eyebrow="Comparison"
          title="Compare with other models"
          description="Evaluate key burr geometries and motor ratings across the Macap range."
          action={
            <a href={fullCompareHref} className="btn btn-secondary">
              Open full comparison tool
            </a>
          }
        />

        {/* Phone: differences first, then the table. From 640px: cards, then differences. */}
        <div className="mt-8 flex flex-col gap-8 sm:gap-10">
        <PhoneCompareTable columns={phoneColumns} caption={`${grinder.name} compared with other models`} />

        {/* 3 to 4 cards in a grid from 640px. The phone uses the table above. */}
        <div className="hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Card 1: Current / Active Model (Brand Yellow Label) */}
          <div className="flex flex-col justify-between border-2 border-yellow bg-white p-5 sm:p-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-yellow px-2.5 py-0.5 type-eyebrow text-black border border-yellow">
                  This Model
                </span>
                <span className="type-eyebrow text-grey">{grinder.groupName || "Range"}</span>
              </div>

              {grinder.imageUrl ? (
                <div className="relative mt-4 h-28 sm:h-36 w-full">
                  <Image
                    src={grinder.imageUrl}
                    alt={grinder.imageAlt || grinder.name}
                    fill
                    sizes="(min-width: 640px) 25vw, 75vw"
                    className="object-contain"
                  />
                </div>
              ) : null}

              <h3 className="mt-4 type-h3 text-black">{grinder.name}</h3>
              <p className="mt-1 text-xs text-grey line-clamp-2">{grinder.shortDescription}</p>

              {/* Compact 2-column Spec grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 border-y border-silver py-3">
                <div>
                  <span className="type-eyebrow text-grey block">Burrs</span>
                  <span className="mt-0.5 font-mono text-black text-xs truncate block">
                    {grinder.specs.burrDiameterMm ? `${grinder.specs.burrDiameterMm}mm ` : ""}
                    {grinder.specs.burrType || "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-grey block">Motor</span>
                  <span className="mt-0.5 font-mono text-black text-xs block">
                    {grinder.specs.motorPowerW ? `${formatNumber(grinder.specs.motorPowerW)} W` : "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-grey block">Hopper</span>
                  <span className="mt-0.5 font-mono text-black text-xs block">
                    {grinder.specs.hopperCapacityG ? `${formatNumber(grinder.specs.hopperCapacityG)} g` : "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-grey block">Use</span>
                  <span className="mt-0.5 font-mono text-black text-xs capitalize block">
                    {grinder.audience === "business" ? "Commercial Bar" : "Home Counter"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-silver text-center">
              <span className="type-eyebrow text-grey">Currently viewing</span>
            </div>
          </div>

          {/* Cards 2..4: Comparison Models with Unique Palette Colours */}
          {comparisonModels.map((model, idx) => {
            const theme = THEMES[(idx + 1) % THEMES.length];
            return (
              <div
                key={model.slug}
                className={`flex flex-col justify-between border ${theme.cardBorder} bg-white p-5 sm:p-6 transition-all hover:border-black`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 type-eyebrow border ${
                        theme.badgeBorder || ""
                      } ${theme.badgeBg} ${theme.badgeText}`}
                    >
                      {model.name}
                    </span>
                    <span className="type-eyebrow text-grey">{model.groupName || "Range"}</span>
                  </div>

                  {model.imageUrl ? (
                    <div className="relative mt-4 h-28 sm:h-36 w-full">
                      <Image
                        src={model.imageUrl}
                        alt={model.imageAlt || model.name}
                        fill
                        sizes="(min-width: 640px) 25vw, 75vw"
                        className="object-contain"
                      />
                    </div>
                  ) : null}

                  <h3 className="mt-4 type-h3 text-black">{model.name}</h3>
                  <p className="mt-1 text-xs text-grey line-clamp-2">{model.shortDescription}</p>

                  {/* Compact 2-column Spec grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 border-y border-silver py-3">
                    <div>
                      <span className="type-eyebrow text-grey block">Burrs</span>
                      <span className="mt-0.5 font-mono text-black text-xs truncate block">
                        {model.burrDiameterMm ? `${model.burrDiameterMm}mm ` : ""}
                        {model.burrType || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-grey block">Motor</span>
                      <span className="mt-0.5 font-mono text-black text-xs block">
                        {model.motorPowerW ? `${formatNumber(model.motorPowerW)} W` : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-grey block">Grind</span>
                      <span className="mt-0.5 font-mono text-black text-xs capitalize block">
                        {model.grindType || "Espresso"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-grey block">Use</span>
                      <span className="mt-0.5 font-mono text-black text-xs capitalize block">
                        {model.audience === "business" ? "Commercial Bar" : "Home Counter"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-silver text-center">
                  <TextLink
                    href={`/grinders/${model.slug}`}
                    className="type-body font-semibold text-black link-underline"
                  >
                    {`View ${model.name}`}
                  </TextLink>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgraded Key Differences with Sequential One-At-A-Time Typing Effect */}
        {notes.length > 0 && (
          <div
            ref={diffSectionRef}
            className="order-first border border-silver bg-white p-6 sm:order-none sm:p-8"
          >
            <h3 className="type-h3 text-black mb-4">
              Key differences at a glance
            </h3>

            <ul className="grid gap-3 sm:grid-cols-2 text-grey">
              {notes.map((note, idx) => {
                let cardStatus: "waiting" | "typing" | "completed" = "waiting";
                if (diffInView) {
                  if (idx < activeCardIndex) {
                    cardStatus = "completed";
                  } else if (idx === activeCardIndex) {
                    cardStatus = "typing";
                  } else {
                    cardStatus = "waiting";
                  }
                }

                return (
                  <TypedDifferenceCard
                    key={idx}
                    note={note}
                    status={cardStatus}
                    onComplete={() => setActiveCardIndex((prev) => prev + 1)}
                    modelMap={modelThemeMap}
                  />
                );
              })}
            </ul>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
