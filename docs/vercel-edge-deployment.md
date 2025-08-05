# Vercel Edge Functions 部署指南

本文档提供了将 Nuxt 项目部署到 Vercel Edge Functions 并集成 Vercel KV Storage 的详细步骤。

## 1. Vercel Edge Functions 配置

### 环境变量设置

在 Vercel 项目设置中，添加以下环境变量：

```
SERVER_PRESET=vercel_edge
```

或者，您可以在构建命令中直接指定预设：

```bash
nuxt build --preset=vercel_edge
```

### nuxt.config.ts 配置

项目的 `nuxt.config.ts` 已经配置为使用 Vercel Edge Functions：

```js
nitro: {
  preset: 'vercel-edge',
  // 其他配置...
}
```

## 2. Vercel KV Storage 集成

### 安装依赖

已安装 Vercel KV 依赖：

```bash
npm install @vercel/kv
```

### 环境变量配置

在 Vercel 项目设置中，添加以下环境变量（从 Vercel KV 控制台获取）：

```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=your_token_here
```

获取这些值的步骤：

1. 登录 Vercel 控制台
2. 进入您的项目
3. 点击 "Storage" 选项卡
4. 创建或选择一个 KV 数据库
5. 点击 "Connect" 或 "环境变量" 选项
6. 复制提供的 API URL 和 Token 值

### 本地开发环境配置

对于本地开发，创建一个 `.env` 文件并添加以下内容：

```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=your_token_here
```

## 3. 访问 KV 存储

### 服务器路由中使用 KV 存储

已创建示例路由 `server/routes/api/kv-example.ts`，展示了如何在服务器端访问 KV 存储：

```js
// 获取KV存储实例
const storage = useStorage('kv')

// 读取数据
const value = await storage.getItem(key)

// 写入数据
await storage.setItem(key, value)

// 删除数据
await storage.removeItem(key)
```

### 客户端访问

通过 API 路由间接访问 KV 存储：

```js
// 读取数据
const { data } = await useFetch('/api/kv-example?key=your-key')

// 写入数据
await $fetch('/api/kv-example', {
  method: 'POST',
  body: {
    key: 'your-key',
    value: 'your-value'
  }
})

// 删除数据
await $fetch('/api/kv-example?key=your-key', {
  method: 'DELETE'
})
```

## 4. 自定义 Vercel 构建输出配置

在 `nuxt.config.ts` 中，已添加 `nitro.vercel.config` 配置：

```js
nitro: {
  // ...其他配置
  vercel: {
    config: {
      regions: ['hnd1', 'sin1'], // 指定部署区域，例如东京和新加坡
      isr: {
        expiration: 60, // ISR缓存过期时间（秒）
      }
    }
  }
}
```

可用的区域代码包括：
- `iad1`: 华盛顿特区（美国东部）
- `sfo1`: 旧金山（美国西部）
- `hnd1`: 东京
- `sin1`: 新加坡
- `fra1`: 法兰克福
- `cdg1`: 巴黎

## 5. 部署步骤

1. 确保您的代码已提交到 Git 仓库
2. 在 Vercel 中导入项目
3. 配置所需的环境变量
4. 点击 "Deploy" 按钮

## 6. 验证部署

部署完成后，您可以通过以下方式验证 Edge Functions 和 KV 存储是否正常工作：

1. 访问您的应用 URL
2. 测试 KV 存储 API 端点：`/api/kv-example`

## 7. 监控和调试

在 Vercel 控制台中：
- 查看 Functions 选项卡了解 Edge Functions 的执行情况
- 查看 Storage 选项卡监控 KV 存储的使用情况
- 查看 Logs 选项卡获取详细的运行日志

## 8. 性能优化建议

- 使用 ISR (Incremental Static Regeneration) 缓存频繁访问的页面
- 将静态资源部署到 CDN
- 优化 KV 存储的读写操作，避免频繁的小型读写
- 考虑使用 Edge Middleware 进行请求过滤和转换