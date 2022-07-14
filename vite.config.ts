import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// const gatewayBaseUri = "https://kissdevelopment-dimpact.commonground.nu";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // server: {
  //   https: true,
  //   proxy: {
  //     "/me": gatewayBaseUri,
  //     "/api": gatewayBaseUri,
  //     "/login": gatewayBaseUri,
  //     "/lougout": gatewayBaseUri,
  //   },
  // },
});
