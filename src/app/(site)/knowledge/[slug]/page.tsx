import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FaqList } from "@/components/grinders/faq-list";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { BleedHero } from "@/components/site/bleed-hero";
import { RichTextBody } from "@/components/site/rich-text";
import { SectionHeader } from "@/components/site/section-header";
import { TextLink } from "@/components/site/text-link";
import { SampleBanner } from "@/components/site/sample-banner";
import { formatDate } from "@/lib/format";
import { articleJsonLd, faqJsonLd, jsonLdGraph } from "@/lib/jsonld";
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
    image: post.seo.imageUrl,
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
      {post.imageUrl ? (
        <BleedHero
          imageUrl={post.imageUrl}
          alt={post.imageAlt}
          blur={post.imageLqip}
          eyebrow={post.topicTitle || undefined}
          title={post.title}
          short
          crumbs={
            <Breadcrumbs
              bare
              items={[
                { name: "Knowledge", path: "/knowledge" },
                ...(post.topicSlug && post.topicTitle
                  ? [{ name: post.topicTitle, path: `/knowledge/topic/${post.topicSlug}` }]
                  : []),
                { name: post.title, path: `/knowledge/${post.slug}` },
              ]}
            />
          }
        />
      ) : (
        <>
          <Breadcrumbs
            items={[
              { name: "Knowledge", path: "/knowledge" },
              ...(post.topicSlug && post.topicTitle
                ? [{ name: post.topicTitle, path: `/knowledge/topic/${post.topicSlug}` }]
                : []),
              { name: post.title, path: `/knowledge/${post.slug}` },
            ]}
          />
          <header className="pt-[var(--space-tight)]">
            <div className="frame">
              {post.topicTitle ? <p className="type-eyebrow mb-3 text-grey">{post.topicTitle}</p> : null}
              <h1 className="type-h1 max-w-4xl text-black">{post.title}</h1>
            </div>
          </header>
        </>
      )}
      {/* Without a photograph the introduction sits under the title as one opening. */}
      <div className={`border-b border-silver ${post.imageUrl ? "section-tight" : "pt-5 pb-[var(--space-tight)]"}`}>
        <div className="frame">
          <p className="type-lead max-w-2xl text-black">{post.answerFirst}</p>
          <p className="type-body mt-6 max-w-2xl text-grey">
            <span className="block font-semibold text-black">{post.author.name}</span>
            {post.author.role ? <span className="block">{post.author.role}</span> : null}
            {post.publishedAt ? <span className="block">{formatDate(post.publishedAt)}</span> : null}
            {post.updatedAt ? <span className="block">Updated {formatDate(post.updatedAt)}</span> : null}
          </p>
          {post.author.bio ? <p className="type-body mt-4 max-w-prose text-grey">{post.author.bio}</p> : null}
        </div>
      </div>
      <div className="section border-b border-silver">
        <div className="frame">
          <RichTextBody value={post.body} />
        </div>
      </div>
      {post.faqs.length ? (
        <section className="section border-b border-silver">
          <div className="frame">
            <SectionHeader title="Questions" />
            <div className="mt-8 max-w-3xl">
              <FaqList faqs={post.faqs} />
            </div>
          </div>
        </section>
      ) : null}
      {post.relatedGrinders.length ? (
        <section className="section border-b border-silver">
          <div className="frame">
            <SectionHeader title="Grinders in this note" />
            <div className="mt-8">
              <GrinderGrid grinders={post.relatedGrinders} />
            </div>
          </div>
        </section>
      ) : null}
      <p className="frame section-tight">
        <TextLink href="/knowledge" className="tap link-underline font-semibold">
          All articles
        </TextLink>
      </p>
      <JsonLd
        data={jsonLdGraph([
          articleJsonLd({
            title: post.title,
            description: post.answerFirst || post.excerpt,
            slug: post.slug,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            authorName: post.author.name,
            authorRole: post.author.role,
            authorBio: post.author.bio,
            authorSameAs: post.author.sameAs,
            imageUrl: post.imageUrl,
          }),
          faqJsonLd(post.faqs),
        ])}
      />
    </article>
  );
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <PostContent params={params} />
    </Suspense>
  );
}
