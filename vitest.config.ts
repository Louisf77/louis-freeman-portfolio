import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@test": new URL("./test", import.meta.url).pathname,
      "~": new URL("./app/frontend", import.meta.url).pathname,
    },
  },
  test: {
    coverage: { provider: "v8" },
    environment: "jsdom",
    globals: false,
    include: ["app/frontend/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
  },
});
