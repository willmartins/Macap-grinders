"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { TextLink } from "@/components/site/text-link";
import type { Grinder } from "@/lib/content/types";
import { pageShots } from "@/lib/imagery";

export type ProductFeatureItem = {
  _key: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  imageAlt?: string;
  icon?: "burrs" | "motor" | "dial" | "screen" | "scale" | "cooling" | null;
  containerBg?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
};

function FeatureIcon({ type }: { type: NonNullable<ProductFeatureItem["icon"]> }) {
  switch (type) {
    case "burrs":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
        </svg>
      );
    case "motor":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "dial":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3M8 12a4 4 0 018 0" strokeLinecap="round" />
        </svg>
      );
    case "screen":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
      );
    case "scale":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 3v18M6 8l6-3 6 3M6 8l-3 6h6L6 8zM18 8l-3 6h6l-3-6z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cooling":
      return (
        <svg className="h-10 w-10 text-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function buildGrinderFeatures(grinder: Grinder): ProductFeatureItem[] {
  const specs = grinder.specs;
  const items: ProductFeatureItem[] = [];

  // Card 1: Adjustment mechanism. Image card (image, title, body, optional link).
  items.push({
    _key: "feat-adjustment",
    title: "Micrometric Adjustment & Fast Opening",
    text: "Stepless micrometric ring gives continuous micron-level control over particle size, while the fast-opening system permits instant burr access without losing calibration.",
    imageUrl: pageShots.aboutDetail.src,
    imageAlt: pageShots.aboutDetail.alt,
    buttonLabel: "Read dialling-in guide",
    buttonHref: "/knowledge/dialling-in-with-less-waste",
  });

  // Card 2: Burrs. Image card (image, title, body, optional link).
  items.push({
    _key: "feat-burrs",
    title: `${specs.burrDiameterMm || 68} mm Precision Burrs`,
    text: `Machined from premium hardened tool steel in Italy to produce an unimodal particle distribution for superior espresso extraction clarity.`,
    imageUrl: pageShots.knowledgeHero.src,
    imageAlt: pageShots.knowledgeHero.alt,
    buttonLabel: "Explore burr geometries",
    buttonHref: "/knowledge/flat-burrs-and-conical-burrs",
  });

  // Card 3: Commercial Drive Motor (ICON VERSION WITH MATCHED IMAGE CONTAINER)
  if (specs.motorPowerW) {
    items.push({
      _key: "feat-motor",
      title: `${specs.motorPowerW} W Commercial Drive`,
      text: "Direct-drive induction motor engineered for constant rotational speed and thermal resistance under relentless continuous café service.",
      icon: "motor",
      containerBg: "#171719", // Customizable container background colour
    });
  } else {
    items.push({
      _key: "feat-motor-default",
      title: "High-Torque Induction Motor",
      text: "Low-RPM drive engineered to eliminate thermal bean expansion and preserve delicate aromatics during extended service rushes.",
      icon: "motor",
      containerBg: "#171719",
    });
  }

  // Card 4: Coffee Targeting System (HIGH-IMPACT TYPOGRAPHIC TREATMENT - NO 04 COUNTER)
  items.push({
    _key: "feat-targeting",
    title: "Coffee Targeting & Anti-Clumping System",
    text: "Engineered delivery fork with static dissipation geometry directs a uniform, fluffy dose directly into the centre of your portafilter basket without counter scatter.",
    imageUrl: null,
    icon: null, // Triggers bold typographic impact card!
  });

  return items;
}

