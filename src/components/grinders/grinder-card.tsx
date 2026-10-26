import Link from "next/link";

import { PhotoSlot } from "@/components/site/photo-slot";
import type { GrinderCard } from "@/lib/content/types";

const statusLabel = { new: "New", current: "Current", discontinued: "Discontinued" };

export function GrinderCardView({ grinder }: { grinder: GrinderCard }) {
  return (
    <article className="flex h-full flex-col border border-line">
      <a href={`/grinders/${grinder.slug}`} className="block">
        <PhotoSlot imageUrl={grinder.imageUrl} alt={grinder.imageAlt || grinder.name} sizes="(min-width: 1024px) 22rem, 100vw" />
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm text-muted">
          {grinder.groupName || "Macap"}
          {grinder.status === "current" ? "" : ` · ${statusLabel[grinder.status]}`}
        </p>
        <h2 className="text-xl font-medium tracking-tight">
          <a href={`/grinders/${grinder.slug}`} className="underline-offset-4 hover:underline">
            {grinder.name}
          </a>
        </h2>
        <p className="text-sm leading-relaxed text-muted">{grinder.shortDescription}</p>
        <p className="mt-auto pt-4 text-sm">
          <a href={`/compare?m=${grinder.slug}`} className="underline underline-offset-4">
            Compare
          </a>
        </p>
      </div>
    </article>
  );
}

export function GrinderGrid({ grinders }: { grinders: GrinderCard[] }) {
  if (!grinders.length) {
    return (
      <p className="text-sm">
        No grinders match these filters. <Link href="/grinders" className="underline underline-offset-4">Clear filters</Link>
      </p>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {grinders.map((grinder) => (
        <li key={grinder.id}>
          <GrinderCardView grinder={grinder} />
        </li>
      ))}
    </ul>
  );
}
