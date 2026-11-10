import Image from "next/image";

import { TextLink } from "@/components/site/text-link";

export type FeatureIconName = "burrs" | "motor" | "dial" | "screen" | "scale" | "cooling";

export type FeatureCardItem = {
  _key: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  imageAlt?: string;
  icon?: FeatureIconName | null;
  /** Ground behind the icon. Defaults to a light tint. */
  containerBg?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
};

export function FeatureIcon({ type }: { type: FeatureIconName }) {
  switch (type) {
    case "burrs":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
        </svg>
      );
    case "motor":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "dial":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3M8 12a4 4 0 018 0" strokeLinecap="round" />
        </svg>
      );
    case "screen":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
      );
    case "scale":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 3v18M6 8l6-3 6 3M6 8l-3 6h6L6 8zM18 8l-3 6h6l-3-6z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cooling":
      return (
        <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Feature card. The variant follows the content:
 * - Image card: image, title, body and an optional link.
 * - Icon card: icon on a colour ground, title, body and an optional link.
 * - Text only card: title, body and an optional link, on the dark surface.
 *
 * `className` carries the width, so a carousel and a grid can both use it.
 * `titleFromSm` hides the title on phones, for a carousel that prints the active title above the row.
 */
export function FeatureCard({
  feature,
  className = "",
  titleFromSm = false,
}: {
  feature: FeatureCardItem;
  className?: string;
  titleFromSm?: boolean;
}) {
  const hasImage = Boolean(feature.imageUrl);
  const hasIcon = !hasImage && Boolean(feature.icon);
  const titleShown = titleFromSm ? "hidden sm:block" : "block";

  if (!hasImage && !hasIcon) {
    return (
      <article
        className={`relative flex flex-col justify-between overflow-hidden border border-silver bg-off-black p-7 text-white transition-all hover:border-yellow md:p-8 ${className}`.trim()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow" />

        <div>
          <div className="flex items-center">
            <span className="inline-block border border-white/15 bg-white/5 px-2.5 py-1 type-eyebrow text-yellow">
              Key Technology
            </span>
          </div>

          <h3 className={`${titleShown} mt-8 type-h3 text-white`}>{feature.title}</h3>

          <p className="mt-4 type-body text-white/75">{feature.text}</p>
        </div>

        {feature.buttonHref && feature.buttonLabel ? (
          <div className="mt-6 border-t border-white/10 pt-4">
            <TextLink href={feature.buttonHref} className="type-body font-semibold text-white hover:text-yellow">
              {feature.buttonLabel}
            </TextLink>
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={`flex flex-col justify-between border border-silver bg-white p-6 transition-all hover:border-black sm:p-7 ${className}`.trim()}
    >
      <div>
        {hasImage ? (
          <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden border border-silver bg-silver">
            <Image
              src={feature.imageUrl!}
              alt={feature.imageAlt || feature.title}
              fill
              sizes="(min-width: 768px) 26rem, 85vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="relative mb-5 flex aspect-[16/10] w-full items-center justify-center overflow-hidden border border-silver transition-colors"
            style={{ backgroundColor: feature.containerBg || "rgba(0,0,0,0.04)" }}
          >
            <div className="flex h-16 w-16 items-center justify-center border border-silver bg-white">
              <FeatureIcon type={feature.icon!} />
            </div>
          </div>
        )}

        <h3 className={`${titleShown} type-h3 text-black`}>{feature.title}</h3>

        <p className="mt-3 type-body text-grey">{feature.text}</p>
      </div>

      {feature.buttonHref && feature.buttonLabel ? (
        <div className="mt-6 border-t border-silver pt-4">
          <TextLink
            href={feature.buttonHref}
            className="type-body font-semibold text-black link-underline"
          >
            {feature.buttonLabel}
          </TextLink>
        </div>
      ) : null}
    </article>
  );
}
