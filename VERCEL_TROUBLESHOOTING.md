# 🔧 Vercel 部署故障排除指南

## 常见部署错误及解决方案

### 1. TypeScript 配置错误

#### 错误信息：
```
Error: Can not read tsconfig.json from /vercel/path0
```

#### 解决方案：
✅ **已修复** - 项目已包含完整的 TypeScript 配置：

1. **更新了 `tsconfig.json`**：添加了完整的编译选项
2. **创建了 `tsconfig.build.json`**：作为备用配置
3. **优化了 `nuxt.config.ts`**：改进了 TypeScript 设置

#### 验证修复：
```bash
# 本地测试构建
npm run build

# 检查 TypeScript 配置
npx tsc --noEmit
```

---

### 2. Vercel 函数路径匹配错误

#### 错误信息：
```
Error: The pattern "server/api/**/*.ts" defined in `functions` doesn't match any Serverless Functions inside the `api` directory.
```

#### 解决方案：
✅ **已修复** - 对于 Nuxt.js 项目，Vercel 会自动处理服务端函数，无需手动配置 `functions` 属性：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxtjs"
}
```

**说明**：
- Nuxt.js 的 `server/api/` 目录会自动转换为 Vercel Functions
- 无需在 `vercel.json` 中手动配置函数路径
- Vercel 会根据文件结构自动创建对应的 API 路由

### 3. Vercel 配置冲突

#### 错误信息：
```
The 'functions' property cannot be used in conjunction with the 'builds' property
```

#### 解决方案：
✅ **已修复** - 使用简化的配置格式，让 Vercel 自动处理。

---

### 3. 依赖安装失败

#### 可能的错误信息：
```
npm ERR! peer dep missing
npm ERR! code ERESOLVE
```

#### 解决方案：
```bash
# 清理依赖
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果仍有问题，使用强制安装
npm install --force
```

---

### 4. API 路由不工作

#### 症状：
- API 返回 404 错误
- 服务端函数未执行

#### 解决方案：
1. **检查文件结构**：
```
server/
└── api/
    └── v1/
        ├── analyze.post.ts
        ├── test-connection.post.ts
        ├── feedback.post.ts
        └── image-recognition.post.ts
```

2. **确保文件命名正确**：
   - 使用 `.post.ts` 或 `.get.ts` 后缀
   - 文件名不能包含特殊字符

3. **检查导出格式**：
```typescript
export default defineEventHandler(async (event) => {
  // 您的 API 逻辑
})
```

---

### 5. 环境变量问题

#### 症状：
- API 密钥未定义
- 配置值为空

#### 解决方案：
1. **在 Vercel Dashboard 中设置环境变量**：
   - `NUXT_OPENAI_API_KEY`
   - `NUXT_JWT_SECRET`
   - `NUXT_PUBLIC_SITE_URL`

2. **检查变量名前缀**：
   - 服务端变量：`NUXT_`
   - 客户端变量：`NUXT_PUBLIC_`

3. **重新部署以应用变量**：
```bash
vercel --prod
```

---

### 6. 构建超时

#### 错误信息：
```
Error: Command "npm run build" timed out after 45s
```

#### 解决方案：
1. **优化构建配置**：
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    minify: true
  },
  typescript: {
    typeCheck: false // 禁用类型检查以加速构建
  }
})
```

2. **升级 Vercel 计划**（如果需要更长构建时间）

---

### 7. 内存不足

#### 错误信息：
```
JavaScript heap out of memory
```

#### 解决方案：
1. **在 `package.json` 中增加内存限制**：
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' nuxt build"
  }
}
```

2. **优化构建过程**：
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    minify: true,
    compressPublicAssets: true
  }
})
```

---

### 8. PDF 解析失败

#### 症状：
- PDF 上传后无法解析
- 服务端错误

#### 解决方案：
PDF 解析依赖 `pdf-parse` 库，在 Vercel Edge Runtime 中可能有限制：

1. **检查运行时配置**：
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel', // 使用 Node.js Runtime 而不是 Edge
  }
})
```

2. **添加错误处理**：
```typescript
// server/api/v1/analyze.post.ts
try {
  const pdfData = await pdfParse(part.data, options)
  jdText = pdfData.text
} catch (error) {
  console.error('PDF解析错误:', error)
  throw new Error('PDF文件解析失败，请尝试转换为文本后重新输入')
}
```

---

### 9. 图片识别不工作

#### 症状：
- 图片上传后无响应
- API 返回错误

#### 解决方案：
1. **检查 API 密钥配置**：
   - 确保设置了对应的 AI 服务 API 密钥
   - 验证密钥有效性

2. **检查图片格式支持**：
```typescript
// 支持的格式
const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
```

3. **添加详细错误日志**：
```typescript
console.error('图片识别错误:', {
  model: imageConfig.model,
  apiKey: imageConfig.apiKey ? '已设置' : '未设置',
  error: error.message
})
```

---

## 🔍 调试步骤

### 1. 本地验证
```bash
# 确保本地可以正常运行
npm run dev

# 测试本地构建
npm run build
npm run preview
```

### 2. 检查 Vercel 日志
1. 访问 Vercel Dashboard
2. 选择您的项目
3. 查看 "Functions" 标签页的日志
4. 检查构建日志中的错误信息

### 3. 测试 API 接口
```bash
# 使用 curl 测试 API
curl -X POST https://your-app.vercel.app/api/v1/test-connection \
  -H "Content-Type: application/json" \
  -d '{"apiProvider":"openai","apiKey":"your-key","model":"gpt-3.5-turbo"}'
```

### 4. 检查环境变量
```bash
# 在 Vercel CLI 中查看环境变量
vercel env ls
```

---

## 📋 部署前检查清单

- [ ] 本地构建成功：`npm run build`
- [ ] TypeScript 检查通过：`npx tsc --noEmit`
- [ ] 所有 API 文件存在且格式正确
- [ ] 环境变量已在 Vercel 中设置
- [ ] `vercel.json` 配置正确
- [ ] Git 仓库已推送到 GitHub

---

## 🆘 获取帮助

如果问题仍然存在：

1. **查看完整错误日志**：
   - Vercel Dashboard → 项目 → Functions → 查看日志
   - 浏览器开发者工具 → Console/Network

2. **检查项目配置**：
   - 对比工作的配置文件
   - 验证所有必需文件存在

3. **联系支持**：
   - Vercel 社区论坛
   - GitHub Issues
   - 技术支持

---

**记住：大多数部署问题都是配置相关的，仔细检查每个配置文件通常能解决问题！** 🚀