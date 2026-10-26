"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { trackEvent } from "@/lib/analytics";
import type { GrinderFilters } from "@/lib/filters";
import type { Group } from "@/lib/content/types";

export function FilterBar({
  groups,
  burrs,
  filters,
}: {
  groups: Group[];
  burrs: number[];
  filters: GrinderFilters;
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const read = (key: string) => String(data.get(key) || "");
    for (const key of ["audience", "group", "burr", "grind", "status"]) {
      const value = read(key);
      if (value) next.set(key, value);
    }
    trackEvent({
      name: "grinder_filter",
      props: {
        audience: next.get("audience") || "any",
        group: next.get("group") || "any",
        burr: next.get("burr") || "any",
        grind: next.get("grind") || "any",
        status: next.get("status") || "current",
      },
    });
    const query = next.toString();
    router.push(query ? `/grinders?${query}` : "/grinders");
  }

  return (
    <form action="/grinders" method="get" onSubmit={onSubmit} className="grid gap-4 md:grid-cols-5">
      <label className="grid gap-2 text-sm">
        Use
        <select name="audience" className="field" defaultValue={filters.audience}>
          <option value="">All</option>
          <option value="home">Home</option>
          <option value="business">Professional</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Line
        <select name="group" className="field" defaultValue={filters.group}>
          <option value="">All</option>
          {groups.map((group) => (
            <option key={group.slug} value={group.slug}>
              {group.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Burr size
        <select name="burr" className="field" defaultValue={filters.burr}>
          <option value="">All</option>
          {burrs.map((size) => (
            <option key={size} value={String(size)}>
              {size} mm
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Grind
        <select name="grind" className="field" defaultValue={filters.grind}>
          <option value="">All</option>
          <option value="espresso">Espresso</option>
          <option value="filter">Filter</option>
          <option value="both">Espresso and filter</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Status
        <select name="status" className="field" defaultValue={filters.status}>
          <option value="">Current and new</option>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="current">Current</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </label>
      <div className="md:col-span-5">
        <button type="submit" className="btn">
          Show grinders
        </button>
      </div>
    </form>
  );
}
