<template>
  <div class="flex h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] text-gray-800 dark:text-gray-200 overflow-hidden">
    <!-- 左侧边栏 -->
    <div 
      @mouseenter="showSidebar"
      @mouseleave="hideSidebar"
      :class="[
        'fixed left-0 top-0 h-full bg-white/80 dark:bg-[#1A1A1A]/80 border-r border-gray-100 dark:border-gray-800/50 flex flex-col transition-all duration-300 ease-in-out z-[100] backdrop-blur-sm',
        isSidebarCollapsed ? 'w-[60px]' : 'w-[260px]'
      ]"
    >
      <!-- Logo -->
      <div class="p-4 flex items-center">
        <div class="w-7 h-7 rounded-full bg-[#FF6B6B] dark:bg-[#FF6B6B]/90 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        <div class="overflow-hidden ml-3">
          <div :class="['transition-all duration-300 whitespace-nowrap', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
            <h1 class="text-base font-medium">JD Insight</h1>
          </div>
        </div>
      </div>

      <!-- 主要操作按钮 -->
      <div class="px-3 py-4">
        <button
          type="button"
          class="w-full rounded-xl py-2.5 px-3 flex items-center bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/20 dark:hover:bg-[#FF6B6B]/10 text-[#FF6B6B] transition-colors duration-200"
          @click="createNewAnalysis"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <div class="overflow-hidden ml-3">
            <span :class="['text-sm font-medium transition-all duration-300 block whitespace-nowrap', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
              新建分析
            </span>
          </div>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-3 py-2 space-y-1">
      <!-- 快速开始 -->
        <button
            @click="selectSample('senior')"
          class="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
          <div class="overflow-hidden ml-3">
            <span :class="['text-sm transition-all duration-300 block whitespace-nowrap', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
              快速开始
            </span>
          </div>
        </button>

        <!-- 上传分析 -->
        <button
            @click="triggerFileUpload"
          class="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
          <div class="overflow-hidden ml-3">
            <span :class="['text-sm transition-all duration-300 block whitespace-nowrap', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
              上传分析
            </span>
          </div>
        </button>

        <!-- 历史记录 -->
        <div class="mt-8 overflow-hidden">
          <div :class="['transition-all duration-300', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
            <h3 class="px-3 mb-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">最近分析</h3>
            <div class="space-y-1">
              <button
            v-for="record in recentRecords"
            :key="record.id"
                class="w-full text-left px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
              >
                {{ record.title }}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- 底部设置 -->
      <div class="px-3 py-4 mt-auto">
          <button
            @click="openSettings"
          class="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          <div class="overflow-hidden ml-3">
            <span :class="['text-sm transition-all duration-300 block whitespace-nowrap', isSidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0']">
              设置
            </span>
          </div>
          </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0 ml-[60px] bg-[#FAFAFA] dark:bg-[#0F0F0F]">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSidebarCollapsed = ref(true) // 默认收起
const isHovered = ref(false)

// 显示侧边栏
const showSidebar = () => {
  isHovered.value = true
  isSidebarCollapsed.value = false
}

// 隐藏侧边栏
const hideSidebar = () => {
  isHovered.value = false
  isSidebarCollapsed.value = true
}

// 模拟的历史记录数据
const recentRecords = ref([
  { id: 1, title: '高级产品经理 - 字节跳动', time: '2分钟前' },
  { id: 2, title: '策略产品经理 - 腾讯', time: '1小时前' },
  { id: 3, title: '产品经理 - 阿里巴巴', time: '昨天' }
])

// 创建新分析
const createNewAnalysis = () => {
  if (route.path !== '/') {
    navigateTo('/')
  }
  // 触发新建分析事件
  if (process.client) {
    window.dispatchEvent(new CustomEvent('new-analysis'))
  }
}

// 选择示例
const selectSample = (type: string) => {
  if (route.path !== '/') {
    navigateTo('/')
  }
  // 触发选择示例事件
  if (process.client) {
    window.dispatchEvent(new CustomEvent('select-sample', { detail: { type } }))
  }
}

// 触发文件上传
const triggerFileUpload = () => {
  if (route.path !== '/') {
    navigateTo('/')
  }
  // 触发文件上传事件
  if (process.client) {
    window.dispatchEvent(new CustomEvent('trigger-file-upload'))
  }
}

// 打开设置模态框
const openSettings = () => {
  if (route.path !== '/') {
    navigateTo('/')
  }
  // 触发全局事件打开设置
  if (process.client) {
    window.dispatchEvent(new CustomEvent('open-settings'))
  }
}
</script> 

<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 1.5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.3);
}
</style> 