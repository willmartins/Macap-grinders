import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TextLink } from "@/components/site/text-link";
import { SampleBanner } from "@/components/site/sample-banner";
import { formatDate } from "@/lib/format";
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
      <header className="frame section-tight">
        <h1 className="display">{topic.title}</h1>
        <p className="mt-6 max-w-2xl text-lg">{topic.description}</p>
      </header>
      <ul className="frame section-tight grid gap-[var(--gap-inner)]">
        {related.length ? (
          related.map((post) => (
            <li key={post.slug} className="border-b border-line py-5">
              <h2 className="text-xl font-medium">
                <TextLink href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                  {post.title}
                </TextLink>
              </h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-2 text-sm text-muted">{formatDate(post.publishedAt)}</p>
            </li>
          ))
        ) : (
          <li>No articles in this topic yet.</li>
        )}
      </ul>
    </article>
  );
}

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <TopicContent params={params} />
    </Suspense>
  );
}
