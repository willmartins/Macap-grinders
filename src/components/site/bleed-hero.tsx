import Image from "next/image";
import type { ReactNode } from "react";

export function BleedHero({
  imageUrl,
  alt,
  eyebrow,
  title,
  text,
  children,
  priority = true,
  short = false,
}: {
  imageUrl: string;
  alt: string;
  eyebrow?: string;
  title: string;
  text?: string;
  children?: ReactNode;
  priority?: boolean;
  short?: boolean;
}) {
  return (
    <header className={short ? "hero-bleed hero-bleed-short" : "hero-bleed"}>
      <div className="hero-media">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover media-img"
        />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy frame">
        {eyebrow ? <p className="label text-white/80">{eyebrow}</p> : null}
        <h1 className={`${short ? "display-sm" : "display"} mt-4 max-w-5xl text-white`}>{title}</h1>
        {text ? <p className="hero-lead">{text}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </header>
  );
}
