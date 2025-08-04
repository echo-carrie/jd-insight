export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { apiProvider, apiKey, model } = body

    if (!apiProvider || !apiKey) {
      return {
        success: false,
        message: '缺少必要参数：API提供商和密钥'
      }
    }

    const startTime = Date.now()
    let response: any
    let testModel = model || 'gpt-3.5-turbo'

    // 根据不同的API提供商进行测试
    switch (apiProvider) {
      case 'openai':
        response = await testOpenAI(apiKey, testModel)
        break
      case 'anthropic':
        response = await testAnthropic(apiKey, testModel)
        break
      case 'moonshot':
        response = await testMoonshot(apiKey, testModel)
        break
      case 'zhipu':
        response = await testZhipu(apiKey, testModel)
        break
      default:
        return {
          success: false,
          message: '不支持的API提供商'
        }
    }

    const responseTime = Date.now() - startTime

    if (response.success) {
      return {
        success: true,
        message: '连接测试成功',
        model: response.model || testModel,
        responseTime,
        provider: apiProvider
      }
    } else {
      return {
        success: false,
        message: response.error || '连接测试失败'
      }
    }
  } catch (error) {
    console.error('连通性测试错误:', error)
    return {
      success: false,
      message: '服务器内部错误'
    }
  }
})

// OpenAI API 测试
async function testOpenAI(apiKey: string, model: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        model: data.model || model
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `网络错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

// Anthropic API 测试
async function testAnthropic(apiKey: string, model: string) {
  try {
    const testModel = model.includes('claude') ? model : 'claude-3-haiku-20240307'
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: testModel,
        max_tokens: 5,
        messages: [
          { role: 'user', content: 'Test connection. Please respond with "OK".' }
        ]
      })
    })

    if (response.ok) {
      return {
        success: true,
        model: testModel
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `网络错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

// Moonshot API 测试
async function testMoonshot(apiKey: string, model: string) {
  try {
    const testModel = model.includes('moonshot') ? model : 'moonshot-v1-8k'
    
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: 'user', content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    })

    if (response.ok) {
      return {
        success: true,
        model: testModel
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `网络错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

// 智谱AI API 测试
async function testZhipu(apiKey: string, model: string) {
  try {
    const testModel = model.includes('glm') ? model : 'glm-4'
    
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: 'user', content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    })

    if (response.ok) {
      return {
        success: true,
        model: testModel
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `网络错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
} 