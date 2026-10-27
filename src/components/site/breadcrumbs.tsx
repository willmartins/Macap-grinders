import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  const trail = [{ name: "Macap", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="frame pt-6">
        <ol className="label flex flex-wrap gap-x-2 gap-y-1 text-muted">
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={item.path} className="flex gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {item.name}
                  </span>
                ) : (
                  <a href={item.path} className="underline decoration-line underline-offset-4">
                    {item.name}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
