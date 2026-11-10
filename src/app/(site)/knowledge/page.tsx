import { Suspense } from "react";

import { PhotoSlot } from "@/components/site/photo-slot";
import { SectionHeader } from "@/components/site/section-header";
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
      <section className="section border-b border-silver">
        <div className="frame">
          <SectionHeader title="Topics" />
          <ol className="module-grid mt-8">
            {topics.topics.map((topic) => (
              <li key={topic.slug} className="border-t border-silver pt-5">
                <h3 className="type-h3 text-black">
                  <TextLink href={`/knowledge/topic/${topic.slug}`} className="link-underline">
                    {topic.title}
                  </TextLink>
                </h3>
                <p className="type-body mt-2 max-w-prose text-grey">{topic.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section border-b border-silver">
        <div className="frame">
          <SectionHeader title="Articles" />
          <ul className="mt-8 divide-y divide-silver border-y border-silver">
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
                    <h3 className="type-h3 text-black">
                      <TextLink href={`/knowledge/${post.slug}`} className="link-underline">
                        {post.title}
                      </TextLink>
                    </h3>
                    <p className="type-body mt-2 max-w-xl text-grey">{post.excerpt}</p>
                  </div>
                  <p className="type-eyebrow text-grey md:col-span-2 md:text-right">
                    {post.topicTitle ? <span className="block">{post.topicTitle}</span> : null}
                    <span className="mt-1 block">{formatDate(post.publishedAt)}</span>
                  </p>
                </li>
              );
            })}
          </ul>
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
