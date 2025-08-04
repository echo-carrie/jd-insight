<template>
  <div class="flex flex-col h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F]">
    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 欢迎界面 -->
      <div v-if="!analysisResult" class="flex-1 flex flex-col">
        <div class="flex-1 flex items-center justify-center p-8">
          <div class="max-w-2xl w-full mx-auto space-y-12">
            <!-- Logo 和标题 -->
            <div class="text-center space-y-4">
              <div class="w-14 h-14 rounded-full bg-[#FF6B6B] dark:bg-[#FF6B6B]/90 mx-auto flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-medium text-gray-900 dark:text-white">欢迎使用 JD Insight</h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2 text-base">基于 AI 的产品经理岗位智能解析工具</p>
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="w-full space-y-6">
              <!-- 文本输入框 -->
              <div class="relative">
                <textarea
                  ref="textareaRef"
                  v-model="jdText"
                  placeholder="在这里粘贴 JD 文本..."
                  class="w-full h-[200px] px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                  :disabled="isAnalyzing"
                ></textarea>
                <div class="absolute bottom-3 right-3 flex items-center space-x-2 text-sm text-gray-400">
                  <button
                    v-if="jdText"
                    @click="jdText = ''"
                    class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <button
                    @click="triggerPDFUpload"
                    class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span>上传 PDF</span>
                  </button>
                  <button
                    @click="triggerImageUpload"
                    class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>上传图片</span>
                  </button>
                  <button
                    @click="selectSample('senior')"
                    class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>使用示例</span>
                  </button>
                </div>
                <button
                  @click="analyzeJD"
                  :disabled="isAnalyzing || (!jdText.trim() && !selectedFile)"
                  :class="[
                    'flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isAnalyzing || (!jdText.trim() && !selectedFile)
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white'
                  ]"
                >
                  <svg v-if="isAnalyzing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isAnalyzing ? '分析中...' : '开始分析' }}</span>
                </button>
              </div>

              <!-- 文件预览 -->
              <div v-if="selectedFile" class="mt-4 p-4 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg v-if="selectedFile.type === 'application/pdf'" class="w-6 h-6 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                      <svg v-else class="w-6 h-6 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</div>
                    </div>
                  </div>
                  <button
                    @click="clearFile"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div v-if="selectedFile.type.startsWith('image/')" class="mt-4">
                  <img
                    :src="previewUrl"
                    alt="预览图片"
                    class="max-h-48 rounded-lg object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分析结果 -->
      <div v-else class="flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <div class="max-w-4xl mx-auto space-y-8">
          <!-- 结果标题 -->
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">分析结果</h2>
            <button
              @click="resetAnalysis"
              class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              <span>重新分析</span>
            </button>
          </div>

          <!-- 核心能力 -->
          <div class="space-y-4">
            <h3 class="text-base font-medium text-gray-700 dark:text-gray-300">核心能力要求</h3>
            <div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2">
              <div
                v-for="(ability, index) in analysisResult.coreAbilities"
                :key="index"
                class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"
              >
                <svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">{{ ability }}</span>
              </div>
            </div>
          </div>

          <!-- 岗位要求 -->
          <div class="space-y-4">
            <h3 class="text-base font-medium text-gray-700 dark:text-gray-300">岗位要求</h3>
            <div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2">
              <div
                v-for="(requirement, index) in analysisResult.requirements"
                :key="index"
                class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"
              >
                <svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">{{ requirement }}</span>
              </div>
            </div>
          </div>

          <!-- 核心产出物 -->
          <div class="space-y-4">
            <h3 class="text-base font-medium text-gray-700 dark:text-gray-300">核心产出物</h3>
            <div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2">
              <div
                v-for="(deliverable, index) in analysisResult.deliverables"
                :key="index"
                class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"
              >
                <svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">{{ deliverable }}</span>
              </div>
            </div>
          </div>

          <!-- 反馈按钮 -->
          <div class="flex items-center justify-center space-x-4 pt-4">
            <button
              @click="submitFeedback('like')"
              :disabled="feedback !== null"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors',
                feedback === 'like'
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              <span>有帮助</span>
            </button>
            <button
              @click="submitFeedback('dislike')"
              :disabled="feedback !== null"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors',
                feedback === 'dislike'
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"></path>
              </svg>
              <span>需改进</span>
            </button>
          </div>
        </div>
      </div>

    <!-- 设置模态框 -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="showSettings = false"
    >
      <div class="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <!-- 模态框头部 -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">AI 模型设置</h3>
        </div>

        <!-- 模态框内容 -->
        <div class="px-6 py-4 space-y-4">
          <!-- API 提供商选择 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API 提供商</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="provider in providers"
                :key="provider.value"
                @click="aiSettings.apiProvider = provider.value"
                :class="[
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors',
                  aiSettings.apiProvider === provider.value
                    ? 'bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 text-[#FF6B6B]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                ]"
              >
                <span>{{ provider.icon }}</span>
                <span>{{ provider.name }}</span>
              </button>
            </div>
          </div>

          <!-- API 密钥 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API 密钥</label>
            <div class="relative">
              <input
                :type="showApiKey ? 'text' : 'password'"
                v-model="aiSettings.apiKey"
                placeholder="输入 API 密钥"
                class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
              />
              <button
                @click="showApiKey = !showApiKey"
                class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    v-if="showApiKey"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    v-if="showApiKey"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- 模型选择 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">模型选择</label>
            <div class="relative">
              <input
                v-model="aiSettings.model"
                type="text"
                placeholder="输入模型名称，如：gpt-4-turbo-preview"
                class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
              />
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="model in commonModels"
                  :key="model.value"
                  type="button"
                  @click="aiSettings.model = model.value"
                  class="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {{ model.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 温度滑块 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              温度（创造性）：{{ aiSettings.temperature.toFixed(1) }}
            </label>
            <input
              type="range"
              v-model="aiSettings.temperature"
              min="0"
              max="1"
              step="0.1"
              class="w-full"
            />
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>精确</span>
              <span>创造</span>
            </div>
          </div>

          <!-- 图片识别设置 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">图片识别</label>
              <button
                @click="aiSettings.enableImageRecognition = !aiSettings.enableImageRecognition"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  aiSettings.enableImageRecognition ? 'bg-[#FF6B6B]' : 'bg-gray-200 dark:bg-gray-700'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    aiSettings.enableImageRecognition ? 'translate-x-5' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
            <div v-if="aiSettings.enableImageRecognition" class="mt-4 space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">识别模型</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="model in imageModels"
                    :key="model.value"
                    @click="aiSettings.imageRecognitionModel = model.value"
                    :class="[
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors',
                      aiSettings.imageRecognitionModel === model.value
                        ? 'bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 text-[#FF6B6B]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    ]"
                  >
                    <span>{{ model.label }}</span>
                  </button>
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  启用后可以直接上传或拖放图片进行JD分析。目前支持Moonshot、智谱AI等多个模型。
                </p>
              </div>
            </div>
          </div>

          <!-- API配置部分 -->
          <div v-if="aiSettings.enableImageRecognition" class="mt-4 space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moonshot API配置</label>
              <div class="space-y-2">
                <input
                  v-model="aiSettings.moonshotApiKey"
                  type="password"
                  placeholder="Moonshot API Key（可选，默认使用通用Key）"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
                <input
                  v-model="aiSettings.moonshotBaseURL"
                  type="text"
                  placeholder="API Base URL（可选）"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">智谱API配置</label>
              <div class="space-y-2">
                <input
                  v-model="aiSettings.zhipuApiKey"
                  type="password"
                  placeholder="智谱 API Key"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
                <input
                  v-model="aiSettings.zhipuBaseURL"
                  type="text"
                  placeholder="API Base URL（可选）"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">阿里云API配置</label>
              <div class="space-y-2">
                <input
                  v-model="aiSettings.aliyunApiKey"
                  type="password"
                  placeholder="阿里云 API Key"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
                <input
                  v-model="aiSettings.aliyunBaseURL"
                  type="text"
                  placeholder="API Base URL"
                  class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <!-- 连接测试 -->
          <div class="space-y-2">
            <button
              @click="testConnection"
              :disabled="isTesting"
              class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/20 dark:hover:bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg text-sm font-medium transition-colors"
            >
              <svg
                v-if="isTesting"
                class="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isTesting ? '测试中...' : '测试连接' }}</span>
            </button>
            <div
              v-if="testResult"
              :class="[
                'mt-2 p-3 rounded-lg text-sm whitespace-pre-line',
                testResult.success
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
              ]"
            >
              {{ testResult.message }}
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
          <button
            @click="resetAISettings"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            重置默认
          </button>
          <div class="flex space-x-3">
            <button
              @click="showSettings = false"
              class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              @click="saveSettings"
              class="px-4 py-2 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="pdfInputRef"
      type="file"
      accept=".pdf"
      class="hidden"
      @change="handleFileSelect"
    />
    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { aiConfig } from '~/utils/aiConfig'

