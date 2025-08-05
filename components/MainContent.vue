<template>
  <div class="flex flex-col h-full">
    <!-- 消息列表区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6" ref="messagesContainer">
      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4">
        <div class="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">欢迎使用 JD Insight</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          基于 AI 的产品经理岗位智能解析工具，帮助您快速理解岗位核心能力要求、岗位条件需求和核心产出物。
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div class="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="ml-2 text-sm font-medium text-gray-900 dark:text-white">文本分析</h3>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              直接粘贴JD文本内容，AI将自动分析岗位要求和能力需求
            </p>
          </div>
          <div class="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <h3 class="ml-2 text-sm font-medium text-gray-900 dark:text-white">图片识别</h3>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              上传或粘贴JD截图，AI将自动提取并分析文本内容
            </p>
          </div>
        </div>
      </div>
      
      <!-- 消息列表 -->
      <template v-for="(message, index) in messages" :key="index">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" class="flex justify-end">
          <div class="max-w-[80%] md:max-w-[70%] bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tr-sm px-4 py-3">
            <!-- 文本内容 -->
            <div v-if="message.type === 'text'" class="whitespace-pre-wrap text-sm">{{ message.content }}</div>
            
            <!-- 图片内容 -->
            <div v-else-if="message.type === 'image'" class="space-y-2">
              <img :src="message.content" alt="用户上传图片" class="max-w-full rounded-lg" />
              <p class="text-xs text-gray-500 dark:text-gray-400">图片已上传，正在识别文本...</p>
            </div>
          </div>
        </div>
        
        <!-- AI回复 -->
        <div v-else class="flex">
          <div class="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-full flex items-center justify-center flex-shrink-0 mr-3">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="max-w-[80%] md:max-w-[70%] bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div v-if="message.loading" class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
            <div v-else class="whitespace-pre-wrap text-sm" v-html="message.content"></div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 输入区域 -->
    <div class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] p-4">
      <div class="max-w-4xl mx-auto">
        <div class="relative">
          <textarea
            v-model="inputText"
            ref="inputTextarea"
            placeholder="输入JD文本或粘贴图片..."
            class="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all resize-none"
            rows="3"
            @keydown.enter.ctrl.prevent="sendMessage"
            @paste="handlePaste"
            @input="autoResizeTextarea"
          ></textarea>
          
          <div class="absolute right-2 bottom-2 flex items-center space-x-2">
            <!-- 上传图片按钮 -->
            <button
              @click="triggerImageUpload"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="上传图片"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
            
            <!-- 发送按钮 -->
            <button
              @click="sendMessage"
              :disabled="!inputText.trim() && !imageFile"
              :class="[
                'p-2 rounded-lg transition-colors',
                !inputText.trim() && !imageFile
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-[#FF6B6B] hover:bg-[#FF6B6B]/10 dark:hover:bg-[#FF6B6B]/5'
              ]"
              title="发送消息"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          
          <!-- 图片预览 -->
          <div v-if="imagePreview" class="absolute left-2 bottom-full mb-2 bg-white dark:bg-[#1A1A1A] p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
            <div class="relative">
              <img :src="imagePreview" alt="预览图片" class="h-20 rounded" />
              <button
                @click="clearImagePreview"
                class="absolute -top-2 -right-2 bg-white dark:bg-[#1A1A1A] rounded-full p-0.5 shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>支持文本输入或图片粘贴</span>
          <span>Ctrl + Enter 发送</span>
        </div>
        
        <!-- 隐藏的文件上传输入 -->
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept="image/*"
          @change="handleFileUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

// 消息相关状态
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'image'
  loading?: boolean
  timestamp: number
}

const messages = ref<Message[]>([])
const inputText = ref('')
const isAnalyzing = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const inputTextarea = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

  // 发送消息
const sendMessage = async () => {
  // 如果没有输入文本且没有图片，则不发送
  if (!inputText.value.trim() && !imageFile.value) return
  
  // 添加用户消息
  if (inputText.value.trim()) {
    messages.value.push({
      id: generateId(),
      role: 'user',
      content: inputText.value.trim(),
      type: 'text',
      timestamp: Date.now()
    })
  } else if (imageFile.value && imagePreview.value) {
    messages.value.push({
      id: generateId(),
      role: 'user',
      content: imagePreview.value,
      type: 'image',
      timestamp: Date.now()
    })
  }
  
  // 清空输入
  inputText.value = ''
  clearImagePreview()
  
  // 滚动到底部
  scrollToBottom()
  
  // 添加AI正在思考的消息
  const loadingMessageId = generateId()
  messages.value.push({
    id: loadingMessageId,
    role: 'assistant',
    content: '',
    type: 'text',
    loading: true,
    timestamp: Date.now()
  })
  
  // 滚动到底部
  scrollToBottom()
  
  try {
    isAnalyzing.value = true
    
    let analysisResult
    
    // 判断是文本分析还是图片识别
    if (messages.value[messages.value.length - 2].type === 'image') {
      // 图片识别处理
      const imageBase64 = messages.value[messages.value.length - 2].content
      
      // 获取AI设置
      const aiSettings = getAISettings()
      
      // 调用图片识别API
      const response = await fetch('/api/v1/image-recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: {
            model: aiSettings.imageRecognitionModel || 'gpt-4-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: '请提取这张图片中的所有文本内容，保持原始格式。' },
                  { type: 'image_url', image_url: { url: imageBase64 } }
                ]
              }
            ]
          },
          apiKey: aiSettings.imageProvider === 'moonshot' 
            ? (aiSettings.moonshotApiKey || aiSettings.apiKey)
            : aiSettings.imageProvider === 'zhipu'
              ? aiSettings.zhipuApiKey
              : aiSettings.aliyunApiKey,
          baseURL: getProviderBaseURL(aiSettings.imageProvider)
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || '图片识别失败')
      }
      
      // 提取的文本内容
      const extractedText = result.text
      
      // 使用提取的文本进行JD分析
      analysisResult = await analyzeJDText(extractedText)
    } else {
      // 文本分析处理
      const jdText = messages.value[messages.value.length - 2].content
      analysisResult = await analyzeJDText(jdText)
    }
    
    // 更新AI回复
    const messageIndex = messages.value.findIndex(msg => msg.id === loadingMessageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        content: formatAnalysisResult(analysisResult),
        loading: false
      }
    }
  } catch (error) {
    console.error('分析失败:', error)
    
    // 更新为错误消息
    const messageIndex = messages.value.findIndex(msg => msg.id === loadingMessageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        content: `很抱歉，分析过程中出现错误：${error instanceof Error ? error.message : '请重试'}`,
        loading: false
      }
    }
  } finally {
    isAnalyzing.value = false
    scrollToBottom()
  }
}

