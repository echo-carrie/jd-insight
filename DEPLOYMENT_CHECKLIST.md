# 🚀 JD Insight Vercel 部署检查清单

## 📋 部署前准备

### ✅ 环境检查
- [ ] Node.js 版本 >= 18.0.0
- [ ] 项目可以本地正常运行 (`npm run dev`)
- [ ] 所有依赖已安装 (`npm install`)
- [ ] Git 仓库已初始化并推送到 GitHub

### ✅ 配置文件检查
- [ ] `nuxt.config.ts` 已配置 Vercel 预设
- [ ] `vercel.json` 配置文件已创建
- [ ] `.env.example` 文件已创建
- [ ] `package.json` 包含正确的构建脚本

### ✅ API 功能检查
- [ ] `/server/api/v1/analyze.post.ts` - JD 分析接口
- [ ] `/server/api/v1/test-connection.post.ts` - API 连通性测试
- [ ] `/server/api/v1/feedback.post.ts` - 用户反馈接口
- [ ] `/server/api/v1/image-recognition.post.ts` - 图片识别接口

## 🔑 环境变量配置

### 必需的环境变量
- [ ] `NUXT_OPENAI_API_KEY` - OpenAI API 密钥
- [ ] `NUXT_JWT_SECRET` - JWT 密钥（随机字符串）
- [ ] `NUXT_PUBLIC_SITE_URL` - 站点 URL

### 可选的环境变量（用于多模型支持）
- [ ] `NUXT_MOONSHOT_API_KEY` - Moonshot API 密钥
- [ ] `NUXT_ZHIPU_API_KEY` - 智谱 AI API 密钥
- [ ] `NUXT_ANTHROPIC_API_KEY` - Anthropic API 密钥

## 🚀 部署步骤

### 方法 1: Vercel Dashboard 部署
1. [ ] 访问 [vercel.com](https://vercel.com) 并登录
2. [ ] 点击 "New Project"
3. [ ] 选择 GitHub 仓库
4. [ ] 配置项目设置：
   - Framework Preset: **Nuxt.js**
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
   - Install Command: `npm install`
5. [ ] 添加环境变量
6. [ ] 点击 "Deploy"

### 方法 2: Vercel CLI 部署
1. [ ] 安装 Vercel CLI: `npm i -g vercel`
2. [ ] 登录: `vercel login`
3. [ ] 部署: `vercel --prod`
4. [ ] 设置环境变量: `vercel env add`

## ✅ 部署后验证

### 基础功能测试
- [ ] 网站可以正常访问
- [ ] 页面加载正常，无 404 错误
- [ ] 响应式设计在移动端正常
- [ ] 暗色模式切换正常

### 核心功能测试
- [ ] JD 文本输入和分析功能
- [ ] PDF 文件上传和解析
- [ ] 图片文件上传和识别
- [ ] 示例 JD 加载功能
- [ ] AI 设置配置功能

### API 接口测试
- [ ] 打开浏览器开发者工具
- [ ] 测试 JD 分析功能，检查 `/api/v1/analyze` 接口
- [ ] 测试 API 连通性，检查 `/api/v1/test-connection` 接口
- [ ] 测试反馈功能，检查 `/api/v1/feedback` 接口
- [ ] 测试图片识别，检查 `/api/v1/image-recognition` 接口

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API 响应时间 < 10秒
- [ ] 图片上传处理正常
- [ ] PDF 解析功能正常

## 🐛 常见问题排查

### 构建失败
- [ ] 检查 Node.js 版本是否 >= 18
- [ ] 检查 `package.json` 中的依赖版本
- [ ] 查看 Vercel 构建日志中的错误信息

### API 不工作
- [ ] 检查环境变量是否正确设置
- [ ] 检查 API 路由文件是否存在
- [ ] 查看 Vercel Functions 日志

### 功能异常
- [ ] 检查浏览器控制台错误
- [ ] 检查网络请求是否成功
- [ ] 验证 API 密钥是否有效

## 📊 性能优化

### 已实施的优化
- [ ] 启用了 Vercel Edge Runtime
- [ ] 配置了资源压缩
- [ ] 使用了 Tailwind CSS 的 JIT 模式
- [ ] 启用了图片优化

### 可选优化
- [ ] 配置 CDN 缓存策略
- [ ] 启用 Vercel Analytics
- [ ] 集成错误监控服务
- [ ] 配置性能监控

## 🔒 安全检查

- [ ] API 密钥未在客户端代码中暴露
- [ ] 环境变量正确配置在 Vercel 中
- [ ] CORS 策略配置正确
- [ ] 文件上传大小限制已设置

## 📈 监控设置

- [ ] Vercel Analytics 已启用
- [ ] 错误监控已配置
- [ ] 性能监控已设置
- [ ] 日志记录已配置

## 🎯 最终检查

- [ ] 所有功能都能正常使用
- [ ] 移动端适配良好
- [ ] 加载速度满意
- [ ] 用户体验流畅
- [ ] 错误处理完善

---

## 📞 获取帮助

如果遇到问题，请检查：
1. Vercel 部署日志
2. 浏览器开发者工具
3. 环境变量配置
4. API 密钥有效性

**部署成功后，您的 JD Insight 应用就可以为用户提供专业的产品经理岗位分析服务了！** 🎉