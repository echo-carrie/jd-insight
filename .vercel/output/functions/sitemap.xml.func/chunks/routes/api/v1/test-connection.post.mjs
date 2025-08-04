import { d as defineEventHandler, b as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const testConnection_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { apiProvider, apiKey, model } = body;
    if (!apiProvider || !apiKey) {
      return {
        success: false,
        message: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570\uFF1AAPI\u63D0\u4F9B\u5546\u548C\u5BC6\u94A5"
      };
    }
    const startTime = Date.now();
    let response;
    let testModel = model || "gpt-3.5-turbo";
    switch (apiProvider) {
      case "openai":
        response = await testOpenAI(apiKey, testModel);
        break;
      case "anthropic":
        response = await testAnthropic(apiKey, testModel);
        break;
      case "moonshot":
        response = await testMoonshot(apiKey, testModel);
        break;
      case "zhipu":
        response = await testZhipu(apiKey, testModel);
        break;
      default:
        return {
          success: false,
          message: "\u4E0D\u652F\u6301\u7684API\u63D0\u4F9B\u5546"
        };
    }
    const responseTime = Date.now() - startTime;
    if (response.success) {
      return {
        success: true,
        message: "\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F",
        model: response.model || testModel,
        responseTime,
        provider: apiProvider
      };
    } else {
      return {
        success: false,
        message: response.error || "\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25"
      };
    }
  } catch (error) {
    console.error("\u8FDE\u901A\u6027\u6D4B\u8BD5\u9519\u8BEF:", error);
    return {
      success: false,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    };
  }
});
async function testOpenAI(apiKey, model) {
  var _a;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "user", content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        model: data.model || model
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: ((_a = errorData.error) == null ? void 0 : _a.message) || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `\u7F51\u7EDC\u9519\u8BEF: ${error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"}`
    };
  }
}
async function testAnthropic(apiKey, model) {
  var _a;
  try {
    const testModel = model.includes("claude") ? model : "claude-3-haiku-20240307";
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: testModel,
        max_tokens: 5,
        messages: [
          { role: "user", content: 'Test connection. Please respond with "OK".' }
        ]
      })
    });
    if (response.ok) {
      return {
        success: true,
        model: testModel
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: ((_a = errorData.error) == null ? void 0 : _a.message) || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `\u7F51\u7EDC\u9519\u8BEF: ${error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"}`
    };
  }
}
async function testMoonshot(apiKey, model) {
  var _a;
  try {
    const testModel = model.includes("moonshot") ? model : "moonshot-v1-8k";
    const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: "user", content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    });
    if (response.ok) {
      return {
        success: true,
        model: testModel
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: ((_a = errorData.error) == null ? void 0 : _a.message) || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `\u7F51\u7EDC\u9519\u8BEF: ${error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"}`
    };
  }
}
async function testZhipu(apiKey, model) {
  var _a;
  try {
    const testModel = model.includes("glm") ? model : "glm-4";
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: "user", content: 'Test connection. Please respond with "OK".' }
        ],
        max_tokens: 5,
        temperature: 0
      })
    });
    if (response.ok) {
      return {
        success: true,
        model: testModel
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: ((_a = errorData.error) == null ? void 0 : _a.message) || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `\u7F51\u7EDC\u9519\u8BEF: ${error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"}`
    };
  }
}

export { testConnection_post as default };
//# sourceMappingURL=test-connection.post.mjs.map
