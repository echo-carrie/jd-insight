export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { requestId, rating } = body

    if (!requestId || !rating) {
      throw new Error('缺少必要参数：requestId 或 rating')
    }

    if (!['like', 'dislike'].includes(rating)) {
      throw new Error('无效的评分值')
    }

    // 这里可以将反馈数据存储到数据库
    // 目前只是简单记录日志
    console.log(`用户反馈 - 请求ID: ${requestId}, 评分: ${rating}, 时间: ${new Date().toISOString()}`)

    // 可以扩展为存储到数据库的逻辑
    // await saveToDatabase({ requestId, rating, timestamp: new Date() })

    return {
      success: true,
      message: '反馈提交成功'
    }

  } catch (error) {
    console.error('反馈提交错误:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '反馈提交失败，请稍后重试'
    }
  }
})