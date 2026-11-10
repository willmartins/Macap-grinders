import Image from "next/image";

import { TextLink } from "@/components/site/text-link";
import type { Grinder } from "@/lib/content/types";
import { focusFor } from "@/lib/imagery";

export function ProductOverview({
  grinder,
  videoUrl,
}: {
  grinder: Grinder;
  videoUrl?: string | null;
}) {
  const overviewImage =
    grinder.gallery && grinder.gallery.length > 0
      ? grinder.gallery[0]
      : grinder.imageUrl
        ? { url: grinder.imageUrl, alt: grinder.imageAlt || grinder.name }
        : null;

  const downloadHref = grinder.catalogueUrl || "#specifications";

  const marqueePhrases = [
    "PRECISION BURR GEOMETRY",
    "STEPLESS MICROMETRIC CALIBRATION",
    "HIGH-TORQUE INDUCTION DRIVE",
    "HAND-ASSEMBLED IN VENICE SINCE 1930",
    "100% ITALIAN COMPONENTS",
    "ZERO-RETENTION ANTI-STATIC CHUTE",
    "RAPID BURR CHAMBER ACCESS",
  ];
  const marqueeString = `${marqueePhrases.join("  +  ")}  +  `;

  return (
    <section className="section bg-white border-b border-silver overflow-hidden !pb-0" aria-labelledby="overview-heading">
      <div className="frame">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14 lg:gap-20 pb-12 sm:pb-16">
          {/* Left Column: 4:5 Aspect Ratio supporting Video with Image backup */}
          <div className="md:col-span-6 lg:col-span-5 relative">
            {/* Spinning Circular Text Emblem: "Made in Venice - Shaping Coffee" */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center p-1.5 select-none pointer-events-none">
              <svg viewBox="0 0 100 100" className="h-full w-full motion-safe:animate-[spin_60s_linear_infinite]">
                <defs>
                  <path
                    id="circleTextPath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                </defs>
                <text fill="currentColor" fontSize="8.2" fontWeight="600" letterSpacing="0.16em">
                  <textPath href="#circleTextPath" startOffset="0%">
                    MADE IN VENICE • SHAPING COFFEE •
                  </textPath>
                </text>
              </svg>

              {/* Center emblem icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow text-xs font-mono font-bold tracking-tight">1930</span>
              </div>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden border border-silver bg-silver">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  poster={overviewImage?.url || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : overviewImage?.url ? (
                <Image
                  src={overviewImage.url}
                  alt={overviewImage.alt || grinder.name}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 92vw"
                  className="object-cover"
                  style={{ objectPosition: focusFor(overviewImage.url) }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-center text-grey">
                  Photography to follow
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Impact Title, Single Short Paragraph, and Spec Download Button */}
          <div className="flex flex-col justify-center md:col-span-6 lg:col-span-7">
            <h2 id="overview-heading" className="type-h2 text-black">
              Engineered in Venice for espresso consistency.
            </h2>

            {/* Single Short Paragraph as requested */}
            <p className="type-lead mt-6 text-grey max-w-2xl">
              Conceived for busy bars and specialty coffee programmes, the {grinder.name} unites precision Italian
              burrs with micrometric calibration and robust thermal control. It preserves dialled-in recipes dose after dose,
              minimising waste and ensuring uniform particle distribution throughout daily service.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href={downloadHref}
                className="btn"
                data-analytics="download"
                data-slug={grinder.slug}
                {...(grinder.catalogueUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Download spec sheet
              </a>
              <TextLink href="#specifications" className="type-body font-semibold text-black link-underline">
                View specifications table
              </TextLink>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Technical Monospace Marquee across the bottom */}
      <div className="w-full border-t border-silver bg-white/80 py-3.5 overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes overview-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .overview-marquee-track {
                display: flex;
                width: max-content;
                animation: overview-marquee 75s linear infinite;
              }
              .overview-marquee-track:hover {
                animation-play-state: paused;
              }
              @media (prefers-reduced-motion: reduce) {
                .overview-marquee-track {
                  animation: none;
                }
              }
            `,
          }}
        />
        <div className="overview-marquee-track whitespace-nowrap font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-grey select-none">
          <span className="px-4">{marqueeString}</span>
          <span className="px-4">{marqueeString}</span>
        </div>
      </div>
    </section>
  );
}
