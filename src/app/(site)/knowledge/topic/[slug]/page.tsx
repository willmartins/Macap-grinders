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
      <header className="section-tight border-b border-silver">
        <div className="frame">
          <h1 className="type-h1 max-w-4xl text-black">{topic.title}</h1>
          <p className="type-lead mt-5 max-w-2xl text-grey">{topic.description}</p>
        </div>
      </header>
      <div className="section border-b border-silver">
        <div className="frame">
          <ul className="divide-y divide-silver border-y border-silver">
            {related.length ? (
              related.map((post) => (
                <li key={post.slug} className="grid items-baseline gap-2 py-6 md:grid-cols-12">
                  <div className="md:col-span-9">
                    <h2 className="type-h3 text-black">
                      <TextLink href={`/knowledge/${post.slug}`} className="link-underline">
                        {post.title}
                      </TextLink>
                    </h2>
                    <p className="type-body mt-2 max-w-xl text-grey">{post.excerpt}</p>
                  </div>
                  <p className="type-eyebrow text-grey md:col-span-3 md:text-right">{formatDate(post.publishedAt)}</p>
                </li>
              ))
            ) : (
              <li className="type-body py-6 text-grey">No articles in this topic yet.</li>
            )}
          </ul>
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
