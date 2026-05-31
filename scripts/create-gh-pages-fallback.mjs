import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const distDir = new URL("../dist/", import.meta.url);
const indexPath = new URL("index.html", distDir);
const fallbackPath = new URL("404.html", distDir);
const noJekyllPath = new URL(".nojekyll", distDir);

if (!existsSync(indexPath)) {
  console.error("dist/index.html tidak ditemukan. Jalankan vite build lebih dulu.");
  process.exit(1);
}

copyFileSync(indexPath, fallbackPath);
writeFileSync(noJekyllPath, "");
console.log("Created dist/404.html for GitHub Pages SPA fallback.");
