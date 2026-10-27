import Link from "next/link";

import { PhotoSlot } from "@/components/site/photo-slot";
import type { GrinderCard } from "@/lib/content/types";
import { formatNumber } from "@/lib/format";

const statusLabel = { new: "New", current: "", discontinued: "Discontinued" };

export function GrinderCardView({ grinder }: { grinder: GrinderCard }) {
  const status = statusLabel[grinder.status];
  return (
    <article className="flex h-full flex-col">
      <a href={`/grinders/${grinder.slug}`} className="block">
        <PhotoSlot
          imageUrl={grinder.imageUrl}
          alt={grinder.imageAlt || grinder.name}
          ratio="1/1"
          sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw"
        />
      </a>
      <div className="flex flex-1 flex-col gap-3 border-t border-line pt-4">
        <p className="label text-muted">
          {grinder.groupName || "Macap"}
          {status ? `  /  ${status}` : ""}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-2xl font-medium tracking-tight">
            <a href={`/grinders/${grinder.slug}`} className="underline-offset-4 hover:underline">
              {grinder.name}
            </a>
          </h3>
          {grinder.burrDiameterMm != null ? (
            <p className="stat text-[2rem]">
              {formatNumber(grinder.burrDiameterMm)}
              <span className="label ml-1 text-muted">mm</span>
            </p>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-muted">{grinder.shortDescription}</p>
        <p className="mt-auto pt-4">
          <a href={`/compare?m=${grinder.slug}`} className="label underline-offset-4 hover:underline">
            Compare
          </a>
        </p>
      </div>
    </article>
  );
}

export function GrinderGrid({ grinders, snap = false }: { grinders: GrinderCard[]; snap?: boolean }) {
  if (!grinders.length) {
    return (
      <p className="text-sm">
        No grinders match these filters.{" "}
        <Link href="/grinders" className="underline underline-offset-4">
          Clear filters
        </Link>
      </p>
    );
  }
  if (snap) {
    return (
      <ul className="snap-row model-snap" tabIndex={0} aria-label="Related models">
        {grinders.map((grinder) => (
          <li key={grinder.id}>
            <GrinderCardView grinder={grinder} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {grinders.map((grinder) => (
        <li key={grinder.id}>
          <GrinderCardView grinder={grinder} />
        </li>
      ))}
    </ul>
  );
}
