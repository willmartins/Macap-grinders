export type MailingConsent = {
  email: string;
  consentedAt: string;
  source: string;
};

/** A future list provider. Nothing is connected yet. */
export type MailingListProvider = {
  subscribe(consent: MailingConsent): Promise<void>;
};

/**
 * Replace this with a provider when Macap chooses one.
 * Until then, a sign-up is only recorded on the Macap enquiry email.
 */
export const mailingListProvider: MailingListProvider | null = null;

/** Text for the Macap enquiry. A sign-up is stated on its own lines. */
export async function mailingListNote(consent: MailingConsent | null): Promise<string> {
  if (!consent) return "Mailing list: No.";

  const lines = [
    "MAILING LIST SIGN-UP",
    `${consent.email} asked to join the mailing list.`,
    `Consented at ${consent.consentedAt}.`,
    `Page: ${consent.source}.`,
  ];

  if (!mailingListProvider) {
    lines.push("No mailing provider is connected. Add this address by hand.");
    return lines.join("\n");
  }

  try {
    await mailingListProvider.subscribe(consent);
    lines.push("Passed to the mailing list provider.");
  } catch {
    console.error("Mailing list provider failed.");
    lines.push("The mailing provider did not accept this address. Add it by hand.");
  }
  return lines.join("\n");
}
