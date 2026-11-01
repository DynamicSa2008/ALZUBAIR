// After `vite build`: write robots.txt, sitemap.xml and the web manifest for the configured domain.
// Deep links (/kyc, /order …) are served by public/.htaccess on Apache/cPanel.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "");
const SITE_URL = (env.VITE_SITE_URL || "https://trademarks-sa.com").replace(/\/$/, "");
const BASE = env.VITE_BASE || "/";
const DIST = "dist";
const INDEXED = ["", "order", "track", "kyc", "feedback"];

const today = new Date().toISOString().slice(0, 10);
const urls = INDEXED.map(
  (r) => `  <url>
    <loc>${SITE_URL}/${r ? r + "/" : ""}</loc>
    <lastmod>${today}</lastmod>
    <priority>${r ? "0.7" : "1.0"}</priority>
  </url>`,
).join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: ${BASE}dashboard\nDisallow: ${BASE}api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

writeFileSync(
  join(DIST, "site.webmanifest"),
  JSON.stringify(
    {
      name: "شركة الزبير — Al Zubair",
      short_name: "الزبير",
      start_url: BASE,
      display: "standalone",
      background_color: "#fbf8f6",
      theme_color: "#c52330",
      lang: "ar",
      dir: "rtl",
      icons: [{ src: "meta.webp", sizes: "300x300", type: "image/webp" }],
    },
    null,
    2,
  ),
);

console.log(`postbuild: sitemap.xml, robots.txt, site.webmanifest for ${SITE_URL}`);
