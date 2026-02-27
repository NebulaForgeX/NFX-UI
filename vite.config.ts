import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], outDir: "dist" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase" as const,
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: path.resolve(root, "src/index.ts"),
      name: "NfxUi",
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^react\//,
        /^react-dom\//,
        "google-libphonenumber",
        // 以下不打包，由 npm 依赖在运行时提供，显著减小 dist 体积
        "lucide-react",
        /^lucide-react\//,
        "recharts",
        /^recharts\//,
        "three",
        /^three\//,
        "gsap",
        "@gsap/react",
        "motion",
        /^motion\//,
        "@tanstack/react-query",
        /^@tanstack\/react-query/,
        "react-router-dom",
        /^react-router-dom\//,
        "i18next",
        "react-i18next",
        "i18next-browser-languagedetector",
        "axios",
        "zustand",
        "react-hook-form",
        "@hookform/resolvers",
        "zod",
        "@headlessui/react",
        /^@headlessui\/react/,
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities",
        "react-datepicker",
        "react-intersection-observer",
        "react-pro-sidebar",
        "lenis",
        "postprocessing",
        "eventemitter3",
        "uuid",
        "buffer",
        "axios-case-converter",
        "async-retry",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
