"use client";

import { useEffect, useRef } from "react";

import type { FaqItem } from "@/lib/content/types";

/**
 * Questions and answers as disclosure elements, divided by hairlines.
 * They render open, so the answers are in the page without scripts.
 * Below the side-by-side layout (1024px) they close on load to keep the page short.
 * `collapsed` starts them all closed at every width, as on a knowledge article.
 * The answers stay in the HTML either way, so search and answer engines still read them.
 */
export function FaqList({ faqs, collapsed = false }: { faqs: FaqItem[]; collapsed?: boolean }) {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapsed || window.matchMedia("(min-width: 1024px)").matches) return;
    list.current?.querySelectorAll("details").forEach((item) => {
      item.open = false;
    });
  }, [collapsed]);

  return (
    <div ref={list} className="divide-y divide-silver border-y border-silver">
      {faqs.map((faq) => (
        <details key={faq._key} open={!collapsed} className="group">
          <summary className="cursor-pointer justify-between gap-6 py-4">
            <h3 className="type-body font-semibold text-black">{faq.question}</h3>
            <span className="shrink-0 type-lead leading-none text-grey" aria-hidden="true">
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
