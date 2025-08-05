import { readBody } from 'h3'
import { OpenAI } from 'openai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { apiKey, baseURL, model, type, provider } = body

    if (!apiKey) {
      throw new Error('缺少API密钥')
    }

    // 根据类型和提供商选择测试方法
    if (type === 'base') {
      // 测试基础语言模型
      const openai = new OpenAI({
        apiKey,
        baseURL: baseURL || undefined
      })

      const completion = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个有用的助手。' },
          { role: 'user', content: '请回复"连接测试成功"' }
        ],
        max_tokens: 20
      })

      return {
        success: true,
        message: '基础模型连接测试成功',
        model: completion.model
      }
    } else if (type === 'image') {
      // 测试图像识别模型
      let apiUrl = ''
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      let requestBody: any = {}

      // 根据提供商配置请求
      if (provider === 'moonshot') {
        apiUrl = `${baseURL || 'https://api.moonshot.cn/v1'}/chat/completions`
        headers['Authorization'] = `Bearer ${apiKey}`
        requestBody = {
          model: model || 'moonshot-v1-8k',
          messages: [
            { role: 'user', content: '请回复"图像识别模型连接测试成功"' }
          ],
          max_tokens: 20
        }
      } else if (provider === 'zhipu') {
        apiUrl = `${baseURL || 'https://open.bigmodel.cn/api/paas/v4'}/chat/completions`
        headers['Authorization'] = `Bearer ${apiKey}`
        requestBody = {
          model: model || 'glm-4v',
          messages: [
            { role: 'user', content: '请回复"图像识别模型连接测试成功"' }
          ],
          max_tokens: 20
        }
      } else if (provider === 'aliyun') {
        apiUrl = `${baseURL || 'https://dashscope.aliyuncs.com/api/v1'}/chat/completions`
        headers['Authorization'] = `Bearer ${apiKey}`
        requestBody = {
          model: model || 'qwen-vl-plus',
          messages: [
            { role: 'user', content: '请回复"图像识别模型连接测试成功"' }
          ],
          max_tokens: 20
        }
      } else {
        // 默认使用OpenAI兼容格式
        apiUrl = `${baseURL || 'https://api.openai.com/v1'}/chat/completions`
        headers['Authorization'] = `Bearer ${apiKey}`
        requestBody = {
          model: model || 'gpt-4-vision-preview',
          messages: [
            { role: 'user', content: '请回复"图像识别模型连接测试成功"' }
          ],
          max_tokens: 20
        }
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `请求失败 (${response.status})`)
      }

      const result = await response.json()

      return {
        success: true,
        message: '图像识别模型连接测试成功',
        model: result.model || model
      }
    } else {
      throw new Error('未知的测试类型')
    }
  } catch (error) {
    console.error('连接测试错误:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '连接测试失败，请检查API密钥和网络连接'
    }
  }
})
