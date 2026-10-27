import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const geometry = readFileSync(new URL("../src/components/brand/geometry.ts", import.meta.url), "utf8");

function exportString(name) {
  const match = geometry.match(new RegExp(`export const ${name} = "([^"]+)"`));
  if (!match) throw new Error(`Missing ${name}`);
  return match[1];
}

function exportTemplate(name) {
  const match = geometry.match(new RegExp(`export const ${name} = \`([\\s\\S]*?)\`;`));
  if (!match) throw new Error(`Missing ${name}`);
  return match[1];
}

const iconViewBox = exportString("iconViewBox");
const logoViewBox = exportString("logoViewBox");
const iconShapes = exportTemplate("iconShapes");
const logoShapes = exportTemplate("logoShapes");

if (iconViewBox !== "0 0 132.47 114.32") throw new Error("Icon viewBox changed");
if (logoViewBox !== "0 0 670.53 114.32") throw new Error("Logo viewBox changed");

const marks = readFileSync(new URL("../src/components/brand/marks.tsx", import.meta.url), "utf8");
if (!marks.includes("iconShapes") || !marks.includes("logoShapes") || !marks.includes("currentColor")) {
  throw new Error("Inline marks must use the official geometry and currentColor");
}

function file(viewBox, fill, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}">${body}</svg>\n`;
}

mkdirSync("public/brand", { recursive: true });
writeFileSync("public/brand/macap-icon.svg", file(iconViewBox, "#000", iconShapes));
writeFileSync("public/brand/macap-icon-white.svg", file(iconViewBox, "#fff", iconShapes));
writeFileSync("public/brand/macap-logo.svg", file(logoViewBox, "#000", logoShapes));
writeFileSync("public/brand/macap-logo-white.svg", file(logoViewBox, "#fff", logoShapes));

const [, , vbW, vbH] = iconViewBox.split(" ").map(Number);

function tile(size) {
  const markW = size * 0.64;
  const markH = (markW * vbH) / vbW;
  const x = (size - markW) / 2;
  const y = (size - markH) / 2;
  const scale = markW / vbW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#000"/><g transform="translate(${x} ${y}) scale(${scale})" fill="#fff">${iconShapes}</g></svg>`;
}

writeFileSync("src/app/icon.svg", `${tile(512).replace(` width="512" height="512"`, "")}\n`);

function ico(images) {
  const count = images.length;
  let offset = 6 + 16 * count;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = images.map((image) => {
    const entry = Buffer.alloc(16);
    const dimension = image.size >= 256 ? 0 : image.size;
    entry.writeUInt8(dimension, 0);
    entry.writeUInt8(dimension, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.buffer.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const chrome = "/opt/google/chrome/chrome";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const jobs = [
  { size: 16, path: null },
  { size: 32, path: "src/app/icon.png" },
  { size: 48, path: null },
  { size: 180, path: "src/app/apple-icon.png" },
  { size: 192, path: "public/brand/icon-192.png" },
  { size: 512, path: "public/brand/icon-512.png" },
];

const rendered = [];
for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: job.size, height: job.size },
    deviceScaleFactor: 1,
  });
  const markup = tile(job.size);
  await page.setContent(
    `<!doctype html><html><head><style>html,body{margin:0;background:#000}</style></head><body>${markup}</body></html>`,
    { waitUntil: "load" },
  );
  const dataUrl = await page.evaluate(async (size) => {
    const svg = document.querySelector("svg");
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, size, size);
    URL.revokeObjectURL(url);
    return canvas.toDataURL("image/png");
  }, job.size);
  const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
  await page.close();
  const size = pngSize(buffer);
  if (size.width !== job.size || size.height !== job.size) {
    throw new Error(`Expected ${job.size}px, got ${size.width}x${size.height}`);
  }
  if (buffer[25] !== 6) throw new Error(`Expected an RGBA PNG, colour type ${buffer[25]}`);
  if (job.path) writeFileSync(job.path, buffer);
  rendered.push({ size: job.size, buffer });
}
await browser.close();

writeFileSync("src/app/favicon.ico", ico(rendered.filter((image) => [16, 32, 48].includes(image.size))));
writeFileSync("public/apple-touch-icon.png", rendered.find((image) => image.size === 180).buffer);
console.log("Wrote official logo files and favicon tiles");
