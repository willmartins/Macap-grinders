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
  blur = null,
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
  blur?: string | null;
}) {
  return (
    <header className="relative isolate flex h-[calc(100dvh-var(--chrome-h))] min-h-[calc(100dvh-var(--chrome-h))] w-full overflow-hidden bg-[#0c0c0c] text-white">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< md): Centered grinder, soft scrim, title overlaps grinder */}
      {/* ========================================================================= */}
      <div className="relative flex h-full w-full flex-col justify-between md:hidden">
        {/* Top Header Row on Mobile */}
        <div className="relative z-30 flex items-center justify-between gap-3 px-5 pt-4">
          {crumbs}
          {eyebrow ? (
            <span className="shrink-0 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase text-white/90 backdrop-blur-sm">
              {eyebrow}
            </span>
          ) : null}
        </div>

        {/* Centered Grinder Image on Mobile */}
        <div className="absolute inset-x-0 top-12 bottom-20 z-0 flex items-center justify-center p-4">
          <div className="relative h-full w-full max-h-[58vh]">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              sizes="100vw"
              placeholder={blur ? "blur" : "empty"}
              blurDataURL={blur || undefined}
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* Softened Gradient Scrim on Mobile (Gentle fade, not harsh black) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* Bottom Content Area on Mobile (Overlapping the lower part of the grinder) */}
        <div className="relative z-20 px-5 pb-6 pt-16">
          <h1 className="text-4xl font-semibold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {title}
          </h1>

          {text ? (
            <p className="mt-2 text-sm leading-snug text-white/85 line-clamp-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              {text}
            </p>
          ) : null}

          {/* Key Figures Row on Mobile */}
          {figures && figures.length > 0 ? (
            <ul
              className="mt-3 grid grid-cols-4 gap-2 border-t border-white/20 pt-2.5"
              aria-label="Key figures"
            >
              {figures.map((figure) => (
                <li key={figure.label}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                    {figure.label}
                  </p>
                  <p className="mt-0.5 text-base font-semibold tracking-tight text-white whitespace-nowrap">
                    {figure.value}
                    <span className="ml-0.5 text-[10px] font-normal text-white/70">{figure.unit}</span>
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
      <div className="relative hidden h-full w-full flex-col justify-between py-6 md:flex lg:py-8">
        {/* Top bar: Breadcrumbs and Eyebrow */}
        <div className="frame relative z-30 flex items-center justify-between gap-4">
          {crumbs}
          {eyebrow ? (
            <span className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wider uppercase text-white/80">
              {eyebrow}
            </span>
          ) : null}
        </div>

        {/* Grinder Showcase Image (Sitting ON TOP of the horizon divider line at z-20) */}
        <div className="pointer-events-none absolute right-[max(1.5rem,calc((100vw-90rem)/2))] top-10 bottom-8 z-20 w-[46vw] max-w-[42rem] flex items-center justify-center">
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              sizes="50vw"
              placeholder={blur ? "blur" : "empty"}
              blurDataURL={blur || undefined}
              className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>

        {/* Lower Aligned Content Area */}
        <div className="relative z-10 mt-auto flex flex-col justify-end">
          {/* Massive Expressive Title (Dynamic clamp scale) */}
          <div className="frame">
            <h1 className="text-[clamp(3.5rem,7vw,7.5rem)] font-semibold tracking-tight leading-[0.92] text-white">
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
                  <p className="text-lg md:text-xl font-normal leading-relaxed text-white/85 max-w-xl">
                    {text}
                  </p>
                ) : null}

                {/* Performance Figures Bar */}
                {figures && figures.length > 0 ? (
                  <ul
                    className="mt-6 grid grid-cols-4 gap-4 border-t border-white/20 pt-4"
                    aria-label="Key figures"
                  >
                    {figures.map((figure) => (
                      <li key={figure.label}>
                        <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                          {figure.label}
                        </p>
                        <p className="mt-1 text-2xl lg:text-3xl font-semibold tracking-tight text-white whitespace-nowrap">
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
