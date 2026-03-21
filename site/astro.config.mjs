import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://roadcode.blackroad.io",
  outDir: "dist",
  integrations: [sitemap()],
});
