# Vercel部署问题解决方案

## 问题描述

在部署到Vercel时遇到以下错误：

```
[error] EEXIST: file already exists, symlink './__nitro.func' -> '/vercel/path0/.vercel/output/functions/sitemap.xml.func'
```

这个错误是由于`@nuxtjs/sitemap`模块和Vercel的Nitro预设之间的冲突导致的。具体来说，两者都试图处理`sitemap.xml`路径，导致符号链接创建失败。

## 解决方案

我们通过以下两个步骤解决了这个问题：

### 1. 创建vercel.json文件

添加自定义路由规则来处理sitemap.xml：

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "routes": [
    {
      "src": "/sitemap.xml",
      "dest": "/_nuxt/sitemap.xml"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 2. 修改sitemap模块配置

在`nuxt.config.ts`中调整sitemap模块的配置：

```typescript
// Sitemap配置 - 解决Vercel部署冲突
sitemap: {
  siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateOnBuild: true, // 在构建时生成静态sitemap
  discoverRoutes: true,
  exclude: [
    '/admin/**'
  ]
}
```

## 其他Vercel部署优化建议

1. **增加函数内存和超时时间**：
   - 已在vercel.json中配置

2. **使用ISR（增量静态再生成）**：
   如果需要，可以在`nuxt.config.ts`中添加：
   ```typescript
   nitro: {
     preset: 'vercel',
     routeRules: {
       '/**': { isr: true }
     }
   }
   ```

3. **确保环境变量正确设置**：
   - `NUXT_PUBLIC_SITE_URL`: 设置为你的实际网站URL
   - `NUXT_OPENAI_API_KEY`: 如果使用OpenAI API
   - `NUXT_JWT_SECRET`: 用于JWT认证

## 部署后验证

部署成功后，请验证以下内容：

1. 网站是否正常加载
2. sitemap.xml是否可以正常访问
3. API路由是否正常工作

如果问题仍然存在，可以考虑联系Vercel支持或查看Nuxt和sitemap模块的最新文档。