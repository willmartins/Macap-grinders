"use client";

import { useEffect, useRef } from "react";

import type { FaqItem } from "@/lib/content/types";

/**
 * Questions and answers as disclosure elements, divided by hairlines.
 * They render open, so the answers are in the page without scripts.
 * Below the side-by-side layout (1024px) they close on load to keep the page short.
 */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    list.current?.querySelectorAll("details").forEach((item) => {
      item.open = false;
    });
  }, []);

  return (
    <div ref={list} className="divide-y divide-silver border-y border-silver">
      {faqs.map((faq) => (
        <details key={faq._key} open className="group">
          <summary className="cursor-pointer justify-between gap-6 py-4">
            <h3 className="text-base font-semibold leading-snug text-black">{faq.question}</h3>
            <span className="shrink-0 text-xl font-normal leading-none text-grey" aria-hidden="true">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className="max-w-prose pb-5 type-body text-grey">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
