/// <reference types="@nuxt/types" />
/// <reference types="@nuxtjs/i18n" />

declare module '#app' {
  interface PageMeta {
    title?: string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string) => string
    $route: {
      path: string
    }
  }
}

export {} 