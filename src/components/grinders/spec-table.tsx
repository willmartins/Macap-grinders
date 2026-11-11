import { TextLink } from "@/components/site/text-link";
import type { Grinder } from "@/lib/content/types";
import { compareRows, specEntries } from "@/lib/specs";
import { grinderPath } from "@/lib/paths";

/**
 * Colours that tell models apart in a comparison, in column order.
 * The first model is yellow, then sky and emerald, as in the compare block on the grinder page.
 */
export const modelColours = [
  { border: "border-yellow", fill: "bg-yellow", text: "text-black" },
  { border: "border-sky", fill: "bg-light-sky", text: "text-dark-sky" },
  { border: "border-emerald", fill: "bg-light-emerald", text: "text-dark-emerald" },
  { border: "border-violet", fill: "bg-light-violet", text: "text-dark-violet" },
] as const;

export function modelColour(index: number) {
  return modelColours[index % modelColours.length];
}

export function SpecTable({
  grinder,
  caption,
}: {
  grinder: Grinder;
  caption?: string;
}) {
  const rows = specEntries(grinder);
  return (
    <div className="overflow-x-auto">
      <table className="datasheet min-w-[20rem] border-t border-silver">
        {caption ? <caption className="type-eyebrow mb-4 text-left text-grey">{caption}</caption> : null}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td className="type-mono">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompareTable({ grinders }: { grinders: Grinder[] }) {
  const rows = compareRows(grinders);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left tabular-nums">
        <caption className="type-eyebrow mb-4 text-left text-grey">Specifications side by side.</caption>
        <thead>
          <tr className="border-b border-silver">
            <th scope="col" className="type-eyebrow border-t-2 border-silver pt-3 pb-4 pr-4 align-bottom text-grey">
              Specification
            </th>
            {grinders.map((grinder, index) => (
              <th
                key={grinder.id}
                scope="col"
                className={`border-t-2 ${modelColour(index).border} pt-3 pb-4 pr-6 text-left align-bottom font-normal`}
              >
                <TextLink href={grinderPath(grinder)} className="type-h3 text-black link-underline">
                  {grinder.name}
                </TextLink>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-silver">
              <th scope="row" className="type-body py-4 pr-4 align-top font-medium text-grey">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`} className="type-mono py-4 pr-6 align-top text-black">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
