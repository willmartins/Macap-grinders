"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
    badgeBg: "bg-accent",
    badgeText: "text-black",
    badgeBorder: "border-amber-400",
    highlightBg: "bg-accent",
    highlightText: "text-black",
    cardBorder: "border-accent",
  },
  // Model 2: Sky Blue
  {
    id: "sky",
    badgeBg: "bg-sky-100 dark:bg-sky-950/80",
    badgeText: "text-sky-800 dark:text-sky-200",
    badgeBorder: "border-sky-300 dark:border-sky-700",
    highlightBg: "bg-sky-100 dark:bg-sky-900/60",
    highlightText: "text-sky-900 dark:text-sky-100",
    cardBorder: "border-sky-400/50",
  },
  // Model 3: Emerald Green
  {
    id: "emerald",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/80",
    badgeText: "text-emerald-800 dark:text-emerald-200",
    badgeBorder: "border-emerald-300 dark:border-emerald-700",
    highlightBg: "bg-emerald-100 dark:bg-emerald-900/60",
    highlightText: "text-emerald-900 dark:text-emerald-100",
    cardBorder: "border-emerald-400/50",
  },
  // Model 4: Violet
  {
    id: "violet",
    badgeBg: "bg-violet-100 dark:bg-violet-950/80",
    badgeText: "text-violet-800 dark:text-violet-200",
    badgeBorder: "border-violet-300 dark:border-violet-700",
    highlightBg: "bg-violet-100 dark:bg-violet-900/60",
    highlightText: "text-violet-900 dark:text-violet-100",
    cardBorder: "border-violet-400/50",
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
        <strong className="font-semibold text-fg mr-1.5">{prefix}</strong>
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
    <li className="flex items-start gap-3 border border-line bg-plinth/30 p-4 min-h-[4.5rem]">
      <span className="text-fg font-bold shrink-0 mt-0.5">→</span>
      <div className="type-body min-h-[1.5rem] w-full">
        {visibleText ? renderHighlightedText(visibleText, modelMap) : null}
        {isTypingActive && (
          <span
            className="inline-block w-1.5 h-4 ml-1 bg-accent animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </li>
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

  return (
    <section className="section border-b border-line bg-white" aria-labelledby="compare-heading">
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

        {/* 3 to 4 cards: horizontal snap swipe on mobile, grid on desktop */}
        <div className="mt-8 flex sm:grid gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-2 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Card 1: Current / Active Model (Brand Yellow Label) */}
          <div className="flex-none w-[78vw] sm:w-auto snap-start flex flex-col justify-between border-2 border-accent bg-surface p-5 sm:p-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-accent px-2.5 py-0.5 type-eyebrow text-black border border-amber-400">
                  This Model
                </span>
                <span className="type-eyebrow text-muted">{grinder.groupName || "Range"}</span>
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

              <h3 className="mt-4 type-h3 text-fg">{grinder.name}</h3>
              <p className="mt-1 text-xs text-muted line-clamp-2">{grinder.shortDescription}</p>

              {/* Compact 2-column Spec grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 border-y border-line py-3">
                <div>
                  <span className="type-eyebrow text-muted block">Burrs</span>
                  <span className="mt-0.5 font-mono text-fg text-xs truncate block">
                    {grinder.specs.burrDiameterMm ? `${grinder.specs.burrDiameterMm}mm ` : ""}
                    {grinder.specs.burrType || "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-muted block">Motor</span>
                  <span className="mt-0.5 font-mono text-fg text-xs block">
                    {grinder.specs.motorPowerW ? `${formatNumber(grinder.specs.motorPowerW)} W` : "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-muted block">Hopper</span>
                  <span className="mt-0.5 font-mono text-fg text-xs block">
                    {grinder.specs.hopperCapacityG ? `${formatNumber(grinder.specs.hopperCapacityG)} g` : "-"}
                  </span>
                </div>
                <div>
                  <span className="type-eyebrow text-muted block">Use</span>
                  <span className="mt-0.5 font-mono text-fg text-xs capitalize block">
                    {grinder.audience === "business" ? "Commercial Bar" : "Home Counter"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-line text-center">
              <span className="type-eyebrow text-muted">Currently viewing</span>
            </div>
          </div>

          {/* Cards 2..4: Comparison Models with Unique Palette Colours */}
          {comparisonModels.map((model, idx) => {
            const theme = THEMES[(idx + 1) % THEMES.length];
            return (
              <div
                key={model.slug}
                className={`flex-none w-[78vw] sm:w-auto snap-start flex flex-col justify-between border ${theme.cardBorder} bg-surface p-5 sm:p-6 transition-all hover:border-fg`}
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
                    <span className="type-eyebrow text-muted">{model.groupName || "Range"}</span>
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

                  <h3 className="mt-4 type-h3 text-fg">{model.name}</h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{model.shortDescription}</p>

                  {/* Compact 2-column Spec grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 border-y border-line py-3">
                    <div>
                      <span className="type-eyebrow text-muted block">Burrs</span>
                      <span className="mt-0.5 font-mono text-fg text-xs truncate block">
                        {model.burrDiameterMm ? `${model.burrDiameterMm}mm ` : ""}
                        {model.burrType || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-muted block">Motor</span>
                      <span className="mt-0.5 font-mono text-fg text-xs block">
                        {model.motorPowerW ? `${formatNumber(model.motorPowerW)} W` : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-muted block">Grind</span>
                      <span className="mt-0.5 font-mono text-fg text-xs capitalize block">
                        {model.grindType || "Espresso"}
                      </span>
                    </div>
                    <div>
                      <span className="type-eyebrow text-muted block">Use</span>
                      <span className="mt-0.5 font-mono text-fg text-xs capitalize block">
                        {model.audience === "business" ? "Commercial Bar" : "Home Counter"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line text-center">
                  <TextLink
                    href={`/grinders/${model.slug}`}
                    className="type-body font-semibold text-fg hover:shadow-[inset_0_-1px_0_var(--accent)]"
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
            className="mt-10 border border-line bg-surface p-6 sm:p-8"
          >
            <h3 className="type-h3 text-fg mb-4">
              Key differences at a glance
            </h3>

            <ul className="grid gap-3 sm:grid-cols-2 text-muted">
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
    </section>
  );
}
