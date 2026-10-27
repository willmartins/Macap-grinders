import Image from "next/image";
import type { ReactNode } from "react";

import type { Figure } from "@/lib/specs";

export function BleedHero({
  imageUrl,
  alt,
  eyebrow,
  title,
  text,
  children,
  priority = true,
  short = false,
  focus = "center",
  figures,
  crumbs,
  product = false,
}: {
  imageUrl: string;
  alt: string;
  eyebrow?: string;
  title: string;
  text?: string;
  children?: ReactNode;
  priority?: boolean;
  short?: boolean;
  focus?: string;
  figures?: Figure[];
  crumbs?: ReactNode;
  product?: boolean;
}) {
  const heroClass = [short ? "hero-bleed hero-bleed-short" : "hero-bleed", product ? "product-hero" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <header data-hero="" className={heroClass}>
      {crumbs}
      <div className="hero-media">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: focus }}
        />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy frame">
        {eyebrow ? <p className="label text-white/80">{eyebrow}</p> : null}
        <h1 className={`${short ? "display-sm" : "display"} mt-4 max-w-6xl text-white`}>{title}</h1>
        {text ? <p className="hero-lead">{text}</p> : null}
        {figures && figures.length ? (
          <ul className="hero-figures" aria-label={product ? "Key figures" : undefined}>
            {figures.map((figure) => (
              <li key={figure.label}>
                <p className="label text-white/75">{figure.label}</p>
                <p className="stat mt-3 text-white">
                  {figure.value}
                  <span className="label ml-2 text-white/70">{figure.unit}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        {children ? <div className="hero-actions flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </header>
  );
}

export function SplitHero({
  homeImage,
  homeAlt,
  homeFocus,
  proImage,
  proAlt,
  proFocus,
}: {
  homeImage: string;
  homeAlt: string;
  homeFocus: string;
  proImage: string;
  proAlt: string;
  proFocus: string;
}) {
  return (
    <header data-hero="" className="split-hero">
      <a href="/home-grinders" className="split-panel">
        <Image
          src={homeImage}
          alt={homeAlt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: homeFocus }}
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-copy frame">
          <p className="label text-white/80">01  /  Home</p>
          <h1 className="display mt-4 text-white">For the home.</h1>
          <p className="hero-lead">Studio grinders for a domestic counter.</p>
          <p className="btn btn-on-photo mt-8 w-fit">Home grinders</p>
        </div>
      </a>
      <a href="/professional" className="split-panel">
        <Image
          src={proImage}
          alt={proAlt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: proFocus }}
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-copy frame">
          <p className="label text-white/80">02  /  Professional</p>
          <p className="display mt-4 text-white">For the bar.</p>
          <p className="hero-lead">Supra, Supra G, Pro and Leo.</p>
          <p className="btn btn-on-photo btn-secondary mt-8 w-fit">Professional</p>
        </div>
      </a>
    </header>
  );
}
