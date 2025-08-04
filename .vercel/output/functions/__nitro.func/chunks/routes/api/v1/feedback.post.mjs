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

const feedback_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { requestId, rating } = body;
    if (!requestId || !rating) {
      throw new Error("\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570\uFF1ArequestId \u6216 rating");
    }
    if (!["like", "dislike"].includes(rating)) {
      throw new Error("\u65E0\u6548\u7684\u8BC4\u5206\u503C");
    }
    console.log(`\u7528\u6237\u53CD\u9988 - \u8BF7\u6C42ID: ${requestId}, \u8BC4\u5206: ${rating}, \u65F6\u95F4: ${(/* @__PURE__ */ new Date()).toISOString()}`);
    return {
      success: true,
      message: "\u53CD\u9988\u63D0\u4EA4\u6210\u529F"
    };
  } catch (error) {
    console.error("\u53CD\u9988\u63D0\u4EA4\u9519\u8BEF:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "\u53CD\u9988\u63D0\u4EA4\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    };
  }
});

export { feedback_post as default };
//# sourceMappingURL=feedback.post.mjs.map
