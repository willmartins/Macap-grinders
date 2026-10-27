import { defineQuery } from "next-sanity";

const card = `{
  _id,
  name,
  "slug": slug.current,
  audience,
  status,
  shortDescription,
  "groupName": group->name,
  "groupSlug": group->slug.current,
  "burrDiameterMm": specs.burrDiameterMm,
  "burrType": specs.burrType,
  "grindType": specs.grindType,
  "motorPowerW": specs.motorPowerW,
  "imageAlt": heroImage.alt,
  heroImage
}`;

const articleCard = `{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "topicTitle": topic->title,
  "topicSlug": topic->slug.current
}`;

const specs = `{
  burrType,
  burrDiameterMm,
  grindType,
  motorPowerW,
  rpm,
  hopperCapacityG,
  outputGPerS,
  adjustment,
  "widthMm": dimensions.widthMm,
  "depthMm": dimensions.depthMm,
  "heightMm": dimensions.heightMm,
  weightKg,
  voltage,
  display,
  features
}`;

const link = `{ _key, label, href }`;

export const SHELL_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    siteName,
    navigation[]${link},
    footerNavigation[]${link},
    socials[]${link},
    email,
    phone,
    address,
    organisation{ name, legalName, url, email, telephone, address, sameAs },
    "seoTitle": seo.title,
    "seoDescription": seo.description
  },
  "collections": *[_type == "grinderCollection" && language == "en-GB"]|order(name asc){
    name, "slug": slug.current, summary, audience
  },
  "legal": *[_type == "legalPage" && language == "en-GB"]|order(title asc){
    title, "slug": slug.current
  }
}`);

export const HOME_QUERY = defineQuery(`*[_id == "homePage"][0]{
  title,
  introduction,
  sections[]{
    _key,
    _type,
    eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt,
    "imagePosition": imagePosition,
    image,
    links[]${link},
    link${link},
    body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical
}`);

export const JOURNEY_QUERY = defineQuery(`*[_type == "journeyPage" && slug.current == $slug && language == "en-GB"][0]{
  title,
  "slug": slug.current,
  audience,
  introduction,
  sections[]{
    _key,
    _type,
    eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt,
    imagePosition,
    image,
    links[]${link},
    link${link},
    body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical
}`);

export const SIMPLE_PAGE_QUERY = defineQuery(`*[_id == $id][0]{
  title,
  introduction,
  sections[]{
    _key, _type, eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt, imagePosition, image,
    links[]${link}, link${link}, body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical
}`);

export const GRINDERS_QUERY = defineQuery(`*[_type == "grinder" && language == "en-GB"]|order(name asc)${card}`);

export const GRINDER_QUERY = defineQuery(`*[_type == "grinder" && slug.current == $slug && language == "en-GB"][0]{
  _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
  "groupName": group->name, "groupSlug": group->slug.current,
  "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
  "imageAlt": heroImage.alt, heroImage,
  gallery[]{ _key, alt, asset, crop, hotspot },
  specs${specs},
  extraSpecs[]{ _key, label, value },
  faqs[]{ _key, question, answer },
  relatedGrinders[]->${card},
  relatedArticles[]->${articleCard},
  "catalogueUrl": catalogue.asset->url,
  "catalogueLabel": catalogue.label,
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical,
  seoImage
}`);

export const COLLECTION_QUERY = defineQuery(`*[_type == "grinderCollection" && slug.current == $slug && language == "en-GB"][0]{
  _id, name, "slug": slug.current, summary, answerFirst, audience,
  grinders[]->${card},
  sections[]{
    _key, _type, eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt, imagePosition, image,
    links[]${link}, link${link}, body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, heroImage,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical
}`);

export const POSTS_QUERY = defineQuery(`*[_type == "kbPost" && language == "en-GB"]|order(publishedAt desc)${articleCard}`);

export const POST_QUERY = defineQuery(`*[_type == "kbPost" && slug.current == $slug && language == "en-GB"][0]{
  title, "slug": slug.current, excerpt, publishedAt, updatedAt, answerFirst, body,
  "topicTitle": topic->title, "topicSlug": topic->slug.current,
  "authorName": author->name, "authorSlug": author->slug.current, "authorRole": author->role, "authorBio": author->bio,
  "imageAlt": image.alt, image,
  faqs[]{ _key, question, answer },
  relatedGrinders[]->${card},
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical
}`);

export const TOPICS_QUERY = defineQuery(`*[_type == "kbTopic" && language == "en-GB"]|order(title asc){
  title, "slug": slug.current, description,
  "seoTitle": seo.title, "seoDescription": seo.description
}`);

export const LEGAL_QUERY = defineQuery(`*[_type == "legalPage" && slug.current == $slug && language == "en-GB"][0]{
  title, "slug": slug.current, effectiveDate, body,
  "seoTitle": seo.title, "seoDescription": seo.description, "noIndex": seo.noIndex == true
}`);

export const SITEMAP_QUERY = defineQuery(`{
  "grinders": *[_type == "grinder" && language == "en-GB" && status != "discontinued" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "collections": *[_type == "grinderCollection" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "posts": *[_type == "kbPost" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "topics": *[_type == "kbTopic" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "legal": *[_type == "legalPage" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  }
}`);
