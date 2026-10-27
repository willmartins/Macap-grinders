import { defineQuery } from "next-sanity";

const sanityImage = `{ alt, asset, crop, hotspot, "lqip": asset->metadata.lqip }`;

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
  "heroImage": heroImage${sanityImage}
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

const seoFields = `
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "noIndex": seo.noIndex == true,
  "canonical": seo.canonical,
  "seoImage": seo.image${sanityImage}
`;

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
    "image": image${sanityImage},
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
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  ${seoFields}
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
    "image": image${sanityImage},
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
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      answerFirst,
      specs${specs},
      extraSpecs[]{ _key, label, value }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  ${seoFields}
}`);

export const SIMPLE_PAGE_QUERY = defineQuery(`*[_id == $id][0]{
  title,
  introduction,
  sections[]{
    _key, _type, eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt, imagePosition, "image": image${sanityImage},
    links[]${link}, link${link}, body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  ${seoFields}
}`);

export const GRINDERS_QUERY = defineQuery(`*[_type == "grinder" && language == "en-GB"]|order(name asc)${card}`);

export const GRINDER_QUERY = defineQuery(`*[_type == "grinder" && slug.current == $slug && language == "en-GB"][0]{
  _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
  "groupName": group->name, "groupSlug": group->slug.current,
  "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
  "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
  gallery[]{ _key, alt, asset, crop, hotspot, "lqip": asset->metadata.lqip },
  specs${specs},
  extraSpecs[]{ _key, label, value },
  faqs[]{ _key, question, answer },
  relatedGrinders[]->${card},
  relatedArticles[]->${articleCard},
  "catalogueUrl": catalogue.asset->url,
  "catalogueLabel": catalogue.label,
  ${seoFields}
}`);

export const COLLECTION_QUERY = defineQuery(`*[_type == "grinderCollection" && slug.current == $slug && language == "en-GB"][0]{
  _id, name, "slug": slug.current, summary, answerFirst, audience,
  grinders[]->${card},
  sections[]{
    _key, _type, eyebrow, heading, text, intro, quote, attribution, role, caption, url, step,
    "imageAlt": image.alt, imagePosition, "image": image${sanityImage},
    links[]${link}, link${link}, body,
    features[]{ _key, title, text },
    faqs[]{ _key, question, answer },
    grinders[]->${card},
    "detailGrinders": grinders[]->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    "specGrinder": grinder->{
      _id, name, "slug": slug.current, audience, status, shortDescription, answerFirst,
      "groupName": group->name, "groupSlug": group->slug.current,
      "burrDiameterMm": specs.burrDiameterMm, "burrType": specs.burrType, "grindType": specs.grindType,
      "imageAlt": heroImage.alt, "heroImage": heroImage${sanityImage},
      specs${specs},
      extraSpecs[]{ _key, label, value },
      faqs[]{ _key, question, answer }
    },
    collections[]->{ name, "slug": slug.current, summary, audience },
    posts[]->${articleCard}
  },
  ${seoFields}
}`);

export const POSTS_QUERY = defineQuery(`*[_type == "kbPost" && language == "en-GB"]|order(publishedAt desc)${articleCard}`);

export const POST_QUERY = defineQuery(`*[_type == "kbPost" && slug.current == $slug && language == "en-GB"][0]{
  title, "slug": slug.current, excerpt, publishedAt, updatedAt, answerFirst, body,
  "topicTitle": topic->title, "topicSlug": topic->slug.current,
  "authorName": author->name, "authorSlug": author->slug.current, "authorRole": author->role, "authorBio": author->bio,
  "authorSameAs": author->sameAs,
  "imageAlt": image.alt, "image": image${sanityImage},
  faqs[]{ _key, question, answer },
  relatedGrinders[]->${card},
  ${seoFields}
}`);

export const TOPICS_QUERY = defineQuery(`*[_type == "kbTopic" && language == "en-GB"]|order(title asc){
  title, "slug": slug.current, description,
  ${seoFields}
}`);

export const LEGAL_QUERY = defineQuery(`*[_type == "legalPage" && slug.current == $slug && language == "en-GB"][0]{
  title, "slug": slug.current, effectiveDate, body,
  ${seoFields}
}`);

export const SITEMAP_QUERY = defineQuery(`{
  "pages": *[
    _id in ["homePage", "aboutPage", "contactPage", "knowledgeHubPage", "grindersIndexPage"]
    || (_type == "journeyPage" && slug.current in ["home-grinders", "professional"] && language == "en-GB")
  ]{
    "path": select(
      _id == "homePage" => "/",
      _id == "aboutPage" => "/about",
      _id == "contactPage" => "/contact",
      _id == "knowledgeHubPage" => "/knowledge",
      _id == "grindersIndexPage" => "/grinders",
      _type == "journeyPage" => "/" + slug.current
    ),
    _updatedAt
  },
  "grinders": *[_type == "grinder" && language == "en-GB" && status != "discontinued" && seo.noIndex != true]{
    "slug": slug.current,
    _updatedAt,
    "image": coalesce(seo.image.asset->url, heroImage.asset->url)
  },
  "collections": *[_type == "grinderCollection" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "posts": *[_type == "kbPost" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current,
    _updatedAt,
    "image": coalesce(seo.image.asset->url, image.asset->url)
  },
  "topics": *[_type == "kbTopic" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "legal": *[_type == "legalPage" && language == "en-GB" && seo.noIndex != true]{
    "slug": slug.current, _updatedAt
  }
}`);
