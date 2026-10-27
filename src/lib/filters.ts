import type { GrinderCard, GrinderStatus } from "@/lib/content/types";

export type GrinderFilters = {
  audience: string;
  group: string;
  burr: string;
  grind: string;
  status: string;
};

function one(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || "";
}

export function readFilters(
  search: Record<string, string | string[] | undefined>,
): GrinderFilters {
  return {
    audience: one(search.audience),
    group: one(search.group),
    burr: one(search.burr),
    grind: one(search.grind),
    status: one(search.status),
  };
}

export function readCompareSlugs(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value || "";
  return [...new Set(raw.split(",").map((slug) => slug.trim()).filter(Boolean))].slice(0, 3);
}

const statuses = new Set<GrinderStatus>(["new", "current", "discontinued"]);

export function applyFilters(grinders: GrinderCard[], filters: GrinderFilters): GrinderCard[] {
  return grinders.filter((grinder) => {
    if (!filters.status && grinder.status === "discontinued") return false;
    if (filters.status && filters.status !== "all") {
      if (!statuses.has(filters.status as GrinderStatus)) return false;
      if (grinder.status !== filters.status) return false;
    }
    if (filters.audience && grinder.audience !== filters.audience) return false;
    if (filters.group && grinder.groupSlug !== filters.group) return false;
    if (filters.burr && String(grinder.burrDiameterMm ?? "") !== filters.burr) return false;
    if (filters.grind && grinder.grindType !== filters.grind) return false;
    return true;
  });
}
