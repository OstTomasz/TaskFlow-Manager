import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@taskflow/shared": path.resolve(__dirname, "../shared/src/index.ts"),
    },
  },
  test: {
    setupFiles: ["src/test/setup.ts"],
    environment: "jsdom",
    globals: true,
  },
});
