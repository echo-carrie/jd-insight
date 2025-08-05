<template>
  <div class="flex flex-col h-full overflow-hidden">
      <!-- 页面头部 -->
      <div class="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">JD 智能解析</h1>
          <div class="flex items-center space-x-2">
            <button
              @click="showSampleModal = true"
              class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              示例
            </button>
          </div>
        </div>
      </div>
      
      <!-- 主内容 -->
      <div class="flex-1 overflow-hidden">
        <MainContent />
      </div>
    
    <!-- 示例模态框 -->
    <div
      v-if="showSampleModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="showSampleModal = false"
    >
      <div class="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- 模态框头部 -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">选择示例</h3>
            <button
              @click="showSampleModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 模态框内容 -->
        <div class="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div class="space-y-4">
            <div
              v-for="(sample, index) in sampleJDs"
              :key="index"
              class="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              @click="selectSample(sample)"
            >
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ sample.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ sample.preview }}</p>
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button
            @click="showSampleModal = false"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            取消
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
      <div class="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- 模态框头部 -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">AI 模型配置</h3>
            <button
              @click="showSettings = false"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 模态框内容 -->
        <div class="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 基础语言模型配置 -->
            <div class="space-y-6">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">基础语言模型</h4>
              </div>

              <!-- 提供商选择 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">服务提供商</label>
                <select
                  v-model="aiSettings.apiProvider"
                  class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
                >
                  <option v-for="provider in baseLanguageProviders" :key="provider.value" :value="provider.value">
                    {{ provider.name }}
                  </option>
                </select>
              </div>

              <!-- 模型选择 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">模型选择</label>
                <select
                  v-model="aiSettings.model"
                  class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
                >
                  <option v-for="model in getAvailableModels(aiSettings.apiProvider)" :key="model.value" :value="model.value">
                    {{ model.label }}
                  </option>
                  <option value="custom">自定义模型</option>
                </select>
                <input
                  v-if="aiSettings.model === 'custom'"
                  v-model="aiSettings.customModel"
                  type="text"
                  placeholder="输入自定义模型名称"
                  class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
                />
              </div>

              <!-- API 密钥 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API 密钥</label>
                <div class="relative">
                  <input
                    :type="showApiKey ? 'text' : 'password'"
                    v-model="aiSettings.apiKey"
                    placeholder="输入 API 密钥"
                    class="w-full px-3 py-2.5 pr-10 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"
                  />
                  <button
                    @click="showApiKey = !showApiKey"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        v-if="showApiKey"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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

              <!-- 温度滑块 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  温度（创造性）：{{ aiSettings.temperature.toFixed(1) }}
                </label>
                <input
                  type="range"
                  v-model="aiSettings.temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>精确</span>
                  <span>创造</span>
                </div>
              </div>

              <!-- 基础模型连接测试 -->
              <div class="space-y-3">
                <button
                  @click="testBaseModelConnection"
                  :disabled="isTestingBase"
                  class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/20 dark:hover:bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <span>{{ isTestingBase ? '测试中...' : '测试基础模型连接' }}</span>
                </button>
                <div
                  v-if="baseTestResult"
                  :class="[
                    'p-3 rounded-lg text-sm whitespace-pre-line',
                    baseTestResult.success
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ baseTestResult.message }}
                </div>
              </div>
            </div>

            <!-- 图片识别模型配置 -->
            <div class="space-y-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">图片识别模型</h4>
                </div>
                <button
                  @click="aiSettings.enableImageRecognition = !aiSettings.enableImageRecognition"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    aiSettings.enableImageRecognition ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
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

              <div v-if="aiSettings.enableImageRecognition" class="space-y-6">
                <!-- 图片识别提供商选择 -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">服务提供商</label>
                  <select
                    v-model="aiSettings.imageProvider"
                    class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 transition-all"
                  >
                    <option v-for="provider in imageProviders" :key="provider.value" :value="provider.value">
                      {{ provider.name }}
                    </option>
                  </select>
                </div>

                <!-- 图片识别模型选择 -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">模型选择</label>
                  <select
                    v-model="aiSettings.imageRecognitionModel"
                    class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 transition-all"
                  >
                    <option v-for="model in getAvailableImageModels(aiSettings.imageProvider)" :key="model.value" :value="model.value">
                      {{ model.label }}
                    </option>
                  </select>
                </div>

                <!-- 图片识别API配置 -->
                <div class="space-y-4">
                  <div v-if="aiSettings.imageProvider === 'moonshot'" class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moonshot API 配置</label>
                    <input
                      v-model="aiSettings.moonshotApiKey"
                      type="password"
                      placeholder="Moonshot API Key（可选，默认使用基础模型密钥）"
                      class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div v-if="aiSettings.imageProvider === 'zhipu'" class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">智谱 API 配置</label>
                    <input
                      v-model="aiSettings.zhipuApiKey"
                      type="password"
                      placeholder="智谱 API Key"
                      class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div v-if="aiSettings.imageProvider === 'aliyun'" class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">阿里云 API 配置</label>
                    <input
                      v-model="aiSettings.aliyunApiKey"
                      type="password"
                      placeholder="阿里云 API Key"
                      class="w-full px-3 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <!-- 图片识别模型连接测试 -->
                <div class="space-y-3">
                  <button
                    @click="testImageModelConnection"
                    :disabled="isTestingImage"
                    class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-500/10 dark:bg-blue-500/5 hover:bg-blue-500/20 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <span>{{ isTestingImage ? '测试中...' : '测试图片识别连接' }}</span>
                  </button>
                  <div
                    v-if="imageTestResult"
                    :class="[
                      'p-3 rounded-lg text-sm whitespace-pre-line',
                      imageTestResult.success
                        ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    ]"
                  >
                    {{ imageTestResult.message }}
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <div class="text-gray-400 dark:text-gray-600 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">启用图片识别功能以配置相关设置</p>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MainContent from '~/components/MainContent.vue'

