"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import { allowContact } from "@/lib/rate-limit";

export type ContactState = {
  ok: boolean;
  message: string;
};

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  phone: z.string().trim().max(40).optional(),
  topic: z.enum(["Grinder", "Spare part", "Brochure", "Other"], {
    message: "Choose a topic.",
  }),
  message: z.string().trim().min(10, "Write a short message.").max(4000),
  companyWebsite: z.string().max(200).optional(),
  turnstileToken: z.string().optional(),
});

const unavailable = "The form is not available yet. Email info@macap.it.";

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

export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    topic: formData.get("topic"),
    message: formData.get("message"),
    companyWebsite: formData.get("companyWebsite") || undefined,
    turnstileToken: formData.get("cf-turnstile-response") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Check the form and try again." };
  }

  if (parsed.data.companyWebsite) {
    return { ok: true, message: "Message sent. Macap will reply by email." };
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

  const { name, email, phone, topic, message } = parsed.data;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not given"}`,
    `Topic: ${topic}`,
    "",
    message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Macap website: ${topic}`,
      text,
    });
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "Macap has your message",
        text: "Macap has your message and will reply by email.\n\nMacap SRL\ninfo@macap.it",
      });
    } catch (error) {
      console.error("Contact auto-reply failed.", error);
    }
  } catch (error) {
    console.error("Contact email failed.", error);
    return { ok: false, message: "The message was not sent. Try again, or email info@macap.it." };
  }

  return { ok: true, message: "Message sent. Macap will reply by email." };
}
