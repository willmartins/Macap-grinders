import type { Grinder, Specs } from "@/lib/content/types";
import { formatNumber } from "@/lib/format";

export type SpecRow = { label: string; value: string };

const burrLabel: Record<string, string> = { flat: "Flat", conical: "Conical" };
const grindLabel: Record<string, string> = {
  espresso: "Espresso",
  filter: "Filter",
  both: "Espresso and filter",
};
const audienceLabel: Record<string, string> = { home: "Home", business: "Professional" };
const statusLabel: Record<string, string> = {
  new: "New",
  current: "Current",
  discontinued: "Discontinued",
};

function dimensions(specs: Specs): string | null {
  const parts = [specs.widthMm, specs.depthMm, specs.heightMm].filter(
    (value): value is number => value != null,
  );
  if (!parts.length) return null;
  return `${parts.map((value) => formatNumber(value)).join(" × ")} mm`;
}

/** Rows for a single grinder. Empty fields are left out. */
export function specEntries(grinder: Pick<Grinder, "audience" | "status" | "specs">): SpecRow[] {
  const specs = grinder.specs;
  const rows: Array<SpecRow | null> = [
    { label: "Audience", value: audienceLabel[grinder.audience] || grinder.audience },
    { label: "Status", value: statusLabel[grinder.status] || grinder.status },
    specs.burrType ? { label: "Burr type", value: burrLabel[specs.burrType] || specs.burrType } : null,
    specs.burrDiameterMm != null
      ? { label: "Burr diameter", value: `${formatNumber(specs.burrDiameterMm)} mm` }
      : null,
    specs.grindType ? { label: "Grind", value: grindLabel[specs.grindType] || specs.grindType } : null,
    specs.motorPowerW != null ? { label: "Motor", value: `${formatNumber(specs.motorPowerW)} W` } : null,
    specs.rpm != null ? { label: "Speed", value: `${formatNumber(specs.rpm)} rpm` } : null,
    specs.hopperCapacityG != null
      ? { label: "Hopper", value: `${formatNumber(specs.hopperCapacityG)} g` }
      : null,
    specs.outputGPerS != null ? { label: "Output", value: `${formatNumber(specs.outputGPerS)} g/s` } : null,
    specs.adjustment ? { label: "Adjustment", value: specs.adjustment } : null,
    dimensions(specs) ? { label: "Dimensions", value: dimensions(specs) as string } : null,
    specs.weightKg != null ? { label: "Weight", value: `${formatNumber(specs.weightKg)} kg` } : null,
    specs.voltage ? { label: "Voltage", value: specs.voltage } : null,
    specs.display ? { label: "Display", value: specs.display } : null,
    specs.features.length ? { label: "Features", value: specs.features.join(", ") } : null,
    ...specs.extra.map((item) => ({ label: item.label, value: item.value })),
  ];
  return rows.filter((row): row is SpecRow => Boolean(row?.value));
}

const compareLabels = [
  "Audience",
  "Status",
  "Burr type",
  "Burr diameter",
  "Grind",
  "Motor",
  "Speed",
  "Hopper",
  "Output",
  "Adjustment",
  "Dimensions",
  "Weight",
  "Voltage",
  "Display",
  "Features",
];

/** The same rows for every grinder, so the compare table lines up. */
export function compareRows(grinders: Grinder[]): Array<{ label: string; values: string[] }> {
  const tables = grinders.map((grinder) => new Map(specEntries(grinder).map((row) => [row.label, row.value])));
  const extras = grinders.flatMap((grinder) => grinder.specs.extra.map((item) => item.label));
  const labels = [...compareLabels, ...extras.filter((label, index) => extras.indexOf(label) === index)];
  return labels
    .filter((label) => tables.some((table) => table.has(label)))
    .map((label) => ({
      label,
      values: tables.map((table) => table.get(label) || "Not listed"),
    }));
}
