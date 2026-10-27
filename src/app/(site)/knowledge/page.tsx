import { Suspense } from "react";

import { PhotoSlot } from "@/components/site/photo-slot";
import { TextLink } from "@/components/site/text-link";
import { ContentPage } from "@/components/site/content-page";
import { articleShot } from "@/lib/imagery";
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
      <section className="frame section">
        <h2 className="display-sm">Topics</h2>
        <ol className="module-grid mt-8">
          {topics.topics.map((topic) => (
            <li key={topic.slug}>
              <h3 className="text-2xl font-medium tracking-tight">
                <TextLink href={`/knowledge/topic/${topic.slug}`} className="underline-offset-4 hover:underline">
                  {topic.title}
                </TextLink>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{topic.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="frame section">
        <h2 className="display-sm">Articles</h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {posts.posts.map((post) => {
            const shot = articleShot(post.slug);
            return (
              <li key={post.slug} className="grid items-center gap-6 py-6 md:grid-cols-12">
                {shot ? (
                  <a href={`/knowledge/${post.slug}`} className="md:col-span-3">
                    <PhotoSlot imageUrl={shot.src} alt={shot.alt} ratio="16/9" sizes="(min-width: 768px) 18rem, 100vw" />
                  </a>
                ) : null}
                <div className={shot ? "md:col-span-7" : "md:col-span-10"}>
                  <h3 className="text-2xl font-medium tracking-tight">
                    <TextLink href={`/knowledge/${post.slug}`} className="underline-offset-4 hover:underline">
                      {post.title}
                    </TextLink>
                  </h3>
                  <p className="mt-2 max-w-xl text-muted">{post.excerpt}</p>
                </div>
                <p className="label text-muted md:col-span-2 md:text-right">
                  {post.topicTitle ? `${post.topicTitle} / ` : ""}
                  {formatDate(post.publishedAt)}
                </p>
              </li>
            );
          })}
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
