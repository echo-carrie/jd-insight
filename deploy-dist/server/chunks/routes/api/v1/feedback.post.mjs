import { c as defineEventHandler, e as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue';
import 'node:fs';
import 'node:url';
import 'ipx';
import 'node:path';
import 'node:crypto';

const feedback_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.requestId || !body.rating) {
      throw new Error("\u65E0\u6548\u7684\u53CD\u9988\u6570\u636E");
    }
    console.log("\u6536\u5230\u53CD\u9988:", body);
    return {
      success: true
    };
  } catch (error) {
    console.error("\u4FDD\u5B58\u53CD\u9988\u5931\u8D25:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "\u63D0\u4EA4\u53CD\u9988\u5931\u8D25"
    };
  }
});

export { feedback_post as default };
//# sourceMappingURL=feedback.post.mjs.map