// 接口定义
interface AnalysisResult {
  coreAbilities: string[]
  requirements: string[]
  deliverables: string[]
  requestId: string
}

// 在 AISettings 接口中添加新的配置项
interface AISettings {
  apiProvider: string
  apiKey: string
  model: string
  temperature: number
  enableImageRecognition: boolean // 新增：是否启用图片识别
  imageRecognitionModel: string // 新增：图片识别使用的模型
  moonshotApiKey?: string
  moonshotBaseURL?: string
  zhipuApiKey?: string
  zhipuBaseURL?: string
  aliyunApiKey?: string
  aliyunBaseURL?: string
}

// 基础状态
const jdText = ref('')
const position = ref('')
const selectedFile = ref<File | null>(null)
const isAnalyzing = ref(false)
const analysisResult = ref<AnalysisResult | null>(null)
const feedback = ref<'like' | 'dislike' | null>(null)
const textareaRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()

// 文件输入引用
const pdfInputRef = ref<HTMLInputElement>()
const imageInputRef = ref<HTMLInputElement>()
const previewUrl = ref('')

// 设置相关状态
const showSettings = ref(false)
const showApiKey = ref(false)
const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)
const aiSettings = ref<AISettings>({
  apiProvider: 'openai',
  apiKey: '',
  model: 'gpt-4-turbo-preview',
  temperature: 0.3,
  enableImageRecognition: false,
  imageRecognitionModel: 'moonshot-v1-8k',
  moonshotApiKey: '',
  moonshotBaseURL: '',
  zhipuApiKey: '',
  zhipuBaseURL: '',
  aliyunApiKey: '',
  aliyunBaseURL: ''
})

