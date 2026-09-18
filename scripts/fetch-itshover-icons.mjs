#!/usr/bin/env node
/**
 * Pull every animated icon from https://www.itshover.com/icons
 * into src/animations as {name}.tsx.
 *
 * Each card's Copy button / `npx shadcn add` uses the same payload:
 *   https://itshover.com/r/{icon-name}.json
 *
 * Usage (from NFX-UI):
 *   npm run icons:fetch
 *   node scripts/fetch-itshover-icons.mjs
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "src", "animations");
const REGISTRY_URL = "https://itshover.com/r/registry.json";
const ITEM_URL = (name) => `https://itshover.com/r/${name}.json`;
const CONCURRENCY = 8;

async function fetchJson(url, attempts = 4) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw last;
}

async function pool(items, limit, worker) {
  const pending = [...items];
  const running = new Set();
  const results = [];

  const run = async () => {
    while (pending.length) {
      const item = pending.shift();
      const task = worker(item)
        .then((value) => results.push(value))
        .finally(() => running.delete(task));
      running.add(task);
      if (running.size >= limit) await Promise.race(running);
    }
    await Promise.all(running);
  };

  await run();
  return results;
}

function pickFiles(item) {
  const files = item.files ?? [];
  const icon = files.find((f) => typeof f.path === "string" && f.path.endsWith(".tsx"));
  const types = files.find((f) => typeof f.path === "string" && f.path.endsWith("types.ts"));
  return { icon, types };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const registry = await fetchJson(REGISTRY_URL);
  const names = (registry.items ?? []).map((item) => item.name).filter(Boolean);

  if (!names.length) {
    throw new Error("registry.json returned no items");
  }

  console.log(`Found ${names.length} icons on itshover registry`);

  let typesWritten = false;
  let ok = 0;
  const failed = [];

  await pool(names, CONCURRENCY, async (name) => {
    const item = await fetchJson(ITEM_URL(name));
    const { icon, types } = pickFiles(item);

    if (!icon?.content) {
      failed.push(name);
      console.error(`skip ${name}: no tsx content`);
      return;
    }

    const fileName = path.basename(icon.path);
    await writeFile(path.join(OUT_DIR, fileName), icon.content, "utf8");
    ok += 1;
    process.stdout.write(`\r  ${ok}/${names.length}  ${fileName.padEnd(48)}`);

    if (!typesWritten && types?.content) {
      await writeFile(path.join(OUT_DIR, "types.ts"), types.content, "utf8");
      typesWritten = true;
    }
  });

  process.stdout.write("\n");

  if (failed.length) {
    throw new Error(`Failed ${failed.length}: ${failed.join(", ")}`);
  }

  await writeBarrel(OUT_DIR);
  console.log(`Wrote ${ok} icons + types.ts + index.ts → ${path.relative(ROOT, OUT_DIR)}`);
}

async function writeBarrel(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".tsx")).sort();
  const rows = [];
  const seen = new Map();

  for (const file of files) {
    const src = await readFile(path.join(dir, file), "utf8");
    const m = src.match(/export default (\w+)\s*;?\s*$/m);
    if (!m) throw new Error(`no default export: ${file}`);
    const name = m[1];
    if (seen.has(name)) {
      throw new Error(`duplicate ${name}: ${seen.get(name)} vs ${file}`);
    }
    seen.set(name, file);
    rows.push(`export { default as ${name} } from './${file.replace(/\.tsx$/, "")}'`);
  }

  await writeFile(
    path.join(dir, "index.ts"),
    `export type {
  AnimatedIconHandle,
  AnimatedIconProps,
  IconEasing,
} from './types'
export { DEFAULT_STROKE_WIDTH, scaledStrokeWidth } from './types'
export { useAnimatedIconTrigger } from './useAnimatedIconTrigger'

${rows.join("\n")}
`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
