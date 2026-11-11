import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleGrid } from "@/components/knowledge/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TextLink } from "@/components/site/text-link";
import { SampleBanner } from "@/components/site/sample-banner";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadPosts, loadTopics } from "@/sanity/lib/load";

export async function generateStaticParams() {
  const { topics } = await loadTopics("published");
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { topics } = await loadTopics("published");
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) return {};
  return buildMetadata({
    title: topic.seo.title || topic.title,
    description: topic.seo.description || topic.description,
    path: `/knowledge/topic/${topic.slug}`,
    noIndex: topic.seo.noIndex,
    canonical: topic.seo.canonical,
  });
}

async function TopicContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const perspective = await draftPerspective();
  const [topics, posts] = await Promise.all([loadTopics(perspective), loadPosts(perspective)]);
  const topic = topics.topics.find((item) => item.slug === slug);
  if (!topic) notFound();
  const related = posts.posts.filter((post) => post.topicSlug === slug);
  return (
    <article>
      {topics.sample || posts.sample ? <SampleBanner /> : null}
      <Breadcrumbs
        items={[
          { name: "Knowledge", path: "/knowledge" },
          { name: topic.title, path: `/knowledge/topic/${topic.slug}` },
        ]}
      />
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <h1 className="type-h1 max-w-4xl text-black">{topic.title}</h1>
          <p className="type-lead mt-5 max-w-2xl text-grey">{topic.description}</p>
        </div>
      </header>
      <div className="section">
        <div className="frame">
          {related.length ? (
            <ArticleGrid posts={related} priorityFirst />
          ) : (
            <p className="type-body text-grey">No articles in this topic yet.</p>
          )}
          <p className="mt-10">
            <TextLink href="/knowledge" className="tap type-body font-semibold text-black link-underline">
              All articles
            </TextLink>
          </p>
        </div>
      </div>
    </article>
  );
}

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <TopicContent params={params} />
    </Suspense>
  );
}