// AI 提供商选项
const providers = [
  { value: 'openai', name: 'OpenAI', icon: '🤖' },
  { value: 'anthropic', name: 'Anthropic', icon: '🎭' },
  { value: 'moonshot', name: 'Moonshot', icon: '🌙' },
  { value: 'zhipu', name: '智谱AI', icon: '🧠' },
  { value: 'custom', name: '自定义', icon: '⚙️' }
]

// 常用模型列表
const commonModels = [
  { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
  { value: 'moonshot-v1-8k', label: 'Moonshot v1' },
  { value: 'glm-4', label: 'GLM-4' }
]

// 图片识别模型列表
const imageModels = [
  { value: 'moonshot-v1-8k', label: 'Moonshot V1', provider: 'moonshot' },
  { value: 'moonshot-v1-32k', label: 'Moonshot V1-32K', provider: 'moonshot' },
  { value: 'glm-4v', label: 'GLM-4V', provider: 'zhipu' },
  { value: 'qwen-vl-plus', label: 'Qwen VL+', provider: 'aliyun' }
]

// 示例JD数据
const sampleJDs = {
  senior: {
    text: `高级产品经理
岗位职责：
1. 负责公司核心产品的规划、设计和优化，制定产品发展战略
2. 深入了解用户需求，通过数据分析和用户调研驱动产品迭代
3. 协调技术、设计、运营等跨部门团队，推进产品按时上线
4. 建立完善的产品数据体系，持续跟踪产品效果并优化
5. 管理产品全生命周期，从需求分析到产品发布的全流程把控

任职要求：
1. 本科及以上学历，计算机、互联网相关专业优先
2. 5年以上互联网产品经验，有过0-1或1-10产品经历
3. 具备优秀的逻辑思维能力和数据分析能力
4. 熟练使用Axure、Figma等产品设计工具
5. 有过B端或C端产品成功案例，有团队管理经验优先`,
    position: '高级PM'
  },
  strategy: {
    text: `策略产品经理
岗位职责：
1. 负责推荐算法、搜索算法等策略产品的设计和优化
2. 通过A/B测试和数据挖掘，持续优化用户体验和业务指标
3. 与算法工程师紧密合作，将业务需求转化为技术方案
4. 建立策略效果评估体系，定期回顾和优化策略效果
5. 关注行业趋势，探索新的策略方向和技术应用

任职要求：
1. 硕士及以上学历，计算机、数学、统计学等相关专业
2. 3年以上策略产品或算法产品经验
3. 具备强大的数据分析能力，熟练使用SQL、Python等工具
4. 了解机器学习、深度学习等相关技术原理
5. 有推荐系统、搜索引擎、广告系统等相关经验优先`,
    position: '策略PM'
  }
}

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// AI 设置相关函数
const loadAISettings = () => {
  try {
    const settings = aiConfig.getSettings()
    aiSettings.value = {
      apiProvider: settings.apiProvider,
      apiKey: settings.apiKey,
      model: settings.model,
      temperature: settings.temperature,
      enableImageRecognition: settings.enableImageRecognition ?? false,
      imageRecognitionModel: settings.imageRecognitionModel ?? 'moonshot-v1-8k',
      moonshotApiKey: settings.moonshotApiKey,
      moonshotBaseURL: settings.moonshotBaseURL,
      zhipuApiKey: settings.zhipuApiKey,
      zhipuBaseURL: settings.zhipuBaseURL,
      aliyunApiKey: settings.aliyunApiKey,
      aliyunBaseURL: settings.aliyunBaseURL
    }
  } catch (error) {
    console.error('加载AI设置失败:', error)
  }
}

const saveSettings = () => {
  try {
    const fullSettings = aiConfig.getSettings()
    const updatedSettings = {
      ...fullSettings,
      apiProvider: aiSettings.value.apiProvider,
      apiKey: aiSettings.value.apiKey,
      model: aiSettings.value.model,
      temperature: aiSettings.value.temperature,
      enableImageRecognition: aiSettings.value.enableImageRecognition,
      imageRecognitionModel: aiSettings.value.imageRecognitionModel,
      moonshotApiKey: aiSettings.value.moonshotApiKey,
      moonshotBaseURL: aiSettings.value.moonshotBaseURL,
      zhipuApiKey: aiSettings.value.zhipuApiKey,
      zhipuBaseURL: aiSettings.value.zhipuBaseURL,
      aliyunApiKey: aiSettings.value.aliyunApiKey,
      aliyunBaseURL: aiSettings.value.aliyunBaseURL
    }
    aiConfig.saveSettings(updatedSettings)
    showSettings.value = false
    testResult.value = null
    alert('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请重试')
  }
}

const resetAISettings = () => {
  if (confirm('确定要重置为默认设置吗？')) {
    aiSettings.value = {
      apiProvider: 'openai',
      apiKey: '',
      model: 'gpt-4-turbo-preview',
      temperature: 0.3,
      enableImageRecognition: false,
      imageRecognitionModel: 'moonshot-v1-8k',
      moonshotApiKey: '',
      moonshotBaseURL: '',
      zhipuApiKey: '',
      zhipuBaseURL: '',
      aliyunApiKey: '',
      aliyunBaseURL: ''
    }
    testResult.value = null
  }
}

const resetTestResult = () => {
  testResult.value = null
}

// 文件处理相关函数
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const clearFile = () => {
  if (selectedFile.value?.type.startsWith('image/') && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
      return
    }
    
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      selectedFile.value = file
      if (file.type.startsWith('image/')) {
        previewUrl.value = URL.createObjectURL(file)
      }
    } else {
      alert('只支持PDF和图片文件(JPG, PNG, JPEG等)')
      return
    }
  }
}

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      event.preventDefault()
      
      const file = items[i].getAsFile()
      if (!file) continue
      
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }
      
      selectedFile.value = file
      alert('已粘贴图片，点击"开始分析"按钮进行分析')
    }
  }
}

