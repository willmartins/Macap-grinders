"use client";

import { track } from "@vercel/analytics";

export const consentKey = "macap-cookie-consent";

export type AnalyticsEvent =
  | { name: "contact_form_submit"; props: { status: "success" | "error" } }
  | { name: "compare_tool_used"; props: { models: string; count: number } }
  | { name: "grinder_viewed"; props: { slug: string; name: string; audience: string } }
  | { name: "journey_step_click"; props: { journey: string; step: string; href: string } }
  | {
      name: "grinder_filter";
      props: { audience: string; group: string; burr: string; grind: string; status: string };
    }
  | { name: "catalogue_download"; props: { slug: string; label: string } }
  | { name: "outbound_click"; props: { href: string } }
  | { name: "contact_click"; props: { kind: "email" | "phone"; href: string } };

type Props = Record<string, string | number | boolean | null>;

export function consentGranted(): boolean {
  try {
    return window.localStorage.getItem(consentKey) === "granted";
  } catch {
    return false;
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  const props = event.props as Props;
  track(event.name, props);
  if (process.env.NEXT_PUBLIC_GTM_ID && window.dataLayer) {
    window.dataLayer.push({ event: event.name, ...props });
  }
  if (consentGranted() && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", event.name, props);
  }
}

export function updateConsent(value: "granted" | "denied"): void {
  try {
    window.localStorage.setItem(consentKey, value);
  } catch {
    /* Storage can be blocked. The choice still applies for this page view. */
  }
  window.gtag?.("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}
