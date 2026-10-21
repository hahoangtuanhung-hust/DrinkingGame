import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: { reporter: ["text", "json", "html"] },
  },
});
