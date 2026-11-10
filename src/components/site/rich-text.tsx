import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

import { TextLink } from "@/components/site/text-link";
import type { RichText } from "@/lib/content/types";
import { safeHref } from "@/lib/security";
import { imageUrl } from "@/sanity/lib/image";

/* Long reading is set at the Lead step, with a measure of about 65 characters. Headings in the body step down to Heading 3 and Lead weight 600. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="type-lead mt-5 max-w-prose text-black">{children}</p>,
    h2: ({ children }) => <h2 className="type-h3 mt-12 max-w-prose text-black">{children}</h2>,
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
    image: ({ value }) => {
      const source = value as { asset?: unknown; alt?: string } | undefined;
      const url = imageUrl(source, 1600);
      if (!url) return null;
      return (
        <figure className="mt-10 max-w-3xl">
          <div className="relative aspect-[16/10] bg-silver">
            <Image src={url} alt={source?.alt || ""} fill sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
          </div>
        </figure>
      );
    },
  },
};

export function RichTextBody({ value }: { value: RichText }) {
  if (!value.length) return null;
  return (
    <div className="prose-macap [&>:first-child]:mt-0">
      <PortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  );
}
