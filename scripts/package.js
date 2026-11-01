// `npm run package` → alzubair-site.zip with everything in dist/ (including .htaccess files),
// ready to upload to public_html via cPanel → File Manager → Upload → Extract.
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";

const ZIP = "alzubair-site.zip";
if (existsSync(ZIP)) rmSync(ZIP);
// bsdtar ships with Windows 10+ and macOS; -a picks the format from the .zip extension.
execFileSync("tar", ["-a", "-c", "-f", `../${ZIP}`, "."], { cwd: "dist", stdio: "inherit" });
console.log(`package: ${ZIP} (${(statSync(ZIP).size / 1024 / 1024).toFixed(1)} MB)`);
