import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { ReactNode } from "react";

import { TextLink } from "@/components/site/text-link";
import type { RichText } from "@/lib/content/types";
import { safeHref } from "@/lib/security";
import { imageUrl } from "@/sanity/lib/image";

type Block = RichText[number];
type ImageValue = { asset?: unknown; alt?: string };

function plainText(block: Block): string {
  return (block.children || []).map((child) => child.text || "").join("");
}

/** An anchor for a heading, from its text. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** The Heading 2 sections of a body, for a contents list. */
export function bodySections(value: RichText): Array<{ id: string; text: string }> {
  return value
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => plainText(block))
    .filter(Boolean)
    .map((text) => ({ id: headingId(text), text }));
}

function childText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childText).join("");
  return "";
}

function BodyImage({ value, sizes }: { value: ImageValue; sizes: string }) {
  const url = imageUrl(value, 1600);
  if (!url) return null;
  return (
    <div className="relative aspect-[4/3] bg-silver">
      <Image src={url} alt={value.alt || ""} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/* Long reading is set at the Lead step, with a measure of about 65 characters. Headings in the body step down to Heading 3 and Lead weight 600. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="type-lead mt-5 max-w-prose text-black">{children}</p>,
    h2: ({ children }) => (
      <h2
        id={headingId(childText(children))}
        className="type-h3 mt-14 max-w-prose scroll-mt-[calc(var(--header-h,4.5rem)+1.5rem)] border-t border-silver pt-6 text-black"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="type-lead mt-8 max-w-prose font-semibold text-black">{children}</h3>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(typeof value?.href === "string" ? value.href : "");
      if (!href) return <>{children}</>;
      return (
        <TextLink href={href} className="underline decoration-silver underline-offset-4 hover:decoration-yellow">
          {children}
        </TextLink>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="mt-10 max-w-prose">
        <BodyImage value={value as ImageValue} sizes="(min-width: 768px) 42rem, 100vw" />
      </figure>
    ),
    // Two or more pictures in a row sit side by side, so a pair does not take two screens.
    imageRow: ({ value }) => {
      const images = (value as { images?: ImageValue[] }).images || [];
      return (
        <figure className="mt-10 grid max-w-prose grid-cols-2 gap-[var(--gap-inner)]">
          {images.map((image, index) => (
            <BodyImage key={index} value={image} sizes="(min-width: 768px) 21rem, 50vw" />
          ))}
        </figure>
      );
    },
  },
};

/** Groups consecutive images into one row. */
function withImageRows(value: RichText): RichText {
  const out: RichText = [];
  for (const block of value) {
    const previous = out[out.length - 1] as (Block & { images?: Block[] }) | undefined;
    if (block._type === "image" && previous?._type === "image") {
      out[out.length - 1] = { _type: "imageRow", _key: `${previous._key}-row`, images: [previous, block] } as Block;
      continue;
    }
    if (block._type === "image" && previous?._type === "imageRow" && previous.images && previous.images.length < 3) {
      previous.images.push(block);
      continue;
    }
    out.push(block);
  }
  return out;
}

export function RichTextBody({ value }: { value: RichText }) {
  if (!value.length) return null;
  return (
    <div className="prose-macap [&>:first-child]:mt-0">
      <PortableText value={withImageRows(value) as PortableTextBlock[]} components={components} />
    </div>
  );
}
