import Image from "next/image";

import { ArrowText } from "@/components/site/text-link";
import type { ArticleCard } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { articleShot } from "@/lib/imagery";

/**
 * An article on a card. It shares the grinder card's frame and foot, so the knowledge base
 * reads as part of the same site. The whole card is one link.
 */
export function ArticleCardView({ post, priority = false }: { post: ArticleCard; priority?: boolean }) {
  const sample = articleShot(post.slug);
  const imageUrl = post.imageUrl || sample?.src || null;
  const date = post.publishedAt ? formatDate(post.publishedAt) : "";
  const accessible = [post.title, post.topicTitle, date, "Read article"].filter(Boolean).join(", ");
  return (
    <a className="machine-card" href={`/knowledge/${post.slug}`} aria-label={accessible}>
      <div className="machine-plinth machine-plinth-wide">
        {imageUrl ? (
          <div className="machine-shot machine-shot-cover">
            <Image
              src={imageUrl}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 84vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
      <div className="machine-foot">
        <p className="type-eyebrow text-grey">
          {post.topicTitle ? <span>{post.topicTitle}</span> : null}
          {post.topicTitle && date ? <span aria-hidden="true"> · </span> : null}
          {date ? <span>{date}</span> : null}
        </p>
        <h3 className="machine-name">{post.title}</h3>
        {post.excerpt ? <p className="type-body text-grey">{post.excerpt}</p> : null}
        <div className="machine-end">
          <p className="machine-go">
            <ArrowText>Read article</ArrowText>
          </p>
        </div>
      </div>
    </a>
  );
}

export function ArticleGrid({ posts, priorityFirst = false }: { posts: ArticleCard[]; priorityFirst?: boolean }) {
  return (
    <ul className="machine-grid">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <ArticleCardView post={post} priority={priorityFirst && index < 3} />
        </li>
      ))}
    </ul>
  );
}