// 示例模态框状态
const showSampleModal = ref(false)

// 示例JD数据
const sampleJDs = [
  {
    title: '高级产品经理 - 字节跳动',
    preview: '负责抖音电商核心业务的产品规划和设计，推动产品从0到1的建设；深入理解用户需求，洞察行业趋势...',
    content: `【职位】高级产品经理
【公司】字节跳动
【工作职责】
1. 负责抖音电商核心业务的产品规划和设计，推动产品从0到1的建设；
2. 深入理解用户需求，洞察行业趋势，制定产品策略和路线图；
3. 与设计、研发、运营等团队紧密协作，确保产品高质量交付；
4. 负责产品的数据分析，持续优化产品体验和业务指标；
5. 跟踪竞品动态，保持产品的市场竞争力。

【任职要求】
1. 本科及以上学历，3年以上互联网产品经理经验，有电商或社交产品经验优先；
2. 具备优秀的产品思维，能够深入理解用户需求并转化为产品方案；
3. 具备良好的数据分析能力，能够通过数据驱动产品决策；
4. 出色的沟通协调能力和项目管理能力，能够推动跨部门合作；
5. 有较强的抗压能力和执行力，能够在快节奏的环境中高效工作；
6. 熟悉电商行业生态和趋势，对产品有独到见解。`
  },
  {
    title: '初级前端开发工程师 - 腾讯',
    preview: '负责腾讯产品的Web前端开发，参与产品的用户界面设计，制作标准优化的代码...',
    content: `【职位】初级前端开发工程师
【公司】腾讯
【工作职责】
1. 负责腾讯产品的Web前端开发，参与产品的用户界面设计；
2. 制作标准优化的代码，并增加交互动态功能；
3. 与后端开发人员一起参与API的设计与实现；
4. 负责前端页面性能优化，提升用户体验；
5. 参与前端技术选型和技术架构设计。

【任职要求】
1. 本科及以上学历，计算机相关专业，1-3年前端开发经验；
2. 熟悉HTML5、CSS3、JavaScript等前端技术，熟悉响应式布局；
3. 熟悉Vue、React等主流前端框架，有实际项目经验；
4. 了解Node.js，有一定的后端开发经验优先；
5. 具有良好的团队协作精神和沟通能力；
6. 对前端技术有浓厚兴趣，有自己的技术博客或开源项目者优先。`
  },
  {
    title: '数据分析师 - 阿里巴巴',
    preview: '负责业务数据的收集、清洗、分析和可视化，挖掘数据价值，为业务决策提供数据支持...',
    content: `【职位】数据分析师
【公司】阿里巴巴
【工作职责】
1. 负责业务数据的收集、清洗、分析和可视化，挖掘数据价值；
2. 建立数据分析模型，为业务决策提供数据支持；
3. 跟踪关键业务指标，发现异常并提出改进建议；
4. 与产品、运营等团队合作，优化产品功能和用户体验；
5. 定期输出数据分析报告，支持业务战略规划。

【任职要求】
1. 本科及以上学历，统计学、数学、计算机等相关专业；
2. 2年以上数据分析相关工作经验，电商行业经验优先；
3. 熟练使用SQL、Python或R等数据处理工具；
4. 熟悉数据可视化工具，如Tableau、PowerBI等；
5. 具备良好的数据敏感度和逻辑思维能力；
6. 优秀的沟通表达能力，能够将复杂的数据分析结果清晰地传达给非技术人员。`
  }
]

