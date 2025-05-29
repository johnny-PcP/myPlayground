---
description: 可針對巢狀物件模糊搜尋的輸入元件。
---

<script setup>
import BasicUsage from '../../../src/components/nested-fuzzy-search/examples/basic-usage.vue'
import BtnUsage from '../../../src/components/nested-fuzzy-search/examples/btn-usage.vue'
</script>

# 巢狀模糊搜尋器 <Badge type="info" text="input" />

日前在社群看到有人分享一篇文章是有關在React實作[巢狀模糊搜尋](https://www.freecodecamp.org/news/how-to-build-a-reusable-usesearch-hook-in-react/)的元件，就想說用自己的理解簡單實作成vue的版本。

## 元件簡介
- 可以針對巢狀物件進行模糊搜尋的輸入元件。
- 可以客製模糊搜尋的精度。
- 預設為直接返回匹配結果，亦可改為函式觸發。

::: details 元件原始碼
<<< ../../../src/components/nested-fuzzy-search/nested-fuzzy-search.vue
:::

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
<<< ../../../src/components/nested-fuzzy-search/examples/basic-usage.vue
:::

## 元件參數

### Props

| name | type | default | require | note |
|---------|------|--------|----------|------|
| `data` | `any[]` | - | ✓ | 要搜尋的資料陣列 |
| `placeholder` | `string` | `'請輸入搜尋關鍵字'` | - | 輸入框的提示文字 |
| `matchPrecision` | `number` | `0.3` | - | 相似度閾值，範圍 0-1，數值越高匹配越嚴格 |
| `autoEmitResults` | `boolean` | `true` | - | 是否自動發送搜尋結果，設為 false 時需手動調用 `triggerSearch()` |
| `debounceMs` | `number` | `300` | - | 防抖延遲時間（毫秒），減少搜尋頻率以提升效能 |

### Emits

| name | type | note |
|---------|------|------|
| `search` | `results: any[]` | 當搜尋結果變更時觸發，傳回符合條件的資料陣列 |

## 客製範例

<BtnUsage title="btn-usage"/>

::: details 查看範例原始碼
<<< ../../../src/components/nested-fuzzy-search/examples/btn-usage.vue
:::

## 作動原理

更實際的作動原理在元件原始碼中有寫上註解，這邊僅簡單說明：

### 模糊比對

1. 先將文字拆分成2-gram（雙字母組合），比方說 "hello" 會被拆分成 ["he", "el", "ll", "lo"]。

2. 再將使用者輸入的文字也拆分成2-gram，再去比對符合的程度有多高。

### 巢狀搜尋

1. 取得遞迴方式，取得全部資料的key，再針對全部取得的key進行模糊比對。
    - 例如對於這樣的資料：
```javascript{3,4}
const data = {
  user: {
    profile: { name: 'Alice', age: 30 },
    tags: ['vue', 'javascript']
  }
}
```
2. 會取得的key為：`['user', 'profile', 'name', 'age', 'tags']`。

3. 再另外根據路徑字串動態提取巢狀物件中的值
```javascript
getValueByPath(data, 'user.profile.name') // 'Alice'
getValueByPath(data, 'user.tags[0]') // 'vue'
```
4. 最後將這些值進行模糊比對，再用some判斷，只要物件內有一個成員符合條件，就會這個物件返回（成為搜尋結果）。
