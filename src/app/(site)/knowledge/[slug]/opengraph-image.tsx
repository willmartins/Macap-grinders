import { brandOpenGraph, ogContentType, ogSize } from "@/lib/og-card";
import { loadPost } from "@/sanity/lib/load";

export const alt = "Macap knowledge";
export const size = ogSize;
export const contentType = ogContentType;

export default async function PostOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadPost(slug, "published");
  const title = loaded?.post.title || "Macap knowledge";
  const line = loaded?.post.answerFirst || loaded?.post.excerpt || "Notes on choosing and using a Macap grinder.";
  return brandOpenGraph(title, line);
}
