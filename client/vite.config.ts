import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

import path from "path"
const pathSrc = path.resolve(__dirname, "./src")

export default defineConfig({
  plugins: [solidPlugin()],
  root: "./",
  publicDir: "public",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${pathSrc.replace(
          /\\/g,
          "/"
        )}/global/style";`,
      },
    },
  },
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
