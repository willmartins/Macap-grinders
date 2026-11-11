import Image from "next/image";
import type { ReactNode } from "react";

import type { Figure } from "@/lib/specs";

export function ProductHero({
  imageUrl,
  alt,
  eyebrow,
  title,
  text,
  children,
  priority = true,
  figures,
  crumbs,
}: {
  imageUrl: string;
  alt: string;
  eyebrow?: string;
  title: string;
  text?: string;
  children?: ReactNode;
  priority?: boolean;
  figures?: Figure[];
  crumbs?: ReactNode;
}) {
  return (
    <header className="relative isolate grid [--hero-photo-w:min(66vw,calc((max(calc(100dvh-var(--chrome-h)),36rem)-2rem)*0.82))] [--hero-photo-right:max(calc(var(--frame-inset)+(100vw-2*var(--frame-inset))/4-var(--hero-photo-w)/2),calc(var(--hero-photo-w)*-0.2))] h-[max(calc(100dvh-var(--chrome-h)),36rem)] w-full grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden bg-off-black text-white wide:flex">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-radial-[circle_at_75%_50%] from-white/8 to-transparent to-65%"
        aria-hidden="true"
      />

      {/*
        One photograph for both layouts, so the browser fetches it once.

        Sizing rule: the grinder fills the height from just under the breadcrumb row down
        to its baseline, and is anchored to that baseline.
        - Stacked (portrait screens): the baseline is the divider above the figures. The
          photograph spans grid rows 2 and 3, so the title and lead sit over its lower
          body, and its height follows however much room the text takes. The -mb-6 drops
          the cut-out's clear space below the divider so the base itself meets it.
          The box is wider than the screen because the cut-outs carry clear space at the
          sides, so width does not limit it on a phone.
        - Side by side (landscape screens from 768px): the baseline is the foot of the hero,
          level with the buttons. The box is as wide as the photograph needs to fill that
          height (0.82 of it, the cut-outs' shape), up to two thirds of the screen. It is
          centred on the middle of the frame's right half, so the text has the left half
          and the grinder the right, at any width. It may run past the screen edge by up
          to a fifth of its width, which is only the cut-out's clear right margin. On a
          squarish screen it reaches over the text column, but only with the cut-out's
          clear left margin (about 15.6% of its width). The text column below is held to
          the space left of the grinder's body, so the lead and figures wrap rather than
          run under it.
        The cut-outs carry about 4% clear space under the base, which is the gap that remains.
      */}
      <div className="pointer-events-none relative z-0 col-start-1 row-start-2 row-end-4 -mx-[12vw] -mb-6 flex items-end justify-center wide:absolute wide:mb-0 wide:top-8 wide:right-[var(--hero-photo-right)] wide:bottom-[var(--consent-banner,0px)] wide:z-20 wide:mx-0 wide:w-[var(--hero-photo-w)]">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) and (orientation: landscape) 66vw, 124vw"
            className="object-contain object-bottom wide:drop-shadow-[0_25px_60px_var(--tw-drop-shadow-color)] wide:drop-shadow-black/85"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STACKED (portrait): grid rows are crumbs / photograph / title and lead / figures and buttons */}
      {/* ========================================================================= */}

      {/* Scrim, so the title and lead read over the photograph */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent wide:hidden"
        aria-hidden="true"
      />

      {/* Row 1: breadcrumbs and eyebrow */}
      <div className="relative z-30 col-start-1 row-start-1 flex items-center justify-between gap-3 px-[var(--frame-inset)] pt-4 wide:hidden">
        {crumbs}
        {eyebrow ? (
          <span className="shrink-0 border border-white/20 bg-black/40 px-2.5 py-1 type-eyebrow text-white/90 backdrop-blur-sm">
            {eyebrow}
          </span>
        ) : null}
      </div>

      {/* Row 3: title and lead, over the lower part of the grinder */}
      <div className="relative z-20 col-start-1 row-start-3 px-[var(--frame-inset)] pb-3 wide:hidden">
        <h1 className="type-display text-white drop-shadow-[0_2px_12px_var(--tw-drop-shadow-color)] drop-shadow-black/80">
          {title}
        </h1>

        {text ? (
          <p className="mt-2 type-body text-white/85 line-clamp-2 drop-shadow-[0_1px_8px_var(--tw-drop-shadow-color)] drop-shadow-black/70">
            {text}
          </p>
        ) : null}
      </div>

      {/* Row 4: figures and buttons. Clears the cookie banner while it shows. */}
      <div className="relative z-20 col-start-1 row-start-4 px-[var(--frame-inset)] pb-[calc(1.5rem+var(--consent-banner,0px))] md:pb-[calc(2rem+var(--consent-banner,0px))] wide:hidden">
        {/* Columns take the width of their figure, so a range does not run into its neighbour. */}
        {figures && figures.length > 0 ? (
          <ul
            className="flex flex-wrap justify-between gap-x-4 gap-y-2 border-t border-white/20 pt-2.5"
            aria-label="Key figures"
          >
            {figures.map((figure) => (
              <li key={figure.label}>
                <p className="type-eyebrow text-white/60">
                  {figure.label}
                </p>
                <p className="mt-0.5 type-h3 text-white tabular-nums whitespace-nowrap">
                  {figure.value}
                  <span className="ml-0.5 text-[0.55em] font-normal text-white/70">{figure.unit}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {children ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {children}
          </div>
        ) : null}
      </div>

      {/* ========================================================================= */}
      {/* SIDE BY SIDE (landscape from 768px): grinder sits on top of the divider line */}
      {/* ========================================================================= */}
      <div className="relative hidden h-full w-full flex-col justify-between pt-8 pb-[calc(2rem+var(--consent-banner,0px))] wide:flex">
        {/* Top bar: Breadcrumbs and Eyebrow */}
        <div className="frame relative z-30 flex items-center justify-between gap-4">
          {crumbs}
          {eyebrow ? (
            <span className="border border-white/20 bg-white/5 px-3.5 py-1.5 type-eyebrow text-white/80">
              {eyebrow}
            </span>
          ) : null}
        </div>

        {/* Lower Aligned Content Area */}
        <div className="relative z-10 mt-auto flex flex-col justify-end">
          {/* Massive Expressive Title (Dynamic clamp scale) */}
          <div className="frame">
            <h1 className="type-display text-white">
              {title}
            </h1>
          </div>

          {/* Full-width Horizon Divider Line (At z-10, so the grinder sits ON TOP of it!) */}
          <div className="relative z-10 my-6 w-full border-t border-white/20" />

          {/* Under Divider: Lead Copy, Stats, and Action Buttons */}
          <div className="frame relative z-30">
            <div className="grid grid-cols-12 gap-8 items-end">
              {/* Left Column: Lead and Buttons */}
              <div className="col-span-7 lg:col-span-6 flex flex-col justify-between pr-4 wide:max-w-[calc(100vw-var(--hero-photo-right)-var(--hero-photo-w)*0.844-var(--frame-inset)-2rem)]">
                {text ? (
                  <p className="type-lead text-white/85 max-w-xl">
                    {text}
                  </p>
                ) : null}

                {/* Performance Figures Bar. Columns take the width of their figure, so a range does not run into its neighbour. */}
                {figures && figures.length > 0 ? (
                  <ul
                    className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-4 lg:gap-x-12"
                    aria-label="Key figures"
                  >
                    {figures.map((figure) => (
                      <li key={figure.label}>
                        <p className="type-eyebrow text-white/60">
                          {figure.label}
                        </p>
                        <p className="mt-1.5 type-h3 text-white tabular-nums whitespace-nowrap">
                          {figure.value}
                          <span className="ml-1 text-[0.55em] font-normal text-white/70">{figure.unit}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Buttons */}
                {children ? (
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {children}
                  </div>
                ) : null}
              </div>

              {/* Right Column: Space reserved for grinder sitting on top */}
              <div className="col-span-5 lg:col-span-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
