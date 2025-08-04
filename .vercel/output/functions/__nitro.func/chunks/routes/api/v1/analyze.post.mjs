import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { d as defineEventHandler, r as readMultipartFormData, a as useRuntimeConfig } from '../../../_/nitro.mjs';
import { createRequire } from 'module';
import { OpenAI } from 'openai';
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

const require = createRequire(globalThis._importMeta_.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const analyze_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const body = await readMultipartFormData(event);
    if (!body) {
      throw new Error("\u65E0\u6548\u7684\u8BF7\u6C42\u6570\u636E");
    }
    let jdText = "";
    let position = "";
    let aiConfig = null;
    let imageBase64 = "";
    for (const part of body) {
      if (part.name === "jdText" && part.data) {
        jdText = part.data.toString();
      } else if (part.name === "position" && part.data) {
        position = part.data.toString();
      } else if (part.name === "aiConfig" && part.data) {
        try {
          aiConfig = JSON.parse(part.data.toString());
        } catch (error) {
          console.error("AI\u914D\u7F6E\u89E3\u6790\u5931\u8D25:", error);
        }
      } else if (part.name === "file" && part.data) {
        if ((_a = part.filename) == null ? void 0 : _a.endsWith(".pdf")) {
          try {
            const options = {
              max: 0,
              pagerender: null
            };
            const pdfData = await pdfParse(part.data, options);
            jdText = pdfData.text;
          } catch (error) {
            console.error("PDF\u89E3\u6790\u9519\u8BEF:", error);
            throw new Error("PDF\u6587\u4EF6\u89E3\u6790\u5931\u8D25");
          }
        } else if ((_b = part.filename) == null ? void 0 : _b.match(/\.(jpe?g|png|gif|webp)$/i)) {
          try {
            imageBase64 = `data:${part.type};base64,${Buffer.from(part.data).toString("base64")}`;
          } catch (error) {
            console.error("\u56FE\u7247\u5904\u7406\u9519\u8BEF:", error);
            throw new Error("\u56FE\u7247\u5904\u7406\u5931\u8D25");
          }
        }
      }
    }
    if (!jdText && !imageBase64) {
      throw new Error("\u8BF7\u63D0\u4F9BJD\u6587\u672C\u3001PDF\u6587\u4EF6\u6216\u56FE\u7247");
    }
    if (!aiConfig) {
      const config = useRuntimeConfig();
      if (!config.openaiApiKey) {
        throw new Error("\u672A\u914D\u7F6EAPI\u5BC6\u94A5\uFF0C\u8BF7\u524D\u5F80\u8BBE\u7F6E\u9875\u9762\u914D\u7F6E");
      }
      let prompt = "";
      if (imageBase64) {
        prompt = `\u8BF7\u5206\u6790\u4EE5\u4E0BJD\u56FE\u7247\uFF0C\u63D0\u53D6\u4E09\u4E2A\u5173\u952E\u7EF4\u5EA6\u7684\u4FE1\u606F\uFF1A

1. \u6838\u5FC3\u80FD\u529B\u8981\u6C42\uFF083-5\u6761\uFF09\uFF1A\u63D0\u53D6\u5C97\u4F4D\u6240\u9700\u7684\u5173\u952E\u80FD\u529B\u548C\u6280\u80FD
2. \u5C97\u4F4D\u6761\u4EF6\u9700\u6C42\uFF1A\u603B\u7ED3\u5B66\u5386\u3001\u7ECF\u9A8C\u3001\u5FC5\u5907\u6280\u80FD\u7B49\u8D44\u683C\u6761\u4EF6
3. \u6838\u5FC3\u4EA7\u51FA\u7269\uFF1A\u63D0\u53D6\u5C97\u4F4D\u9700\u8981\u5B8C\u6210\u7684\u4E3B\u8981\u6587\u6863\u3001\u62A5\u544A\u6216\u6210\u679C

${position ? `\u5C97\u4F4D\u7C7B\u578B\uFF1A${position}
` : ""}`;
      } else {
        prompt = `
\u4F5C\u4E3A\u4E00\u4E2A\u4E13\u4E1A\u7684\u4EA7\u54C1\u7ECF\u7406JD\u5206\u6790\u4E13\u5BB6\uFF0C\u8BF7\u5206\u6790\u4EE5\u4E0B\u4EA7\u54C1\u7ECF\u7406\u5C97\u4F4DJD\uFF0C\u63D0\u53D6\u4E09\u4E2A\u5173\u952E\u7EF4\u5EA6\u7684\u4FE1\u606F\uFF1A

1. \u6838\u5FC3\u80FD\u529B\u8981\u6C42\uFF083-5\u6761\uFF09\uFF1A\u63D0\u53D6\u5C97\u4F4D\u6240\u9700\u7684\u5173\u952E\u80FD\u529B\u548C\u6280\u80FD
2. \u5C97\u4F4D\u6761\u4EF6\u9700\u6C42\uFF1A\u603B\u7ED3\u5B66\u5386\u3001\u7ECF\u9A8C\u3001\u5FC5\u5907\u6280\u80FD\u7B49\u8D44\u683C\u6761\u4EF6
3. \u6838\u5FC3\u4EA7\u51FA\u7269\uFF1A\u63D0\u53D6\u5C97\u4F4D\u9700\u8981\u5B8C\u6210\u7684\u4E3B\u8981\u6587\u6863\u3001\u62A5\u544A\u6216\u6210\u679C

${position ? `\u5C97\u4F4D\u7C7B\u578B\uFF1A${position}
` : ""}
JD\u5185\u5BB9\uFF1A
${jdText}
`;
      }
      prompt += "\n\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\u5206\u6790\u7ED3\u679C\uFF0C\u5305\u542B\u4E09\u4E2A\u6570\u7EC4\u5B57\u6BB5\uFF1AcoreAbilities\u3001requirements\u3001deliverables\u3002\u6BCF\u4E2A\u6570\u7EC4\u5305\u542B\u5BF9\u5E94\u7EF4\u5EA6\u7684\u5177\u4F53\u6761\u76EE\u3002";
      aiConfig = {
        apiKey: config.openaiApiKey,
        baseURL: "https://api.openai.com/v1",
        model: "gpt-4-vision-preview",
        // 使用支持图像的模型
        temperature: 0.3,
        maxTokens: 2e3,
        topP: 1,
        systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u4EA7\u54C1\u7ECF\u7406JD\u5206\u6790\u4E13\u5BB6\uFF0C\u64C5\u957F\u63D0\u53D6JD\u4E2D\u7684\u5173\u952E\u4FE1\u606F\u5E76\u8FDB\u884C\u7ED3\u6784\u5316\u8F93\u51FA\u3002",
        userPrompt: prompt
      };
    }
    if (!aiConfig.apiKey) {
      throw new Error("API\u5BC6\u94A5\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const openai = new OpenAI({
      apiKey: aiConfig.apiKey,
      baseURL: aiConfig.baseURL
    });
    let completion;
    if (imageBase64) {
      completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        // 强制使用支持图像的模型
        messages: [
          {
            role: "system",
            content: aiConfig.systemPrompt
          },
          {
            role: "user",
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
      });
    } else {
      completion = await openai.chat.completions.create({
        model: aiConfig.model,
        messages: [
          {
            role: "system",
            content: aiConfig.systemPrompt
          },
          {
            role: "user",
            content: aiConfig.userPrompt
          }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
        top_p: aiConfig.topP,
        response_format: { type: "json_object" }
      });
    }
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content || "{}");
    } catch (error) {
      const content = completion.choices[0].message.content || "";
      result = {
        coreAbilities: extractListItems(content, "\u6838\u5FC3\u80FD\u529B"),
        requirements: extractListItems(content, "\u5C97\u4F4D\u6761\u4EF6"),
        deliverables: extractListItems(content, "\u6838\u5FC3\u4EA7\u51FA")
      };
    }
    const requestId = Math.random().toString(36).substring(2, 15);
    const analysisResult = {
      coreAbilities: result.coreAbilities || [],
      requirements: result.requirements || [],
      deliverables: result.deliverables || [],
      requestId
    };
    return {
      success: true,
      data: analysisResult
    };
  } catch (error) {
    console.error("\u5206\u6790\u9519\u8BEF:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "\u5206\u6790\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    };
  }
});
function extractListItems(text, sectionName) {
  const regex = new RegExp(`${sectionName}[^:]*:([sS]*?)(?=

|$)`, "i");
  const match = text.match(regex);
  if (!match || !match[1]) return [];
  return match[1].split("\n").map((line) => line.trim()).filter((line) => line.startsWith("-") || line.startsWith("\u2022") || /^\d+\./.test(line)).map((line) => line.replace(/^[-•\d\.\s]+/, "").trim()).filter(Boolean);
}

export { analyze_post as default };
//# sourceMappingURL=analyze.post.mjs.map
