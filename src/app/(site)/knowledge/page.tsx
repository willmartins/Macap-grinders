import { Suspense } from "react";

import { ContentPage } from "@/components/site/content-page";
import { JsonLd } from "@/components/site/json-ld";
import { SampleBanner } from "@/components/site/sample-banner";
import { formatDate } from "@/lib/format";
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
  return (
    <>
      {posts.sample && !page.sample ? <SampleBanner /> : null}
      <ContentPage page={page} />
      <section className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
        <h2 className="text-3xl font-medium tracking-tight">Topics</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {topics.topics.map((topic) => (
            <li key={topic.slug} className="border border-line p-5">
              <h3 className="text-lg font-medium">
                <a href={`/knowledge/topic/${topic.slug}`} className="underline-offset-4 hover:underline">
                  {topic.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-muted">{topic.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <h2 className="text-3xl font-medium tracking-tight">Articles</h2>
        <ul className="mt-6 grid gap-4">
          {posts.posts.map((post) => (
            <li key={post.slug} className="border-b border-line py-5">
              <h3 className="text-xl font-medium">
                <a href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                  {post.title}
                </a>
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-muted">{post.excerpt}</p>
              <p className="mt-2 text-sm text-muted">
                {post.topicTitle ? `${post.topicTitle} · ` : ""}
                {formatDate(post.publishedAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd data={articleCardsJsonLd(posts.posts, "/knowledge")} />
    </>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <KnowledgeContent />
    </Suspense>
  );
}
