import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function faviconVersion() {
  const file = path.resolve("public/favicon.svg");
  if (!fs.existsSync(file)) return String(Date.now());
  return String(Math.floor(fs.statSync(file).mtimeMs));
}

/** Bust browser favicon cache when public/favicon.svg changes */
function faviconCacheBustPlugin() {
  const inject = (html) =>
    html.replace(/href="\/favicon\.svg[^"]*"/, `href="/favicon.svg?v=${faviconVersion()}"`);

  return {
    name: "favicon-cache-bust",
    transformIndexHtml: { order: "pre", handler: inject },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/favicon.svg")) {
          res.setHeader("Cache-Control", "no-store, must-revalidate");
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_DEV_API_URL || "http://localhost:3001";

  return {
    plugins: [react(), faviconCacheBustPlugin()],
    server: {
      port: 5173,
      proxy: {
        "/api": { target: apiTarget, changeOrigin: true },
        "/uploads": { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
