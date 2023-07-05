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
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: true,
        ws: true,
        // headers: { origin: window.location.origin },
      },
    },
  },

  build: {
    minify: true,
    cssMinify: true,
    target: "esnext",
  },
})
