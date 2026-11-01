import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Deploy target: https://trademarks-sa.com/ (cPanel). If the site ever lives in a sub-folder,
// set VITE_BASE=/folder/ and VITE_SITE_URL=https://domain/folder in .env and rebuild.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://trademarks-sa.com").replace(/\/$/, "");
  return {
    plugins: [
      react(),
      {
        name: "site-url",
        transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", siteUrl),
      },
    ],
    base: env.VITE_BASE || "/",
    build: {
      rollupOptions: {
        output: {
          manualChunks: { vendor: ["react", "react-dom", "react-router-dom"] },
        },
      },
    },
  };
});