// 触发文件上传
const triggerPDFUpload = () => {
  pdfInputRef.value?.click()
}

const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

// 处理文件拖放
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    const file = files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
      return
    }
    
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      selectedFile.value = file
      if (file.type.startsWith('image/')) {
        previewUrl.value = URL.createObjectURL(file)
      }
    } else {
      alert('只支持PDF和图片文件(JPG, PNG, JPEG等)')
      return
    }
  }
}

// 处理拖放事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// 测试 API 连通性
const testConnection = async () => {
  if (!aiSettings.value.apiKey.trim()) {
    testResult.value = {
      success: false,
      message: '请先输入 API 密钥'
    }
    return
  }

  try {
    isTesting.value = true
    testResult.value = null

    const response = await fetch('/api/v1/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiProvider: aiSettings.value.apiProvider,
        apiKey: aiSettings.value.apiKey,
        model: aiSettings.value.model || 'gpt-3.5-turbo'
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      testResult.value = {
        success: true,
        message: `✅ 连接成功！\n模型：${result.model || aiSettings.value.model}\n响应时间：${result.responseTime || 'N/A'}ms`
      }
    } else {
      testResult.value = {
        success: false,
        message: `❌ 连接失败\n${result.message || '未知错误'}`
      }
    }
  } catch (error) {
    console.error('连通性测试错误:', error)
    testResult.value = {
      success: false,
      message: `❌ 测试失败\n网络错误或服务不可用`
    }
  } finally {
    isTesting.value = false
  }
}