// 获取AI设置
const getAISettings = () => {
  if (process.client) {
    const settings = localStorage.getItem('ai-settings')
    return settings ? JSON.parse(settings) : {
      apiProvider: 'openai',
      apiKey: '',
      model: 'gpt-4-turbo-preview',
      temperature: 0.3,
      enableImageRecognition: false,
      imageProvider: 'moonshot',
      imageRecognitionModel: 'moonshot-v1-8k'
    }
  }
  return {}
}

// 获取提供商的基础URL
const getProviderBaseURL = (provider: string) => {
  switch (provider) {
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

// 分析JD文本
const analyzeJDText = async (jdText: string) => {
  // 获取AI设置
  const aiSettings = getAISettings()
  
  // 创建表单数据
  const formData = new FormData()
  formData.append('jdText', jdText)
  formData.append('position', '产品经理')
  formData.append('aiConfig', JSON.stringify({
    apiKey: aiSettings.apiKey,
    baseURL: getProviderBaseURL(aiSettings.apiProvider),
    model: aiSettings.model,
    temperature: aiSettings.temperature,
    systemPrompt: '你是一个专业的产品经理JD分析专家，擅长提取JD中的关键信息并进行结构化输出。'
  }))
  
  // 调用分析API
  const response = await fetch('/api/v1/analyze', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'JD分析失败')
  }
  
  return result.data
}

// 格式化分析结果
const formatAnalysisResult = (result: any) => {
  return `
    <div class="space-y-4">
      <h4 class="font-semibold text-gray-900 dark:text-white">分析结果：</h4>
      <p class="text-gray-700 dark:text-gray-300">基于您提供的JD内容，我分析出以下关键信息：</p>
      
      <div class="space-y-2">
        <h5 class="font-medium text-gray-800 dark:text-gray-200">核心能力要求：</h5>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
          ${result.coreAbilities.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="space-y-2">
        <h5 class="font-medium text-gray-800 dark:text-gray-200">岗位条件需求：</h5>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
          ${result.requirements.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="space-y-2">
        <h5 class="font-medium text-gray-800 dark:text-gray-200">核心产出物：</h5>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
          ${result.deliverables.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}

// 自动调整文本框高度
const autoResizeTextarea = () => {
  if (!inputTextarea.value) return
  
  inputTextarea.value.style.height = 'auto'
  inputTextarea.value.style.height = `${Math.min(inputTextarea.value.scrollHeight, 150)}px`
}

// 触发图片上传
const triggerImageUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }
  
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      imagePreview.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
  
  // 重置文件输入，以便可以再次选择同一文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 处理粘贴事件
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      // 阻止默认粘贴行为
      event.preventDefault()
      
      // 获取图片文件
      const file = items[i].getAsFile()
      if (!file) continue
      
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          imagePreview.value = e.target.result as string
        }
      }
      reader.readAsDataURL(file)
      break
    }
  }
}

// 清除图片预览
const clearImagePreview = () => {
  imageFile.value = null
  imagePreview.value = null
}

// 清空聊天
const clearChat = () => {
  messages.value = []
  inputText.value = ''
  clearImagePreview()
}

// 监听全局事件
onMounted(() => {
  // 监听新建分析事件
  window.addEventListener('new-analysis', () => {
    clearChat()
  })
  
  // 监听选择示例事件
  window.addEventListener('select-sample', (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail?.type === 'senior') {
      inputText.value = `【职位】高级产品经理
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
      
      // 自动调整文本框高度
      nextTick(() => {
        autoResizeTextarea()
      })
    }
  })
  
  // 监听设置输入文本事件（从示例模态框选择）
  window.addEventListener('set-input-text', (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail?.text) {
      inputText.value = customEvent.detail.text
      
      // 自动调整文本框高度
      nextTick(() => {
        autoResizeTextarea()
      })
    }
  })
  
  // 监听触发文件上传事件
  window.addEventListener('trigger-file-upload', () => {
    triggerImageUpload()
  })
})
</script>