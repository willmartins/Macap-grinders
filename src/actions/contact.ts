"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { countryName } from "@/lib/countries";
import { enquiryFieldErrors, readEnquiry, roleLabel, roleSharesWithPartner } from "@/lib/enquiry";
import { allowContact } from "@/lib/rate-limit";
import { lookupDistributor } from "@/server/distributors";
import { mailingListNote, type MailingConsent } from "@/server/mailing-list";
import { loadGrinder } from "@/sanity/lib/load";

export type ContactState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const unavailable = "The form is not available yet. Email info@macap.it.";
const sent = "Message sent. Macap will reply by email.";

async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  if (!response.ok) return false;
  const body = (await response.json()) as { success?: boolean };
  return body.success === true;
}

function pageSource(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return "unknown";
  return value;
}

export async function findPartner(country: string): Promise<string | null> {
  if (!country || country.length > 2) return null;
  const partner = await lookupDistributor(country);
  return partner?.name ?? null;
}

export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = readEnquiry(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the form and try again.",
      fieldErrors: enquiryFieldErrors(parsed.error),
    };
  }

  if (parsed.data.companyWebsite) {
    return { ok: true, message: sent };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (!(await allowContact(ip))) {
    return { ok: false, message: "Too many messages. Wait a few minutes, or email info@macap.it." };
  }

  if (!(await turnstileOk(parsed.data.turnstileToken, ip))) {
    return { ok: false, message: "The check failed. Try again." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return { ok: false, message: unavailable };
  }

  const data = parsed.data;
  const source = pageSource(data.source);
  const partner = roleSharesWithPartner(data.role) ? await lookupDistributor(data.country) : null;
  const share = Boolean(partner) && !data.macapOnly;
  const loaded = data.grinder ? await loadGrinder(data.grinder, "published") : null;
  const grinderName = loaded?.grinder.name || "";
  const grinderLine = data.grinder ? `${grinderName || "Unknown model"} (${data.grinder})` : "Not named";
  const consent: MailingConsent | null = data.mailingList
    ? { email: data.email, consentedAt: new Date().toISOString(), source }
    : null;
  const mailing = await mailingListNote(consent);

  const macapText = [
    mailing,
    "",
    `Role: ${roleLabel(data.role)}`,
    `Country: ${countryName(data.country)} (${data.country})`,
    `Grinder: ${grinderLine}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not given"}`,
    partner
      ? `Distributor: ${partner.name}. ${share ? "The message is shared with them." : "The sender asked us to keep this with Macap."}`
      : "Distributor: None matched.",
    "",
    data.message,
  ].join("\n");

  const resend = new Resend(apiKey);
  try {
    const macapMail = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: [
        grinderName ? `Macap website: ${grinderName}` : "Macap website enquiry",
        consent ? "Mailing list sign-up" : "",
      ]
        .filter(Boolean)
        .join(". "),
      text: macapText,
    });
    if (macapMail.error) {
      console.error("Contact email failed.");
      return { ok: false, message: "The message was not sent. Try again, or email info@macap.it." };
    }
  } catch {
    console.error("Contact email failed.");
    return { ok: false, message: "The message was not sent. Try again, or email info@macap.it." };
  }

  if (share && partner) {
    const copy = process.env.CONTACT_DISTRIBUTOR_COPY === "bcc" ? "bcc" : "cc";
    const partnerText = [
      "A Macap website enquiry has been shared with you.",
      "",
      `Role: ${roleLabel(data.role)}`,
      `Country: ${countryName(data.country)} (${data.country})`,
      `Grinder: ${grinderLine}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not given"}`,
      "",
      data.message,
    ].join("\n");
    try {
      const partnerMail = await resend.emails.send({
        from,
        to: partner.email,
        replyTo: data.email,
        [copy]: to,
        subject: grinderName ? `Macap enquiry: ${grinderName}` : "Macap enquiry",
        text: partnerText,
      });
      if (partnerMail.error) console.error("Distributor email failed.");
    } catch {
      console.error("Distributor email failed.");
    }
  }

  try {
    const confirmation = share
      ? "Macap has your message. We have also shared it with our partner in your country. We will reply by email.\n\nMacap SRL\ninfo@macap.it"
      : "Macap has your message and will reply by email.\n\nMacap SRL\ninfo@macap.it";
    const reply = await resend.emails.send({
      from,
      to: data.email,
      subject: "Macap has your message",
      text: confirmation,
    });
    if (reply.error) console.error("Contact confirmation failed.");
  } catch {
    console.error("Contact confirmation failed.");
  }

  return { ok: true, message: sent };
}
