"use client";

import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";

import { findPartner, submitContact, type ContactState } from "@/actions/contact";
import { CountryField } from "@/components/contact/country-field";
import { useEnquiryGrinder } from "@/components/contact/enquiry-context";
import { TextLink } from "@/components/site/text-link";
import { trackEvent } from "@/lib/analytics";
import { enquiryFieldErrors, enquiryRoles, readEnquiry, roleSharesWithPartner, type EnquiryGrinder } from "@/lib/enquiry";

const initial: ContactState = { ok: false, message: "" };

export function ContactForm({ grinder: given }: { grinder?: EnquiryGrinder | null }) {
  const fromPage = useEnquiryGrinder();
  const grinder = given === undefined ? fromPage : given;
  const pathname = usePathname() || "/contact";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [state, action, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [partner, setPartner] = useState<{ country: string; role: string; name: string | null } | null>(null);
  const base = useId();
  const errors = Object.keys(clientErrors).length ? clientErrors : state.fieldErrors || {};
  const partnerName =
    partner && partner.country === country && partner.role === role && roleSharesWithPartner(role) ? partner.name : null;
  const showPartner = Boolean(partnerName);

  useEffect(() => {
    if (!roleSharesWithPartner(role) || !country) return;
    let live = true;
    const requested = { country, role };
    findPartner(country).then((name) => {
      if (live) setPartner({ ...requested, name });
    });
    return () => {
      live = false;
    };
  }, [role, country]);

  useEffect(() => {
    if (!state.ok || !state.message) return;
    trackEvent({
      name: "generate_lead",
      props: { role, country, grinder: grinder?.slug || "none" },
    });
  }, [state.ok, state.message, role, country, grinder?.slug]);

  useEffect(() => {
    if (state.ok || !state.message) return;
    trackEvent({ name: "contact_form_submit", props: { status: "error" } });
  }, [state.ok, state.message]);

  if (state.ok) {
    return (
      <p role="status" className="text-lg">
        {state.message}
      </p>
    );
  }

  const roleError = errors.role;
  const countryError = errors.country;
  const messageError = errors.message;
  const emailError = errors.email;
  const phoneError = errors.phone;

  return (
    <form
      action={action}
      className="enquiry-form"
      noValidate
      onSubmit={(event) => {
        const form = event.currentTarget;
        const parsed = readEnquiry(new FormData(form));
        if (!parsed.success) {
          event.preventDefault();
          const fields = enquiryFieldErrors(parsed.error);
          setClientErrors(fields);
          const order = ["role", "country", "message", "email", "phone"] as const;
          const first = order.find((key) => fields[key]);
          const target =
            first === "role"
              ? form.querySelector<HTMLElement>('input[name="role"]')
              : first === "country"
                ? form.querySelector<HTMLElement>('[role="combobox"]')
                : first
                  ? form.querySelector<HTMLElement>(`[name="${first}"]`)
                  : null;
          target?.focus();
          return;
        }
        setClientErrors({});
      }}
    >
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${base}-company`}>Company website</label>
        <input id={`${base}-company`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="source" value={grinder ? `/grinders/${grinder.slug}` : pathname} />
      {grinder ? <input type="hidden" name="grinder" value={grinder.slug} /> : null}

      {grinder ? (
        <div className="enquire-machine">
          {grinder.imageUrl ? (
            <Image
              src={grinder.imageUrl}
              alt={grinder.imageAlt || ""}
              width={96}
              height={96}
              className="enquire-thumb"
            />
          ) : null}
          <p className="text-xl font-medium tracking-tight">{grinder.name}</p>
        </div>
      ) : null}

      <fieldset aria-describedby={roleError ? `${base}-role-error` : undefined} aria-invalid={roleError ? true : undefined}>
        <legend className="text-sm">What do you do?</legend>
        <div className="choice-grid">
          {enquiryRoles.map((item) => (
            <label key={item.value} className="choice">
              <input
                type="radio"
                name="role"
                value={item.value}
                checked={role === item.value}
                onChange={() => setRole(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
        {roleError ? (
          <p id={`${base}-role-error`} className="form-error">
            {roleError}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-2">
        <label className="text-sm" id={`${base}-country-label`} htmlFor={`${base}-country`}>
          Where are you based?
        </label>
        <CountryField
          id={`${base}-country`}
          error={countryError}
          errorId={`${base}-country-error`}
          onChange={setCountry}
        />
        {countryError ? (
          <p id={`${base}-country-error`} className="form-error">
            {countryError}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {showPartner ? (
          <div className="partner-note">
            <p>
              We have a partner in your country: {partnerName}. Your message below will be shared with both of us.
            </p>
            <label className="choice-check" htmlFor={`${base}-macap-only`}>
              <input id={`${base}-macap-only`} type="checkbox" name="macapOnly" value="yes" />
              Only send my message to Macap
            </label>
          </div>
        ) : null}
      </div>

      <label className="grid gap-2 text-sm" htmlFor={`${base}-message`}>
        Message
        <textarea
          id={`${base}-message`}
          name="message"
          className="field min-h-36"
          required
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? `${base}-message-error` : undefined}
        />
        {messageError ? (
          <span id={`${base}-message-error`} className="form-error">
            {messageError}
          </span>
        ) : null}
      </label>

      <label className="grid gap-2 text-sm" htmlFor={`${base}-email`}>
        Email address
        <input
          id={`${base}-email`}
          name="email"
          type="email"
          className="field"
          autoComplete="email"
          required
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${base}-email-error` : undefined}
        />
        {emailError ? (
          <span id={`${base}-email-error`} className="form-error">
            {emailError}
          </span>
        ) : null}
      </label>

      <label className="grid gap-2 text-sm" htmlFor={`${base}-phone`}>
        Phone number
        <input
          id={`${base}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel"
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={phoneError ? `${base}-phone-hint ${base}-phone-error` : `${base}-phone-hint`}
        />
        <span id={`${base}-phone-hint`} className="text-sm text-muted">
          Optional. Include the country code if you are outside Italy.
        </span>
        {phoneError ? (
          <span id={`${base}-phone-error`} className="form-error">
            {phoneError}
          </span>
        ) : null}
      </label>

      <div className="grid gap-2">
        <label className="choice-check" htmlFor={`${base}-mailing`}>
          <input
            id={`${base}-mailing`}
            type="checkbox"
            name="mailingList"
            value="yes"
            aria-describedby={`${base}-mailing-hint`}
          />
          Sign up to our mailing list
        </label>
        <p id={`${base}-mailing-hint`} className="text-sm text-muted">
          Occasional notes on grinders and how to look after them. Nothing from other companies.{" "}
          <TextLink href="/legal/privacy-policy">Privacy policy</TextLink>
        </p>
      </div>

      {siteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      ) : null}

      <div className="sr-only" aria-live="polite">
        {Object.keys(clientErrors).length ? "Check the form and try again." : ""}
      </div>
      <button type="submit" className="btn w-fit" disabled={pending}>
        {pending ? "Sending." : "Send"}
      </button>
      {state.message && !state.ok ? (
        <p role="alert" className="text-sm">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
