import { draftMode } from "next/headers";

export type Perspective = "published" | "drafts";

/** Call this outside a `use cache` function. Draft mode reads cookies. */
export async function draftPerspective(): Promise<Perspective> {
  const mode = await draftMode();
  return mode.isEnabled ? "drafts" : "published";
}
