# 🚀 快速部署到 Vercel

## 方法一：通过 Vercel Dashboard（推荐新手）

### 1. 准备 GitHub 仓库
```bash
# 如果还没有 Git 仓库
git init
git add .
git commit -m "Ready for Vercel deployment"

# 推送到 GitHub（替换为您的仓库地址）
git remote add origin https://github.com/your-username/jd-insight-nuxt.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 中部署
1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **"New Project"**
3. 选择您的 GitHub 仓库 `jd-insight-nuxt`
4. 配置项目：
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
   - **Install Command**: `npm install`

### 3. 设置环境变量
在 Vercel 项目设置中添加以下环境变量：

**必需变量：**
- `NUXT_OPENAI_API_KEY`: 您的 OpenAI API 密钥
- `NUXT_JWT_SECRET`: 随机生成的密钥（如：`your-super-secret-jwt-key-12345`）
- `NUXT_PUBLIC_SITE_URL`: 您的 Vercel 应用 URL（如：`https://jd-insight.vercel.app`）

**可选变量（用于多模型支持）：**
- `NUXT_MOONSHOT_API_KEY`: Moonshot API 密钥
- `NUXT_ZHIPU_API_KEY`: 智谱 AI API 密钥
- `NUXT_ANTHROPIC_API_KEY`: Anthropic API 密钥

### 4. 部署
点击 **"Deploy"** 按钮，等待部署完成。

---

## 方法二：通过 Vercel CLI（推荐开发者）

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署项目
```bash
# 在项目根目录执行
vercel

# 首次部署会询问项目配置，按提示操作
# 后续部署使用
vercel --prod
```

### 4. 设置环境变量
```bash
# 添加必需的环境变量
vercel env add NUXT_OPENAI_API_KEY
vercel env add NUXT_JWT_SECRET
vercel env add NUXT_PUBLIC_SITE_URL

# 添加可选的环境变量
vercel env add NUXT_MOONSHOT_API_KEY
vercel env add NUXT_ZHIPU_API_KEY
vercel env add NUXT_ANTHROPIC_API_KEY
```

### 5. 重新部署以应用环境变量
```bash
vercel --prod
```

---

## 🔍 部署后验证

### 1. 基础功能测试
- [ ] 访问您的 Vercel 应用 URL
- [ ] 检查页面是否正常加载
- [ ] 测试响应式设计（手机/平板）
- [ ] 测试暗色模式切换

### 2. 核心功能测试
- [ ] 输入 JD 文本并点击"开始分析"
- [ ] 上传 PDF 文件测试
- [ ] 上传图片文件测试
- [ ] 点击"使用示例"测试
- [ ] 打开设置页面配置 AI 模型

### 3. API 功能测试
打开浏览器开发者工具（F12），在 Network 标签页中：
- [ ] 测试 `/api/v1/analyze` 接口
- [ ] 测试 `/api/v1/test-connection` 接口
- [ ] 测试 `/api/v1/feedback` 接口
- [ ] 测试 `/api/v1/image-recognition` 接口

---

## 🐛 常见问题解决

### 问题 1: TypeScript 配置读取失败
**错误信息：** `Error: Can not read tsconfig.json from /vercel/path0`

**解决方案：**
这是因为 Vercel 构建环境中 `.nuxt/tsconfig.json` 文件可能未正确生成。已修复：

1. 更新了 `tsconfig.json` 配置，添加了完整的编译选项
2. 创建了 `tsconfig.build.json` 作为备用配置
3. 优化了 `nuxt.config.ts` 中的 TypeScript 设置

### 问题 2: 构建失败
**解决方案：**
```bash
# 本地测试构建
npm run build

# 如果本地构建成功但 Vercel 失败，检查：
# 1. Node.js 版本（应该是 18+）
# 2. 依赖版本兼容性
# 3. Vercel 构建日志中的具体错误
```

### 问题 2: Vercel 函数路径匹配错误
**错误信息：** `The pattern "server/api/**/*.ts" defined in 'functions' doesn't match any Serverless Functions`

**解决方案：**
对于 Nuxt.js 项目，Vercel 会自动处理服务端函数，无需手动配置。已修复配置：
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxtjs"
}
```

**说明：**
- Nuxt.js 的 `server/api/` 目录会自动转换为 Vercel Functions
- 无需手动配置函数路径
- Vercel 会根据文件结构自动创建 API 路由

### 问题 3: API 路由返回 404
**解决方案：**
1. 检查 `server/api/v1/` 目录下的文件是否存在
2. 确保文件名以 `.post.ts` 或 `.get.ts` 结尾
3. 检查 `vercel.json` 配置是否正确

### 问题 3: 环境变量不生效
**解决方案：**
1. 在 Vercel Dashboard 中检查环境变量设置
2. 确保变量名前缀为 `NUXT_`
3. 重新部署项目：`vercel --prod`

### 问题 4: AI 分析功能不工作
**解决方案：**
1. 检查 API 密钥是否正确设置
2. 在设置页面测试 API 连接
3. 查看浏览器控制台的错误信息
4. 检查 Vercel Functions 日志

---

## 📊 性能优化建议

### 1. 启用 Vercel Analytics
在 Vercel Dashboard 中启用 Analytics 来监控应用性能。

### 2. 配置缓存策略
项目已配置了基本的缓存策略，API 响应会缓存 60 秒。

### 3. 监控错误
考虑集成 Sentry 等错误监控服务：
```bash
npm install @sentry/nuxt
```

---

## 🎯 部署成功！

如果所有测试都通过，恭喜您！JD Insight 已经成功部署到 Vercel。

**您的应用现在可以：**
- ✅ 分析产品经理岗位 JD
- ✅ 支持文本、PDF、图片多种输入方式
- ✅ 提供结构化的分析结果
- ✅ 支持多种 AI 模型
- ✅ 在全球范围内快速访问

**分享您的应用：**
- 应用 URL: `https://your-app.vercel.app`
- 可以分享给朋友、同事使用
- 支持移动端访问

---

需要帮助？随时询问！ 🚀git add .
git commit -m "Ready for Vercel deployment"
git push origin main
