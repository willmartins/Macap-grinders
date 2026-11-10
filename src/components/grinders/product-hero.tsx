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
    <header className="relative isolate flex h-[calc(100dvh-var(--chrome-h))] min-h-[calc(100dvh-var(--chrome-h))] w-full overflow-hidden bg-surface-dark text-white">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/*
        One photograph for both layouts, so the browser fetches it once.
        Phone: centred behind the copy, under the scrim.
        Desktop: on the right, in front of the divider line.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-12 bottom-20 z-0 flex items-center justify-center p-4 md:inset-x-auto md:right-[max(1.5rem,calc((100vw-90rem)/2))] md:top-10 md:bottom-8 md:z-20 md:w-[46vw] md:max-w-[42rem] md:p-0">
        <div className="relative h-full max-h-[58vh] w-full md:max-h-none">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 46vw, 100vw"
            className="object-contain object-center md:drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< md): Centered grinder, soft scrim, title overlaps grinder */}
      {/* ========================================================================= */}
      <div className="relative flex h-full w-full flex-col justify-between md:hidden">
        {/* Top Header Row on Mobile */}
        <div className="relative z-30 flex items-center justify-between gap-3 px-5 pt-4">
          {crumbs}
          {eyebrow ? (
            <span className="shrink-0 border border-white/20 bg-black/40 px-2.5 py-1 type-eyebrow text-white/90 backdrop-blur-sm">
              {eyebrow}
            </span>
          ) : null}
        </div>

        {/* Softened Gradient Scrim on Mobile (Gentle fade, not harsh black) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* Bottom Content Area on Mobile (Overlapping the lower part of the grinder). Clears the cookie banner while it shows. */}
        <div className="relative z-20 px-5 pb-[calc(1.5rem+var(--consent-banner,0px))] pt-16">
          <h1 className="type-display text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {title}
          </h1>

          {text ? (
            <p className="mt-2 type-body text-white/85 line-clamp-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              {text}
            </p>
          ) : null}

          {/* Key Figures Row on Mobile. Columns take the width of their figure, so a range does not run into its neighbour. */}
          {figures && figures.length > 0 ? (
            <ul
              className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-2 border-t border-white/20 pt-2.5"
              aria-label="Key figures"
            >
              {figures.map((figure) => (
                <li key={figure.label}>
                  <p className="type-eyebrow text-white/60">
                    {figure.label}
                  </p>
                  <p className="mt-0.5 text-lg font-semibold tracking-tight text-white tabular-nums whitespace-nowrap">
                    {figure.value}
                    <span className="ml-0.5 text-xs font-normal text-white/70">{figure.unit}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Action Buttons on Mobile */}
          {children ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {children}
            </div>
          ) : null}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= md): Grinder sits ON TOP of the grounding divider line */}
      {/* ========================================================================= */}
      <div className="relative hidden h-full w-full flex-col justify-between pt-6 pb-[calc(1.5rem+var(--consent-banner,0px))] md:flex lg:pt-8 lg:pb-[calc(2rem+var(--consent-banner,0px))]">
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
          <div className="relative z-10 my-5 md:my-6 w-full border-t border-white/20" />

          {/* Under Divider: Lead Copy, Stats, and Action Buttons */}
          <div className="frame relative z-30">
            <div className="grid grid-cols-12 gap-8 items-end">
              {/* Left Column: Lead and Buttons */}
              <div className="col-span-7 lg:col-span-6 flex flex-col justify-between pr-4">
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
                        <p className="mt-1.5 type-stat text-white whitespace-nowrap">
                          {figure.value}
                          <span className="ml-1 text-sm font-normal text-white/70">{figure.unit}</span>
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
