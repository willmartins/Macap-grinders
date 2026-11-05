import Image from "next/image";

import type { GalleryImage } from "@/lib/content/types";
import { focusFor } from "@/lib/imagery";

function parseSanityRatio(url: string | null): number {
  if (!url) return 1.333;
  const match = url.match(/-(\d+)x(\d+)(?:\.|\?)/);
  if (match) {
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    if (width > 0 && height > 0) {
      return Number((width / height).toFixed(3));
    }
  }
  return 1.333;
}

export function FlexibleGallery({
  gallery,
  modelName,
}: {
  gallery?: GalleryImage[];
  modelName: string;
}) {
  const validImages = (gallery || []).filter((img) => Boolean(img.url));

  // If no images available, do not use it
  if (validImages.length === 0) {
    return null;
  }

  // Duplicate images for infinite seamless loop on mobile
  const marqueeImages = [...validImages, ...validImages, ...validImages];

  return (
    <section className="section border-b border-line bg-white overflow-hidden" aria-labelledby="gallery-heading">
      {/* Inline styles for slow infinite auto-scrolling mobile marquee */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes gallery-marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-33.333333%); }
            }
            .mobile-gallery-marquee {
              display: flex;
              gap: 1rem;
              width: max-content;
              animation: gallery-marquee 75s linear infinite;
            }
            .mobile-gallery-marquee:hover,
            .mobile-gallery-marquee:active {
              animation-play-state: paused;
            }
          `,
        }}
      />

      <div className="frame">
        <div className="max-w-2xl">
          <h2 id="gallery-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Workshop & detail photography
          </h2>
          <p className="mt-2 text-muted text-sm sm:text-base">
            Craftsmanship and materials of the {modelName}, photographed in Venice.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (>= md): Consistent height, real image aspect ratios       */}
        {/* ========================================================================= */}
        <div className="mt-8 hidden md:flex items-center gap-5 h-[24rem] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {validImages.map((img) => {
            const ratio = parseSanityRatio(img.url);
            return (
              <div
                key={img._key}
                className="relative h-full overflow-hidden rounded-2xl border border-line bg-plinth shadow-sm flex-none group transition-transform duration-300 hover:border-fg/40"
                style={{ aspectRatio: `${ratio}` }}
              >
                <Image
                  src={img.url!}
                  alt={img.alt || modelName}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: focusFor(img.url!) }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< md): Consistent height, real aspect ratios, slower scroll */}
      {/* ========================================================================= */}
      <div className="mt-6 md:hidden overflow-hidden py-2" aria-label="Photo carousel">
        <div className="mobile-gallery-marquee cursor-grab active:cursor-grabbing px-4">
          {marqueeImages.map((img, index) => {
            const ratio = parseSanityRatio(img.url);
            return (
              <div
                key={`${img._key}-${index}`}
                className="relative h-64 flex-none overflow-hidden rounded-xl border border-line bg-plinth shadow-sm"
                style={{ aspectRatio: `${ratio}` }}
              >
                <Image
                  src={img.url!}
                  alt={img.alt || modelName}
                  fill
                  sizes="75vw"
                  className="object-cover"
                  style={{ objectPosition: focusFor(img.url!) }}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted">Touch to pause and explore</p>
      </div>
    </section>
  );
}
