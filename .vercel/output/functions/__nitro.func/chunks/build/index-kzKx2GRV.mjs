import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderDynamicModel } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const jdText = ref("");
    ref("");
    const selectedFile = ref(null);
    const isAnalyzing = ref(false);
    const analysisResult = ref(null);
    const feedback = ref(null);
    ref();
    ref();
    ref();
    ref();
    const previewUrl = ref("");
    const showSettings = ref(false);
    const showApiKey = ref(false);
    const isTesting = ref(false);
    const testResult = ref(null);
    const aiSettings = ref({
      apiProvider: "openai",
      apiKey: "",
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      enableImageRecognition: false,
      imageRecognitionModel: "moonshot-v1-8k",
      moonshotApiKey: "",
      moonshotBaseURL: "",
      zhipuApiKey: "",
      zhipuBaseURL: "",
      aliyunApiKey: "",
      aliyunBaseURL: ""
    });
    const providers = [
      { value: "openai", name: "OpenAI", icon: "\u{1F916}" },
      { value: "anthropic", name: "Anthropic", icon: "\u{1F3AD}" },
      { value: "moonshot", name: "Moonshot", icon: "\u{1F319}" },
      { value: "zhipu", name: "\u667A\u8C31AI", icon: "\u{1F9E0}" },
      { value: "custom", name: "\u81EA\u5B9A\u4E49", icon: "\u2699\uFE0F" }
    ];
    const commonModels = [
      { value: "gpt-4-turbo-preview", label: "GPT-4 Turbo" },
      { value: "gpt-4", label: "GPT-4" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
      { value: "moonshot-v1-8k", label: "Moonshot v1" },
      { value: "glm-4", label: "GLM-4" }
    ];
    const imageModels = [
      { value: "moonshot-v1-8k", label: "Moonshot V1", provider: "moonshot" },
      { value: "moonshot-v1-32k", label: "Moonshot V1-32K", provider: "moonshot" },
      { value: "glm-4v", label: "GLM-4V", provider: "zhipu" },
      { value: "qwen-vl-plus", label: "Qwen VL+", provider: "aliyun" }
    ];
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const resetTestResult = () => {
      testResult.value = null;
    };
    watch(aiSettings, () => {
      resetTestResult();
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F]" }, _attrs))}><div class="flex-1 flex flex-col overflow-hidden">`);
      if (!analysisResult.value) {
        _push(`<div class="flex-1 flex flex-col"><div class="flex-1 flex items-center justify-center p-8"><div class="max-w-2xl w-full mx-auto space-y-12"><div class="text-center space-y-4"><div class="w-14 h-14 rounded-full bg-[#FF6B6B] dark:bg-[#FF6B6B]/90 mx-auto flex items-center justify-center"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><div><h1 class="text-2xl font-medium text-gray-900 dark:text-white">\u6B22\u8FCE\u4F7F\u7528 JD Insight</h1><p class="text-gray-500 dark:text-gray-400 mt-2 text-base">\u57FA\u4E8E AI \u7684\u4EA7\u54C1\u7ECF\u7406\u5C97\u4F4D\u667A\u80FD\u89E3\u6790\u5DE5\u5177</p></div></div><div class="w-full space-y-6"><div class="relative"><textarea placeholder="\u5728\u8FD9\u91CC\u7C98\u8D34 JD \u6587\u672C..." class="w-full h-[200px] px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 transition-all"${ssrIncludeBooleanAttr(isAnalyzing.value) ? " disabled" : ""}>${ssrInterpolate(jdText.value)}</textarea><div class="absolute bottom-3 right-3 flex items-center space-x-2 text-sm text-gray-400">`);
        if (jdText.value) {
          _push(`<button class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><button class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg><span>\u4E0A\u4F20 PDF</span></button><button class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>\u4E0A\u4F20\u56FE\u7247</span></button><button class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>\u4F7F\u7528\u793A\u4F8B</span></button></div><button${ssrIncludeBooleanAttr(isAnalyzing.value || !jdText.value.trim() && !selectedFile.value) ? " disabled" : ""} class="${ssrRenderClass([
          "flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200",
          isAnalyzing.value || !jdText.value.trim() && !selectedFile.value ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed" : "bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white"
        ])}">`);
        if (isAnalyzing.value) {
          _push(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(isAnalyzing.value ? "\u5206\u6790\u4E2D..." : "\u5F00\u59CB\u5206\u6790")}</span></button></div>`);
        if (selectedFile.value) {
          _push(`<div class="mt-4 p-4 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">`);
          if (selectedFile.value.type === "application/pdf") {
            _push(`<svg class="w-6 h-6 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`);
          } else {
            _push(`<svg class="w-6 h-6 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`);
          }
          _push(`</div><div><div class="text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(selectedFile.value.name)}</div><div class="text-xs text-gray-500 dark:text-gray-400">${ssrInterpolate(formatFileSize(selectedFile.value.size))}</div></div></div><button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          if (selectedFile.value.type.startsWith("image/")) {
            _push(`<div class="mt-4"><img${ssrRenderAttr("src", previewUrl.value)} alt="\u9884\u89C8\u56FE\u7247" class="max-h-48 rounded-lg object-contain mx-auto"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<div class="flex-1 overflow-y-auto px-4 py-8 md:px-8"><div class="max-w-4xl mx-auto space-y-8"><div class="flex items-center justify-between"><h2 class="text-xl font-medium text-gray-900 dark:text-white">\u5206\u6790\u7ED3\u679C</h2><button class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg><span>\u91CD\u65B0\u5206\u6790</span></button></div><div class="space-y-4"><h3 class="text-base font-medium text-gray-700 dark:text-gray-300">\u6838\u5FC3\u80FD\u529B\u8981\u6C42</h3><div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2"><!--[-->`);
        ssrRenderList(analysisResult.value.coreAbilities, (ability, index) => {
          _push(`<div class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-sm">${ssrInterpolate(ability)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="space-y-4"><h3 class="text-base font-medium text-gray-700 dark:text-gray-300">\u5C97\u4F4D\u8981\u6C42</h3><div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2"><!--[-->`);
        ssrRenderList(analysisResult.value.requirements, (requirement, index) => {
          _push(`<div class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-sm">${ssrInterpolate(requirement)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="space-y-4"><h3 class="text-base font-medium text-gray-700 dark:text-gray-300">\u6838\u5FC3\u4EA7\u51FA\u7269</h3><div class="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2"><!--[-->`);
        ssrRenderList(analysisResult.value.deliverables, (deliverable, index) => {
          _push(`<div class="flex items-start space-x-3 text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 mt-1 text-[#FF6B6B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-sm">${ssrInterpolate(deliverable)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="flex items-center justify-center space-x-4 pt-4"><button${ssrIncludeBooleanAttr(feedback.value !== null) ? " disabled" : ""} class="${ssrRenderClass([
          "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors",
          feedback.value === "like" ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        ])}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg><span>\u6709\u5E2E\u52A9</span></button><button${ssrIncludeBooleanAttr(feedback.value !== null) ? " disabled" : ""} class="${ssrRenderClass([
          "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors",
          feedback.value === "dislike" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        ])}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"></path></svg><span>\u9700\u6539\u8FDB</span></button></div></div></div>`);
      }
      if (showSettings.value) {
        _push(`<div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"><div class="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"><div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800"><h3 class="text-lg font-medium text-gray-900 dark:text-white">AI \u6A21\u578B\u8BBE\u7F6E</h3></div><div class="px-6 py-4 space-y-4"><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API \u63D0\u4F9B\u5546</label><div class="grid grid-cols-2 gap-2"><!--[-->`);
        ssrRenderList(providers, (provider) => {
          _push(`<button class="${ssrRenderClass([
            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors",
            aiSettings.value.apiProvider === provider.value ? "bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 text-[#FF6B6B]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          ])}"><span>${ssrInterpolate(provider.icon)}</span><span>${ssrInterpolate(provider.name)}</span></button>`);
        });
        _push(`<!--]--></div></div><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API \u5BC6\u94A5</label><div class="relative"><input${ssrRenderAttr("type", showApiKey.value ? "text" : "password")}${ssrRenderDynamicModel(showApiKey.value ? "text" : "password", aiSettings.value.apiKey, null)} placeholder="\u8F93\u5165 API \u5BC6\u94A5" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"><button class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
        if (showApiKey.value) {
          _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>`);
        } else {
          _push(`<!---->`);
        }
        if (showApiKey.value) {
          _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`);
        } else {
          _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>`);
        }
        _push(`</svg></button></div></div><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">\u6A21\u578B\u9009\u62E9</label><div class="relative"><input${ssrRenderAttr("value", aiSettings.value.model)} type="text" placeholder="\u8F93\u5165\u6A21\u578B\u540D\u79F0\uFF0C\u5982\uFF1Agpt-4-turbo-preview" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:focus:ring-[#FF6B6B]/10 transition-all"><div class="mt-2 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(commonModels, (model) => {
          _push(`<button type="button" class="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">${ssrInterpolate(model.label)}</button>`);
        });
        _push(`<!--]--></div></div></div><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> \u6E29\u5EA6\uFF08\u521B\u9020\u6027\uFF09\uFF1A${ssrInterpolate(aiSettings.value.temperature.toFixed(1))}</label><input type="range"${ssrRenderAttr("value", aiSettings.value.temperature)} min="0" max="1" step="0.1" class="w-full"><div class="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>\u7CBE\u786E</span><span>\u521B\u9020</span></div></div><div class="space-y-2"><div class="flex items-center justify-between"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">\u56FE\u7247\u8BC6\u522B</label><button class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          aiSettings.value.enableImageRecognition ? "bg-[#FF6B6B]" : "bg-gray-200 dark:bg-gray-700"
        ])}"><span class="${ssrRenderClass([
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          aiSettings.value.enableImageRecognition ? "translate-x-5" : "translate-x-0"
        ])}"></span></button></div>`);
        if (aiSettings.value.enableImageRecognition) {
          _push(`<div class="mt-4 space-y-4"><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">\u8BC6\u522B\u6A21\u578B</label><div class="grid grid-cols-2 gap-2"><!--[-->`);
          ssrRenderList(imageModels, (model) => {
            _push(`<button class="${ssrRenderClass([
              "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors",
              aiSettings.value.imageRecognitionModel === model.value ? "bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 text-[#FF6B6B]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
            ])}"><span>${ssrInterpolate(model.label)}</span></button>`);
          });
          _push(`<!--]--></div><p class="mt-2 text-xs text-gray-500 dark:text-gray-400"> \u542F\u7528\u540E\u53EF\u4EE5\u76F4\u63A5\u4E0A\u4F20\u6216\u62D6\u653E\u56FE\u7247\u8FDB\u884CJD\u5206\u6790\u3002\u76EE\u524D\u652F\u6301Moonshot\u3001\u667A\u8C31AI\u7B49\u591A\u4E2A\u6A21\u578B\u3002 </p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (aiSettings.value.enableImageRecognition) {
          _push(`<div class="mt-4 space-y-4"><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moonshot API\u914D\u7F6E</label><div class="space-y-2"><input${ssrRenderAttr("value", aiSettings.value.moonshotApiKey)} type="password" placeholder="Moonshot API Key\uFF08\u53EF\u9009\uFF0C\u9ED8\u8BA4\u4F7F\u7528\u901A\u7528Key\uFF09" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"><input${ssrRenderAttr("value", aiSettings.value.moonshotBaseURL)} type="text" placeholder="API Base URL\uFF08\u53EF\u9009\uFF09" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"></div></div><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">\u667A\u8C31API\u914D\u7F6E</label><div class="space-y-2"><input${ssrRenderAttr("value", aiSettings.value.zhipuApiKey)} type="password" placeholder="\u667A\u8C31 API Key" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"><input${ssrRenderAttr("value", aiSettings.value.zhipuBaseURL)} type="text" placeholder="API Base URL\uFF08\u53EF\u9009\uFF09" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"></div></div><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">\u963F\u91CC\u4E91API\u914D\u7F6E</label><div class="space-y-2"><input${ssrRenderAttr("value", aiSettings.value.aliyunApiKey)} type="password" placeholder="\u963F\u91CC\u4E91 API Key" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"><input${ssrRenderAttr("value", aiSettings.value.aliyunBaseURL)} type="text" placeholder="API Base URL" class="w-full px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-2"><button${ssrIncludeBooleanAttr(isTesting.value) ? " disabled" : ""} class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF6B6B]/10 dark:bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/20 dark:hover:bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg text-sm font-medium transition-colors">`);
        if (isTesting.value) {
          _push(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(isTesting.value ? "\u6D4B\u8BD5\u4E2D..." : "\u6D4B\u8BD5\u8FDE\u63A5")}</span></button>`);
        if (testResult.value) {
          _push(`<div class="${ssrRenderClass([
            "mt-2 p-3 rounded-lg text-sm whitespace-pre-line",
            testResult.value.success ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          ])}">${ssrInterpolate(testResult.value.message)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-between"><button class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"> \u91CD\u7F6E\u9ED8\u8BA4 </button><div class="flex space-x-3"><button class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"> \u53D6\u6D88 </button><button class="px-4 py-2 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white rounded-lg text-sm font-medium transition-colors"> \u4FDD\u5B58\u8BBE\u7F6E </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input type="file" accept=".pdf" class="hidden"><input type="file" accept="image/*" class="hidden"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-kzKx2GRV.mjs.map