// 获取图片识别的API配置
const getImageRecognitionConfig = () => {
  const provider = imageModels.find(m => m.value === aiSettings.value.imageRecognitionModel)?.provider
  if (!provider) return null

  // 根据提供商获取对应的API配置
  const settings = aiConfig.getSettings()
  switch (provider) {
    case 'moonshot':
      return {
        apiKey: settings.moonshotApiKey || settings.apiKey, // 优先使用专用key，否则使用通用key
        baseURL: settings.moonshotBaseURL || 'https://api.moonshot.cn/v1',
        model: aiSettings.value.imageRecognitionModel
      }
    case 'zhipu':
      return {
        apiKey: settings.zhipuApiKey,
        baseURL: settings.zhipuBaseURL || 'https://open.bigmodel.cn/api/paas/v4',
        model: aiSettings.value.imageRecognitionModel
      }
    case 'aliyun':
      return {
        apiKey: settings.aliyunApiKey,
        baseURL: settings.aliyunBaseURL,
        model: aiSettings.value.imageRecognitionModel
      }
    default:
      return null
  }
}

// 示例和分析相关函数
const selectSample = (type: 'senior' | 'strategy') => {
  const sample = sampleJDs[type]
  jdText.value = sample.text
  position.value = sample.position
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const resetAnalysis = () => {
  analysisResult.value = null
  feedback.value = null
  jdText.value = ''
  position.value = ''
  selectedFile.value = null
}

const openSettings = () => {
  loadAISettings()
  showSettings.value = true
}

// 分析JD
const analyzeJD = async () => {
  try {
    isAnalyzing.value = true
    feedback.value = null
    
    if (!jdText.value && !selectedFile.value) {
      alert('请输入JD文本或上传文件')
      return
    }
    
    const validation = aiConfig.validateSettings()
    if (!validation.isValid) {
      const errorMsg = validation.errors.join('\n')
      if (confirm(`配置验证失败：\n${errorMsg}\n\n是否打开设置进行配置？`)) {
        openSettings()
      }
      return
    }
    
    const apiConfig = aiConfig.getAPIConfig()
    const prompts = aiConfig.buildPrompt(jdText.value, position.value)
    
    const formData = new FormData()
    
    // 如果是图片文件，使用配置的模型处理
    if (selectedFile.value && selectedFile.value.type.startsWith('image/')) {
      if (!aiSettings.value.enableImageRecognition) {
        alert('请先在设置中启用图片识别功能')
        isAnalyzing.value = false
        return
      }

      // 获取图片识别配置
      const imageConfig = getImageRecognitionConfig()
      if (!imageConfig) {
        alert('图片识别配置无效，请检查设置')
        isAnalyzing.value = false
        return
      }

      // 验证API Key
      if (!imageConfig.apiKey) {
        if (confirm('未配置图片识别所需的API密钥，是否前往设置？')) {
          openSettings()
        }
        isAnalyzing.value = false
        return
      }

      try {
        // 将图片转换为 base64
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile.value!)
        })

        // 构建请求
        const imageRequest = {
          request: {
            model: imageConfig.model,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: '请帮我提取这张图片中的JD文本内容，只需要返回提取的文本，不需要任何分析。'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: base64Image as string
                    }
                  }
                ]
              }
            ]
          },
          apiKey: imageConfig.apiKey,
          baseURL: imageConfig.baseURL
        }

        const imageResponse = await fetch('/api/v1/image-recognition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imageRequest)
        })

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json().catch(() => ({}))
          if (imageResponse.status === 401) {
            if (confirm('图片识别API密钥无效或已过期，是否前往设置？')) {
              openSettings()
            }
            return
          }
          throw new Error(errorData.message || '图片处理失败')
        }

        const imageResult = await imageResponse.json()
        if (imageResult.success && imageResult.text) {
          jdText.value = imageResult.text
          formData.append('jdText', imageResult.text)
        } else {
          throw new Error(imageResult.message || '图片处理失败')
        }
      } catch (error) {
        console.error('图片处理错误:', error)
        alert('图片处理失败，请尝试手动输入文本或上传PDF文件')
        isAnalyzing.value = false
        return
      }
    } else {
      // PDF或直接输入的文本
      if (jdText.value) {
        formData.append('jdText', jdText.value)
      }
      if (selectedFile.value) {
        formData.append('file', selectedFile.value)
      }
    }
    
    if (position.value) {
      formData.append('position', position.value)
    }
    
    // 添加AI配置
    const aiConfigData = {
      apiKey: apiConfig.apiKey,
      baseURL: apiConfig.baseURL,
      model: apiConfig.model,
      temperature: apiConfig.temperature,
      maxTokens: apiConfig.maxTokens,
      topP: apiConfig.topP,
      systemPrompt: prompts.system,
      userPrompt: prompts.user
    }
    formData.append('aiConfig', JSON.stringify(aiConfigData))

    const response = await fetch('/api/v1/analyze', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 401) {
        const provider = aiSettings.value.apiProvider || 'openai'
        const providerName = providers.find(p => p.value === provider)?.name || provider
        
        alert(`❌ API 认证失败 (401)\n\n可能的原因：\n` +
              `• API 密钥错误或过期\n` +
              `• 当前选择的提供商：${providerName}\n` +
              `• 请检查密钥是否与提供商匹配\n\n` +
              `建议：\n` +
              `• 重新复制粘贴 API 密钥\n` +
              `• 确认选择了正确的 AI 服务提供商\n` +
              `• 检查账户余额和权限`)
        
        openSettings()
        return
      } else if (response.status === 429) {
        alert('❌ API 请求频率限制 (429)\n\n请稍后再试或检查您的 API 套餐限制。')
        return
      } else if (response.status >= 500) {
        alert('❌ 服务器错误\n\n服务暂时不可用，请稍后重试。')
        return
      }
      
      throw new Error(errorData.message || `请求失败 (${response.status})`)
    }

    const result = await response.json()
    if (result.success) {
      analysisResult.value = result.data
    } else {
      throw new Error(result.message || '分析失败')
    }
  } catch (error) {
    console.error('分析出错:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        alert('🔑 API 认证问题\n\n请检查您的 API 密钥设置，点击左侧设置按钮进行配置。')
        openSettings()
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        alert('🌐 网络连接问题\n\n请检查网络连接并重试。')
      } else {
        alert(`❌ 分析失败\n\n错误信息：${error.message}`)
      }
    } else {
      alert('❌ 分析失败，请稍后重试')
    }
  } finally {
    isAnalyzing.value = false
  }
}

