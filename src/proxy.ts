import { NextResponse, type NextRequest } from "next/server";

import { isIndexingAllowed } from "@/lib/indexing";
import { legacyRedirects } from "@/lib/redirects/legacy";
import { safeHref } from "@/lib/security";
import { client } from "@/sanity/lib/client";

type SanityRedirect = { source?: string; destination?: string; permanent?: boolean };

const TTL_MS = 15_000;
let cached: { at: number; rows: SanityRedirect[] } | null = null;

function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

async function sanityRedirects(): Promise<SanityRedirect[]> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.rows;
  try {
    const rows = await client.withConfig({ useCdn: false }).fetch<SanityRedirect[]>(
      `*[_type == "redirect" && isEnabled != false]{ source, destination, permanent }`,
    );
    cached = { at: now, rows: Array.isArray(rows) ? rows : [] };
    return cached.rows;
  } catch (error) {
    console.error("Macap redirects", error);
    return cached?.rows || [];
  }
}

function withRobots(response: NextResponse, request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!isIndexingAllowed(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const path = normalise(request.nextUrl.pathname);
  if (path.startsWith("/api") || path.startsWith("/studio") || path === "/robots.txt" || path === "/sitemap.xml") {
    return withRobots(NextResponse.next(), request);
  }

  const legacy = legacyRedirects[path];
  const legacyTarget = safeHref(legacy);
  if (legacyTarget && legacyTarget !== path) {
    return withRobots(NextResponse.redirect(new URL(legacyTarget, request.url), 301), request);
  }

  const rows = await sanityRedirects();
  const match = rows.find((row) => normalise(row.source || "") === path);
  const destination = safeHref(match?.destination);
  if (destination && destination !== path) {
    return withRobots(
      NextResponse.redirect(new URL(destination, request.url), match?.permanent === false ? 302 : 301),
      request,
    );
  }

  return withRobots(NextResponse.next(), request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)", "/robots.txt", "/sitemap.xml"],
};
