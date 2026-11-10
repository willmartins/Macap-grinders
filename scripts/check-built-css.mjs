import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function cssFiles(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) cssFiles(path, found);
    else if (name.endsWith(".css")) found.push(path);
  }
  return found;
}

const css = cssFiles(".next")
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

const failures = [];
if (!css.includes(".model-hero")) failures.push("built CSS has no .model-hero rule");
if (!css.includes(".choice-frame")) failures.push("built CSS has no .choice-frame rule");
if (!css.includes(".model-hero-figures")) failures.push("built CSS has no horizontal figure row");

// The named colours are the ground for every page. White must still be white.
if (!/--white:#fff/.test(css)) failures.push("built CSS has no white colour token");
if (!/--yellow:#ffc600/.test(css)) failures.push("built CSS has no yellow colour token");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("built CSS contains the photo frames and the named colours");
