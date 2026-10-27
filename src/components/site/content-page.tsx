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
  const hero = page.sections[0]?._type === "heroBanner" ? page.sections[0] : null;
  const showIntro = page.introduction && page.introduction !== hero?.text;
  return (
    <article>
      {page.sample ? <SampleBanner /> : null}
      {hero ? null : (
        <header className="frame pt-16 md:pt-24">
          <h1 className="display max-w-5xl">{page.title}</h1>
          {showIntro ? <p className="mt-6 max-w-2xl text-lg leading-relaxed">{page.introduction}</p> : null}
        </header>
      )}
      {hero && showIntro ? (
        <p className="frame border-b border-line py-12 text-lg leading-relaxed md:py-16">{page.introduction}</p>
      ) : null}
      <PageBuilder sections={page.sections} journey={journey} />
    </article>
  );
}
