import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

import type { RichText } from "@/lib/content/types";
import { safeHref } from "@/lib/security";
import { imageUrl } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 max-w-2xl text-base leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 max-w-2xl text-2xl font-medium tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 max-w-2xl text-xl font-medium">{children}</h3>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(typeof value?.href === "string" ? value.href : "");
      if (!href) return <>{children}</>;
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="underline decoration-line underline-offset-4"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const source = value as { asset?: unknown; alt?: string } | undefined;
      const url = imageUrl(source, 1600);
      if (!url) return null;
      return (
        <figure className="mt-8 max-w-3xl">
          <div className="relative aspect-[16/10]">
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
    <div className="prose-macap">
      <PortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  );
}