export function FeaturesSwipe({ grinder }: { grinder: Grinder }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const features = buildGrinderFeatures(grinder);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 320;
    const gap = 24;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: still ? "auto" : "smooth",
    });
    setActiveIndex(index);
  };

  const scroll = (direction: "left" | "right") => {
    const next = direction === "left" ? Math.max(0, activeIndex - 1) : Math.min(features.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = el.firstElementChild?.clientWidth || 320;
      const gap = 24;
      const idx = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(features.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [features.length]);

  return (
    <section className="section border-b border-line bg-white" aria-labelledby="features-heading">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {/* Desktop Section Heading */}
            <div className="hidden sm:block">
              <p className="type-eyebrow text-muted mb-2.5">Engineering</p>
              <h2 id="features-heading" className="type-h2 text-fg">
                Engineered features & technology
              </h2>
            </div>

            {/* Mobile: Eyebrow + Dynamic active card title outside the cards */}
            <div className="sm:hidden min-h-[4.25rem] flex flex-col justify-end">
              <p className="type-eyebrow text-muted">
                Features & technology
              </p>
              <h2 className="mt-1.5 type-h3 text-fg transition-all duration-200">
                {features[activeIndex]?.title}
              </h2>
            </div>
          </div>

          {/* Swipe / Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={activeIndex === 0}
              aria-label="Previous feature"
              className="flex h-11 w-11 items-center justify-center border border-line bg-surface text-fg hover:border-fg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={activeIndex === features.length - 1}
              aria-label="Next feature"
              className="flex h-11 w-11 items-center justify-center border border-line bg-surface text-fg hover:border-fg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              →
            </button>
          </div>
        </div>

        {/* Swiping track - NO HORIZONTAL SCROLLBAR */}
        <div
          ref={scrollRef}
          className="mt-8 flex gap-6 overflow-x-auto pb-2 pt-2 snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Engineered features list"
        >
          {features.map((feature) => {
            const hasImage = Boolean(feature.imageUrl);
            const hasIcon = Boolean(feature.icon);
            const isHighImpactTypographic = !hasImage && !hasIcon;

            // VARIANT 3: NO IMAGE AND NO ICON -> High Impact Architectural Design
            if (isHighImpactTypographic) {
              return (
                <article
                  key={feature._key}
                  className="flex-none w-[85vw] sm:w-[22rem] md:w-[26rem] snap-start flex flex-col justify-between border border-line bg-surface-dark-elevated text-white p-7 md:p-8 relative overflow-hidden group hover:border-accent transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

                  <div>
                    <div className="flex items-center">
                      <span className="inline-block border border-white/15 bg-white/5 px-2.5 py-1 type-eyebrow text-accent">
                        Key Technology
                      </span>
                    </div>

                    <h3 className="hidden sm:block mt-8 type-h3 text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-4 type-body text-white/75">
                      {feature.text}
                    </p>
                  </div>

                  {feature.buttonHref && feature.buttonLabel ? (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <TextLink href={feature.buttonHref} className="type-body font-semibold text-white hover:text-accent">
                        {feature.buttonLabel}
                      </TextLink>
                    </div>
                  ) : null}
                </article>
              );
            }

            // VARIANT 1 (WITH REAL IMAGE) OR VARIANT 2 (WITH ICON MATCHING IMAGE CONTAINER)
            return (
              <article
                key={feature._key}
                className="flex-none w-[85vw] sm:w-[22rem] md:w-[26rem] snap-start flex flex-col justify-between border border-line bg-surface p-6 sm:p-7 transition-all hover:border-fg"
              >
                <div>
                  {/* Case 1: Image provided (from media library) */}
                  {hasImage ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-plinth mb-5">
                      <Image
                        src={feature.imageUrl!}
                        alt={feature.imageAlt || feature.title}
                        fill
                        sizes="(min-width: 768px) 26rem, 85vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  {/* Case 2: Icon provided -> Matched to image container with configurable background colour */}
                  {hasIcon ? (
                    <div
                      className="relative aspect-[16/10] w-full overflow-hidden border border-line mb-5 flex items-center justify-center transition-colors"
                      style={{ backgroundColor: feature.containerBg || "rgba(0,0,0,0.04)" }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center bg-surface border border-line">
                        <FeatureIcon type={feature.icon!} />
                      </div>
                    </div>
                  ) : null}

                  <h3 className="hidden sm:block type-h3 text-fg">
                    {feature.title}
                  </h3>

                  <p className="mt-3 type-body text-muted">
                    {feature.text}
                  </p>
                </div>

                {feature.buttonHref && feature.buttonLabel ? (
                  <div className="mt-6 pt-4 border-t border-line">
                    <TextLink href={feature.buttonHref} className="type-body font-semibold text-fg hover:shadow-[inset_0_-1px_0_var(--accent)]">
                      {feature.buttonLabel}
                    </TextLink>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* Carousel Bar Indicators */}
        <div className="mt-6 flex justify-center items-center gap-2" role="tablist" aria-label="Feature slides">
          {features.map((feature, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={feature._key}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => scrollToIndex(idx)}
                className={`transition-all duration-300 h-1.5 ${
                  isCurrent ? "w-8 bg-fg" : "w-3 bg-line hover:bg-muted"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
