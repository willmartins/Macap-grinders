import { NextResponse, type NextRequest } from "next/server";

import { isIndexingAllowed } from "@/lib/indexing";
import { legacyRedirects } from "@/lib/redirects/legacy";
import { safeHref } from "@/lib/security";
import { client } from "@/sanity/lib/client";

type SanityRedirect = { source?: string; destination?: string; permanent?: boolean };
type GrinderRange = { slug?: string; range?: string };

const TTL_MS = 15_000;
let cached: { at: number; rows: SanityRedirect[] } | null = null;
let rangesCached: { at: number; map: Map<string, string> } | null = null;

/**
 * Addresses from before the /grinders restructure (November 2026). The audience pages and
 * collections moved under /grinders. A grinder moved under its range, which needs Sanity.
 */
function movedPath(path: string): string | null {
  if (path === "/home-grinders") return "/grinders/home";
  if (path === "/professional") return "/grinders/professional";
  const collection = path.match(/^\/collections\/([a-z0-9-]+)$/);
  if (collection) return `/grinders/${collection[1]}`;
  return null;
}

/** Grinder slug to range slug, for old /grinders/<model> addresses. */
async function grinderRanges(): Promise<Map<string, string>> {
  const now = Date.now();
  if (rangesCached && now - rangesCached.at < TTL_MS) return rangesCached.map;
  try {
    const rows = await client.withConfig({ useCdn: false }).fetch<GrinderRange[]>(
      `*[_type == "grinder" && defined(group)]{ "slug": slug.current, "range": group->slug.current }`,
    );
    const map = new Map<string, string>();
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row.slug && row.range) map.set(row.slug, row.range);
    }
    rangesCached = { at: now, map };
    return map;
  } catch (error) {
    console.error("Macap grinder ranges", error);
    return rangesCached?.map || new Map();
  }
}

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

  const moved = movedPath(path);
  if (moved) {
    return withRobots(NextResponse.redirect(new URL(moved + request.nextUrl.search, request.url), 301), request);
  }

  const shortGrinder = path.match(/^\/grinders\/([a-z0-9-]+)$/);
  if (shortGrinder && shortGrinder[1] !== "home" && shortGrinder[1] !== "professional") {
    const ranges = await grinderRanges();
    const range = ranges.get(shortGrinder[1]);
    // A range's own address is never redirected, even if a model shares its slug.
    const isRange = [...ranges.values()].includes(shortGrinder[1]);
    if (range && !isRange) {
      return withRobots(
        NextResponse.redirect(new URL(`/grinders/${range}/${shortGrinder[1]}${request.nextUrl.search}`, request.url), 301),
        request,
      );
    }
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
