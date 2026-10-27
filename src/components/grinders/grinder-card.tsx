import Image from "next/image";

import { ArrowText, TextLink } from "@/components/site/text-link";
import type { GrindType, GrinderCard } from "@/lib/content/types";
import { formatNumber } from "@/lib/format";

const statusLabel = { new: "New", current: "", discontinued: "Discontinued" };
const grindLabel: Record<GrindType, string> = {
  espresso: "Espresso",
  filter: "Filter",
  both: "Espresso and filter",
};

function keySpecs(grinder: GrinderCard): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  if (grinder.burrDiameterMm != null) {
    specs.push({ label: "Burrs", value: `${formatNumber(grinder.burrDiameterMm)} mm` });
  }
  if (grinder.motorPowerW != null) {
    specs.push({ label: "Motor", value: `${formatNumber(grinder.motorPowerW)} W` });
  } else if (grinder.grindType) {
    specs.push({ label: "Grind", value: grindLabel[grinder.grindType] });
  }
  return specs.slice(0, 2);
}

export function GrinderCardView({ grinder }: { grinder: GrinderCard }) {
  const status = statusLabel[grinder.status];
  const line = grinder.groupName || "Macap";
  const specs = keySpecs(grinder);
  const accessible = [grinder.name, line, status, ...specs.map((spec) => `${spec.label} ${spec.value}`), "View model"]
    .filter(Boolean)
    .join(", ");

  return (
    <a className="machine-card" href={`/grinders/${grinder.slug}`} aria-label={accessible}>
      <div className="machine-plinth">
        {grinder.imageUrl ? (
          <div className="machine-shot">
            <Image
              src={grinder.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 84vw"
              className="object-contain"
            />
          </div>
        ) : (
          <p className="label text-muted">Photography to follow</p>
        )}
      </div>
      <div className="machine-foot">
        <p className="label text-muted">
          {line}
          {status ? `  /  ${status}` : ""}
        </p>
        <h3 className="machine-name">{grinder.name}</h3>
        <div className="machine-end">
          {specs.length ? (
            <dl className="machine-specs">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="machine-specs" />
          )}
          <p className="machine-go">
            <ArrowText>View model</ArrowText>
          </p>
        </div>
      </div>
    </a>
  );
}

export function GrinderGrid({ grinders, snap = false }: { grinders: GrinderCard[]; snap?: boolean }) {
  if (!grinders.length) {
    return (
      <p className="text-sm">
        No grinders match these filters.{" "}
        <TextLink href="/grinders" className="underline underline-offset-4">
          Clear filters
        </TextLink>
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
    <ul className="machine-grid">
      {grinders.map((grinder) => (
        <li key={grinder.id}>
          <GrinderCardView grinder={grinder} />
        </li>
      ))}
    </ul>
  );
}
