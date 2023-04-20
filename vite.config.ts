import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
  },
  build: {
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "bundle",
      formats: ["cjs", "es"],
      fileName: (format) => {
        switch (format) {
          case "cjs": {
            return `index.js`;
          }
          case "es": {
            return `index.mjs`;
          }
        }
        return "index.js";
      },
    },
    rollupOptions: {
      external: [],
    },
    minify: false,
  },
});
