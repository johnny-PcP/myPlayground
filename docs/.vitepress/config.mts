import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Playground",
  description: "自我練習與想法實踐的空間",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "關於本站", link: "/about" },
      { text: "元件列表", link: "/components/" },
    ],

    sidebar: [
      {
        text: "導覽",
        items: [{ text: "關於本站", link: "/about" }],
      },

      {
        text: "學習之道",
        items: [{ text: "調皮的按鈕", link: "/learning/btn-naughty/" }],
      },
      {
        text: "靈感實踐",
        items: [
          {
            text: "非精準搜尋Input",
            link: "/inspiration/nested-fuzzy-search/",
          },
        ],
      },
      {
        text: "元件列表",
        link: "/components/",
        items: [
          {
            text: "按鈕",
            items: [{ text: "調皮的按鈕", link: "/learning/btn-naughty/" }],
          },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/johnny-PcP/myPlayground" },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/in/johnny-chen-51b61427a",
      },
    ],
    footer: {
      copyright: "Copyright © 2025-present Johnny Chen",
    },
    lightModeSwitchTitle: "Light Mode",
    darkModeSwitchTitle: "Dark Mode",
    darkModeSwitchLabel: "深/淺色模式切換",
  },
});
