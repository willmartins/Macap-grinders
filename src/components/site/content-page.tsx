import { PageBuilder, type PageBuilderContext } from "@/components/modules/page-builder";
import { SampleBanner } from "@/components/site/sample-banner";
import type { PageDocument } from "@/lib/content/types";

export function ContentPage({
  page,
  journey,
  context,
}: {
  page: PageDocument;
  journey?: string;
  context?: PageBuilderContext;
}) {
  const hero = page.sections[0]?._type === "heroBanner";
  return (
    <article>
      {page.sample ? <SampleBanner /> : null}
      {hero ? null : (
        <header className="section-tight border-b border-silver">
          <div className="frame">
            <h1 className="type-h1 max-w-4xl text-black">{page.title}</h1>
            {page.introduction ? <p className="type-lead mt-5 max-w-2xl text-grey">{page.introduction}</p> : null}
          </div>
        </header>
      )}
      <PageBuilder sections={page.sections} journey={journey} context={context} />
    </article>
  );
}
