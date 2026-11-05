import type { Grinder } from "@/lib/content/types";

const burrLabel: Record<string, string> = {
  flat: "flat",
  conical: "conical",
};

const grindLabel: Record<string, string> = {
  espresso: "espresso",
  filter: "filter",
  both: "espresso and filter",
};

function names(grinders: Grinder[]): string {
  return grinders.map((grinder) => grinder.name).join(", ");
}

/**
 * Short notes for the compare tool. They describe the figures on the page.
 * They do not pick a winner.
 */
export function explainDifferences(grinders: Grinder[]): string[] {
  if (grinders.length < 2) return [];
  const notes: string[] = [];

  const burrs = grinders.filter((grinder) => grinder.specs.burrType);
  if (new Set(burrs.map((grinder) => grinder.specs.burrType)).size > 1) {
    const parts = burrs.map(
      (grinder) =>
        `${grinder.name}: ${burrLabel[grinder.specs.burrType || ""] || grinder.specs.burrType} burrs`,
    );
    notes.push(`${parts.join(". ")}. Both grind coffee. The particle shape differs.`);
  }

  const sized = grinders.filter((grinder) => grinder.specs.burrDiameterMm != null);
  if (sized.length > 1) {
    const sorted = [...sized].sort(
      (a, b) => (a.specs.burrDiameterMm || 0) - (b.specs.burrDiameterMm || 0),
    );
    const smallest = sorted[0];
    const largest = sorted[sorted.length - 1];
    if (
      smallest &&
      largest &&
      smallest.specs.burrDiameterMm !== largest.specs.burrDiameterMm
    ) {
      notes.push(
        `${largest.name} has ${largest.specs.burrDiameterMm} mm burrs. ${smallest.name} has ${smallest.specs.burrDiameterMm} mm burrs. A larger burr is for busier service.`,
      );
    }
  }

  const output = grinders.filter((grinder) => grinder.specs.outputGPerS != null);
  if (output.length > 1) {
    const fastest = [...output].sort(
      (a, b) => (b.specs.outputGPerS || 0) - (a.specs.outputGPerS || 0),
    )[0];
    if (fastest?.specs.outputGPerS) {
      notes.push(
        `${fastest.name} is the quickest here, at ${fastest.specs.outputGPerS} g/s. That figure is speed, not flavour.`,
      );
    }
  }

  const hoppers = grinders.filter((grinder) => grinder.specs.hopperCapacityG != null);
  if (hoppers.length > 1) {
    const sorted = [...hoppers].sort(
      (a, b) => (a.specs.hopperCapacityG || 0) - (b.specs.hopperCapacityG || 0),
    );
    const smallest = sorted[0];
    const largest = sorted[sorted.length - 1];
    if (
      smallest &&
      largest &&
      smallest.specs.hopperCapacityG !== largest.specs.hopperCapacityG
    ) {
      notes.push(
        `${largest.name} holds ${largest.specs.hopperCapacityG} g. ${smallest.name} holds ${smallest.specs.hopperCapacityG} g.`,
      );
    }
  }

  if (new Set(grinders.map((grinder) => grinder.audience)).size > 1) {
    const home = grinders.filter((grinder) => grinder.audience === "home").map((grinder) => grinder.name);
    const business = grinders
      .filter((grinder) => grinder.audience === "business")
      .map((grinder) => grinder.name);
    notes.push(
      `${home.join(" and ") || "The home model"} is for a home counter. ${business.join(" and ") || "The professional model"} is for the bar.`,
    );
  }

  const adjustments = grinders.filter((grinder) => grinder.specs.adjustment);
  if (new Set(adjustments.map((grinder) => grinder.specs.adjustment)).size > 1) {
    const lines = adjustments.map((grinder) => `${grinder.name}: ${grinder.specs.adjustment}`);
    notes.push(`Adjustment differs. ${lines.join(". ")}.`);
  }

  const displays = grinders.filter((grinder) => grinder.specs.display);
  const without = grinders.filter((grinder) => !grinder.specs.display);
  if (displays.length && without.length) {
    notes.push(
      `${displays.map((grinder) => grinder.name).join(" and ")} ${displays.length > 1 ? "have" : "has"} a display. ${without.map((grinder) => grinder.name).join(" and ")} ${without.length > 1 ? "do" : "does"} not.`,
    );
  }

  const weights = grinders.filter((grinder) => grinder.specs.weightKg != null);
  if (weights.length > 1) {
    const sorted = [...weights].sort((a, b) => (a.specs.weightKg || 0) - (b.specs.weightKg || 0));
    const lightest = sorted[0];
    const heaviest = sorted[sorted.length - 1];
    if (lightest && heaviest && lightest.specs.weightKg !== heaviest.specs.weightKg) {
      notes.push(
        `${lightest.name} weighs ${lightest.specs.weightKg} kg. ${heaviest.name} weighs ${heaviest.specs.weightKg} kg.`,
      );
    }
  }

  const grindTypes = grinders.filter((grinder) => grinder.specs.grindType);
  if (new Set(grindTypes.map((grinder) => grinder.specs.grindType)).size > 1) {
    const lines = grindTypes.map(
      (grinder) =>
        `${grinder.name}: ${grindLabel[grinder.specs.grindType || ""] || grinder.specs.grindType}`,
    );
    notes.push(`${lines.join(". ")}. Match the grinder to the brew.`);
  }

  for (const grinder of grinders) {
    const unique = grinder.specs.features.filter(
      (feature) =>
        !grinders.some(
          (other) => other.id !== grinder.id && other.specs.features.includes(feature),
        ),
    );
    if (unique.length) {
      notes.push(`${grinder.name} alone lists ${unique.join(", ")}.`);
    }
  }

  if (!notes.length) {
    notes.push(`${names(grinders)} are close on these figures. Read each grinder page before you choose.`);
  }

  return notes;
}

export function compareHref(slugs: string[]): string {
  const unique = [...new Set(slugs.filter(Boolean))].slice(0, 3);
  if (!unique.length) return "/compare";
  return `/compare?m=${unique.join(",")}`;
}
