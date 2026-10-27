"use client";

import { useEffect, useId, useLayoutEffect, useState, useSyncExternalStore } from "react";

import { TextLink } from "@/components/site/text-link";
import { consentKey, updateConsent } from "@/lib/analytics";

const consentEvent = "macap-consent";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(consentEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(consentEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readConsent(): string | null {
  try {
    return window.localStorage.getItem(consentKey);
  } catch {
    return "denied";
  }
}

export function CookieConsent() {
  const titleId = useId();
  const choice = useSyncExternalStore(subscribe, readConsent, () => null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (choice != null) {
      root.style.removeProperty("--consent-banner");
      return;
    }
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    const apply = () => root.style.setProperty("--consent-banner", `${banner.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(banner);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-banner");
    };
  }, [choice]);

  useEffect(() => {
    function onOpen(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-cookie-settings]")) {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("click", onOpen);
    return () => document.removeEventListener("click", onOpen);
  }, []);

  function choose(value: "granted" | "denied") {
    updateConsent(value);
    window.dispatchEvent(new Event(consentEvent));
    setOpen(false);
  }

  const choices = (
    <div className="cookie-actions">
      <button type="button" className="btn" onClick={() => choose("granted")}>
        Accept
      </button>
      <button type="button" className="btn" onClick={() => choose("denied")}>
        Reject
      </button>
    </div>
  );

  return (
    <>
      {choice == null ? (
        <>
          <div aria-hidden="true" className="h-[var(--consent-banner,10rem)]" />
          <div id="cookie-banner" className="cookie-banner" role="region" aria-label="Cookies">
            <div className="cookie-bar frame">
              <p className="cookie-line">
                Analytics cookies stay off until you accept.{" "}
                <TextLink href="/legal/cookie-policy">Cookie policy</TextLink>
              </p>
              {choices}
            </div>
          </div>
        </>
      ) : null}
      {open && choice != null ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-4 md:place-items-center" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="grid w-full max-w-lg gap-4 border border-line bg-bg p-6 text-fg"
          >
            <p id={titleId} className="text-base font-medium">
              Cookies
            </p>
            <p className="max-w-xl text-sm leading-relaxed">
              Google Analytics stays off until you accept. Vercel analytics does not use cookies and runs either way.
              Advertising storage stays off.
            </p>
            <p className="text-sm">
              <TextLink href="/legal/cookie-policy">Cookie policy</TextLink>
            </p>
            {choices}
          </div>
        </div>
      ) : null}
    </>
  );
}
