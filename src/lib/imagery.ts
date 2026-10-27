/**
 * Sample photography from the previous Macap site (Sanity project xb4mqxnu).
 * Swap a URL here when the file moves into project u5o31ts3.
 * Left out: author-style portraits, and frames with Italian words set in the picture
 * (Host Milano title card, “qualità costante”).
 */

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const cdn = "https://cdn.sanity.io/images/xb4mqxnu/production";

function shot(file: string, alt: string, width: number, height: number): Shot {
  return { src: `${cdn}/${file}`, alt, width, height };
}

export const pageShots = {
  homeHero: shot(
    "7846d779f999f9987ae2da6aa43bdf47cf9a254f-1400x1050.jpg",
    "Macap coffee grinder on a stone counter, seen from above.",
    1400,
    1050,
  ),
  homeSplit: shot(
    "bc13d606a47248e2925f0631d01f3da0e1358af3-1920x1080.webp",
    "Macap M2M Domus grinder on a wooden kitchen counter.",
    1920,
    1080,
  ),
  professionalSplit: shot(
    "a257bb9ccf284481a23741303e466408eab8ee11-2400x1600.jpg",
    "Macap grinder on a cafe counter with cups and a glass of water.",
    2400,
    1600,
  ),
  homeJourney: shot(
    "1aab3f6692d4081c9afa4018ae8d2c17d3ec89aa-1920x1080.webp",
    "Macap M2E Domus grinder on a kitchen counter beside a cup.",
    1920,
    1080,
  ),
  professionalJourney: shot(
    "5377a00cd68e1c49e83dba59066f00c125505062-1800x1200.jpg",
    "Macap grinder in use on a bar counter.",
    1800,
    1200,
  ),
  aboutHero: shot(
    "d508e46901997608172f5a61d754b3a821b2c55e-1920x1080.webp",
    "Close view of a Macap grinder on the bench, with a hand on the machine.",
    1920,
    1080,
  ),
  aboutDetail: shot(
    "38eec291fa9c0f96986b4316c5d9c0aad3a99479-1920x1920.webp",
    "Hands setting a Macap grinder, with the hopper open.",
    1920,
    1920,
  ),
  knowledgeHero: shot(
    "bb5042c0c71080c2e889bf03e789f096ac62b5ef-2400x1600.jpg",
    "Hands holding coffee grounds beside a Macap grinder.",
    2400,
    1600,
  ),
} as const;

export const articleShots: Record<string, Shot> = {
  "flat-burrs-and-conical-burrs": shot(
    "d1cf04d17e33b25cb236c5e7b36d6c5da83133f9-2532x1899.png",
    "Black and white photograph of Macap Supra grinders.",
    2532,
    1899,
  ),
  "dialling-in-with-less-waste": shot(
    "f08ef94a4a52d60e578e06d20f2f32be54d7e087-1200x1500.jpg",
    "Espresso pouring into a cup, with a Macap grinder behind it.",
    1200,
    1500,
  ),
  "supra-68-and-supra-83": shot(
    "d1b07964c5a3ee07e8a1a95a38e4ea5c94df387b-2092x1408.png",
    "Macap Supra 83 grinder in a dark studio.",
    2092,
    1408,
  ),
};

export const collectionShots: Record<string, Shot> = {
  "home-espresso": shot(
    "1aab3f6692d4081c9afa4018ae8d2c17d3ec89aa-1920x1080.webp",
    "Macap M2E Domus grinder on a kitchen counter beside a cup.",
    1920,
    1080,
  ),
  "professional-espresso": shot(
    "7b9da45e760c05371f99e83599d83b9c02c15bdd-1200x800.jpg",
    "Macap Supra 83 grinder on a dark counter.",
    1200,
    800,
  ),
  "grind-by-weight": shot(
    "2b983db56e3ef8f5d15b6889d331377565c3d354-1334x890.jpg",
    "Macap Supra 68 G grinder on a bar.",
    1334,
    890,
  ),
  supra: shot(
    "f790c22536751fe58810ca55372f72a11e82d89f-1200x1200.jpg",
    "Macap Supra grinder, square crop.",
    1200,
    1200,
  ),
  studio: shot(
    "bc13d606a47248e2925f0631d01f3da0e1358af3-1920x1080.webp",
    "Macap M2M Domus grinder on a wooden kitchen counter.",
    1920,
    1080,
  ),
};

