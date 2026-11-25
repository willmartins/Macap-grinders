import Image from "next/image";

import { youtubeId } from "@/components/modules/page-builder";
import type { Grinder, LinkItem } from "@/lib/content/types";
import { performanceFigures } from "@/lib/specs";

/**
 * One grinder, featured on a dark band. The film leads when there is one and the
 * photograph sits beside it; without a film the photograph takes the whole column.
 * The figures come from the grinder, so they never drift from its specification.
 */
export function FeaturedGrinder({
  grinder,
  eyebrow,
  heading,
  text,
  videoUrl,
  link,
}: {
  grinder: Grinder;
  eyebrow?: string;
  heading: string;
  text?: string;
  videoUrl?: string | null;
  link: LinkItem;
}) {
  const video = videoUrl ? youtubeId(videoUrl) : null;
  const figures = performanceFigures(grinder).slice(0, 3);
  const photo = grinder.imageUrl;

  return (
    <div className="grid items-start gap-[var(--gap-block)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-[var(--gap-inner)]">
        {video ? (
          <div className="relative aspect-video overflow-hidden border border-white/15 bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}`}
              title={`${grinder.name} film`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}

        {photo ? (
          <figure
            className={`relative overflow-hidden border border-white/15 bg-white ${
              video ? "aspect-[4/3] w-full max-w-md" : "aspect-[16/10]"
            }`}
          >
            <Image
              src={photo}
              alt={grinder.imageAlt || grinder.name}
              fill
              sizes="(min-width: 1024px) 46rem, 92vw"
              className="object-contain p-6"
            />
          </figure>
        ) : (
          <p className="type-eyebrow text-white/60">Photography to follow</p>
        )}
      </div>

      <div>
        {eyebrow ? <p className="type-eyebrow text-white/70">{eyebrow}</p> : null}
        <h2 className="type-h2 mt-3 max-w-xl text-white">{heading}</h2>
        {text ? <p className="type-lead mt-5 max-w-md text-white/80">{text}</p> : null}

        {figures.length ? (
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-5">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt className="type-eyebrow text-white/60">{figure.label}</dt>
                <dd className="type-h3 mt-1.5 whitespace-nowrap text-white tabular-nums">
                  {figure.value}
                  <span className="ml-1 text-sm font-normal text-white/70">{figure.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="mt-8">
          <a href={link.href} className="btn btn-yellow">
            {link.label}
          </a>
        </p>
      </div>
    </div>
  );
}
