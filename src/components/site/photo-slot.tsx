import Image from "next/image";

export function PhotoSlot({
  imageUrl,
  alt,
  sizes,
  priority = false,
}: {
  imageUrl?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      ) : (
        <p className="absolute inset-x-0 bottom-0 p-6 text-sm text-muted">Photography to follow.</p>
      )}
    </div>
  );
}
