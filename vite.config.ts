import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const devPort = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: "0.0.0.0",
    port: devPort,
    strictPort: true,
    allowedHosts: [".cursorvm.com"],
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PREVIEW_PORT) || 4173,
    strictPort: true,
    allowedHosts: [".cursorvm.com"],
  },
});
