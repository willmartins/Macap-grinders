import { PageBuilder } from "@/components/modules/page-builder";
import { SampleBanner } from "@/components/site/sample-banner";
import type { PageDocument } from "@/lib/content/types";

export function ContentPage({
  page,
  journey,
}: {
  page: PageDocument;
  journey?: string;
}) {
  const hero = page.sections[0]?._type === "heroBanner";
  return (
    <article>
      {page.sample ? <SampleBanner /> : null}
      {hero ? null : (
        <header className="frame section-tight">
          <h1 className="display max-w-5xl">{page.title}</h1>
          {page.introduction ? <p className="mt-6 max-w-2xl text-lg leading-relaxed">{page.introduction}</p> : null}
        </header>
      )}
      <PageBuilder sections={page.sections} journey={journey} />
    </article>
  );
}
