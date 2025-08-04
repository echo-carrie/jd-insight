# JD Insight Vercel 部署指南

本指南将帮助您将 JD Insight 项目完整部署到 Vercel，确保所有功能正常运行。

## 📋 部署前准备

### 1. 环境要求
- Node.js 18+ (已完成)
- Git 账户
- Vercel 账户
- AI 服务提供商的 API 密钥

### 2. 项目结构检查
确保项目包含以下关键文件：
```
jd-insight-nuxt/
├── nuxt.config.ts          # Nuxt 配置
├── package.json             # 依赖配置
├── server/                  # 服务端 API
│   └── api/
│       └── v1/
│           ├── analyze.post.ts
│           ├── test-connection.post.ts
│           └── feedback.post.ts
├── pages/                   # 页面文件
├── layouts/                 # 布局文件
├── utils/                   # 工具函数
└── public/                  # 静态资源
```

## 🚀 部署步骤

### 步骤 1: 准备 Git 仓库

1. **初始化 Git 仓库**（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **推送到 GitHub**：
```bash
# 创建 GitHub 仓库后
git remote add origin https://github.com/your-username/jd-insight-nuxt.git
git branch -M main
git push -u origin main
```

### 步骤 2: 配置环境变量

创建 `.env.example` 文件，列出所需的环境变量：

```env
# OpenAI API 配置
NUXT_OPENAI_API_KEY=your_openai_api_key_here

# JWT 密钥（用于会话管理）
NUXT_JWT_SECRET=your_jwt_secret_here

# 站点 URL（生产环境）
NUXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 步骤 3: 优化 Nuxt 配置

更新 `nuxt.config.ts` 以适配 Vercel：

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Nitro 配置 - 适配 Vercel
  nitro: {
    compatibilityDate: '2025-08-04',
    preset: 'vercel-edge', // 使用 Vercel Edge Runtime
    // 或者使用 'vercel' 用于 Node.js Runtime
  },

  // 开启 SSR
  ssr: true,

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/fontaine',
    '@nuxt/image',
  ],

  // 应用配置
  app: {
    head: {
      title: 'JD Insight - 产品经理岗位智能解析工具',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: '基于AI的产品经理岗位JD智能解析工具，帮助产品经理小白快速理解岗位核心能力要求、岗位条件需求和核心产出物。' 
        }
      ],
    }
  },

  // 运行时配置
  runtimeConfig: {
    // 私有密钥 (仅在服务端可用)
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
    jwtSecret: process.env.NUXT_JWT_SECRET || '',
    
    // 公共密钥 (客户端可用)
    public: {
      apiBase: '/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app'
    }
  },

  // TypeScript 配置
  typescript: {
    strict: false,
    typeCheck: false,
    shim: false
  },

  // 暗色模式配置
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  // Tailwind 配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts',
    exposeConfig: false,
    viewer: true
  }
})
```

### 步骤 4: 创建 Vercel 配置文件

创建 `vercel.json` 文件：

```json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ],
  "functions": {
    "server/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NUXT_OPENAI_API_KEY": "@openai-api-key",
    "NUXT_JWT_SECRET": "@jwt-secret"
  }
}
```

### 步骤 5: 部署到 Vercel

#### 方法 1: 通过 Vercel Dashboard（推荐）

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择您的 GitHub 仓库
4. 配置项目：
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
   - **Install Command**: `npm install`

5. 添加环境变量：
   - `NUXT_OPENAI_API_KEY`: 您的 OpenAI API 密钥
   - `NUXT_JWT_SECRET`: 随机生成的密钥字符串
   - `NUXT_PUBLIC_SITE_URL`: 您的 Vercel 应用 URL

6. 点击 "Deploy"

#### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 设置环境变量
vercel env add NUXT_OPENAI_API_KEY
vercel env add NUXT_JWT_SECRET
vercel env add NUXT_PUBLIC_SITE_URL

# 重新部署以应用环境变量
vercel --prod
```

## 🔧 功能验证清单

部署完成后，请验证以下功能：

### ✅ 基础功能
- [ ] 页面正常加载
- [ ] 响应式设计正常
- [ ] 暗色模式切换
- [ ] 侧边栏交互

### ✅ 核心功能
- [ ] JD 文本输入和分析
- [ ] PDF 文件上传和解析
- [ ] 图片文件上传和识别
- [ ] 示例 JD 加载
- [ ] AI 设置配置

### ✅ API 功能
- [ ] `/api/v1/analyze` - JD 分析接口
- [ ] `/api/v1/test-connection` - API 连通性测试
- [ ] `/api/v1/feedback` - 用户反馈接口

### ✅ 高级功能
- [ ] 多 AI 模型支持
- [ ] 图片识别（需要配置相应 API）
- [ ] 用户设置持久化

## 🐛 常见问题解决

### 1. 构建失败
```bash
# 检查 Node.js 版本
node -v  # 应该是 18+

# 清理依赖重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. API 路由不工作
确保 `server/api/` 目录结构正确，文件名以 `.post.ts` 或 `.get.ts` 结尾。

### 3. 环境变量未生效
- 检查 Vercel Dashboard 中的环境变量设置
- 确保变量名前缀为 `NUXT_`
- 重新部署项目

### 4. PDF 解析失败
PDF 解析依赖 `pdf-parse` 库，在 Vercel Edge Runtime 中可能有限制。如果遇到问题，可以：
- 将 `nitro.preset` 改为 `'vercel'`（使用 Node.js Runtime）
- 或者实现客户端 PDF 解析

### 5. 图片识别不工作
需要创建缺失的图片识别 API：

```typescript
// server/api/v1/image-recognition.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { request, apiKey, baseURL } = body

    // 根据不同的 AI 服务提供商处理图片识别
    // 实现具体的图片识别逻辑
    
    return {
      success: true,
      text: "提取的文本内容"
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
})
```

## 📊 性能优化建议

### 1. 启用压缩
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  }
})
```

### 2. 图片优化
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    domains: ['your-domain.com'],
    formats: ['webp', 'avif']
  }
})
```

### 3. 缓存策略
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true, headers: { 'cache-control': 's-maxage=60' } }
  }
})
```

## 🔒 安全配置

### 1. API 密钥保护
- 永远不要在客户端代码中暴露 API 密钥
- 使用环境变量存储敏感信息
- 定期轮换 API 密钥

### 2. CORS 配置
```typescript
// server/api/v1/analyze.post.ts
export default defineEventHandler(async (event) => {
  // 设置 CORS 头
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  
  // 处理预检请求
  if (getMethod(event) === 'OPTIONS') {
    return ''
  }
  
  // 您的 API 逻辑
})
```

## 📈 监控和分析

### 1. Vercel Analytics
在 Vercel Dashboard 中启用 Analytics 来监控应用性能。

### 2. 错误监控
考虑集成 Sentry 或其他错误监控服务：

```bash
npm install @sentry/nuxt
```

## 🎯 部署后检查清单

- [ ] 应用可以正常访问
- [ ] 所有页面路由正常
- [ ] API 接口响应正常
- [ ] 文件上传功能正常
- [ ] AI 分析功能正常
- [ ] 移动端适配正常
- [ ] 性能指标良好
- [ ] 错误监控已设置

## 📞 获取帮助

如果遇到部署问题：

1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 验证环境变量配置
4. 参考 [Nuxt.js 部署文档](https://nuxt.com/docs/getting-started/deployment)
5. 参考 [Vercel 文档](https://vercel.com/docs)

---

**祝您部署成功！** 🚀

如果您需要任何帮助或有疑问，请随时询问。