const submitFeedback = async (rating: 'like' | 'dislike') => {
  if (!analysisResult.value) return

  try {
    feedback.value = rating
    
    const response = await fetch('/api/v1/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId: analysisResult.value.requestId,
        rating
      })
    })

    if (!response.ok) {
      throw new Error('提交反馈失败')
    }
  } catch (error) {
    console.error('提交反馈出错:', error)
    feedback.value = null
  }
}

// 生命周期钩子
onMounted(() => {
  loadAISettings()
  
  if (process.client) {
    window.addEventListener('open-settings', openSettings)
    window.addEventListener('new-analysis', resetAnalysis)
    window.addEventListener('select-sample', (e: any) => {
      selectSample(e.detail.type)
    })
    window.addEventListener('trigger-file-upload', triggerFileUpload)
  }

  textareaRef.value?.addEventListener('paste', handlePaste)
  const textarea = textareaRef.value
  if (textarea) {
    textarea.addEventListener('dragover', handleDragOver)
    textarea.addEventListener('drop', handleDrop)
  }
})

watch(aiSettings, () => {
  resetTestResult()
}, { deep: true })

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('open-settings', openSettings)
    window.removeEventListener('new-analysis', resetAnalysis)
    window.removeEventListener('select-sample', (e: any) => {
      selectSample(e.detail.type)
    })
    window.removeEventListener('trigger-file-upload', triggerFileUpload)
  }

  textareaRef.value?.removeEventListener('paste', handlePaste)
  const textarea = textareaRef.value
  if (textarea) {
    textarea.removeEventListener('dragover', handleDragOver)
    textarea.removeEventListener('drop', handleDrop)
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>