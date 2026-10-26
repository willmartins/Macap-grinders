"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";

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

  const panel = (
    <div className="grid gap-4">
      <p id={titleId} className="text-base font-medium">
        Cookies
      </p>
      <p className="max-w-xl text-sm leading-relaxed">
        Google Analytics stays off until you accept. Vercel analytics does not use cookies and runs either way.
        Advertising storage stays off.
      </p>
      <p className="text-sm">
        <Link href="/legal/cookie-policy" className="underline underline-offset-4">
          Cookie policy
        </Link>
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={() => choose("granted")}>
          Accept analytics
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => choose("denied")}>
          Reject
        </button>
      </div>
    </div>
  );

  return (
    <>
      {choice == null ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg px-5 py-5 md:px-8">
          <div className="mx-auto max-w-6xl">{panel}</div>
        </div>
      ) : null}
      {open && choice != null ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-4 md:place-items-center" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-lg border border-line bg-bg p-6 text-fg"
          >
            {panel}
          </div>
        </div>
      ) : null}
    </>
  );
}
