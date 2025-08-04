/// <reference types="@nuxt/types" />
/// <reference types="@nuxtjs/i18n" />

declare module '#app' {
  interface NuxtApp {
    $route: {
      path: string
    }
  }
}

declare module '@heroicons/vue/24/outline' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  
  export const SunIcon: FunctionalComponent<SVGAttributes>
  export const MoonIcon: FunctionalComponent<SVGAttributes>
  export const ChevronRightIcon: FunctionalComponent<SVGAttributes>
  export const ChevronDownIcon: FunctionalComponent<SVGAttributes>
  export const DocumentTextIcon: FunctionalComponent<SVGAttributes>
  export const CloudArrowUpIcon: FunctionalComponent<SVGAttributes>
  export const CheckCircleIcon: FunctionalComponent<SVGAttributes>
  export const XCircleIcon: FunctionalComponent<SVGAttributes>
}

declare module '#i18n' {
  interface I18nConfig {
    defaultLocale: string
    locales: {
      code: string
      name: string
      iso: string
    }[]
  }
}

export {} 