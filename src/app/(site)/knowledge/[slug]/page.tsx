import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GrinderGrid } from "@/components/grinders/grinder-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { BleedHero } from "@/components/site/bleed-hero";
import { RichTextBody } from "@/components/site/rich-text";
import { SampleBanner } from "@/components/site/sample-banner";
import { formatDate } from "@/lib/format";
import { articleJsonLd, faqJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { draftPerspective } from "@/sanity/lib/draft";
import { loadPost, loadPosts } from "@/sanity/lib/load";

export async function generateStaticParams() {
  const { posts } = await loadPosts("published");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadPost(slug, "published");
  if (!loaded) return {};
  const { post } = loaded;
  return buildMetadata({
    title: post.seo.title || post.title,
    description: post.seo.description || post.answerFirst || post.excerpt,
    path: `/knowledge/${post.slug}`,
    noIndex: post.seo.noIndex,
    canonical: post.seo.canonical,
    image: post.seo.imageUrl || post.imageUrl,
    type: "article",
  });
}

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadPost(slug, await draftPerspective());
  if (!loaded) notFound();
  const { post, sample } = loaded;
  return (
    <article>
      {sample ? <SampleBanner /> : null}
      <Breadcrumbs
        items={[
          { name: "Knowledge", path: "/knowledge" },
          ...(post.topicSlug && post.topicTitle
            ? [{ name: post.topicTitle, path: `/knowledge/topic/${post.topicSlug}` }]
            : []),
          { name: post.title, path: `/knowledge/${post.slug}` },
        ]}
      />
      {post.imageUrl ? (
        <BleedHero
          imageUrl={post.imageUrl}
          alt={post.imageAlt}
          eyebrow={post.topicTitle || "Knowledge"}
          title={post.title}
          short
        />
      ) : (
        <header className="frame pt-16 md:pt-24">
          <h1 className="display-sm max-w-4xl">{post.title}</h1>
        </header>
      )}
      <div className="frame py-12">
        <p className="max-w-2xl text-xl leading-snug">{post.answerFirst}</p>
        <p className="label mt-6 text-muted">
          {post.author.name}
          {post.publishedAt ? ` / ${formatDate(post.publishedAt)}` : ""}
          {post.updatedAt ? ` / Updated ${formatDate(post.updatedAt)}` : ""}
        </p>
      </div>
      <div className="frame pb-10">
        <RichTextBody value={post.body} />
      </div>
      {post.faqs.length ? (
        <section className="frame pb-12">
          <h2 className="text-3xl font-medium tracking-tight">Questions</h2>
          <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
            {post.faqs.map((faq) => (
              <details key={faq._key} className="py-4">
                <summary className="cursor-pointer font-medium">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
      {post.relatedGrinders.length ? (
        <section className="frame pb-24">
          <h2 className="mb-6 text-3xl font-medium tracking-tight">Grinders in this note</h2>
          <GrinderGrid grinders={post.relatedGrinders} />
        </section>
      ) : null}
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.answerFirst || post.excerpt,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.author.name,
          imageUrl: post.imageUrl,
        })}
      />
      <JsonLd data={faqJsonLd(post.faqs)} />
    </article>
  );
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted">Loading.</p>}>
      <PostContent params={params} />
    </Suspense>
  );
}
