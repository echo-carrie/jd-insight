import { defineEventHandler, getQuery, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  // 获取KV存储实例
  const storage = useStorage('kv')
  
  // 根据请求方法执行不同操作
  if (event.method === 'GET') {
    // 获取查询参数
    const query = getQuery(event)
    const key = query.key as string
    
    if (!key) {
      return {
        error: '缺少key参数'
      }
    }
    
    try {
      // 从KV存储中获取数据
      const value = await storage.getItem(key)
      return {
        success: true,
        key,
        value,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: `获取数据失败: ${error.message}`
      }
    }
  } 
  
  else if (event.method === 'POST') {
    try {
      // 获取请求体
      const body = await readBody(event)
      const { key, value } = body
      
      if (!key || value === undefined) {
        return {
          success: false,
          error: '缺少key或value参数'
        }
      }
      
      // 存储数据到KV
      await storage.setItem(key, value)
      
      return {
        success: true,
        message: '数据已成功存储',
        key,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: `存储数据失败: ${error.message}`
      }
    }
  }
  
  else if (event.method === 'DELETE') {
    // 获取查询参数
    const query = getQuery(event)
    const key = query.key as string
    
    if (!key) {
      return {
        success: false,
        error: '缺少key参数'
      }
    }
    
    try {
      // 从KV存储中删除数据
      await storage.removeItem(key)
      
      return {
        success: true,
        message: '数据已成功删除',
        key,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: `删除数据失败: ${error.message}`
      }
    }
  }
  
  return {
    success: false,
    error: '不支持的请求方法'
  }
})