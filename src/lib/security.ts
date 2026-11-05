/** Accept a single-slash path, mailto, tel, or an http(s) URL. Reject protocol-relative and script URLs. */
export function safeHref(value: string | null | undefined): string | null {
  if (!value) return null;
  const href = value.trim();
  if (!href || href.startsWith("//") || href.toLowerCase().startsWith("javascript:")) return null;
  if (href.startsWith("/")) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  try {
    const url = new URL(href);
    if (url.protocol === "https:" || url.protocol === "http:") return href;
  } catch {
    return null;
  }
  return null;
}

export function telHref(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : "tel:";
}
