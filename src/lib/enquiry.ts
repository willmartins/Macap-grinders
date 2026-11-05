import { z } from "zod";

import { isCountryCode } from "@/lib/countries";

export const enquiryRoles = [
  { value: "cafe", label: "Cafe" },
  { value: "roastery", label: "Roastery / coffee supplier" },
  { value: "supplier", label: "Equipment supplier / distributor" },
  { value: "home", label: "Home barista" },
  { value: "other", label: "Other" },
] as const;

export type EnquiryRole = (typeof enquiryRoles)[number]["value"];

const partnerRoles = new Set<EnquiryRole>(["cafe", "roastery", "home"]);

export function roleSharesWithPartner(role: string): boolean {
  return partnerRoles.has(role as EnquiryRole);
}

export function roleLabel(role: string): string {
  return enquiryRoles.find((item) => item.value === role)?.label || role;
}

const phonePattern = /^\+?[0-9][0-9\s().-]*$/;

export const enquirySchema = z.object({
  role: z.enum(["cafe", "roastery", "supplier", "home", "other"], {
    message: "Choose what you do.",
  }),
  country: z.string().refine((code) => isCountryCode(code), "Choose your country."),
  message: z.string().trim().min(1, "Write a message.").max(4000),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .superRefine((value, ctx) => {
      if (!value) return;
      const digits = value.replace(/\D/g, "");
      if (!phonePattern.test(value) || digits.length < 6 || digits.length > 20) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a phone number we can call, or leave it blank.",
        });
      }
    }),
  mailingList: z.boolean(),
  macapOnly: z.boolean(),
  grinder: z.string().trim().max(80),
  source: z.string().trim().max(200),
  companyWebsite: z.string().max(200),
  turnstileToken: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function enquiryFieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export function readEnquiry(formData: FormData) {
  return enquirySchema.safeParse({
    role: formData.get("role"),
    country: formData.get("country"),
    message: formData.get("message"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    mailingList: formData.get("mailingList") === "yes",
    macapOnly: formData.get("macapOnly") === "yes",
    grinder: formData.get("grinder") || "",
    source: formData.get("source") || "",
    companyWebsite: formData.get("companyWebsite") || "",
    turnstileToken: formData.get("cf-turnstile-response") || undefined,
  });
}

export type EnquiryGrinder = {
  slug: string;
  name: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};
