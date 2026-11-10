import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export function Breadcrumbs({
  items,
  overlay = false,
  bare = false,
}: {
  items: Array<{ name: string; path: string }>;
  overlay?: boolean;
  bare?: boolean;
}) {
  const trail = [{ name: "Macap", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={bare ? "" : "frame pt-6"}>
        <ol className={`flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium ${overlay ? "text-white/70" : "text-grey"}`}>
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={item.path} className="inline-flex items-center gap-1.5">
                {index > 0 ? (
                  <span className="opacity-40 select-none" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {last ? (
                  <span aria-current="page" className={overlay ? "text-white font-semibold" : "text-black font-semibold"}>
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={item.path}
                    className={`transition-colors hover:underline underline-offset-4 ${
                      overlay ? "hover:text-white" : "hover:text-black"
                    }`}
                  >
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
