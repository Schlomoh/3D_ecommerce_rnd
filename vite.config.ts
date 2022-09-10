import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // minify: 'terser',
    lib: {
      name: "bm-viewer",
      entry: "src/bm-viewer.ts",
      formats: ["es"],
    },
    rollupOptions: {
      // external: /^lit/
    },
  },
  plugins: [],
});
