// GitHub Pages has no SPA fallback. Copy index.html into a folder per route so deep links
// (/kyc, /order …) return 200 with the app, add 404.html for anything else, and write sitemap.xml.
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE_URL = "https://dynamicsa2008.github.io/ALZUBAIR";
const ROUTES = ["order", "track", "kyc", "feedback", "dashboard"];
const INDEXED = ["", "order", "track", "kyc", "feedback"];

const index = join(DIST, "index.html");
for (const route of ROUTES) {
  mkdirSync(join(DIST, route), { recursive: true });
  copyFileSync(index, join(DIST, route, "index.html"));
}
copyFileSync(index, join(DIST, "404.html"));

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
console.log(`postbuild: ${ROUTES.length} route pages, 404.html, sitemap.xml`);
