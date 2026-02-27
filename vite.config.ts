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
        "google-libphonenumber", // 含 eval，不打包可避免 Rolldown 警告；依赖由 npm 安装
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
