import Image from "next/image";

import { GalleryDrift } from "@/components/grinders/gallery-drift";
import { SectionHeader } from "@/components/site/section-header";
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

  // Repeat the set so the phone row can drift and wrap without a jump
  const marqueeImages = [...validImages, ...validImages, ...validImages];

  return (
    <section className="section border-b border-line bg-white overflow-hidden" aria-labelledby="gallery-heading">
      <div className="frame">
        <SectionHeader
          id="gallery-heading"
          eyebrow="Gallery"
          title="Workshop & detail photography"
          description={`Craftsmanship and materials of the ${modelName}, photographed in Venice.`}
        />

        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (>= md): Consistent height, real image aspect ratios       */}
        {/* ========================================================================= */}
        <div className="mt-8 hidden md:flex items-center gap-5 h-[24rem] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {validImages.map((img) => {
            const ratio = parseSanityRatio(img.url);
            return (
              <div
                key={img._key}
                className="relative h-full overflow-hidden border border-line bg-plinth flex-none group transition-colors duration-300 hover:border-fg"
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
      <div className="mt-6 py-2 md:hidden">
        <GalleryDrift setSize={validImages.length} label={`${modelName} photographs`}>
          {marqueeImages.map((img, index) => {
            const ratio = parseSanityRatio(img.url);
            const repeat = index >= validImages.length;
            return (
              <div
                key={`${img._key}-${index}`}
                className="relative h-64 flex-none overflow-hidden border border-line bg-plinth"
                style={{ aspectRatio: `${ratio}` }}
                aria-hidden={repeat ? true : undefined}
              >
                <Image
                  src={img.url!}
                  alt={repeat ? "" : img.alt || modelName}
                  fill
                  sizes="75vw"
                  className="object-cover"
                  style={{ objectPosition: focusFor(img.url!) }}
                />
              </div>
            );
          })}
        </GalleryDrift>
        <p className="mt-3 text-center type-eyebrow text-muted">Swipe to see more</p>
      </div>
    </section>
  );
}
