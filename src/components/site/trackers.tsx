"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

export function ClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (link.dataset.analytics === "journey") {
        trackEvent({
          name: "journey_step_click",
          props: {
            journey: link.dataset.journey || "",
            step: link.dataset.step || link.textContent?.trim() || "",
            href,
          },
        });
      }
      if (link.dataset.analytics === "download" || href.toLowerCase().includes(".pdf")) {
        trackEvent({
          name: "catalogue_download",
          props: { slug: link.dataset.slug || "", label: link.textContent?.trim() || "" },
        });
      }
      if (href.startsWith("mailto:")) {
        trackEvent({ name: "contact_click", props: { kind: "email", href } });
      }
      if (href.startsWith("tel:")) {
        trackEvent({ name: "contact_click", props: { kind: "phone", href } });
      }
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin && url.protocol.startsWith("http")) {
          trackEvent({ name: "outbound_click", props: { href: url.toString() } });
        }
      } catch {
        /* Ignore empty or hash links. */
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

export function TrackGrinderView({
  slug,
  name,
  audience,
}: {
  slug: string;
  name: string;
  audience: string;
}) {
  useEffect(() => {
    trackEvent({ name: "grinder_viewed", props: { slug, name, audience } });
  }, [slug, name, audience]);
  return null;
}

export function TrackCompare({ models }: { models: string }) {
  useEffect(() => {
    const count = models.split(",").filter(Boolean).length;
    if (count < 2) return;
    trackEvent({ name: "compare_tool_used", props: { models, count } });
  }, [models]);
  return null;
}
