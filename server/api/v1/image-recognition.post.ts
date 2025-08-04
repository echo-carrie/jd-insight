export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { request, apiKey, baseURL } = body

    if (!request || !apiKey) {
      throw new Error('缺少必要参数：request 或 apiKey')
    }

    const { model, messages } = request

    // 根据模型判断使用哪个 API
    let apiUrl = ''
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (model.includes('moonshot')) {
      // Moonshot API
      apiUrl = `${baseURL || 'https://api.moonshot.cn/v1'}/chat/completions`
      headers['Authorization'] = `Bearer ${apiKey}`
    } else if (model.includes('glm')) {
      // 智谱 API
      apiUrl = `${baseURL || 'https://open.bigmodel.cn/api/paas/v4'}/chat/completions`
      headers['Authorization'] = `Bearer ${apiKey}`
    } else if (model.includes('qwen')) {
      // 阿里云 API
      apiUrl = `${baseURL}/chat/completions`
      headers['Authorization'] = `Bearer ${apiKey}`
    } else {
      // 默认使用 OpenAI 兼容格式
      apiUrl = `${baseURL || 'https://api.openai.com/v1'}/chat/completions`
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    // 发送请求到对应的 AI 服务
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 401) {
        throw new Error('API 密钥无效或已过期')
      } else if (response.status === 429) {
        throw new Error('API 请求频率限制，请稍后重试')
      } else if (response.status >= 500) {
        throw new Error('AI 服务暂时不可用，请稍后重试')
      }
      
      throw new Error(errorData.error?.message || `请求失败 (${response.status})`)
    }

    const result = await response.json()
    const extractedText = result.choices?.[0]?.message?.content || ''

    if (!extractedText) {
      throw new Error('未能从图片中提取到文本内容')
    }

    return {
      success: true,
      text: extractedText.trim(),
      model: result.model || model
    }

  } catch (error) {
    console.error('图片识别错误:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '图片识别失败，请稍后重试'
    }
  }
})