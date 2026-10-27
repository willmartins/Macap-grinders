export type Audience = "home" | "business";
export type AudienceFilter = Audience | "both";
export type GrinderStatus = "new" | "current" | "discontinued";
export type BurrType = "flat" | "conical";
export type GrindType = "espresso" | "filter" | "both";
export type ThemeName = "home" | "professional" | "neutral";

export type RichText = Array<{
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  alt?: string;
  asset?: unknown;
}>;

export type LinkItem = {
  _key: string;
  label: string;
  href: string;
};

export type FaqItem = {
  _key: string;
  question: string;
  answer: string;
};

export type SeoFields = {
  title: string;
  description: string;
  imageUrl?: string | null;
  noIndex?: boolean;
  canonical?: string | null;
};

export type ExtraSpec = {
  _key: string;
  label: string;
  value: string;
};

export type Specs = {
  burrType: BurrType | null;
  burrDiameterMm: number | null;
  motorPowerW: number | null;
  rpm: number | null;
  hopperCapacityG: number | null;
  outputGPerS: number | null;
  adjustment: string | null;
  widthMm: number | null;
  depthMm: number | null;
  heightMm: number | null;
  weightKg: number | null;
  voltage: string | null;
  display: string | null;
  grindType: GrindType | null;
  features: string[];
  extra: ExtraSpec[];
};

export type GrinderCard = {
  id: string;
  name: string;
  slug: string;
  audience: Audience;
  status: GrinderStatus;
  shortDescription: string;
  groupName: string | null;
  groupSlug: string | null;
  burrDiameterMm: number | null;
  burrType: BurrType | null;
  grindType: GrindType | null;
  motorPowerW: number | null;
  imageUrl: string | null;
  imageAlt: string;
  imageLqip?: string | null;
};

export type GalleryImage = {
  _key: string;
  url: string | null;
  alt: string;
  lqip?: string | null;
};

export type ArticleCard = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  topicTitle: string | null;
  topicSlug: string | null;
};

export type Grinder = GrinderCard & {
  answerFirst: string;
  gallery: GalleryImage[];
  specs: Specs;
  faqs: FaqItem[];
  relatedGrinders: GrinderCard[];
  relatedArticles: ArticleCard[];
  catalogueUrl: string | null;
  catalogueLabel: string | null;
  seo: SeoFields;
};

export type Group = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  audience: AudienceFilter;
};

export type CollectionCard = {
  name: string;
  slug: string;
  summary: string;
  audience: AudienceFilter;
};

export type Collection = CollectionCard & {
  id: string;
  answerFirst: string;
  grinders: GrinderCard[];
  sections: Section[];
  seo: SeoFields;
};

export type Author = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  sameAs: string[];
};

export type Topic = {
  title: string;
  slug: string;
  description: string;
  seo: SeoFields;
};

export type Post = ArticleCard & {
  updatedAt: string | null;
  answerFirst: string;
  author: Author;
  body: RichText;
  faqs: FaqItem[];
  relatedGrinders: GrinderCard[];
  imageUrl: string | null;
  imageAlt: string;
  imageLqip?: string | null;
  seo: SeoFields;
};

export type LegalPage = {
  title: string;
  slug: string;
  effectiveDate: string;
  body: RichText;
  seo: SeoFields;
};

export type FeatureItem = {
  _key: string;
  title: string;
  text: string;
};

export type Section =
  | {
      _key: string;
      _type: "heroBanner";
      eyebrow?: string;
      heading: string;
      text?: string;
      links: LinkItem[];
      imageUrl?: string | null;
      imageAlt?: string;
      imageLqip?: string | null;
    }
  | { _key: string; _type: "richText"; heading?: string; body: RichText }
  | {
      _key: string;
      _type: "imageText";
      heading: string;
      text: string;
      imageUrl: string | null;
      imageAlt: string;
      imageLqip?: string | null;
      imagePosition: "left" | "right";
      link?: LinkItem;
    }
  | {
      _key: string;
      _type: "grinderGrid";
      heading: string;
      intro?: string;
      grinders: GrinderCard[];
    }
  | {
      _key: string;
      _type: "collectionCarousel";
      heading: string;
      intro?: string;
      collections: CollectionCard[];
    }
  | {
      _key: string;
      _type: "featureList";
      heading: string;
      intro?: string;
      features: FeatureItem[];
    }
  | { _key: string; _type: "specTable"; heading?: string; grinder: Grinder | null }
  | {
      _key: string;
      _type: "comparisonTable";
      heading: string;
      intro?: string;
      grinders: Grinder[];
    }
  | { _key: string; _type: "faqAccordion"; heading: string; faqs: FaqItem[] }
  | {
      _key: string;
      _type: "ctaBanner";
      heading: string;
      text?: string;
      link: LinkItem;
      step?: string;
    }
  | {
      _key: string;
      _type: "videoEmbed";
      heading?: string;
      url: string;
      caption?: string;
    }
  | {
      _key: string;
      _type: "kbPostGrid";
      heading: string;
      intro?: string;
      posts: ArticleCard[];
    }
  | {
      _key: string;
      _type: "quote";
      quote: string;
      attribution: string;
      role?: string;
    }
  | { _key: string; _type: "contactBlock"; heading: string; text?: string };

export type SiteSettings = {
  siteName: string;
  navigation: LinkItem[];
  footerNavigation: LinkItem[];
  socials: LinkItem[];
  email: string;
  phone: string;
  address: string;
  organisation: {
    name: string;
    legalName: string;
    url: string;
    email: string;
    telephone: string;
    address: string;
    sameAs: string[];
  };
  seo: SeoFields;
};

export type Shell = {
  sample: boolean;
  settings: SiteSettings;
  collections: CollectionCard[];
  legal: Array<{ title: string; slug: string }>;
};

export type PageDocument = {
  title: string;
  introduction: string;
  sections: Section[];
  seo: SeoFields;
  sample: boolean;
};

export type Journey = PageDocument & {
  slug: string;
  audience: Audience;
};
