<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#1A1A1A] border-r border-gray-100 dark:border-gray-800">
    <!-- 侧边栏头部 -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">JD Insight</h1>
      </div>
    </div>

    <!-- 侧边栏内容 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- 新建分析按钮 -->
      <button
        @click="emitNewAnalysis"
        class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>新建分析</span>
      </button>

      <!-- 快速开始 -->
      <div class="space-y-3">
        <h3 class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">快速开始</h3>
        <div class="space-y-1">
          <button
            @click="emitSelectSample('senior')"
            class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>高级产品经理示例</span>
          </button>
          <button
            class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>初级前端开发示例</span>
          </button>
          <button
            @click="emitTriggerFileUpload"
            class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            <span>上传JD截图</span>
          </button>
        </div>
      </div>

      <!-- 历史记录 -->
      <div class="space-y-3">
        <h3 class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">历史记录</h3>
        <div class="space-y-1">
          <div class="text-xs text-gray-400 dark:text-gray-600 text-center py-2">
            暂无历史记录
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边栏底部 -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <button
          @click="emitOpenSettings"
          class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>设置</span>
        </button>
        <button
          @click="toggleDarkMode"
          class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 颜色模式
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// 事件处理函数
const emitOpenSettings = () => {
  window.dispatchEvent(new CustomEvent('open-settings'))
}

const emitNewAnalysis = () => {
  window.dispatchEvent(new CustomEvent('new-analysis'))
}

const emitSelectSample = (type: string) => {
  window.dispatchEvent(new CustomEvent('select-sample', { detail: { type } }))
}

const emitTriggerFileUpload = () => {
  window.dispatchEvent(new CustomEvent('trigger-file-upload'))
}
</script>