// 选择示例
const selectSample = (sample: any) => {
  // 关闭模态框
  showSampleModal.value = false
  
  // 触发全局事件，将示例内容传递给MainContent组件
  if (process.client) {
    window.dispatchEvent(new CustomEvent('set-input-text', { 
      detail: { text: sample.content } 
    }))
  }
}

// 设置相关状态
const showSettings = ref(false)
const showApiKey = ref(false)
const isTestingBase = ref(false)
const isTestingImage = ref(false)
const baseTestResult = ref<{ success: boolean; message: string } | null>(null)
const imageTestResult = ref<{ success: boolean; message: string } | null>(null)

// AI设置接口
interface AISettings {
  apiProvider: string
  apiKey: string
  model: string
  customModel: string
  temperature: number
  enableImageRecognition: boolean
  imageProvider: string
  imageRecognitionModel: string
  moonshotApiKey?: string
  zhipuApiKey?: string
  aliyunApiKey?: string
}

const aiSettings = ref<AISettings>({
  apiProvider: 'openai',
  apiKey: '',
  model: 'gpt-4-turbo-preview',
  customModel: '',
  temperature: 0.3,
  enableImageRecognition: false,
  imageProvider: 'moonshot',
  imageRecognitionModel: 'moonshot-v1-8k',
  moonshotApiKey: '',
  zhipuApiKey: '',
  aliyunApiKey: ''
})

// 基础语言模型提供商
const baseLanguageProviders = [
  { value: 'openai', name: 'OpenAI' },
  { value: 'anthropic', name: 'Anthropic' },
  { value: 'moonshot', name: 'Moonshot' },
  { value: 'zhipu', name: '智谱AI' },
  { value: 'aliyun', name: '阿里云' }
]

// 图片识别提供商
const imageProviders = [
  { value: 'moonshot', name: 'Moonshot' },
  { value: 'zhipu', name: '智谱AI' },
  { value: 'aliyun', name: '阿里云' }
]

// 各提供商的模型列表
const modelsByProvider = {
  openai: [
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo Preview' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  anthropic: [
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
  ],
  moonshot: [
    { value: 'moonshot-v1-8k', label: 'Moonshot V1 8K' },
    { value: 'moonshot-v1-32k', label: 'Moonshot V1 32K' },
    { value: 'moonshot-v1-128k', label: 'Moonshot V1 128K' }
  ],
  zhipu: [
    { value: 'glm-4', label: 'GLM-4' },
    { value: 'glm-3-turbo', label: 'GLM-3 Turbo' }
  ],
  aliyun: [
    { value: 'qwen-turbo', label: 'Qwen Turbo' },
    { value: 'qwen-plus', label: 'Qwen Plus' },
    { value: 'qwen-max', label: 'Qwen Max' }
  ]
}

// 图片识别模型列表
const imageModelsByProvider = {
  moonshot: [
    { value: 'moonshot-v1-8k', label: 'Moonshot V1 8K' },
    { value: 'moonshot-v1-32k', label: 'Moonshot V1 32K' }
  ],
  zhipu: [
    { value: 'glm-4v', label: 'GLM-4V' }
  ],
  aliyun: [
    { value: 'qwen-vl-plus', label: 'Qwen VL Plus' },
    { value: 'qwen-vl-max', label: 'Qwen VL Max' }
  ]
}

// 获取可用模型的函数
const getAvailableModels = (provider: string) => {
  return modelsByProvider[provider as keyof typeof modelsByProvider] || []
}

// 获取图片识别可用模型的函数
const getAvailableImageModels = (provider: string) => {
  return imageModelsByProvider[provider as keyof typeof imageModelsByProvider] || []
}

// AI配置管理
const aiConfig = {
  getSettings: () => {
    if (process.client) {
      const settings = localStorage.getItem('ai-settings')
      return settings ? JSON.parse(settings) : aiSettings.value
    }
    return aiSettings.value
  },
  saveSettings: (settings: AISettings) => {
    if (process.client) {
      localStorage.setItem('ai-settings', JSON.stringify(settings))
    }
  }
}

