import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function imageUrl(
  image: { asset?: unknown } | null | undefined,
  width: number,
  height?: number,
): string | null {
  if (!image?.asset) return null;
  // The URL builder accepts the Sanity image object, including crop and hotspot.
  let request = urlFor(image as SanityImageSource).width(width).auto("format");
  if (height) request = request.height(height).fit("crop");
  return request.url();
}
