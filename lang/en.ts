export default {
  app: {
    name: 'JD Insight',
    description: 'Product Manager Job Description Analysis Tool'
  },
  nav: {
    home: 'Home',
    about: 'About'
  },
  home: {
    title: 'Product Manager Job Description Analysis Tool',
    jd: {
      label: 'Enter Job Description',
      placeholder: 'Paste the product manager job description here...'
    },
    file: {
      label: 'Or Upload PDF File',
      upload: 'Upload File',
      drop: 'or drag and drop',
      hint: 'PDF files up to 5MB supported'
    },
    position: {
      label: 'Position Type',
      any: 'Any',
      junior: 'Junior Product Manager',
      senior: 'Senior Product Manager',
      operation: 'Operations Product Manager',
      strategy: 'Strategy Product Manager'
    },
    analyze: {
      button: 'Analyze',
      loading: 'Analyzing...'
    },
    result: {
      title: 'Analysis Result',
      abilities: 'Core Abilities',
      requirements: 'Job Requirements',
      deliverables: 'Key Deliverables',
      feedback: {
        dislike: 'Inaccurate',
        like: 'Accurate'
      }
    }
  },
  about: {
    title: 'About JD Insight',
    intro: {
      title: 'Project Introduction',
      content: 'JD Insight is an AI-powered tool that helps product managers understand job descriptions by analyzing core abilities, requirements, and key deliverables.'
    },
    features: {
      title: 'Features',
      analysis: 'Smart Analysis: AI-powered JD text analysis',
      dimensions: '3D Analysis: Core abilities, requirements, and deliverables',
      files: 'File Support: Text input and PDF upload',
      feedback: 'User Feedback: Like/dislike and text feedback',
      models: 'Multiple Models: Support for OpenAI, Kimi, GLM, and more'
    }
  },
  error: {
    404: 'Page Not Found',
    generic: 'Error',
    default: 'Please check the URL or return to home.',
    home: 'Go Home',
    retry: 'Retry'
  }
} 