// 测试基础模型连接
const testBaseModelConnection = async () => {
  if (!aiSettings.value.apiKey.trim()) {
    baseTestResult.value = {
      success: false,
      message: '请先输入 API 密钥'
    }
    return
  }

  try {
    isTestingBase.value = true
    baseTestResult.value = null

    const modelToTest = aiSettings.value.model === 'custom' ? aiSettings.value.customModel : aiSettings.value.model
    
    // 调用测试连接API
    const response = await fetch('/api/v1/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: aiSettings.value.apiKey,
        baseURL: getProviderBaseURL(aiSettings.value.apiProvider),
        model: modelToTest,
        type: 'base',
        provider: aiSettings.value.apiProvider
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      baseTestResult.value = {
        success: true,
        message: `✅ 基础模型连接成功！\n模型：${result.model || modelToTest}\n配置已保存`
      }
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    baseTestResult.value = {
      success: false,
      message: `❌ 基础模型测试失败\n${error instanceof Error ? error.message : '网络错误或服务不可用'}`
    }
  } finally {
    isTestingBase.value = false
  }
}

// 测试图片识别模型连接
const testImageModelConnection = async () => {
  if (!aiSettings.value.enableImageRecognition) {
    imageTestResult.value = {
      success: false,
      message: '请先启用图片识别功能'
    }
    return
  }
  
  // 获取对应提供商的API密钥
  let apiKey = ''
  if (aiSettings.value.imageProvider === 'moonshot') {
    apiKey = aiSettings.value.moonshotApiKey || aiSettings.value.apiKey
  } else if (aiSettings.value.imageProvider === 'zhipu') {
    apiKey = aiSettings.value.zhipuApiKey
  } else if (aiSettings.value.imageProvider === 'aliyun') {
    apiKey = aiSettings.value.aliyunApiKey
  }
  
  if (!apiKey.trim()) {
    imageTestResult.value = {
      success: false,
      message: '请先输入图片识别模型的 API 密钥'
    }
    return
  }

  try {
    isTestingImage.value = true
    imageTestResult.value = null
    
    // 调用测试连接API
    const response = await fetch('/api/v1/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey,
        baseURL: getProviderBaseURL(aiSettings.value.imageProvider),
        model: aiSettings.value.imageRecognitionModel,
        type: 'image',
        provider: aiSettings.value.imageProvider
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      imageTestResult.value = {
        success: true,
        message: `✅ 图片识别模型连接成功！\n模型：${result.model || aiSettings.value.imageRecognitionModel}\n配置已保存`
      }
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    imageTestResult.value = {
      success: false,
      message: `❌ 图片识别模型测试失败\n${error instanceof Error ? error.message : '网络错误或服务不可用'}`
    }
  } finally {
    isTestingImage.value = false
  }
}

// 获取提供商的基础URL
const getProviderBaseURL = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1'
    case 'anthropic':
      return 'https://api.anthropic.com/v1'
    case 'moonshot':
      return 'https://api.moonshot.cn/v1'
    case 'zhipu':
      return 'https://open.bigmodel.cn/api/paas/v4'
    case 'aliyun':
      return 'https://dashscope.aliyuncs.com/api/v1'
    default:
      return 'https://api.openai.com/v1'
  }
}

// 加载AI设置
const loadAISettings = () => {
  try {
    const settings = aiConfig.getSettings()
    Object.assign(aiSettings.value, settings)
  } catch (error) {
    console.error('加载AI设置失败:', error)
  }
}

// 保存设置
const saveSettings = () => {
  try {
    aiConfig.saveSettings(aiSettings.value)
    showSettings.value = false
    baseTestResult.value = null
    imageTestResult.value = null
    alert('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请重试')
  }
}

// 重置设置
const resetAISettings = () => {
  if (confirm('确定要重置为默认设置吗？')) {
    aiSettings.value = {
      apiProvider: 'openai',
      apiKey: '',
      model: 'gpt-4-turbo-preview',
      customModel: '',
      temperature: 0.3,
      enableImageRecognition: false,
      imageProvider: 'moonshot',
      imageRecognitionModel: 'moonshot-v1-8k',
      moonshotApiKey: '',
      zhipuApiKey: '',
      aliyunApiKey: ''
    }
    baseTestResult.value = null
    imageTestResult.value = null
  }
}

// 监听提供商变化，自动选择第一个可用模型
watch(() => aiSettings.value.apiProvider, (newProvider) => {
  const availableModels = getAvailableModels(newProvider)
  if (availableModels.length > 0) {
    aiSettings.value.model = availableModels[0].value
  }
})

watch(() => aiSettings.value.imageProvider, (newProvider) => {
  const availableModels = getAvailableImageModels(newProvider)
  if (availableModels.length > 0) {
    aiSettings.value.imageRecognitionModel = availableModels[0].value
  }
})


// 监听全局事件
onMounted(() => {
  loadAISettings()
  
  if (process.client) {
    // 监听打开设置事件
    window.addEventListener('open-settings', () => {
      showSettings.value = true
    })
    
    // 监听选择示例事件
    window.addEventListener('select-sample', (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.type === 'senior') {
        showSampleModal.value = true
      }
    })
  }
})
</script>
