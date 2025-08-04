import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // 使用硬编码的站点URL（在生产环境中应该从环境变量获取）
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // 定义网站的主要路由
  const routes = [
    '/',
    '/about'
  ]
  
  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`
  
  // 设置响应头
  event.node.res.setHeader('Content-Type', 'application/xml')
  
  // 返回sitemap内容
  return sitemap
})