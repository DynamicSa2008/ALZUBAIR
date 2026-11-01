// Runs before `npm run deploy`. The dashboard publishes settings.json straight to the live site,
// so the copy in this checkout may be older — pull the live one into dist/ before uploading.
// (Gallery uploads are kept because deploy uses `gh-pages --add`, which never deletes files.)
import { writeFileSync } from "node:fs";

const LIVE = "https://dynamicsa2008.github.io/ALZUBAIR/settings.json";

try {
  const res = await fetch(`${LIVE}?v=${Date.now()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  JSON.parse(text);
  writeFileSync("dist/settings.json", text);
  console.log("sync-live: using the live settings.json");
} catch (e) {
  console.warn(`sync-live: could not fetch live settings (${e.message}); deploying the local copy`);
}
