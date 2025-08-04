<template>
  <div class="min-h-screen pt-16 pb-12 flex flex-col bg-white">
    <main class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex-shrink-0 flex justify-center">
        <NuxtLink to="/" class="inline-flex">
          <span class="sr-only">JD Insight</span>
          <img class="h-12 w-auto" src="/favicon.ico" alt="JD Insight">
        </NuxtLink>
      </div>
      <div class="py-16">
        <div class="text-center">
          <p class="text-sm font-semibold text-primary-600 uppercase tracking-wide">
            {{ error.statusCode }} 错误
          </p>
          <h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            {{ error.statusCode === 404 ? '页面不存在' : '出错了' }}
          </h1>
          <p class="mt-2 text-base text-gray-500">
            {{ error.message || '抱歉，发生了一些错误。' }}
          </p>
          <div class="mt-6 flex justify-center space-x-4">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              返回首页
            </NuxtLink>
            <button
              v-if="error.statusCode !== 404"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              @click="handleError"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const router = useRouter()

const handleError = () => {
  if (props.error.statusCode === 404) {
    router.push('/')
  } else {
    router.replace(route.fullPath)
  }
}
</script> 