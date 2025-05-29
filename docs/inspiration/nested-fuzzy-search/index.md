---
description: 可針對巢狀物件模糊搜尋的輸入元件。
---

<script setup>
import BasicUsage from '../../../src/components/n-gram-searcher/examples/basic-usage.vue'
import BtnUsage from '../../../src/components/n-gram-searcher/examples/btn-usage.vue'
</script>

# 巢狀模糊搜尋器 <Badge type="info" text="input" />

日前在社群看到有人分享一篇文章是有關在React實作[巢狀模糊搜尋](https://www.freecodecamp.org/news/how-to-build-a-reusable-usesearch-hook-in-react/)的元件，就想說用自己的理解簡單實作成vue的版本。

## 元件簡介
- 可以針對巢狀物件進行模糊搜尋的輸入元件。
- 可以客製模糊搜尋的精度。
- 預設為直接返回匹配結果，亦可改為函式觸發。

## 基礎範例

假設我們有一個物件資料結構如下：
```typescript
interface DataItem {
  id: number;
  title: string;
  keywords: string[];
  author: {
    name: string;
    email: string;
  };
  chapters: Array<{
    name: string;
    duration: number;
  }>;
}
```
::: details 查看完整範例結構
```javascript
[
  {
    id: 1,
    title: 'Vue.js 完整開發指南',
    keywords: ['Vue', 'JavaScript', '前端', 'SPA'],
    author: {
      name: '張小明',
      email: 'zhang@example.com'
    },
    chapters: [
      { name: '基礎概念', duration: 120 },
      { name: 'Composition API', duration: 180 },
      { name: '狀態管理', duration: 150 }
    ]
  },
  {
    id: 2,
    title: 'React 效能優化實戰',
    keywords: ['React', 'Performance', '優化'],
    author: {
      name: '李美華',
      email: 'li@example.com'
    },
    chapters: [
      { name: 'Virtual DOM 原理', duration: 90 },
      { name: 'Memo 與 Callback', duration: 110 },
      { name: '代碼分割', duration: 100 }
    ]
  },
  {
    id: 3,
    title: 'Node.js 後端開發',
    keywords: ['Node.js', 'Express', 'API', '後端'],
    author: {
      name: '王大安',
      email: 'wang@example.com'
    },
    chapters: [
      { name: 'Express 框架', duration: 140 },
      { name: 'MongoDB 整合', duration: 160 },
      { name: 'Authentication', duration: 130 }
    ]
  },
  {
    id: 4,
    title: 'Python 資料科學',
    keywords: ['Python', '資料分析', 'Pandas', 'NumPy'],
    author: {
      name: '陳志強',
      email: 'chen@example.com'
    },
    chapters: [
      { name: 'Pandas 基礎', duration: 200 },
      { name: '資料視覺化', duration: 170 },
      { name: '機器學習入門', duration: 220 }
    ]
  },
  {
    id: 5,
    title: 'Docker 容器化部署',
    keywords: ['Docker', 'DevOps', '容器', '部署'],
    author: {
      name: '林雅婷',
      email: 'lin@example.com'
    },
    chapters: [
      { name: 'Docker 基礎', duration: 80 },
      { name: 'Dockerfile 撰寫', duration: 95 },
      { name: 'Docker Compose', duration: 120 }
    ]
  },
]
```
:::

### 基本用法

預設情況下，輸入文字後會直接返回匹配的結果，並且可以在巢狀物件中進行模糊搜尋。

<BasicUsage title="basic-usage"/>

::: details 查看範例原始碼
<<< ../../../src/components/n-gram-searcher/examples/basic-usage.vue
:::

## 元件參數

### Props

### Emits

## 客製範例

<BtnUsage title="btn-usage"/>

::: details 查看範例原始碼
<<< ../../../src/components/n-gram-searcher/examples/btn-usage.vue
:::

## 作動原理