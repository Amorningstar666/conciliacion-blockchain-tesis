import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En GitHub Pages la app se sirve bajo /<nombre-del-repo>/
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173 },
});
