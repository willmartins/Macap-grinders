import { Suspense } from "react";

import { ArticleGrid } from "@/components/knowledge/article-card";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { ContentPage } from "@/components/site/content-page";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { articleCardsJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadKnowledgeHub, loadPosts, loadTopics } from "@/sanity/lib/load";

export async function generateMetadata() {
  const page = await loadKnowledgeHub("published");
  return buildMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.introduction,
    path: "/knowledge",
    noIndex: page.seo.noIndex,
    canonical: page.seo.canonical,
  });
}

async function KnowledgeContent() {
  const perspective = await draftPerspective();
  const [page, posts, topics] = await Promise.all([
    loadKnowledgeHub(perspective),
    loadPosts(perspective),
    loadTopics(perspective),
  ]);
  const count = (slug: string) => posts.posts.filter((post) => post.topicSlug === slug).length;
  return (
    <>
      {posts.sample && !page.sample ? <SampleBanner /> : null}
      <ContentPage page={page} />
      {/* Topics as one row of links, then every article as a card. */}
      <section className="section" aria-labelledby="articles-heading">
        <div className="frame">
          <nav aria-label="Topics" className="mb-[var(--gap-block)] flex flex-wrap items-baseline gap-x-8 gap-y-3 border-b border-silver pb-6">
            <p className="type-eyebrow text-grey">Topics</p>
            {topics.topics.map((topic) => (
              <TextLink
                key={topic.slug}
                href={`/knowledge/topic/${topic.slug}`}
                className="tap type-body font-semibold text-black link-underline"
              >
                {`${topic.title} (${count(topic.slug)})`}
              </TextLink>
            ))}
          </nav>
          <SectionHeader id="articles-heading" title="Articles" className="mb-8" />
          <ArticleGrid posts={posts.posts} priorityFirst />
        </div>
      </section>
      <JsonLd data={articleCardsJsonLd(posts.posts, "/knowledge")} />
    </>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <KnowledgeContent />
    </Suspense>
  );
}
