import { defineStore } from 'pinia'

// 创建一个简单的配置工具，不依赖于 Pinia 的持久化
const localStorageUtils = {
  getItem(key: string): string | null {
    if (process.client) {
      return localStorage.getItem(key)
    }
    return null
  },
  setItem(key: string, value: string): void {
    if (process.client) {
      localStorage.setItem(key, value)
    }
  }
}

// 从本地存储加载初始状态
const loadInitialState = () => {
  const savedConfig = localStorageUtils.getItem('clientConfig')
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig)
    } catch (e) {
      console.error('Failed to parse saved config:', e)
    }
  }
  return {
    openaiApiKey: '',
    openaiBaseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4-vision-preview',
    temperature: 0.3,
    maxTokens: 2000,
    topP: 1.0
  }
}

export const useClientConfigStore = defineStore('clientConfig', {
  state: () => loadInitialState(),
  
  actions: {
    setOpenAIConfig(config: {
      apiKey?: string,
      baseUrl?: string,
      model?: string,
      temperature?: number,
      maxTokens?: number,
      topP?: number
    }) {
      if (config.apiKey) this.openaiApiKey = config.apiKey
      if (config.baseUrl) this.openaiBaseUrl = config.baseUrl
      if (config.model) this.model = config.model
      if (config.temperature !== undefined) this.temperature = config.temperature
      if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens
      if (config.topP !== undefined) this.topP = config.topP
      
      // 保存到本地存储
      this.saveToLocalStorage()
    },
    
    clearConfig() {
      this.openaiApiKey = ''
      this.openaiBaseUrl = 'https://api.openai.com/v1'
      this.model = 'gpt-4-vision-preview'
      this.temperature = 0.3
      this.maxTokens = 2000
      this.topP = 1.0
      
      // 保存到本地存储
      this.saveToLocalStorage()
    },
    
    getConfig() {
      return {
        apiKey: this.openaiApiKey,
        baseURL: this.openaiBaseUrl,
        model: this.model,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
        topP: this.topP
      }
    },
    
    // 保存到本地存储
    saveToLocalStorage() {
      if (process.client) {
        try {
          const configString = JSON.stringify({
            openaiApiKey: this.openaiApiKey,
            openaiBaseUrl: this.openaiBaseUrl,
            model: this.model,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            topP: this.topP
          })
          localStorageUtils.setItem('clientConfig', configString)
        } catch (e) {
          console.error('Failed to save config to localStorage:', e)
        }
      }
    }
  }
})