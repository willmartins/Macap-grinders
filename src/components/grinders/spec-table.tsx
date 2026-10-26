import type { Grinder } from "@/lib/content/types";
import { compareRows, specEntries } from "@/lib/specs";

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
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
        {caption ? <caption className="mb-3 text-left text-muted">{caption}</caption> : null}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="w-40 py-3 pr-4 font-medium">
                {row.label}
              </th>
              <td className="py-3">{row.value}</td>
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
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="mb-3 text-left text-muted">Specifications side by side.</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="py-3 pr-4 font-medium">
              Specification
            </th>
            {grinders.map((grinder) => (
              <th key={grinder.id} scope="col" className="py-3 pr-4 font-medium">
                <a href={`/grinders/${grinder.slug}`} className="underline underline-offset-4">
                  {grinder.name}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="py-3 pr-4 font-medium">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`} className="py-3 pr-4 align-top">
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
