import Image from "next/image";

import { ArrowText } from "@/components/site/text-link";
import type { CollectionCard, RangeCard } from "@/lib/content/types";
import { collectionShot } from "@/lib/imagery";
import { collectionPath, rangePath } from "@/lib/paths";

/**
 * Range and collection cards. They share the grinder card's frame, plinth and foot,
 * so a range, a collection and a model read as one family. Each card is one link.
 */

function modelCount(count: number): string {
  return count === 1 ? "1 model" : `${count} models`;
}

export function RangeCardView({ range }: { range: RangeCard }) {
  const accessible = [range.name, range.summary, range.modelCount ? modelCount(range.modelCount) : "", "View range"]
    .filter(Boolean)
    .join(", ");
  return (
    <a className="machine-card" href={rangePath(range.slug)} aria-label={accessible}>
      <div className="machine-plinth machine-plinth-wide">
        {range.imageUrl ? (
          <div className={range.imageKind === "photo" ? "machine-shot machine-shot-cover" : "machine-shot"}>
            <Image
              src={range.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 84vw"
              className={range.imageKind === "photo" ? "object-cover" : "object-contain"}
            />
          </div>
        ) : (
          <p className="type-eyebrow text-grey">Photography to follow</p>
        )}
      </div>
      <div className="machine-foot">
        <p className="type-eyebrow text-grey">Range</p>
        <h3 className="machine-name">{range.name}</h3>
        {range.summary ? <p className="type-body text-grey">{range.summary}</p> : null}
        <div className="machine-end">
          <p className="type-eyebrow text-grey">{range.modelCount ? modelCount(range.modelCount) : ""}</p>
          <p className="machine-go">
            <ArrowText>View range</ArrowText>
          </p>
        </div>
      </div>
    </a>
  );
}

export function CollectionCardView({ collection }: { collection: CollectionCard }) {
  const shot = collection.imageUrl
    ? { src: collection.imageUrl, alt: collection.imageAlt || "" }
    : collectionShot(collection.slug);
  const accessible = [collection.name, collection.summary, "View collection"].filter(Boolean).join(", ");
  return (
    <a className="machine-card" href={collectionPath(collection.slug)} aria-label={accessible}>
      <div className="machine-plinth machine-plinth-wide">
        {shot ? (
          <div className="machine-shot machine-shot-cover">
            <Image
              src={shot.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 84vw"
              className="object-cover"
            />
          </div>
        ) : (
          <p className="type-eyebrow text-grey">Photography to follow</p>
        )}
      </div>
      <div className="machine-foot">
        <p className="type-eyebrow text-grey">Collection</p>
        <h3 className="machine-name">{collection.name}</h3>
        {collection.summary ? <p className="type-body text-grey">{collection.summary}</p> : null}
        <div className="machine-end">
          <p className="machine-go">
            <ArrowText>View collection</ArrowText>
          </p>
        </div>
      </div>
    </a>
  );
}

export function RangeGrid({ ranges }: { ranges: RangeCard[] }) {
  return (
    <ul className="machine-grid">
      {ranges.map((range) => (
        <li key={range.id}>
          <RangeCardView range={range} />
        </li>
      ))}
    </ul>
  );
}

export function CollectionGrid({ collections }: { collections: CollectionCard[] }) {
  return (
    <ul className="machine-grid">
      {collections.map((collection) => (
        <li key={collection.slug}>
          <CollectionCardView collection={collection} />
        </li>
      ))}
    </ul>
  );
}
