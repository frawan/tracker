// Copies the web app (pages + vendor/) into www/, which Capacitor packages into the APK.
// index.html in the repo root stays the single source of truth (requirement G1).
import { rmSync, mkdirSync, cpSync } from "node:fs";
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
// Pages packaged in the app (android.html is website-only: its link is hidden in the app)
for (const page of ["index.html", "privacy.html", "delete-account.html"]) cpSync(page, `www/${page}`);
cpSync("vendor", "www/vendor", { recursive: true, filter: src => !src.endsWith(".md") });
console.log("www/ ready");
