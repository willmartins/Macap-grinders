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
      <table className="w-full min-w-[20rem] border-collapse text-left">
        {caption ? <caption className="label mb-4 text-left text-muted">{caption}</caption> : null}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="label w-40 py-4 pr-4 font-medium text-muted">
                {row.label}
              </th>
              <td className="py-4 text-base tabular-nums">{row.value}</td>
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
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="label mb-4 text-left text-muted">Specifications side by side.</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="label py-4 pr-4 font-medium text-muted">
              Specification
            </th>
            {grinders.map((grinder) => (
              <th key={grinder.id} scope="col" className="py-4 pr-6 text-left align-bottom">
                <a href={`/grinders/${grinder.slug}`} className="text-xl font-medium tracking-tight underline-offset-4 hover:underline">
                  {grinder.name}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="label py-4 pr-4 font-medium text-muted">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`} className="py-4 pr-6 align-top tabular-nums">
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
