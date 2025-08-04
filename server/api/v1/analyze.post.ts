import { readMultipartFormData } from 'h3'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse/lib/pdf-parse.js')
import { OpenAI } from 'openai'

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
          // 解析PDF文件
          try {
            const options = {
              max: 0,
              pagerender: null
            }
            const pdfData = await pdfParse(part.data, options)
            jdText = pdfData.text
          } catch (error) {
            console.error('PDF解析错误:', error)
            throw new Error('PDF文件解析失败')
          }
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

    // 如果没有客户端配置，使用服务端默认配置
    if (!aiConfig) {
      const config = useRuntimeConfig()
      if (!config.openaiApiKey) {
        throw new Error('未配置API密钥，请前往设置页面配置')
      }
      
      // 构建默认提示词
      let prompt = ''
      
      if (imageBase64) {
        prompt = `请分析以下JD图片，提取三个关键维度的信息：

1. 核心能力要求（3-5条）：提取岗位所需的关键能力和技能
2. 岗位条件需求：总结学历、经验、必备技能等资格条件
3. 核心产出物：提取岗位需要完成的主要文档、报告或成果

${position ? `岗位类型：${position}\n` : ''}`
      } else {
        prompt = `
作为一个专业的产品经理JD分析专家，请分析以下产品经理岗位JD，提取三个关键维度的信息：

1. 核心能力要求（3-5条）：提取岗位所需的关键能力和技能
2. 岗位条件需求：总结学历、经验、必备技能等资格条件
3. 核心产出物：提取岗位需要完成的主要文档、报告或成果

${position ? `岗位类型：${position}\n` : ''}
JD内容：
${jdText}
`
      }
      
      prompt += '\n请以JSON格式返回分析结果，包含三个数组字段：coreAbilities、requirements、deliverables。每个数组包含对应维度的具体条目。'

      aiConfig = {
        apiKey: config.openaiApiKey,
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-4-vision-preview',  // 使用支持图像的模型
        temperature: 0.3,
        maxTokens: 2000,
        topP: 1.0,
        systemPrompt: '你是一个专业的产品经理JD分析专家，擅长提取JD中的关键信息并进行结构化输出。',
        userPrompt: prompt
      }
    }

    // 验证配置
    if (!aiConfig.apiKey) {
      throw new Error('API密钥不能为空')
    }

    // 调用AI API
    const openai = new OpenAI({
      apiKey: aiConfig.apiKey,
      baseURL: aiConfig.baseURL
    })

    let completion;
    
    if (imageBase64) {
      // 使用Vision API处理图片
      completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",  // 强制使用支持图像的模型
        messages: [
          {
            role: 'system',
            content: aiConfig.systemPrompt
          },
          {
            role: 'user',
            content: [
              { type: "text", text: aiConfig.userPrompt },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                  detail: "high"
                }
              }
            ]
          }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
        top_p: aiConfig.topP
      })
    } else {
      // 处理文本
      completion = await openai.chat.completions.create({
        model: aiConfig.model,
        messages: [
          {
            role: 'system',
            content: aiConfig.systemPrompt
          },
          {
            role: 'user',
            content: aiConfig.userPrompt
          }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
        top_p: aiConfig.topP,
        response_format: { type: 'json_object' }
      })
    }

    // 解析结果
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (error) {
      // 如果返回的不是JSON格式，尝试提取结构化信息
      const content = completion.choices[0].message.content || ''
      result = {
        coreAbilities: extractListItems(content, '核心能力'),
        requirements: extractListItems(content, '岗位条件'),
        deliverables: extractListItems(content, '核心产出')
      }
    }

    // 生成请求ID
    const requestId = Math.random().toString(36).substring(2, 15)

    const analysisResult: AnalysisResult = {
      coreAbilities: result.coreAbilities || [],
      requirements: result.requirements || [],
      deliverables: result.deliverables || [],
      requestId
    }

    return {
      success: true,
      data: analysisResult
    }
  } catch (error) {
    console.error('分析错误:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '分析失败，请稍后重试'
    }
  }
})

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