// server/vitest.config.ts — pełny plik
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@taskflow/shared": path.resolve(__dirname, "../shared/src/index.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["src/test/setup.ts"],
    exclude: ["**/node_modules/**", "seed.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["**/node_modules/**", "scripts/**"],
    },
  },
});
