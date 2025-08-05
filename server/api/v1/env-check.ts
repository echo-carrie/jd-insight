import { defineEventHandler, readBody } from 'h3'
import OpenAI from 'openai'

// 定义模型列表
const baseModels = [
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'openai' },
  { value: 'gpt-4', label: 'GPT-4', provider: 'openai' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'openai' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'anthropic' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'anthropic' },
  { value: 'moonshot-v1-8k', label: 'Moonshot v1', provider: 'moonshot' },
  { value: 'moonshot-v1-32k', label: 'Moonshot v1-32k', provider: 'moonshot' },
  { value: 'glm-4', label: 'GLM-4', provider: 'zhipu' },
  { value: 'qwen-max', label: 'Qwen Max', provider: 'aliyun' }
]

const visionModels = [
  { value: 'gpt-4-vision', label: 'GPT-4 Vision', provider: 'openai' },
  { value: 'moonshot-v1-8k', label: 'Moonshot V1', provider: 'moonshot' },
  { value: 'moonshot-v1-32k', label: 'Moonshot V1-32K', provider: 'moonshot' },
  { value: 'glm-4v', label: 'GLM-4V', provider: 'zhipu' },
  { value: 'qwen-vl-plus', label: 'Qwen VL+', provider: 'aliyun' }
]

// 获取模型列表
export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  
  // GET 请求返回模型列表
  if (method === 'GET') {
    return {
      success: true,
      data: {
        baseModels,
        visionModels
      }
    }
  }
  
  // POST 请求用于测试连接
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { apiProvider, apiKey, model, baseURL } = body
      
      if (!apiKey) {
        return {
          success: false,
          message: '请提供 API 密钥'
        }
      }
      
      // 根据不同的 API 提供商进行连接测试
      const startTime = Date.now()
      let result
      
      switch (apiProvider) {
        case 'openai':
          result = await testOpenAI(apiKey, model, baseURL)
          break
        case 'anthropic':
          result = await testAnthropic(apiKey, model, baseURL)
          break
        case 'moonshot':
          result = await testMoonshot(apiKey, model, baseURL)
          break
        case 'zhipu':
          result = await testZhipu(apiKey, model, baseURL)
          break
        case 'aliyun':
          result = await testAliyun(apiKey, model, baseURL)
          break
        default:
          result = await testOpenAI(apiKey, model, baseURL)
      }
      
      const responseTime = Date.now() - startTime
      
      return {
        success: result.success,
        message: result.message,
        model: result.model,
        responseTime
      }
    } catch (error) {
      console.error('API 连接测试失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '连接测试失败，请检查 API 密钥和网络连接'
      }
    }
  }
})

// OpenAI 连接测试
async function testOpenAI(apiKey: string, model: string = 'gpt-3.5-turbo', baseURL?: string) {
  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined
    })
    
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: '请回复"连接成功"' }
      ],
      max_tokens: 10
    })
    
    return {
      success: true,
      message: '连接成功！OpenAI API 工作正常。',
      model: response.model
    }
  } catch (error: any) {
    if (error.status === 401) {
      return {
        success: false,
        message: 'API 密钥无效或已过期'
      }
    } else if (error.status === 404) {
      return {
        success: false,
        message: `模型 "${model}" 不存在或您没有访问权限`
      }
    } else {
      return {
        success: false,
        message: `连接失败: ${error.message}`
      }
    }
  }
}

// Anthropic 连接测试
async function testAnthropic(apiKey: string, model: string = 'claude-3-sonnet-20240229', baseURL?: string) {
  try {
    // 使用 fetch 直接调用 Anthropic API
    const url = baseURL || 'https://api.anthropic.com/v1/messages'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-sonnet-20240229',
        max_tokens: 10,
        messages: [
          { role: 'user', content: '请回复"连接成功"' }
        ]
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `HTTP 错误 ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      message: '连接成功！Anthropic API 工作正常。',
      model: data.model
    }
  } catch (error: any) {
    return {
      success: false,
      message: `连接失败: ${error.message}`
    }
  }
}

// Moonshot 连接测试
async function testMoonshot(apiKey: string, model: string = 'moonshot-v1-8k', baseURL?: string) {
  try {
    const url = baseURL || 'https://api.moonshot.cn/v1/chat/completions'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'moonshot-v1-8k',
        messages: [
          { role: 'user', content: '请回复"连接成功"' }
        ],
        max_tokens: 10
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `HTTP 错误 ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      message: '连接成功！Moonshot API 工作正常。',
      model: data.model
    }
  } catch (error: any) {
    return {
      success: false,
      message: `连接失败: ${error.message}`
    }
  }
}

// 智谱 AI 连接测试
async function testZhipu(apiKey: string, model: string = 'glm-4', baseURL?: string) {
  try {
    const url = baseURL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'glm-4',
        messages: [
          { role: 'user', content: '请回复"连接成功"' }
        ],
        max_tokens: 10
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `HTTP 错误 ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      message: '连接成功！智谱 AI API 工作正常。',
      model: data.model
    }
  } catch (error: any) {
    return {
      success: false,
      message: `连接失败: ${error.message}`
    }
  }
}

// 阿里云 API 连接测试
async function testAliyun(apiKey: string, model: string = 'qwen-max', baseURL?: string) {
  try {
    if (!baseURL) {
      return {
        success: false,
        message: '请提供阿里云 API 的 Base URL'
      }
    }
    
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'qwen-max',
        input: {
          messages: [
            { role: 'user', content: '请回复"连接成功"' }
          ]
        },
        parameters: {
          max_tokens: 10
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `HTTP 错误 ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      message: '连接成功！阿里云 API 工作正常。',
      model: model
    }
  } catch (error: any) {
    return {
      success: false,
      message: `连接失败: ${error.message}`
    }
  }
}
