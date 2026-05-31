import { defineConfig } from "vite";

const devPort = Number(process.env.PORT) || 5173;
const previewPort = Number(process.env.PREVIEW_PORT) || 4173;

export default defineConfig({
  base: "./",
  server: {
    // 클라우드 프리뷰 프록시가 접근할 수 있도록 모든 인터페이스에 바인딩
    host: "0.0.0.0",
    port: devPort,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: previewPort,
    strictPort: true,
  },
});
