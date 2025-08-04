interface AISettings {
  apiProvider: string
  apiKey: string
  apiBaseUrl: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt: string
  userPromptTemplate: string
  encryptStorage: boolean
  autoClean: boolean
}

class AIConfigManager {
  private static instance: AIConfigManager
  private settings: AISettings | null = null

  private constructor() {}

  public static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager()
    }
    return AIConfigManager.instance
  }

  // 默认配置
  private getDefaultSettings(): AISettings {
    return {
      apiProvider: 'openai',
      apiKey: '',
      apiBaseUrl: '',
      model: 'gpt-4-turbo-preview',
      temperature: 0.3,
      maxTokens: 2000,
      topP: 1.0,
      systemPrompt: '你是一个专业的产品经理JD分析专家，擅长提取JD中的关键信息并进行结构化输出。',
      userPromptTemplate: `作为一个专业的产品经理JD分析专家，请分析以下产品经理岗位JD，提取三个关键维度的信息：

1. 核心能力要求（3-5条）：提取岗位所需的关键能力和技能
2. 岗位条件需求：总结学历、经验、必备技能等资格条件  
3. 核心产出物：提取岗位需要完成的主要文档、报告或成果

{position ? \`岗位类型：{position}\\n\` : ''}
JD内容：
{jdText}

请以JSON格式返回分析结果，包含三个数组字段：coreAbilities、requirements、deliverables。每个数组包含对应维度的具体条目。`,
      encryptStorage: true,
      autoClean: false
    }
  }

  // 简单的加密函数
  private encrypt(text: string): string {
    if (typeof window === 'undefined') return text
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch (error) {
      console.error('加密失败:', error)
      return text
    }
  }

  // 简单的解密函数
  private decrypt(encryptedText: string): string {
    if (typeof window === 'undefined') return encryptedText
    try {
      return decodeURIComponent(escape(atob(encryptedText)))
    } catch (error) {
      console.error('解密失败:', error)
      return encryptedText
    }
  }

  // 获取配置
  public getSettings(): AISettings {
    if (this.settings) {
      return this.settings
    }

    if (typeof window === 'undefined') {
      return this.getDefaultSettings()
    }

    try {
      const stored = localStorage.getItem('ai_settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // 如果启用了加密，解密API密钥
        if (parsed.encryptStorage && parsed.apiKey) {
          parsed.apiKey = this.decrypt(parsed.apiKey)
        }
        
        this.settings = { ...this.getDefaultSettings(), ...parsed }
      } else {
        this.settings = this.getDefaultSettings()
      }
    } catch (error) {
      console.error('加载配置失败:', error)
      this.settings = this.getDefaultSettings()
    }

    return this.settings
  }

  // 保存配置
  public saveSettings(newSettings: AISettings): void {
    if (typeof window === 'undefined') return

    try {
      const settingsToSave = { ...newSettings }
      
      // 如果启用了加密，加密API密钥
      if (settingsToSave.encryptStorage && settingsToSave.apiKey) {
        settingsToSave.apiKey = this.encrypt(settingsToSave.apiKey)
      }
      
      localStorage.setItem('ai_settings', JSON.stringify(settingsToSave))
      
      // 更新内存中的配置（保持解密状态）
      this.settings = newSettings
      
      // 设置自动清除监听
      if (newSettings.autoClean) {
        this.setupAutoClean()
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      throw new Error('保存配置失败')
    }
  }

  // 设置自动清除
  private setupAutoClean(): void {
    if (typeof window === 'undefined') return
    
    const cleanup = () => {
      try {
        const settings = this.getSettings()
        if (settings.autoClean) {
          const safeCopy = { ...settings }
          safeCopy.apiKey = ''
          localStorage.setItem('ai_settings', JSON.stringify(safeCopy))
        }
      } catch (error) {
        console.error('自动清除失败:', error)
      }
    }

    window.addEventListener('beforeunload', cleanup)
    window.addEventListener('pagehide', cleanup)
  }

  // 获取API配置（用于发送请求）
  public getAPIConfig() {
    const settings = this.getSettings()
    
    const providers: Record<string, any> = {
      openai: {
        baseURL: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4-turbo-preview'
      },
      anthropic: {
        baseURL: 'https://api.anthropic.com/v1',
        defaultModel: 'claude-3-sonnet-20240229'
      },
      moonshot: {
        baseURL: 'https://api.moonshot.cn/v1',
        defaultModel: 'moonshot-v1-8k'
      },
      zhipu: {
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        defaultModel: 'glm-4'
      },
      custom: {
        baseURL: settings.apiBaseUrl,
        defaultModel: settings.model
      }
    }

    const provider = providers[settings.apiProvider] || providers.openai

    return {
      apiKey: settings.apiKey,
      baseURL: provider.baseURL,
      model: settings.model || provider.defaultModel,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      topP: settings.topP
    }
  }

  // 构建提示词
  public buildPrompt(jdText: string, position?: string): { system: string; user: string } {
    const settings = this.getSettings()
    
    let userPrompt = settings.userPromptTemplate
    userPrompt = userPrompt.replace('{jdText}', jdText)
    userPrompt = userPrompt.replace('{position}', position || '')
    
    // 处理条件逻辑
    if (position) {
      userPrompt = userPrompt.replace(/\{position \? \\`([^`]+)\\` : ''\}/g, '$1')
    } else {
      userPrompt = userPrompt.replace(/\{position \? \\`[^`]+\\` : ''\}/g, '')
    }

    return {
      system: settings.systemPrompt,
      user: userPrompt
    }
  }

  // 清除所有数据
  public clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_settings')
    }
    this.settings = null
  }

  // 检查配置是否有效
  public validateSettings(): { isValid: boolean; errors: string[] } {
    const settings = this.getSettings()
    const errors: string[] = []

    if (!settings.apiKey) {
      errors.push('API密钥不能为空')
    }

    if (!settings.model) {
      errors.push('模型名称不能为空')
    }

    if (settings.temperature < 0 || settings.temperature > 2) {
      errors.push('Temperature 值应在 0-2 之间')
    }

    if (settings.maxTokens < 1 || settings.maxTokens > 10000) {
      errors.push('最大输出长度应在 1-10000 之间')
    }

    if (settings.topP < 0 || settings.topP > 1) {
      errors.push('Top-p 值应在 0-1 之间')
    }

    if (!settings.systemPrompt.trim()) {
      errors.push('系统提示词不能为空')
    }

    if (!settings.userPromptTemplate.trim()) {
      errors.push('用户提示词模板不能为空')
    }

    if (settings.apiProvider === 'custom' && !settings.apiBaseUrl) {
      errors.push('自定义API提供商需要设置基础URL')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// 导出单例实例
export const aiConfig = AIConfigManager.getInstance()
export type { AISettings } 