# Vercel部署指南

## 准备工作

1. 确保你有一个Vercel账号
2. 确保你的项目已经推送到GitHub、GitLab或Bitbucket

## 部署步骤

### 1. 配置环境变量

在Vercel项目设置中添加以下环境变量：

- `NUXT_OPENAI_API_KEY`: OpenAI API密钥（如果你的应用使用）
- `NUXT_JWT_SECRET`: JWT密钥（用于认证）
- `NUXT_PUBLIC_SITE_URL`: 你的网站URL（例如：https://jd-insight.vercel.app）

### 2. 部署命令

确保`package.json`中有正确的构建命令：

```json
{
  "scripts": {
    "build": "nuxt build",
    "generate": "nuxt generate"
  }
}
```

### 3. 解决sitemap冲突问题

我们已经通过以下方式解决了sitemap冲突问题：

1. 添加了`vercel.json`文件，配置了sitemap路由
2. 在`nuxt.config.ts`中配置了sitemap模块使用静态生成

### 4. 部署流程

1. 在Vercel控制台中点击"New Project"
2. 导入你的Git仓库
3. 配置项目：
   - 构建命令：`npm run build`
   - 输出目录：`.output/public`
   - 环境变量：如上所述
4. 点击"Deploy"开始部署

### 5. 部署后检查

部署完成后，检查以下内容：

1. 网站是否正常加载
2. sitemap.xml是否可以正常访问（通过 your-domain.com/sitemap.xml）
3. API路由是否正常工作

## 常见问题排查

如果部署失败，请检查以下几点：

1. 查看Vercel构建日志，了解具体错误
2. 确认环境变量是否正确设置
3. 检查`vercel.json`和`nuxt.config.ts`配置是否正确
4. 尝试在本地运行`npm run build`命令，确保本地构建成功

## 自动部署

Vercel会自动监听你的Git仓库变化，当有新的提交时会自动部署。你可以在项目设置中配置：

1. 生产分支（通常是`main`或`master`）
2. 预览分支（用于预览部署）
3. 忽略的构建步骤（可选）

## 性能优化

1. **启用ISR（增量静态再生成）**：
   在`nuxt.config.ts`中添加：
   ```typescript
   nitro: {
     routeRules: {
       '/**': { isr: true }
     }
   }
   ```

2. **配置缓存策略**：
   在`vercel.json`中添加：
   ```json
   {
     "headers": [
       {
         "source": "/_nuxt/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```

3. **优化图片**：
   使用`@nuxt/image`模块（已安装）处理图片优化

## 相关资源

- [Nuxt.js官方Vercel部署文档](https://nuxt.com/docs/getting-started/deployment#vercel)
- [Vercel Nuxt.js部署指南](https://vercel.com/guides/deploying-nuxtjs-with-vercel)
- [Nuxt Sitemap模块文档](https://sitemap.nuxtjs.org/)