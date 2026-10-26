import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

type WebhookBody = {
  _type?: string;
  slug?: string;
  tags?: string[];
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("Revalidation is not configured.", { status: 501 });
  }

  const { isValidSignature, body } = await parseBody<WebhookBody>(request, secret, true);
  if (!isValidSignature) {
    return new Response("Invalid signature.", { status: 401 });
  }

  const tags = new Set<string>();
  for (const tag of body?.tags || []) {
    if (tag) tags.add(tag);
  }
  if (body?._type) tags.add(body._type);
  if (body?._type && body.slug) tags.add(`${body._type}:${body.slug}`);

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: [...tags] });
}
