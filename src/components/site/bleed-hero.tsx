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
  focus = "center",
  figures,
  crumbs,
  product = false,
  blur = null,
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
  blur?: string | null;
}) {
  if (product) {
    return (
      <header className="model-hero">
        <div className="model-hero-media">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur || undefined}
            className="object-cover"
            style={{ objectPosition: focus }}
          />
        </div>
        <div className="model-hero-scrim" aria-hidden="true" />
        <div className="model-hero-copy frame">
          {crumbs}
          {eyebrow ? <p className="type-eyebrow text-white/80">{eyebrow}</p> : null}
          <h1 className="type-display mt-3 max-w-5xl text-white">{title}</h1>
          {text ? <p className="type-lead mt-3 max-w-xl text-white/85">{text}</p> : null}
          {figures && figures.length ? (
            <ul className="model-hero-figures" aria-label="Key figures">
              {figures.map((figure) => (
                <li key={figure.label}>
                  <p className="type-eyebrow text-white/60">{figure.label}</p>
                  <p className="type-h3 mt-1.5 whitespace-nowrap text-white tabular-nums">
                    {figure.value}
                    <span className="ml-1 text-sm font-normal text-white/70">{figure.unit}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          {children ? <div className="model-hero-actions flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </header>
    );
  }

  return (
    <header className="stage border-b border-silver">
      <div className="frame stage-grid">
        <div className="stage-copy">
          {crumbs}
          {eyebrow ? <p className="type-eyebrow mt-4 text-grey">{eyebrow}</p> : null}
          <h1 className="type-h1 mt-3 max-w-xl text-black">{title}</h1>
          {text ? <p className="type-lead mt-5 max-w-xl text-grey">{text}</p> : null}
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        <figure className="stage-media">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 900px) 36rem, 100vw"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur || undefined}
            className="object-cover"
            style={{ objectPosition: focus }}
          />
        </figure>
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
    <header className="home-choice border-b border-silver">
      <div className="frame">
        <p className="type-eyebrow text-grey">Macap, since 1930</p>
        <h1 className="type-h1 mt-3 max-w-3xl text-black">Coffee grinders for the counter and the bar.</h1>
      </div>
      {/* Two choices on one hairline grid. The silver gap draws the rule between them. */}
      <div className="frame mt-[var(--gap-block)] grid items-stretch gap-px border border-silver bg-silver md:grid-cols-2">
        <a href="/home-grinders" className="choice-card">
          <p className="type-h2 max-w-[10ch] text-black">For the home.</p>
          <p className="type-lead max-w-[22rem] text-grey md:min-h-[3.4rem]">Studio grinders for a domestic counter.</p>
          <p className="btn w-fit">Home grinders</p>
          <figure className="choice-frame">
            <Image
              src={homeImage}
              alt={homeAlt}
              fill
              priority
              sizes="(min-width: 768px) 36rem, 100vw"
              className="object-cover"
              style={{ objectPosition: homeFocus }}
            />
          </figure>
        </a>
        <a href="/professional" className="choice-card">
          <p className="type-h2 max-w-[10ch] text-black">For the bar.</p>
          <p className="type-lead max-w-[22rem] text-grey md:min-h-[3.4rem]">Supra, Supra G, Pro and Leo.</p>
          <p className="btn btn-secondary w-fit">Professional</p>
          <figure className="choice-frame">
            <Image
              src={proImage}
              alt={proAlt}
              fill
              priority
              sizes="(min-width: 768px) 36rem, 100vw"
              className="object-cover"
              style={{ objectPosition: proFocus }}
            />
          </figure>
        </a>
      </div>
    </header>
  );
}
