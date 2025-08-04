#!/bin/bash

# JD Insight Vercel 部署脚本
# 使用方法: ./scripts/deploy.sh

echo "🚀 开始部署 JD Insight 到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 检查是否已登录 Vercel
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录 Vercel:"
    vercel login
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到 Vercel
echo "📦 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "📋 请确保在 Vercel Dashboard 中设置以下环境变量："
echo "   - NUXT_OPENAI_API_KEY"
echo "   - NUXT_JWT_SECRET"
echo "   - NUXT_PUBLIC_SITE_URL"
echo ""
echo "🔗 访问您的应用: https://your-app.vercel.app"