import { sampleGrinders, samplePosts } from "@/lib/content/sample";
import { buildLlmsFull } from "@/lib/llms";
import type { Grinder, Post } from "@/lib/content/types";
import { loadGrinder, loadGrinderCards, loadPost, loadPosts } from "@/sanity/lib/load";

export async function GET() {
  const [catalogue, posts] = await Promise.all([loadGrinderCards("published"), loadPosts("published")]);
  const grinders: Grinder[] = [];
  if (catalogue.sample) {
    grinders.push(...sampleGrinders);
  } else {
    for (const card of catalogue.grinders) {
      const loaded = await loadGrinder(card.slug, "published");
      if (loaded && !loaded.sample) grinders.push(loaded.grinder);
    }
  }
  const articles: Post[] = [];
  if (posts.sample) {
    articles.push(...samplePosts);
  } else {
    for (const card of posts.posts) {
      const loaded = await loadPost(card.slug, "published");
      if (loaded && !loaded.sample) articles.push(loaded.post);
    }
  }
  return new Response(buildLlmsFull(grinders, articles), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
