<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://chillcomponent.codlin.me/logo.webp',
    name: 'Codfish',
    title: '@codfish2140',
    links: [
       { icon: 'gitlab', link: 'https://gitlab.com/side_project/chill-component' },
      { icon: 'threads', link: 'https://www.threads.com/@codfish2140' },
      { icon: 'youtube', link: 'https://www.youtube.com/@codfish2140' },
    ]
  }]
</script>

# 關於這個網站

每次看過的文章或做過的功能，往往只有在當下最熟悉，但是過了段時間後就很容易忘記一些語法細節，只記得大概的觀念，所以希望藉由這個網站幫助自己在需要時能快速回憶。

## 如何使用本站 ?

### <span style="color: #ff5722;">對你來說：拷貝即用</span>

本站會盡量將各式組件，設計成能夠拷貝即用，您可直接閱覽[元件列表](./components/)來尋找需要的元件。
::: tip

您也可以嘗試在上方搜尋框輸入關鍵字搜索。

:::

### <span style="color: #4caf50;">對我來說： 目的分類</span>

根據學習目的不同，本站的組件區分：

- **學習之道**: 重現他人元件，並分析可以學習的地方。
- **靈感實踐**: 重構並優化自己的做過的元件，或將一些想法予以實踐。

::: tip

每個組件詳細頁面的後半部將紀錄我對該組件的構建心得（類似筆記）。

:::

## 特別感謝

鱈魚大的[Chill Component](https://gitlab.com/side_project/chill-component)專案給予本站的設計非常多靈感，是一個本來想做的事竟然有人做出來，還遠超預期的存在。

<VPTeamMembers size="small" :members />

## About Me - [Linked-In](https://www.linkedin.com/in/johnny-chen-51b61427a)

INFJ-A, 貓, 吃貨

![img](cat-icon.png)

::: details 技能樹

- **前端框架**: Vue.js
- **渲染框架**: Nuxt.js(SSR), Astro(SSG)
- **後端框架**: Laravel, Nova
- **API**: GraphQL (GQL)
- **版型與樣式**: Tailwind CSS, Bootstrap
- **容器**: Docker
- **自動化部署**: GitHub Actions

:::
::: info

- 本站使用 VitePress 構建，原始碼位於[GitHub](https://github.com/johnny-PcP/myPlayground.git)。
- 有任何問題或建議，歡迎以 [e-mail](mailto:johnnypcp0313@gmail.com) 聯繫我。

:::
