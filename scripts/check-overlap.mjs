import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const base = process.env.BASE_URL || "http://localhost:3010";
const chrome = process.env.CHROME_PATH || "/opt/google/chrome/chrome";

const routes = [
  ["/", "home"],
  ["/home-grinders", "home-journey"],
  ["/professional", "professional"],
  ["/collections/home-espresso", "collection-home-espresso"],
  ["/collections/professional-espresso", "collection-professional"],
  ["/collections/grind-by-weight", "collection-grind-by-weight"],
  ["/collections/supra", "collection-supra"],
  ["/grinders", "catalogue"],
  ["/grinders?group=supra", "group-supra"],
  ["/grinders?group=supra-g-series", "group-supra-g"],
  ["/grinders?group=leo", "group-leo"],
  ["/grinders?group=pro", "group-pro"],
  ["/grinders/supra-68", "grinder-supra-68"],
  ["/grinders/m2m-domus", "grinder-m2m-domus"],
  ["/compare", "compare"],
  ["/knowledge", "knowledge"],
  ["/knowledge/supra-68-and-supra-83", "knowledge-post"],
  ["/knowledge/topic/choosing-a-grinder", "topic"],
  ["/about", "about"],
  ["/contact", "contact"],
  ["/legal/privacy-policy", "legal-privacy"],
  ["/legal/terms", "legal-terms"],
  ["/legal/cookie-policy", "legal-cookies"],
  ["/this-page-does-not-exist", "missing"],
];

const viewports = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

function probe(scrolled) {
  const overlaps = (a, b) =>
    a.bottom > b.top + 1 && a.top < b.bottom - 1 && a.right > b.left + 1 && a.left < b.right - 1;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
  };
  const shown = (el) => {
    if (!el) return false;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const header = document.querySelector(".site-header");
  const failures = [];
  if (!header) {
    failures.push("missing-header");
    return failures;
  }
  const hb = box(header);
  const banner = document.querySelector(".sample-banner");
  if (shown(banner)) {
    const bb = box(banner);
    if (overlaps(hb, bb) || hb.top + 1 < bb.bottom) failures.push("banner-under-header");
  }
  const menu = document.querySelector(".menu-panel");
  const details = document.querySelector(".site-menu");
  if (details && !details.open && menu && getComputedStyle(menu).display !== "none") {
    failures.push("menu-visible-while-closed");
  }
  if (details?.open && shown(menu)) {
    const mb = box(menu);
    if (mb.top + 1 < hb.bottom) failures.push("menu-covers-header");
  }
  const targets = [
    ["breadcrumb", document.querySelector('[aria-label="Breadcrumb"]')],
    ["h1", document.querySelector("h1")],
  ];
  for (const [name, el] of targets) {
    if (!shown(el)) continue;
    const r = box(el);
    if (scrolled && r.top < hb.bottom - 1) continue;
    if (overlaps(hb, r)) failures.push(`${name}-overlap`);
  }
  return failures;
}

const failures = [];

const browser = await chromium.launch({ executablePath: chrome, headless: true });

for (const consent of ["denied", "shown"]) {
  const context = await browser.newContext();
  if (consent === "denied") {
    await context.addInitScript(() => localStorage.setItem("macap-cookie-consent", "denied"));
  }
  const page = await context.newPage();
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const [path, name] of routes) {
      const response = await page.goto(base + path, { waitUntil: "load", timeout: 30000 });
      if (!response) {
        failures.push({ name, path, viewport: viewport.width, consent, banner: "present", state: "load", issues: ["no-response"] });
        continue;
      }
      if (consent === "shown") {
        await page.waitForSelector(".cookie-banner", { timeout: 4000 }).catch(() => {});
      }
      await page.waitForTimeout(80);
      for (const banner of ["present", "absent"]) {
        if (banner === "absent") {
          await page.evaluate(() => document.querySelector(".sample-banner")?.remove());
          await page.waitForTimeout(40);
        }
        const states = ["scroll-0"];
        if (viewport.width < 768) states.push("menu-open");
        states.push("scrolled");
        for (const state of states) {
          if (state === "scroll-0") {
            await page.evaluate(() => window.scrollTo(0, 0));
            const menu = page.locator(".site-menu");
            if (await menu.count()) await menu.evaluate((el) => { el.open = false; });
          }
          if (state === "menu-open") {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.locator(".site-menu").evaluate((el) => { el.open = true; });
          }
          if (state === "scrolled") {
            const menu = page.locator(".site-menu");
            if (await menu.count()) await menu.evaluate((el) => { el.open = false; });
            await page.evaluate(() => window.scrollTo(0, 48));
          }
          await page.waitForTimeout(30);
          const issues = await page.evaluate(probe, state === "scrolled");
          if (issues.length) {
            failures.push({ name, path, viewport: `${viewport.width}x${viewport.height}`, consent, banner, state, issues });
          }
        }
      }
    }
  }
  await context.close();
}

await browser.close();

const byRoute = new Map();
for (const item of failures) {
  const key = item.name;
  if (!byRoute.has(key)) byRoute.set(key, []);
  byRoute.get(key).push(`${item.viewport} ${item.consent} banner-${item.banner} ${item.state}: ${item.issues.join(", ")}`);
}

if (!failures.length) {
  console.log(`overlap check passed (${routes.length} routes, ${viewports.length} viewports, cookie on/off, banner on/off, scroll and menu)`);
  process.exit(0);
}

console.log("overlap check failed");
for (const [name, rows] of byRoute) {
  console.log(`\n${name}`);
  for (const row of rows) console.log(`  ${row}`);
}
console.log(`\n${failures.length} failing states`);
process.exit(1);
