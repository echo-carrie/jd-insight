// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Nitro配置 - 针对Vercel优化
  nitro: {
    compatibilityDate: '2025-08-04',
    preset: 'vercel',
    // 为API路由设置更长的超时时间
    routeRules: {
      '/api/**': { 
        cors: true,
        headers: { 
          'cache-control': 's-maxage=60',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },

  // 开启SSR
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
  
  // Sitemap配置 - 解决Vercel部署冲突
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  sitemap: {
    urls: [],
    exclude: [
      '/admin/**'
    ],
    autoLastmod: true
  },

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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  // TypeScript配置 - 针对Vercel构建优化
  typescript: {
    strict: false,
    typeCheck: false,
    shim: false,
    tsConfig: {
      compilerOptions: {
        strict: false,
        skipLibCheck: true,
        noImplicitAny: false,
        moduleResolution: "bundler"
      }
    }
  },

  // 暗色模式配置
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  // Tailwind配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts',
    exposeConfig: false,
    viewer: true
  }
})
