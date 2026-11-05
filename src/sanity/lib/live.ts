import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";

/**
 * The read token stays on the server. Draft preview in the Presentation tool
 * uses the draft-mode route. A browser token is intentionally omitted so a
 * viewer token is never shipped to the public site.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken || false,
  browserToken: false,
  strict: true,
});
