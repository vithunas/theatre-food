import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@shared": path.resolve(dir, "../shared") },
  },
  server: {
    port: 5174,
    fs: { allow: [path.resolve(dir, "..")] },
  },
});
