import { readMultipartFormData } from 'h3'
// 完全移除pdf-parse相关代码

interface AnalysisResult {
  coreAbilities: string[]
  requirements: string[]
  deliverables: string[]
  requestId: string
}

interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt: string
  userPrompt: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event)
    if (!body) {
      throw new Error('无效的请求数据')
    }

    let jdText = ''
    let position = ''
    let aiConfig: AIConfig | null = null
    let imageBase64 = ''

    // 处理文本和岗位类型
    for (const part of body) {
      if (part.name === 'jdText' && part.data) {
        jdText = part.data.toString()
      } else if (part.name === 'position' && part.data) {
        position = part.data.toString()
      } else if (part.name === 'aiConfig' && part.data) {
        try {
          aiConfig = JSON.parse(part.data.toString())
        } catch (error) {
          console.error('AI配置解析失败:', error)
        }
      } else if (part.name === 'file' && part.data) {
        // 处理上传的文件
        if (part.filename?.endsWith('.pdf')) {
          // 在Edge环境中，我们不直接解析PDF，而是将其作为文本提示用户上传文本
          throw new Error('在当前环境中不支持PDF解析，请直接复制JD文本或上传图片')
        } else if (part.filename?.match(/\.(jpe?g|png|gif|webp)$/i)) {
          // 处理图片文件
          try {
            // 将图片转换为base64
            imageBase64 = `data:${part.type};base64,${Buffer.from(part.data).toString('base64')}`
          } catch (error) {
            console.error('图片处理错误:', error)
            throw new Error('图片处理失败')
          }
        }
      }
    }

    if (!jdText && !imageBase64) {
      throw new Error('请提供JD文本、PDF文件或图片')
    }

    // 如果没有客户端配置，提示用户配置API密钥
    if (!aiConfig || !aiConfig.apiKey) {
      throw new Error('请先配置AI模型API密钥，可以在设置页面进行配置')
    }
    
    // 注意：API密钥仅作为临时配置项使用，不在服务器端持久化存储
    
    // 模拟分析结果 - 在实际项目中，这里应该调用第三方API进行分析
    // 但我们不再直接依赖OpenAI，而是使用客户端提供的配置进行API调用
    
    // 生成请求ID
    const requestId = Math.random().toString(36).substring(2, 15)
    
    // 提取JD文本中的关键信息
    const analysisResult = await analyzeJDText(jdText || imageBase64, position, aiConfig)

    return {
      success: true,
      data: {
        ...analysisResult,
        requestId
      }
    }
  } catch (error) {
    console.error('分析错误:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '分析失败，请稍后重试'
    }
  }
})

// 分析JD文本的函数
async function analyzeJDText(text: string, position: string, config: AIConfig): Promise<Omit<AnalysisResult, 'requestId'>> {
  try {
    // 这里应该使用客户端提供的配置调用第三方API
    // 但我们不再直接依赖OpenAI，而是使用通用的fetch API
    
    // 根据配置的baseURL和model选择合适的API端点
    const apiEndpoint = `${config.baseURL}/chat/completions`
    
    // 构建请求体
    const requestBody = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: config.systemPrompt || '你是一个专业的产品经理JD分析专家，擅长提取JD中的关键信息并进行结构化输出。'
        },
        {
          role: 'user',
          content: config.userPrompt || `
作为一个专业的产品经理JD分析专家，请分析以下产品经理岗位JD，提取三个关键维度的信息：

1. 核心能力要求（3-5条）：提取岗位所需的关键能力和技能
2. 岗位条件需求：总结学历、经验、必备技能等资格条件
3. 核心产出物：提取岗位需要完成的主要文档、报告或成果

${position ? `岗位类型：${position}\n` : ''}
JD内容：
${text}

请以JSON格式返回分析结果，包含三个数组字段：coreAbilities、requirements、deliverables。每个数组包含对应维度的具体条目。
`
        }
      ],
      temperature: config.temperature || 0.3,
      max_tokens: config.maxTokens || 2000,
      top_p: config.topP || 1.0,
      response_format: { type: 'json_object' }
    }
    
    // 发送请求到API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API请求失败: ${errorData.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    // 解析结果
    let result
    try {
      const content = data.choices[0].message.content || '{}'
      result = JSON.parse(content)
    } catch (error) {
      // 如果返回的不是JSON格式，尝试提取结构化信息
      const content = data.choices[0].message.content || ''
      result = {
        coreAbilities: extractListItems(content, '核心能力'),
        requirements: extractListItems(content, '岗位条件'),
        deliverables: extractListItems(content, '核心产出')
      }
    }
    
    return {
      coreAbilities: result.coreAbilities || [],
      requirements: result.requirements || [],
      deliverables: result.deliverables || []
    }
  } catch (error) {
    console.error('API调用错误:', error)
    
    // 如果API调用失败，返回默认分析结果
    return {
      coreAbilities: ['需要配置有效的API密钥才能进行分析'],
      requirements: ['请在设置中配置有效的API密钥'],
      deliverables: ['API调用失败，无法提供分析结果']
    }
  }
}

// 辅助函数：从非JSON格式的文本中提取列表项
function extractListItems(text: string, sectionName: string): string[] {
  const regex = new RegExp(`${sectionName}[^:]*:([\s\S]*?)(?=\n\n|$)`, 'i')
  const match = text.match(regex)
  if (!match || !match[1]) return []
  
  return match[1].split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line))
    .map(line => line.replace(/^[-•\d\.\s]+/, '').trim())
    .filter(Boolean)
}
