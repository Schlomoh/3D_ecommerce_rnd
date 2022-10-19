import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      name: "BMV",
      fileName: "bm-viewer",
      entry: "src/bm-viewer.ts",
    },
    rollupOptions: {
      plugins: [nodeResolve()],
    },
  },
});
