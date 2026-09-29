import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode !== "production",
  },
  plugins: [RubyPlugin(), react()],
}));
