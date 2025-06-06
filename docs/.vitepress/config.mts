import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'My Playground',
    description: '自我練習與想法實踐的空間',
    // 如果部署到 https://username.github.io/myPlayground，需要設置 base
    base: '/myPlayground/',
    head: [
      [
        'link',
        {
          rel: 'preconnect', // 提前與目標伺服器建立連接，減少 DNS 查詢、TLS 握手等延遲，提升字體加載速度
          href: 'https://fonts.googleapis.com', // 提供字體的 CSS 樣式表
        },
      ],
      [
        'link',
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com', // 加載字體的 CSS 樣式表
          crossorigin: 'true', // 啟用 CORS，確保字體正確加載並啟用快取
        },
      ],

      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap', // 載入 Google 字體樣式表
        },
      ],
      [
        'meta',
        {
          property: 'og:image',
          content: '/cat.png',
        },
      ],
      ['link', { rel: 'icon', href: '/favicon.webp' }],
    ],
    themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: '首頁', link: '/' },
        { text: '關於本站', link: '/about' },
        { text: '元件列表', link: '/components/' },
      ],
      sidebar: [
        {
          text: '導覽',
          items: [{ text: '關於本站', link: '/about' }],
        },
        {
          text: '元件列表',
          link: '/components/',
          items: [
            { text: '巢狀模糊搜尋器', link: '/inspiration/nested-fuzzy-search/' },
            { text: '即時渲染通知', link: '/inspiration/render-dialog/' },
          ],
        },
        // {
        //   text: '學習之道',
        //   items: [
        //     { text: '調皮的按鈕', link: '/learning/btn-naughty/' },
        //     {
        //       text: '逐字轉場',
        //       link: '/learning/text-characters-transition/',
        //     },
        //   ],
        // },
        {
          text: '其他',
          items: [{ text: '安裝', link: '/install' }],
        },
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/johnny-PcP/myPlayground' },
        {
          icon: 'linkedin',
          link: 'https://www.linkedin.com/in/johnny-chen-51b61427a',
        },
      ],
      search: {
        provider: 'local',
      },
      footer: {
        copyright: 'Copyright © 2025-present Johnny Chen',
      },
      lightModeSwitchTitle: 'Light Mode',
      darkModeSwitchTitle: 'Dark Mode',
      darkModeSwitchLabel: '深/淺色模式切換',
    },
    // mermaid
    mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: 'mermaid my-class', // set additional css classes for parent container
    },
    // system settings
    markdown: {
      lineNumbers: true,
    },
    appearance: {
      initialValue: undefined,
    },

    transformPageData(pageData) {
    // 為每個頁面動態添加 Open Graph 描述
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push([
        'meta',
        {
          property: 'og:description',
          content: pageData?.frontmatter?.description ?? '',
        },
      ])
    },

    lastUpdated: true,
    vite: {
      worker: {
        format: 'es',
      },
    },
  }),
)
