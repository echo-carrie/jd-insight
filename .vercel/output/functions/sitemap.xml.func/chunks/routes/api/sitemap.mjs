import { d as defineEventHandler, a as useRuntimeConfig } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const sitemap = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "http://localhost:3000";
  const routes = [
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/terms"
    // 添加你网站的其他主要路由
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map((route) => `
  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
</urlset>`;
  event.node.res.setHeader("Content-Type", "application/xml");
  return sitemap;
});

export { sitemap as default };
//# sourceMappingURL=sitemap.mjs.map
