import Image from "next/image";

const ratioClass = {
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]",
} as const;

export function PhotoSlot({
  imageUrl,
  alt,
  sizes,
  priority = false,
  ratio = "4/3",
  fit = "cover",
}: {
  imageUrl?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  ratio?: keyof typeof ratioClass;
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`relative overflow-hidden bg-surface ${ratioClass[ratio]}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={fit === "contain" ? "object-contain media-img" : "object-cover media-img"}
        />
      ) : (
        <p className="label absolute inset-x-0 bottom-0 p-4 text-muted">Photography to follow</p>
      )}
    </div>
  );
}
