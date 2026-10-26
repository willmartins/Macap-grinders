import { unsplash } from "@/lib/site";
import type {
  ArticleCard,
  Author,
  Collection,
  FaqItem,
  Grinder,
  GrinderCard,
  Group,
  Journey,
  LegalPage,
  PageDocument,
  Post,
  RichText,
  Shell,
  Specs,
  Topic,
} from "@/lib/content/types";

const placeholderAlt = "Placeholder photograph from Unsplash, to be replaced with Macap photography.";

function text(key: string, style: "normal" | "h2" | "h3", value: string): RichText[number] {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-s`, text: value, marks: [] }],
  };
}

function specs(partial: Partial<Specs> & Pick<Specs, "burrType" | "burrDiameterMm" | "grindType">): Specs {
  return {
    motorPowerW: null,
    rpm: null,
    hopperCapacityG: null,
    outputGPerS: null,
    adjustment: null,
    widthMm: null,
    depthMm: null,
    heightMm: null,
    weightKg: null,
    voltage: "220-240 V",
    display: null,
    features: [],
    extra: [{ _key: "sample", label: "Data", value: "Sample figure. Confirm before launch." }],
    ...partial,
  };
}

function card(grinder: Grinder): GrinderCard {
  return {
    id: grinder.id,
    name: grinder.name,
    slug: grinder.slug,
    audience: grinder.audience,
    status: grinder.status,
    shortDescription: grinder.shortDescription,
    groupName: grinder.groupName,
    groupSlug: grinder.groupSlug,
    burrDiameterMm: grinder.burrDiameterMm,
    burrType: grinder.burrType,
    grindType: grinder.grindType,
    imageUrl: grinder.imageUrl,
    imageAlt: grinder.imageAlt,
  };
}

const author: Author = {
  name: "Macap",
  slug: "macap",
  role: "Macap editorial",
  bio: "Notes from Macap on choosing, using and looking after a coffee grinder.",
};

export const sampleGroups: Group[] = [
  {
    id: "group-supra",
    name: "Supra",
    slug: "supra",
    summary: "Commercial flat-burr grinders for busy espresso service.",
    audience: "business",
  },
  {
    id: "group-supra-g",
    name: "Supra G",
    slug: "supra-g-series",
    summary: "Supra grinders with grind-by-weight dosing.",
    audience: "business",
  },
  {
    id: "group-pro",
    name: "Pro",
    slug: "pro",
    summary: "The professional line: doser, on-demand and shop grinders.",
    audience: "business",
  },
  {
    id: "group-leo",
    name: "Leo",
    slug: "leo",
    summary: "Compact professional grinders for bars with less counter space.",
    audience: "business",
  },
  {
    id: "group-studio",
    name: "Studio",
    slug: "studio",
    summary: "Home grinders for a domestic counter.",
    audience: "home",
  },
];

function makeGrinder(input: Omit<Grinder, "relatedGrinders" | "relatedArticles" | "gallery">): Grinder {
  return { ...input, gallery: [], relatedGrinders: [], relatedArticles: [] };
}

const supra68 = makeGrinder({
  id: "grinder-supra-68",
  name: "Supra 68",
  slug: "supra-68",
  audience: "business",
  status: "current",
  shortDescription: "A 68 mm flat-burr grinder for bars that pull espresso all day.",
  groupName: "Supra",
  groupSlug: "supra",
  burrDiameterMm: 68,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap Supra 68 coffee grinder",
  answerFirst:
    "The Supra 68 is a commercial espresso grinder. Flat burrs, 68 mm. Motor 550 W.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 68,
    grindType: "espresso",
    motorPowerW: 550,
    rpm: null,
    hopperCapacityG: 1500,
    outputGPerS: 4.2,
    adjustment: "Micrometric, with fast opening",
    widthMm: 244,
    depthMm: 354,
    heightMm: 638,
    weightKg: null,
    display: "3.5 inch touch screen",
    features: ["Coffee Targeting System", "Fast Opening System"],
    extra: [
      { _key: "sample", label: "Data", value: "Sample set. Confirm before launch." },
      { _key: "rate", label: "Productivity", value: "3.8-4.5 g/s" },
    ],
  }),
  faqs: [
    {
      _key: "s68-1",
      question: "Who is the Supra 68 for?",
      answer: "Bars on espresso service, where a 68 mm flat burr is enough.",
    },
    {
      _key: "s68-2",
      question: "Is the Supra 68 a home grinder?",
      answer: "No. It is a professional grinder. For a home counter, look at the Studio line.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "Supra 68 coffee grinder",
    description: "Macap Supra 68: a 68 mm flat-burr espresso grinder for commercial service.",
  },
});

const supra83 = makeGrinder({
  id: "grinder-supra-83",
  name: "Supra 83",
  slug: "supra-83",
  audience: "business",
  status: "current",
    shortDescription: "83 mm flat burrs. Higher output than the Supra 68.",
  groupName: "Supra",
  groupSlug: "supra",
  burrDiameterMm: 83,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap Supra 83 coffee grinder",
  answerFirst:
    "The Supra 83 is the larger Supra. Flat burrs, 83 mm, for higher output.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 83,
    grindType: "espresso",
    motorPowerW: 800,
    rpm: 1400,
    hopperCapacityG: 1600,
    outputGPerS: 5,
    adjustment: "Stepless micrometric",
    widthMm: 230,
    depthMm: 400,
    heightMm: 670,
    weightKg: 18,
    features: ["Fast opening system", "Coffee targeting system"],
  }),
  faqs: [
    {
      _key: "s83-1",
      question: "Supra 68 or Supra 83?",
      answer:
        "Choose the 83 when the bar is busier and you want the larger burr and higher output. Choose the 68 when the counter is tighter and volume is lower.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "Supra 83 coffee grinder",
    description: "Macap Supra 83: an 83 mm flat-burr espresso grinder for higher-volume bars.",
  },
});

const supra68g = makeGrinder({
  id: "grinder-supra-68-g",
  name: "Supra 68 G",
  slug: "supra-68-g-series",
  audience: "business",
  status: "new",
    shortDescription: "Supra 68 with commercial grind-by-weight.",
  groupName: "Supra G",
  groupSlug: "supra-g-series",
  burrDiameterMm: 68,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap Supra 68 G coffee grinder",
  answerFirst:
    "The Supra 68 G is a 68 mm flat-burr grinder that doses by weight.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 68,
    grindType: "espresso",
    motorPowerW: 650,
    rpm: 1400,
    hopperCapacityG: 1500,
    outputGPerS: 3.5,
    adjustment: "Grind by weight",
    widthMm: 210,
    depthMm: 390,
    heightMm: 640,
    weightKg: 15,
    display: "Weight dosing display",
    features: ["Grind by weight", "Fast opening system"],
  }),
  faqs: [
    {
      _key: "g-1",
      question: "What does grind by weight change?",
      answer:
        "It stops at a set weight of coffee, not a set time. The dose stays steadier when the beans or the setting change.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "Supra 68 G grind-by-weight grinder",
    description: "Macap Supra 68 G: commercial grind-by-weight espresso grinder with 68 mm flat burrs.",
  },
});

const leo55 = makeGrinder({
  id: "grinder-leo-55",
  name: "Leo 55",
  slug: "leo-55",
  audience: "business",
  status: "current",
    shortDescription: "Compact professional espresso grinder.",
  groupName: "Leo",
  groupSlug: "leo",
  burrDiameterMm: 58,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap Leo 55 coffee grinder",
  answerFirst:
    "The Leo 55 is a compact professional espresso grinder for sites with less counter space.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 58,
    grindType: "espresso",
    motorPowerW: 450,
    rpm: 1350,
    hopperCapacityG: 1000,
    outputGPerS: 2.2,
    adjustment: "Stepless",
    widthMm: 175,
    depthMm: 340,
    heightMm: 560,
    weightKg: 9,
    features: ["Compact body"],
  }),
  faqs: [
    {
      _key: "leo-1",
      question: "Is Leo still in the Macap range?",
      answer: "Yes. Leo stays in the range. It is the compact professional grinder.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "Leo 55 coffee grinder",
    description: "Macap Leo 55: a compact professional espresso grinder.",
  },
});

const m7 = makeGrinder({
  id: "grinder-m7",
  name: "M7",
  slug: "m7",
  audience: "business",
  status: "current",
    shortDescription: "Pro line. Conical burrs, with a doser.",
  groupName: "Pro",
  groupSlug: "pro",
  burrDiameterMm: 68,
  burrType: "conical",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap M7 coffee grinder",
  answerFirst:
    "The M7 is a professional doser grinder with conical burrs.",
  specs: specs({
    burrType: "conical",
    burrDiameterMm: 68,
    grindType: "espresso",
    motorPowerW: 450,
    rpm: 450,
    hopperCapacityG: 1500,
    outputGPerS: 2.8,
    adjustment: "Stepped, with doser",
    widthMm: 200,
    depthMm: 370,
    heightMm: 620,
    weightKg: 13,
    features: ["Doser"],
    extra: [
      { _key: "sample", label: "Data", value: "Sample figures for layout review" },
      { _key: "doser", label: "Dosing", value: "Doser" },
    ],
  }),
  faqs: [
    {
      _key: "m7-1",
      question: "What is a doser grinder?",
      answer:
        "Coffee is ground into a chamber. A lever releases the dose into the portafilter.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "M7 doser coffee grinder",
    description: "Macap M7: a professional conical-burr doser grinder in the Pro line.",
  },
});

const mx = makeGrinder({
  id: "grinder-mx",
  name: "MX",
  slug: "mx",
  audience: "business",
  status: "current",
    shortDescription: "Pro line. Flat burrs, on demand.",
  groupName: "Pro",
  groupSlug: "pro",
  burrDiameterMm: 65,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap MX coffee grinder",
  answerFirst:
    "The MX is a professional on-demand grinder. Flat burrs. It grinds into the portafilter.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 65,
    grindType: "espresso",
    motorPowerW: 500,
    rpm: 1350,
    hopperCapacityG: 1200,
    outputGPerS: 2.5,
    adjustment: "Stepless, on demand",
    widthMm: 180,
    depthMm: 350,
    heightMm: 590,
    weightKg: 11,
    features: ["On demand"],
  }),
  faqs: [
    {
      _key: "mx-1",
      question: "How is the MX different from the M7?",
      answer:
        "The MX grinds on demand and uses flat burrs. The M7 is a conical doser.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "MX on-demand coffee grinder",
    description: "Macap MX: a professional on-demand flat-burr espresso grinder.",
  },
});

const m2m = makeGrinder({
  id: "grinder-m2m-domus",
  name: "M2M Domus",
  slug: "m2m-domus",
  audience: "home",
  status: "current",
    shortDescription: "Home espresso grinder. Conical burrs, small footprint.",
  groupName: "Studio",
  groupSlug: "studio",
  burrDiameterMm: 50,
  burrType: "conical",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap M2M Domus coffee grinder",
  answerFirst:
    "The M2M Domus is a home espresso grinder with conical burrs.",
  specs: specs({
    burrType: "conical",
    burrDiameterMm: 50,
    grindType: "espresso",
    motorPowerW: 250,
    rpm: 1400,
    hopperCapacityG: 250,
    outputGPerS: 1.4,
    adjustment: "Stepless",
    widthMm: 120,
    depthMm: 180,
    heightMm: 360,
    weightKg: 4.2,
    features: ["Small footprint"],
  }),
  faqs: [
    {
      _key: "m2m-1",
      question: "Can I use the M2M Domus in a bar?",
      answer:
        "No. It is a home grinder. For service, use Leo, Pro or Supra.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "M2M Domus home coffee grinder",
    description: "Macap M2M Domus: a compact conical-burr espresso grinder for home.",
  },
});

const m2e = makeGrinder({
  id: "grinder-m2e-domus",
  name: "M2E Domus",
  slug: "m2e-domus",
  audience: "home",
  status: "current",
    shortDescription: "Home espresso grinder. 50 mm flat burrs.",
  groupName: "Studio",
  groupSlug: "studio",
  burrDiameterMm: 50,
  burrType: "flat",
  grindType: "espresso",
  imageUrl: null,
  imageAlt: "Macap M2E Domus coffee grinder",
  answerFirst:
    "The M2E Domus is a home espresso grinder with 50 mm flat burrs.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 50,
    grindType: "espresso",
    motorPowerW: 250,
    rpm: 1350,
    hopperCapacityG: 300,
    outputGPerS: 1.6,
    adjustment: "Stepless",
    widthMm: 125,
    depthMm: 190,
    heightMm: 370,
    weightKg: 4.6,
    features: ["Flat burrs for home"],
  }),
  faqs: [
    {
      _key: "m2e-1",
      question: "M2M or M2E?",
      answer:
        "The M2M uses conical burrs. The M2E uses flat burrs. Both are home espresso grinders.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "M2E Domus home coffee grinder",
    description: "Macap M2E Domus: a 50 mm flat-burr espresso grinder for home.",
  },
});

const m2d = makeGrinder({
  id: "grinder-m2d-silent",
  name: "M2D Silent",
  slug: "m2d-silent",
  audience: "home",
  status: "current",
    shortDescription: "Home grinder, built to run more quietly.",
  groupName: "Studio",
  groupSlug: "studio",
  burrDiameterMm: 58,
  burrType: "flat",
  grindType: "both",
  imageUrl: null,
  imageAlt: "Macap M2D Silent coffee grinder",
  answerFirst:
    "The M2D Silent is a home grinder for espresso and filter, built to run more quietly.",
  specs: specs({
    burrType: "flat",
    burrDiameterMm: 58,
    grindType: "both",
    motorPowerW: 250,
    rpm: 900,
    hopperCapacityG: 300,
    outputGPerS: 1.2,
    adjustment: "Stepless",
    widthMm: 130,
    depthMm: 200,
    heightMm: 390,
    weightKg: 5.1,
    features: ["Quieter running", "Espresso and filter"],
  }),
  faqs: [
    {
      _key: "m2d-1",
      question: "Will it be silent?",
      answer:
        "No grinder is silent. The M2D Silent is quieter than a commercial grinder.",
    },
  ],
  catalogueUrl: null,
  catalogueLabel: null,
  seo: {
    title: "M2D Silent home coffee grinder",
    description: "Macap M2D Silent: a quieter home grinder for espresso and filter.",
  },
});

export const sampleGrinders: Grinder[] = [
  supra68,
  supra83,
  supra68g,
  leo55,
  m7,
  mx,
  m2m,
  m2e,
  m2d,
];

const bySlug = Object.fromEntries(sampleGrinders.map((grinder) => [grinder.slug, grinder]));

function relate(slug: string, related: string[], articles: ArticleCard[]) {
  const grinder = bySlug[slug];
  if (!grinder) return;
  grinder.relatedGrinders = related.map((item) => card(bySlug[item])).filter(Boolean);
  grinder.relatedArticles = articles;
}

export const sampleAuthor = author;

export const sampleTopics: Topic[] = [
  {
    title: "Choosing a grinder",
    slug: "choosing-a-grinder",
    description: "How to match a Macap grinder to the way you brew and the volume you serve.",
    seo: {
      title: "Choosing a Macap grinder",
      description: "Guides for choosing a Macap coffee grinder for home or for the bar.",
    },
  },
  {
    title: "Dialling in",
    slug: "dialling-in",
    description: "Practical notes on getting a repeatable grind with less wasted coffee.",
    seo: {
      title: "Dialling in a coffee grinder",
      description: "How to dial in a Macap grinder with less waste.",
    },
  },
  {
    title: "Care",
    slug: "care",
    description: "Cleaning, burr wear and when to replace parts.",
    seo: {
      title: "Grinder care",
      description: "How to look after a Macap coffee grinder.",
    },
  },
];

const postCards: ArticleCard[] = [
  {
    title: "Flat burrs and conical burrs",
    slug: "flat-burrs-and-conical-burrs",
    excerpt: "What actually changes when you move between flat and conical burrs.",
    publishedAt: "2026-03-12",
    topicTitle: "Choosing a grinder",
    topicSlug: "choosing-a-grinder",
  },
  {
    title: "Dialling in with less waste",
    slug: "dialling-in-with-less-waste",
    excerpt: "A short order of work for a new coffee, without throwing away half a bag.",
    publishedAt: "2026-04-02",
    topicTitle: "Dialling in",
    topicSlug: "dialling-in",
  },
  {
    title: "Supra 68 and Supra 83",
    slug: "supra-68-and-supra-83",
    excerpt: "How to choose between the two Supra sizes for a working bar.",
    publishedAt: "2026-05-20",
    topicTitle: "Choosing a grinder",
    topicSlug: "choosing-a-grinder",
  },
];

relate("supra-68", ["supra-83", "supra-68-g-series", "leo-55"], [postCards[2], postCards[0]]);
relate("supra-83", ["supra-68", "supra-68-g-series"], [postCards[2]]);
relate("supra-68-g-series", ["supra-68", "supra-83"], [postCards[2]]);
relate("leo-55", ["mx", "supra-68"], [postCards[0]]);
relate("m7", ["mx", "leo-55"], [postCards[0]]);
relate("mx", ["m7", "leo-55"], [postCards[0]]);
relate("m2m-domus", ["m2e-domus", "m2d-silent"], [postCards[0], postCards[1]]);
relate("m2e-domus", ["m2m-domus", "m2d-silent"], [postCards[0], postCards[1]]);
relate("m2d-silent", ["m2e-domus", "m2m-domus"], [postCards[1]]);

export function sampleGrinderCards(): GrinderCard[] {
  return sampleGrinders.map(card);
}

export const samplePosts: Post[] = [
  {
    ...postCards[0],
    updatedAt: "2026-06-01",
    answerFirst:
      "Flat burrs and conical burrs both make good espresso. Flat burrs are often chosen for a narrower particle spread at higher volumes. Conical burrs are often quieter and kinder to a small motor. Taste matters more than the label.",
    author,
    imageUrl: unsplash.espresso,
    imageAlt: placeholderAlt,
    body: [
      text("p1", "normal", "Start with the coffee you already like. If you cannot taste a difference in the cup, the burr shape is not the decision that should spend the budget."),
      text("p2", "h2", "What changes"),
      text("p3", "normal", "Flat burrs spin as a pair of discs. Conical burrs sit one inside the other. The shape changes the range of particle sizes and the way the grinder heats and sounds. It does not guarantee a better espresso."),
      text("p4", "h2", "A practical way to choose"),
      text("p5", "normal", "At home, noise, size and how easy the grinder is to dial in matter as much as the burr. In a bar, output, heat during a rush, and how fast you can open the grinder to clean it matter more."),
    ],
    faqs: [
      {
        _key: "f1",
        question: "Are flat burrs better for espresso?",
        answer: "Not by default. They are a common choice for busy bars. Many excellent espressos are ground on conical burrs.",
      },
    ],
    relatedGrinders: [card(m2m), card(m2e), card(supra68)],
    seo: {
      title: "Flat burrs and conical burrs",
      description: "How flat and conical burrs differ, and how to choose for home or for the bar.",
    },
  },
  {
    ...postCards[1],
    updatedAt: null,
    answerFirst:
      "Dial in by changing one thing at a time, and taste before you throw coffee away. Lock the dose, move the grind, then adjust the yield.",
    author,
    imageUrl: unsplash.cup,
    imageAlt: placeholderAlt,
    body: [
      text("d1", "normal", "Weigh the dose. Pull the shot. Taste it. If it is sour and fast, grind a little finer. If it is bitter and slow, grind a little coarser. Change nothing else until the taste moves."),
      text("d2", "h2", "Waste less"),
      text("d3", "normal", "Purge a small amount after a big grind change, not a full hopper. Write down the setting that worked so the next bag starts closer."),
    ],
    faqs: [
      {
        _key: "d-faq",
        question: "How much coffee should I purge?",
        answer: "Enough to clear the grounds still sitting in the burrs from the previous setting. A few grams is usually enough after a small change.",
      },
    ],
    relatedGrinders: [card(m2d), card(m2e)],
    seo: {
      title: "Dialling in with less waste",
      description: "A short method for dialling in espresso without wasting coffee.",
    },
  },
  {
    ...postCards[2],
    updatedAt: null,
    answerFirst:
      "Choose the Supra 68 when the bar is steady and the counter is tight. Choose the Supra 83 when you need the larger burr and higher output.",
    author,
    imageUrl: null,
    imageAlt: "",
    body: [
      text("c1", "normal", "Both grinders are professional flat-burr espresso grinders in the Supra line. The useful difference is burr diameter, output and the space the machine takes."),
      text("c2", "normal", "If you want each dose weighed, look at the Supra G series rather than choosing between 68 and 83 on size alone."),
    ],
    faqs: [
      {
        _key: "c-faq",
        question: "Does a larger burr mean better coffee?",
        answer: "No. It usually means the grinder can do more work in a rush. The coffee still depends on the beans, the water and the person pulling the shot.",
      },
    ],
    relatedGrinders: [card(supra68), card(supra83), card(supra68g)],
    seo: {
      title: "Supra 68 and Supra 83",
      description: "How to choose between the Macap Supra 68 and Supra 83.",
    },
  },
];

const homeCards = sampleGrinderCards().filter((item) => item.audience === "home");
const businessCards = sampleGrinderCards().filter((item) => item.audience === "business");

export const sampleCollections: Collection[] = [
  {
    id: "col-home",
    name: "Home espresso",
    slug: "home-espresso",
    summary: "Studio grinders for a domestic counter.",
    audience: "home",
    answerFirst: "Home espresso brings together the Studio grinders: compact machines for a kitchen, not a service counter.",
    grinders: homeCards,
    sections: [],
    seo: {
      title: "Home espresso grinders",
      description: "Macap Studio grinders for home espresso.",
    },
  },
  {
    id: "col-pro",
    name: "Professional espresso",
    slug: "professional-espresso",
    summary: "Supra, Leo and Pro grinders for the bar.",
    audience: "business",
    answerFirst: "Professional espresso is the working range: Supra, Leo and Pro, for bars that grind through a service.",
    grinders: businessCards,
    sections: [],
    seo: {
      title: "Professional espresso grinders",
      description: "Macap grinders for commercial espresso service.",
    },
  },
  {
    id: "col-gbw",
    name: "Grind by weight",
    slug: "grind-by-weight",
    summary: "Supra G grinders that dose by weight.",
    audience: "business",
    answerFirst: "Grind by weight is for bars that want each dose measured in grams rather than timed.",
    grinders: sampleGrinderCards().filter((item) => item.slug.includes("g-series")),
    sections: [],
    seo: {
      title: "Grind by weight",
      description: "Macap Supra G grinders with grind-by-weight dosing.",
    },
  },
  {
    id: "col-supra",
    name: "Supra",
    slug: "supra",
    summary: "The Supra 68 and Supra 83.",
    audience: "business",
    answerFirst: "The Supra collection is Macap's commercial flat-burr line for espresso, in 68 mm and 83 mm.",
    grinders: sampleGrinderCards().filter((item) => item.groupSlug === "supra"),
    sections: [],
    seo: {
      title: "Supra grinders",
      description: "Macap Supra 68 and Supra 83 commercial espresso grinders.",
    },
  },
  {
    id: "col-studio",
    name: "Studio",
    slug: "studio",
    summary: "The home line: Domus and Silent.",
    audience: "home",
    answerFirst: "Studio is Macap's home grinder line, including Domus and Silent.",
    grinders: homeCards,
    sections: [],
    seo: {
      title: "Studio home grinders",
      description: "Macap Studio grinders for the home.",
    },
  },
];

const collectionCards = sampleCollections.map(({ name, slug, summary, audience }) => ({
  name,
  slug,
  summary,
  audience,
}));

const homeFaqs: FaqItem[] = [
  {
    _key: "hf1",
    question: "Which home grinder should I start with?",
    answer:
      "If you want the smallest conical grinder, start with the M2M Domus. If you want flat burrs, look at the M2E Domus. If noise matters in a shared room, look at the M2D Silent.",
  },
  {
    _key: "hf2",
    question: "Are these for a bar?",
    answer: "No. The home journey is for a domestic counter. Professional grinders are on the Professional page.",
  },
];

const proFaqs: FaqItem[] = [
  {
    _key: "pf1",
    question: "Where should a busy bar start?",
    answer:
        "Start with Supra. Choose 68 or 83 by output and counter space. For weighed doses, use Supra G.",
  },
  {
    _key: "pf2",
    question: "Is the Leo line still available?",
    answer: "Yes. Leo stays in the range for bars that need a smaller professional grinder.",
  },
];

export const sampleHomeJourney: Journey = {
  sample: true,
  title: "Home grinders",
  slug: "home-grinders",
  audience: "home",
  introduction:
    "Studio grinders for a home counter. Espresso, and one model for espresso and filter.",
  seo: {
    title: "Home coffee grinders",
    description: "Macap Studio grinders for home espresso and filter.",
  },
  sections: [
    {
      _key: "h-hero",
      _type: "heroBanner",
      eyebrow: "Home",
      heading: "Home grinders",
      text: "For a domestic counter. Choose by brew, burr and noise.",
      links: [
        { _key: "h1", label: "See home grinders", href: "#home-grinders" },
        { _key: "h2", label: "Compare two models", href: "/compare?m=m2m-domus,m2e-domus" },
      ],
    },
    {
      _key: "h-needs",
      _type: "featureList",
      heading: "Choose by the coffee",
      intro: "Three checks cover most home kitchens.",
      features: [
        {
          _key: "n1",
          title: "Espresso, filter, or both",
          text: "The Domus models are espresso grinders. The M2D Silent covers espresso and filter.",
        },
        {
          _key: "n2",
          title: "Flat or conical",
          text: "M2M is conical. M2E and M2D are flat. Read the burr note in Knowledge if you have not compared them.",
        },
        {
          _key: "n3",
          title: "Noise and space",
          text: "All three fit a home counter. Choose Silent when the grinder shares a room.",
        },
      ],
    },
    {
      _key: "home-grinders",
      _type: "grinderGrid",
      heading: "Studio grinders",
      intro: "The Studio line. Figures are sample data until the catalogue is published.",
      grinders: homeCards,
    },
    {
      _key: "h-cols",
      _type: "collectionCarousel",
      heading: "Collections",
      intro: "Sets grouped by use.",
      collections: collectionCards.filter((item) => item.audience === "home"),
    },
    {
      _key: "h-compare",
      _type: "comparisonTable",
      heading: "M2M and M2E",
      intro: "Same job. Conical burrs or flat burrs.",
      grinders: [m2m, m2e],
    },
    {
      _key: "h-cta",
      _type: "ctaBanner",
      heading: "Compare the Studio line",
      text: "M2M, M2E and M2D Silent, with the differences in plain language.",
      link: { _key: "hc", label: "Compare home grinders", href: "/compare?m=m2m-domus,m2e-domus,m2d-silent" },
      step: "compare",
    },
    {
      _key: "h-kb",
      _type: "kbPostGrid",
      heading: "Read first",
      posts: [postCards[0], postCards[1]],
    },
    { _key: "h-faq", _type: "faqAccordion", heading: "Questions", faqs: homeFaqs },
    {
      _key: "h-contact",
      _type: "ctaBanner",
      heading: "Contact Macap",
      text: "Write if you are choosing a home grinder.",
      link: { _key: "hco", label: "Contact us", href: "/contact" },
      step: "contact",
    },
  ],
};

export const sampleProfessionalJourney: Journey = {
  sample: true,
  title: "Professional",
  slug: "professional",
  audience: "business",
  introduction:
    "Supra, Supra G, Pro and Leo. For espresso service.",
  seo: {
    title: "Professional coffee grinders",
    description: "Macap grinders for the bar: Supra, Supra G, Pro and Leo.",
  },
  sections: [
    {
      _key: "p-hero",
      _type: "heroBanner",
      eyebrow: "Professional",
      heading: "Professional grinders",
      text: "For the bar. Choose by output, dosing and counter space.",
      links: [
        { _key: "p1", label: "See professional grinders", href: "#professional-grinders" },
        { _key: "p2", label: "Compare Supra 68 and 83", href: "/compare?m=supra-68,supra-83" },
      ],
    },
    {
      _key: "p-needs",
      _type: "featureList",
      heading: "What to match",
      features: [
        {
          _key: "b1",
          title: "Volume",
          text: "Supra 68 for a steady bar. Supra 83 when you need the larger burr and higher output.",
        },
        {
          _key: "b2",
          title: "How you dose",
          text: "On demand, doser, or grind by weight. Pro covers the first two. Supra G doses by weight.",
        },
        {
          _key: "b3",
          title: "Counter space",
          text: "Leo stays in the range. Use it when the counter is small.",
        },
      ],
    },
    {
      _key: "professional-grinders",
      _type: "grinderGrid",
      heading: "The professional range",
      intro: "Supra, Supra G, Pro and Leo. Labo, Barline and tampers are not listed.",
      grinders: businessCards,
    },
    {
      _key: "p-cols",
      _type: "collectionCarousel",
      heading: "Collections",
      collections: collectionCards.filter((item) => item.audience === "business"),
    },
    {
      _key: "p-compare",
      _type: "comparisonTable",
      heading: "Supra 68, Supra 83, Leo 55",
      intro: "Three sizes for espresso service.",
      grinders: [supra68, supra83, leo55],
    },
    {
      _key: "p-cta",
      _type: "ctaBanner",
      heading: "Compare them",
      text: "Output, burr size and weight, in plain language.",
      link: {
        _key: "pc",
        label: "Open the compare tool",
        href: "/compare?m=supra-68,supra-83,leo-55",
      },
      step: "compare",
    },
    {
      _key: "p-kb",
      _type: "kbPostGrid",
      heading: "Related reading",
      posts: [postCards[2], postCards[0]],
    },
    { _key: "p-faq", _type: "faqAccordion", heading: "Questions", faqs: proFaqs },
    {
      _key: "p-contact",
      _type: "contactBlock",
      heading: "Contact Macap",
      text: "Tell us the output, the dosing and the space.",
    },
  ],
};

export const sampleHomePage: PageDocument = {
  sample: true,
  title: "Macap",
  introduction:
    "Macap designs and manufactures coffee grinders in Italy, for the home and for the bar.",
  seo: {
    title: "Macap coffee grinders",
    description:
      "Macap designs and manufactures coffee grinders in Italy. Explore home grinders or professional grinders for the bar.",
  },
  sections: [
    {
      _key: "home-hero",
      _type: "heroBanner",
      eyebrow: "Coffee grinders, made in Italy",
      heading: "For the home. For the bar.",
      text: "Macap has made coffee grinders in the Venice area since 1930.",
      links: [
        { _key: "a", label: "Home grinders", href: "/home-grinders" },
        { _key: "b", label: "Professional", href: "/professional" },
      ],
    },
    {
      _key: "home-split",
      _type: "imageText",
      heading: "Home grinders",
      text: "Studio grinders for a domestic counter. Domus and Silent.",
      imageUrl: unsplash.cup,
      imageAlt: placeholderAlt,
      imagePosition: "right",
      link: { _key: "go-home", label: "Start the home journey", href: "/home-grinders" },
    },
    {
      _key: "home-pro",
      _type: "imageText",
      heading: "Professional grinders",
      text: "Supra, Supra G, Pro and Leo. Leo stays in the range. Labo, Barline and tampers are not listed.",
      imageUrl: unsplash.espresso,
      imageAlt: placeholderAlt,
      imagePosition: "left",
      link: { _key: "go-pro", label: "Start the professional journey", href: "/professional" },
    },
    {
      _key: "home-quote",
      _type: "quote",
      quote: "Match the grinder to the counter, then to the coffee.",
      attribution: "Macap",
    },
  ],
};

export const sampleAbout: PageDocument = {
  sample: true,
  title: "About Macap",
  introduction:
    "Macap makes coffee grinders in the Venice area. This page is a placeholder for the company story.",
  seo: {
    title: "About Macap",
    description: "Macap manufactures coffee grinders in Italy for the home and for professional bars.",
  },
  sections: [
    {
      _key: "about-hero",
      _type: "heroBanner",
      eyebrow: "About",
      heading: "Macap",
      text: "Coffee grinders, made in the Venice area since 1930.",
      links: [],
    },
    {
      _key: "about-body",
      _type: "richText",
      heading: "Placeholder",
      body: [
        text(
          "ab1",
          "normal",
          "PLACEHOLDER. Replace this with Macap's account of the factory and the range. Do not publish this as the company history.",
        ),
        text(
          "ab2",
          "normal",
          "This site lists home and professional coffee grinders. Leo stays. Labo, Barline and tampers do not.",
        ),
      ],
    },
    {
      _key: "about-image",
      _type: "imageText",
      heading: "Photography",
      text: "Placeholder photograph from Unsplash. Replace it with Macap photography.",
      imageUrl: unsplash.beans,
      imageAlt: placeholderAlt,
      imagePosition: "right",
    },
  ],
};

export const sampleContact: PageDocument = {
  sample: true,
  title: "Contact us",
  introduction: "Write about a grinder, a part or a brochure. The form sends one message to Macap.",
  seo: {
    title: "Contact Macap",
    description: "Contact Macap about coffee grinders, parts and brochures.",
  },
  sections: [
    {
      _key: "contact-form",
      _type: "contactBlock",
      heading: "Send a message",
      text: "If the form is not switched on yet, use the email on this page.",
    },
  ],
};

export const sampleKnowledgeHub: PageDocument = {
  sample: true,
  title: "Knowledge",
  introduction:
    "Notes on choosing a grinder, dialling in, and burr care. Each article answers the question first.",
  seo: {
    title: "Macap knowledge base",
    description: "Guides from Macap on choosing a coffee grinder, dialling in, and care.",
  },
  sections: [
    {
      _key: "kb-hero",
      _type: "heroBanner",
      eyebrow: "Knowledge",
      heading: "Knowledge",
      text: "Sample articles, so the hub can be reviewed before Macap publishes the final pieces.",
      links: [],
      imageUrl: unsplash.beans,
      imageAlt: placeholderAlt,
    },
  ],
};

export const sampleGrindersIndex: PageDocument = {
  sample: true,
  title: "Grinders",
  introduction:
    "All Macap coffee grinders on this site. Filter by use, line, burr size and grind.",
  seo: {
    title: "Macap coffee grinders",
    description: "Browse Macap coffee grinders and filter by audience, line, burr size and grind type.",
  },
  sections: [],
};

export const sampleLegal: LegalPage[] = [
  {
    title: "Privacy policy",
    slug: "privacy-policy",
    effectiveDate: "2026-10-01",
    seo: {
      title: "Privacy policy",
      description: "Draft privacy policy for the Macap website.",
    },
    body: [
      text("pv0", "h2", "PLACEHOLDER"),
      text(
        "pv1",
        "normal",
        "PLACEHOLDER. This is not Macap's privacy policy. Replace it with text approved by Macap's advisers before the site launches.",
      ),
      text(
        "pv2",
        "normal",
        "The form on the contact page collects the name, email, optional phone number, topic and message you type, so Macap can reply. It is sent by email to the inbox configured for the site. Do not send card numbers or passwords.",
      ),
    ],
  },
  {
    title: "Terms and conditions",
    slug: "terms",
    effectiveDate: "2026-10-01",
    seo: {
      title: "Terms and conditions",
      description: "Draft terms for the Macap website.",
    },
    body: [
      text("tm0", "h2", "PLACEHOLDER"),
      text(
        "tm1",
        "normal",
        "PLACEHOLDER. These are not the terms of sale or use. Specifications shown while the catalogue is marked as sample content are not an offer.",
      ),
    ],
  },
  {
    title: "Cookie policy",
    slug: "cookie-policy",
    effectiveDate: "2026-10-26",
    seo: {
      title: "Cookie policy",
      description: "How the Macap website uses cookies and similar storage.",
    },
    body: [
      text("ck0", "h2", "PLACEHOLDER FOR LEGAL REVIEW"),
      text(
        "ck1",
        "normal",
        "PLACEHOLDER. This draft describes how the site is built. Have it checked before launch. It is not a finished cookie policy.",
      ),
      text("ck2", "h2", "What the site uses today"),
      text(
        "ck3",
        "normal",
        "Your choice is remembered in local storage under the name macap-cookie-consent. That is not an advertising cookie. You can change it at any time from Cookie settings in the footer.",
      ),
      text(
        "ck4",
        "normal",
        "Google Analytics 4 loads only when a measurement ID is configured. Analytics storage is denied until you accept. If you accept, Analytics may set its own cookies. Advertising storage stays off: this site does not run ads. If you reject, Analytics storage stays denied.",
      ),
      text(
        "ck5",
        "normal",
        "Vercel Web Analytics and Speed Insights are cookieless and run without a consent banner. An optional Cloudflare Turnstile check on the contact form, if switched on, may set a cookie to tell people and bots apart.",
      ),
    ],
  },
];

export const sampleShell: Shell = {
  sample: true,
  settings: {
    siteName: "Macap",
    navigation: [
      { _key: "nav-home", label: "Home", href: "/home-grinders" },
      { _key: "nav-pro", label: "Professional", href: "/professional" },
      { _key: "nav-contact", label: "Contact us", href: "/contact" },
    ],
    footerNavigation: [
      { _key: "f-grinders", label: "All grinders", href: "/grinders" },
      { _key: "f-knowledge", label: "Knowledge", href: "/knowledge" },
      { _key: "f-about", label: "About", href: "/about" },
      { _key: "f-compare", label: "Compare", href: "/compare" },
      { _key: "f-contact", label: "Contact us", href: "/contact" },
    ],
    socials: [],
    email: "info@macap.it",
    phone: "+39 041 5030466",
    address: "Via Toniolo 18, 30030 Maerne di Martellago, Venice, Italy",
    organisation: {
      name: "Macap",
      legalName: "Macap SRL",
      url: "https://macap.it",
      email: "info@macap.it",
      telephone: "+39 041 5030466",
      address: "Via Toniolo 18, 30030 Maerne di Martellago, Venice, Italy",
      sameAs: [],
    },
    seo: {
      title: "Macap coffee grinders",
      description:
        "Macap designs and manufactures coffee grinders in Italy, for the home and for the bar.",
    },
  },
  collections: collectionCards,
  legal: sampleLegal.map((page) => ({ title: page.title, slug: page.slug })),
};

export function findGrinder(slug: string): Grinder | undefined {
  return sampleGrinders.find((grinder) => grinder.slug === slug);
}
