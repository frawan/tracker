// Copies the web app (index.html + vendor/) into www/, which Capacitor packages into the APK.
// index.html in the repo root stays the single source of truth (requirement G1).
import { rmSync, mkdirSync, cpSync } from "node:fs";
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
cpSync("index.html", "www/index.html");
cpSync("vendor", "www/vendor", { recursive: true, filter: src => !src.endsWith(".md") });
console.log("www/ ready");
