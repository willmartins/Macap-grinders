import type { CollectionCard, Grinder, Post } from "@/lib/content/types";
import { specEntries } from "@/lib/specs";
import { getSiteUrl } from "@/lib/site";

function abs(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function buildLlmsIndex(input: {
  grinders: Array<{ name: string; slug: string; shortDescription: string }>;
  collections: CollectionCard[];
  posts: Array<{ title: string; slug: string; excerpt: string }>;
}): string {
  const lines = [
    "# Macap",
    "",
    "> Macap designs and manufactures coffee grinders in Italy, for the home and for the bar.",
    "",
    "Macap has made coffee grinders in the Venice area since 1930.",
    "",
    "## Journeys",
    "",
    `- [Home grinders](${abs("/home-grinders")}): Studio grinders for a domestic counter.`,
    `- [Professional](${abs("/professional")}): Supra, Supra G, Pro and Leo for the bar.`,
    `- [All grinders](${abs("/grinders")}): filter the range.`,
    `- [Compare](${abs("/compare")}): two or three grinders, side by side.`,
    `- [Knowledge](${abs("/knowledge")}): notes on choosing, dialling in and care.`,
    `- [Contact](${abs("/contact")})`,
    "",
    "## Grinders",
    "",
    ...input.grinders.map(
      (grinder) => `- [${grinder.name}](${abs(`/grinders/${grinder.slug}`)}): ${grinder.shortDescription}`,
    ),
    "",
    "## Collections",
    "",
    ...input.collections.map(
      (collection) =>
        `- [${collection.name}](${abs(`/collections/${collection.slug}`)}): ${collection.summary}`,
    ),
    "",
    "## Knowledge",
    "",
    ...input.posts.map((post) => `- [${post.title}](${abs(`/knowledge/${post.slug}`)}): ${post.excerpt}`),
    "",
  ];
  return lines.join("\n");
}

export function buildLlmsFull(grinders: Grinder[], posts: Post[]): string {
  const blocks = [
    "# Macap, full notes",
    "",
    "Figures marked as sample are not final. Confirm them before you quote a specification.",
    "",
  ];
  for (const grinder of grinders) {
    blocks.push(`## ${grinder.name}`, "", grinder.answerFirst, "", grinder.shortDescription, "");
    for (const row of specEntries(grinder)) {
      blocks.push(`- ${row.label}: ${row.value}`);
    }
    blocks.push("", `Page: ${abs(`/grinders/${grinder.slug}`)}`, "");
  }
  for (const post of posts) {
    blocks.push(`## ${post.title}`, "", post.answerFirst, "", post.excerpt, "");
    blocks.push(`Page: ${abs(`/knowledge/${post.slug}`)}`, "");
  }
  return blocks.join("\n");
}
