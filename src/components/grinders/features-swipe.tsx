"use client";

import { useEffect, useRef, useState } from "react";

import { FeatureCard, type FeatureCardItem } from "@/components/site/feature-card";
import type { Grinder } from "@/lib/content/types";
import { pageShots } from "@/lib/imagery";

/** Kept for callers that used the old name. */
export type ProductFeatureItem = FeatureCardItem;

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
    <section className="section border-b border-silver bg-white" aria-labelledby="features-heading">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {/* Desktop Section Heading */}
            <div className="hidden sm:block">
              <p className="type-eyebrow text-grey mb-2.5">Engineering</p>
              <h2 id="features-heading" className="type-h2 text-black">
                Engineered features & technology
              </h2>
            </div>

            {/* Mobile: Eyebrow + Dynamic active card title outside the cards */}
            <div className="sm:hidden min-h-[4.25rem] flex flex-col justify-end">
              <p className="type-eyebrow text-grey">
                Features & technology
              </p>
              <h2 className="mt-1.5 type-h3 text-black transition-all duration-200">
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
              className="flex h-11 w-11 items-center justify-center border border-silver bg-white text-black hover:border-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={activeIndex === features.length - 1}
              aria-label="Next feature"
              className="flex h-11 w-11 items-center justify-center border border-silver bg-white text-black hover:border-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
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
          {features.map((feature) => (
            <FeatureCard
              key={feature._key}
              feature={feature}
              titleFromSm
              className="flex-none w-[85vw] sm:w-[22rem] md:w-[26rem] snap-start"
            />
          ))}
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
                  isCurrent ? "w-8 bg-black" : "w-3 bg-silver hover:bg-grey"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
