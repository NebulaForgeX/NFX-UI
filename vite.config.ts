import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function injectCssModuleSideEffect(): Plugin {
  return {
    name: "inject-css-module-side-effect",
    generateBundle(_opts, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (!/\bfrom\s+["']\.\/s\.module\.js["']/.test(chunk.code)) continue;
        if (chunk.code.includes('import "./s.module.css"') || chunk.code.includes("import './s.module.css'")) continue;
        chunk.code = `import "./s.module.css";\n${chunk.code}`;
      }
    },
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "src");

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function toPackageExternal(name: string): RegExp {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}($|/)`);
}

const packageExternals = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})].map(toPackageExternal);

function collectEntries(dir: string, base = srcDir): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      Object.assign(entries, collectEntries(abs, base));
      continue;
    }
    if (!/\.tsx?$/.test(name)) continue;
    if (name.endsWith(".d.ts") || name.includes(".test.") || name.includes(".spec.")) continue;
    const rel = path.relative(base, abs).replace(/\.(tsx?)$/, "");
    entries[rel] = abs;
  }
  return entries;
}

export default defineConfig({
  plugins: [
    react(),
    injectCssModuleSideEffect(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.*", "src/**/*.css"],
      outDirs: "dist",
      tsconfigPath: "./tsconfig.build.json",
      bundleTypes: false,
    }),
  ],
  resolve: {
    alias: [
      { find: /^nfx-ui\/(.*)$/, replacement: path.join(srcDir, "$1") },
      { find: "@", replacement: srcDir },
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: true,
    lib: {
      entry: collectEntries(srcDir),
      formats: ["es"],
    },
    rollupOptions: {
      external: packageExternals,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
