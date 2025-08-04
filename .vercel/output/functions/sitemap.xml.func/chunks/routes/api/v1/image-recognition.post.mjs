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

const imageRecognition_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const body = await readBody(event);
    const { request, apiKey, baseURL } = body;
    if (!request || !apiKey) {
      throw new Error("\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570\uFF1Arequest \u6216 apiKey");
    }
    const { model, messages } = request;
    let apiUrl = "";
    let headers = {
      "Content-Type": "application/json"
    };
    if (model.includes("moonshot")) {
      apiUrl = `${baseURL || "https://api.moonshot.cn/v1"}/chat/completions`;
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (model.includes("glm")) {
      apiUrl = `${baseURL || "https://open.bigmodel.cn/api/paas/v4"}/chat/completions`;
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (model.includes("qwen")) {
      apiUrl = `${baseURL}/chat/completions`;
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else {
      apiUrl = `${baseURL || "https://api.openai.com/v1"}/chat/completions`;
      headers["Authorization"] = `Bearer ${apiKey}`;
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2e3,
        temperature: 0.1
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error("API \u5BC6\u94A5\u65E0\u6548\u6216\u5DF2\u8FC7\u671F");
      } else if (response.status === 429) {
        throw new Error("API \u8BF7\u6C42\u9891\u7387\u9650\u5236\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
      } else if (response.status >= 500) {
        throw new Error("AI \u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
      }
      throw new Error(((_a = errorData.error) == null ? void 0 : _a.message) || `\u8BF7\u6C42\u5931\u8D25 (${response.status})`);
    }
    const result = await response.json();
    const extractedText = ((_d = (_c = (_b = result.choices) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) == null ? void 0 : _d.content) || "";
    if (!extractedText) {
      throw new Error("\u672A\u80FD\u4ECE\u56FE\u7247\u4E2D\u63D0\u53D6\u5230\u6587\u672C\u5185\u5BB9");
    }
    return {
      success: true,
      text: extractedText.trim(),
      model: result.model || model
    };
  } catch (error) {
    console.error("\u56FE\u7247\u8BC6\u522B\u9519\u8BEF:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "\u56FE\u7247\u8BC6\u522B\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    };
  }
});

export { imageRecognition_post as default };
//# sourceMappingURL=image-recognition.post.mjs.map
