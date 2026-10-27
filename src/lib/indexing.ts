/**
 * Indexing is off until launch.
 * Allow it only when NEXT_PUBLIC_ALLOW_INDEXING is "true",
 * or this is a Vercel production deployment and the request host
 * is the canonical site host.
 */

type IndexingEnv = {
  [key: string]: string | undefined;
  NEXT_PUBLIC_ALLOW_INDEXING?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
};

export function canonicalOrigin(env: IndexingEnv = process.env): string {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  return "https://macap.it";
}

export function canonicalHostname(env: IndexingEnv = process.env): string {
  try {
    return new URL(canonicalOrigin(env)).hostname.toLowerCase();
  } catch {
    return "macap.it";
  }
}

export function requestHostname(hostHeader: string | null | undefined): string | null {
  const raw = hostHeader?.split(",")[0]?.trim().toLowerCase();
  if (!raw) return null;
  return raw.replace(/:\d+$/, "");
}

export function isIndexingAllowed(
  hostHeader: string | null | undefined,
  env: IndexingEnv = process.env,
): boolean {
  if (env.NEXT_PUBLIC_ALLOW_INDEXING === "true") return true;
  if (env.VERCEL_ENV !== "production") return false;
  const host = requestHostname(hostHeader);
  return host != null && host === canonicalHostname(env);
}
