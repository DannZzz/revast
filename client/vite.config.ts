import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
  root: "./",
  publicDir: "public",
  server: {
    port: 3000,
    proxy: {
      "/assets": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
})
