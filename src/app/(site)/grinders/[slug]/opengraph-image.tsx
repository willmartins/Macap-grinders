import { brandOpenGraph, ogContentType, ogSize } from "@/lib/og-card";
import { loadGrinder } from "@/sanity/lib/load";

export const alt = "Macap coffee grinder";
export const size = ogSize;
export const contentType = ogContentType;

export default async function GrinderOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadGrinder(slug, "published");
  const name = loaded?.grinder.name || "Macap";
  const line = loaded?.grinder.answerFirst || loaded?.grinder.shortDescription || "Coffee grinder";
  return brandOpenGraph(name, line);
}