export const grinderMedia: Record<string, { hero: Shot; gallery: Shot[] }> = {
  "supra-68": {
    hero: shot(
      "bd4298250073711feb9f32eaa056dae7bb3f9db6-1200x801.jpg",
      "Macap Supra 68 grinder on a counter, wide view.",
      1200,
      801,
    ),
    gallery: [
      shot(
        "f790c22536751fe58810ca55372f72a11e82d89f-1200x1200.jpg",
        "Macap Supra grinder, square crop.",
        1200,
        1200,
      ),
      shot(
        "d1cf04d17e33b25cb236c5e7b36d6c5da83133f9-2532x1899.png",
        "Black and white photograph of Macap Supra grinders.",
        2532,
        1899,
      ),
    ],
  },
  "supra-83": {
    hero: shot(
      "7b9da45e760c05371f99e83599d83b9c02c15bdd-1200x800.jpg",
      "Macap Supra 83 grinder on a dark counter.",
      1200,
      800,
    ),
    gallery: [
      shot(
        "d1b07964c5a3ee07e8a1a95a38e4ea5c94df387b-2092x1408.png",
        "Macap Supra 83 grinder in a dark studio.",
        2092,
        1408,
      ),
      shot(
        "6a420798ee0a8426a9eb854c64916e321ec28446-2096x1404.png",
        "Macap Supra 83 grinder, three-quarter view.",
        2096,
        1404,
      ),
    ],
  },
  "supra-68-g-series": {
    hero: shot(
      "2b983db56e3ef8f5d15b6889d331377565c3d354-1334x890.jpg",
      "Macap Supra 68 G grinder on a bar.",
      1334,
      890,
    ),
    gallery: [
      shot(
        "36cf16176051ba67af2149a923334f09e275ae4d-997x998.jpg",
        "Macap Supra 68 G grinder, detail.",
        997,
        998,
      ),
    ],
  },
  "leo-55": {
    hero: shot(
      "f8c9e3eee2773dd1e5ff0e71682547eecda97d3d-1920x1080.webp",
      "Macap Leo 55 grinder, front view.",
      1920,
      1080,
    ),
    gallery: [
      shot(
        "b72312481e5fca2c588d71dd014eb5a066ceb3e7-1000x1000.webp",
        "Macap Leo 55 grinder, detail.",
        1000,
        1000,
      ),
      shot(
        "6cf5140186b54cdba4c9ae4c1dbacc2e54384c14-1000x1000.webp",
        "Macap Leo 55 grinder, side detail.",
        1000,
        1000,
      ),
    ],
  },
  m7: {
    hero: shot(
      "a65083fa8a01dccc017b009cbb444bc45346ab66-3000x1800.webp",
      "Macap M7 doser grinder.",
      3000,
      1800,
    ),
    gallery: [
      shot(
        "20cd1dc98cb88ce66b9703c10e0bd55748ee5431-1000x1000.webp",
        "Macap M7 grinder, detail.",
        1000,
        1000,
      ),
    ],
  },
  mx: {
    hero: shot(
      "a7d22b95f9621812afa48f896067afc0306799f0-3000x1800.webp",
      "Macap MX on-demand grinder.",
      3000,
      1800,
    ),
    gallery: [
      shot(
        "f8e26df866ebe643d20a8f57b181fdc95f132aef-1000x1000.webp",
        "Macap MX grinder, detail.",
        1000,
        1000,
      ),
    ],
  },
  "m2m-domus": {
    hero: shot(
      "bc13d606a47248e2925f0631d01f3da0e1358af3-1920x1080.webp",
      "Macap M2M Domus grinder on a wooden kitchen counter.",
      1920,
      1080,
    ),
    gallery: [
      shot(
        "4f54452240b9979c7e76fcb3f58f3292fe6f98b3-1000x1000.webp",
        "Macap M2M Domus grinder, detail.",
        1000,
        1000,
      ),
      shot(
        "d3210a0c044cf2186657a2296a911bce86f9673c-1000x1000.webp",
        "Macap M2M Domus grinder, second detail.",
        1000,
        1000,
      ),
    ],
  },
  "m2e-domus": {
    hero: shot(
      "1aab3f6692d4081c9afa4018ae8d2c17d3ec89aa-1920x1080.webp",
      "Macap M2E Domus grinder on a kitchen counter beside a cup.",
      1920,
      1080,
    ),
    gallery: [
      shot(
        "230d2d89de3b618dc7725fb41e7469e878a10582-1000x1000.webp",
        "Macap M2E Domus grinder, detail.",
        1000,
        1000,
      ),
    ],
  },
  "m2d-silent": {
    hero: shot(
      "77112bfd8ab9b17f2aeaa40e00e33469af7f64fe-1920x1080.webp",
      "Macap M2D Silent grinder.",
      1920,
      1080,
    ),
    gallery: [
      shot(
        "9d0def52eef83c8158804f405c211f88c8db52e1-1000x1000.webp",
        "Macap M2D Silent grinder, detail.",
        1000,
        1000,
      ),
    ],
  },
};

export function articleShot(slug: string): Shot | null {
  return articleShots[slug] ?? null;
}

export function collectionShot(slug: string): Shot | null {
  return collectionShots[slug] ?? null;
}
