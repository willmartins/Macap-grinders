import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FaqList } from "@/components/grinders/faq-list";
import { GrinderGrid } from "@/components/grinders/grinder-card";
import { ArticleGrid } from "@/components/knowledge/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { BleedHero } from "@/components/site/bleed-hero";
import { bodySections, RichTextBody } from "@/components/site/rich-text";
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
  const perspective = await draftPerspective();
  const [loaded, all] = await Promise.all([loadPost(slug, perspective), loadPosts(perspective)]);
  if (!loaded) notFound();
  const { post, sample } = loaded;
  const sections = bodySections(post.body);
  // Up to three more articles: the same topic first, then the newest.
  const others = all.posts.filter((item) => item.slug !== post.slug);
  const more = [
    ...others.filter((item) => item.topicSlug && item.topicSlug === post.topicSlug),
    ...others.filter((item) => !item.topicSlug || item.topicSlug !== post.topicSlug),
  ].slice(0, 3);
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
      {/* The answer first, then who wrote it. Without a photograph it sits under the title as one opening. */}
      <div className={`border-b border-silver ${post.imageUrl ? "section-tight" : "pt-5 pb-[var(--space-tight)]"}`}>
        <div className="frame grid gap-6 lg:grid-cols-12 lg:gap-[var(--gap-block)]">
          <p className="type-eyebrow text-grey lg:col-span-3 lg:pt-1.5">In short</p>
          <div className="lg:col-span-8">
            <p className="type-lead max-w-prose text-black">{post.answerFirst}</p>
            <p className="type-body mt-6 text-grey">
              <span className="font-semibold text-black">{post.author.name}</span>
              {post.publishedAt ? <span>{` · ${formatDate(post.publishedAt)}`}</span> : null}
              {post.updatedAt ? <span>{` · Updated ${formatDate(post.updatedAt)}`}</span> : null}
            </p>
            {post.author.bio ? <p className="type-body mt-1 max-w-prose text-grey">{post.author.bio}</p> : null}
          </div>
        </div>
      </div>

      {/* The body, with a contents list beside it on a wide screen and above it on a narrow one. */}
      <div className="section border-b border-silver">
        <div className="frame grid gap-8 lg:grid-cols-12 lg:gap-[var(--gap-block)]">
          {sections.length >= 3 ? (
            <aside className="lg:col-span-3">
              <details className="group border-y border-silver lg:hidden">
                <summary className="type-eyebrow cursor-pointer justify-between py-4 text-black">
                  Contents
                  <span aria-hidden="true" className="text-grey">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <ContentsList sections={sections} />
              </details>
              <nav aria-label="Contents" className="sticky top-[calc(var(--header-h,4.5rem)+1.5rem)] hidden lg:block">
                <p className="type-eyebrow text-grey">Contents</p>
                <ContentsList sections={sections} />
              </nav>
            </aside>
          ) : null}
          <div className={sections.length >= 3 ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-4"}>
            <RichTextBody value={post.body} />
          </div>
        </div>
      </div>
      {post.faqs.length ? (
        <section className="section border-b border-silver">
          <div className="frame">
            <SectionHeader title="Questions" />
            <div className="mt-8 max-w-3xl">
              <FaqList faqs={post.faqs} collapsed />
            </div>
          </div>
        </section>
      ) : null}
      {post.relatedGrinders.length ? (
        <section className="section border-b border-silver">
          <div className="frame">
            <SectionHeader title="Grinders in this article" />
            <div className="mt-8">
              <GrinderGrid grinders={post.relatedGrinders} />
            </div>
          </div>
        </section>
      ) : null}
      {more.length ? (
        <section className="section" aria-labelledby="more-heading">
          <div className="frame">
            <SectionHeader
              id="more-heading"
              title="More articles"
              className="mb-8"
              action={
                <TextLink href="/knowledge" className="tap type-body font-semibold text-black link-underline">
                  All articles
                </TextLink>
              }
            />
            <ArticleGrid posts={more} />
          </div>
        </section>
      ) : null}
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

function ContentsList({ sections }: { sections: Array<{ id: string; text: string }> }) {
  return (
    <ol className="mt-3 grid gap-2.5 pb-4 lg:pb-0">
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="type-body text-grey hover:text-black link-underline">
            {section.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="frame section type-body text-grey">Loading.</p>}>
      <PostContent params={params} />
    </Suspense>
  );
}
