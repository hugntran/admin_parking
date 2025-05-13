import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  define: {
    global: "window", // Định nghĩa global như window để giải quyết lỗi khi sử dụng sockjs-client
  },
  server: {
    proxy: {
      "/app-data-service": {
        target: "http://18.182.12.54:8082",
        changeOrigin: true,
        secure: false,
      },
      "/identity": {
        target: "http://18.182.12.54:8080",
        changeOrigin: true,
        secure: false,
      },
      "/dispute": {
        target: "http://18.182.12.54:8086",
        changeOrigin: true,
        secure: false,
      },
      "/payment": {
        target: "http://18.182.12.54:8084",
        changeOrigin: true,
        secure: false,
      },
      "/file": {
        target: "http://18.182.12.54:8085",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
