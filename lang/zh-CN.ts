export default {
  app: {
    name: 'JD Insight',
    description: '产品经理岗位智能解析工具'
  },
  nav: {
    home: '首页',
    about: '关于'
  },
  home: {
    title: '产品经理岗位智能解析工具',
    jd: {
      label: '请输入职位描述 (JD)',
      placeholder: '请粘贴产品经理岗位的职位描述...'
    },
    file: {
      label: '或上传 PDF 文件',
      upload: '上传文件',
      drop: '或拖拽文件到此处',
      hint: '支持 PDF 文件，最大 5MB'
    },
    position: {
      label: '岗位类型',
      any: '不指定',
      junior: '初级产品经理',
      senior: '高级产品经理',
      operation: '运营产品经理',
      strategy: '策略产品经理'
    },
    analyze: {
      button: '开始分析',
      loading: '分析中...'
    },
    result: {
      title: '分析结果',
      abilities: '核心能力要求',
      requirements: '岗位条件要求',
      deliverables: '核心产出物',
      feedback: {
        dislike: '不准确',
        like: '准确'
      }
    }
  },
  about: {
    title: '关于 JD Insight',
    intro: {
      title: '项目简介',
      content: 'JD Insight (读懂JD) 是一款基于大语言模型的产品经理岗位JD智能解析工具，帮助产品经理小白快速理解岗位核心能力要求、岗位条件需求和核心产出物。'
    },
    features: {
      title: '功能特性',
      analysis: '智能分析：基于AI模型智能解析JD文本',
      dimensions: '三维分析：核心能力、岗位条件、核心产出物',
      files: '文件支持：支持文本输入和PDF文件上传',
      feedback: '用户反馈：支持点赞/点踩和文字反馈',
      models: '多模型支持：支持OpenAI、Kimi、GLM等多种AI模型'
    }
  },
  error: {
    404: '页面未找到',
    generic: '出错了',
    default: '请检查URL是否正确，或返回首页。',
    home: '返回首页',
    retry: '重试'
  }
} 