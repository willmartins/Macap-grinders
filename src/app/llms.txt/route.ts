import { buildLlmsIndex } from "@/lib/llms";
import { loadGrinderCards, loadPosts, loadShell } from "@/sanity/lib/load";

export async function GET() {
  const [catalogue, posts, shell] = await Promise.all([
    loadGrinderCards("published"),
    loadPosts("published"),
    loadShell("published"),
  ]);
  const body = buildLlmsIndex({
    grinders: catalogue.grinders,
    collections: shell.collections,
    posts: posts.posts,
  });
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
