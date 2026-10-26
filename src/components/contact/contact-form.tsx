"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";

import { submitContact, type ContactState } from "@/actions/contact";
import { trackEvent } from "@/lib/analytics";

const initial: ContactState = { ok: false, message: "" };
const topics = ["Grinder", "Spare part", "Brochure", "Other"] as const;

export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [state, action, pending] = useActionState(submitContact, initial);
  const tracked = useRef("");

  useEffect(() => {
    if (!state.message || tracked.current === state.message) return;
    tracked.current = state.message;
    trackEvent({
      name: "contact_form_submit",
      props: { status: state.ok ? "success" : "error" },
    });
  }, [state]);

  return (
    <form action={action} className="grid max-w-xl gap-4" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="grid gap-2 text-sm" htmlFor="name">
        Name
        <input id="name" name="name" className="field" autoComplete="name" required />
      </label>
      <label className="grid gap-2 text-sm" htmlFor="email">
        Email
        <input id="email" name="email" type="email" className="field" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm" htmlFor="phone">
        Phone, optional
        <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" />
      </label>
      <label className="grid gap-2 text-sm" htmlFor="topic">
        Topic
        <select id="topic" name="topic" className="field" defaultValue="Grinder" required>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm" htmlFor="message">
        Message
        <textarea id="message" name="message" className="field min-h-36" required />
      </label>
      {siteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      ) : null}
      <button type="submit" className="btn w-fit" disabled={pending}>
        {pending ? "Sending." : "Send message"}
      </button>
      {state.message ? (
        <p role="status" className="text-sm">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
