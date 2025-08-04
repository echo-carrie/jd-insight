import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  // 获取站点URL
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  
  // 定义网站的主要路由
  const routes = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    // 添加你网站的其他主要路由
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