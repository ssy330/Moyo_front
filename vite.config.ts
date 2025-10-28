import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // src/를 @로 단축
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 백엔드 FastAPI 서버로 요청 프록시
      "/api/v1": {
        target: "http://127.0.0.1:8000", // FastAPI 실행 주소
        changeOrigin: true, // CORS 회피용
      },
    },
  },
});
