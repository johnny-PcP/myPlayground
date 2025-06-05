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
interface _DataItem {
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
    title: 'Complete Vue.js Development Guide',
    keywords: ['Vue', 'JavaScript', 'Frontend', 'SPA'],
    author: {
      name: 'John Smith',
      email: 'john@example.com',
    },
    chapters: [
      { name: 'Basic Concepts', duration: 120 },
      { name: 'Composition API', duration: 180 },
      { name: 'State Management', duration: 150 },
    ],
  },
  {
    id: 2,
    title: 'React Performance Optimization',
    keywords: ['React', 'Performance', 'Optimization'],
    author: {
      name: 'Emily Johnson',
      email: 'emily@example.com',
    },
    chapters: [
      { name: 'Virtual DOM Principles', duration: 90 },
      { name: 'Memo and Callback', duration: 110 },
      { name: 'Code Splitting', duration: 100 },
    ],
  },
  {
    id: 3,
    title: 'Node.js Backend Development',
    keywords: ['Node.js', 'Express', 'API', 'Backend'],
    author: {
      name: 'Michael Brown',
      email: 'michael@example.com',
    },
    chapters: [
      { name: 'Express Framework', duration: 140 },
      { name: 'MongoDB Integration', duration: 160 },
      { name: 'Authentication', duration: 130 },
    ],
  },
  {
    id: 4,
    title: 'Python Data Science',
    keywords: ['Python', 'Data Analysis', 'Pandas', 'NumPy'],
    author: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
    },
    chapters: [
      { name: 'Pandas Basics', duration: 200 },
      { name: 'Data Visualization', duration: 170 },
      { name: 'Machine Learning Intro', duration: 220 },
    ],
  },
  {
    id: 5,
    title: 'Docker Containerization',
    keywords: ['Docker', 'DevOps', 'Container', 'Deployment'],
    author: {
      name: 'David Lee',
      email: 'david@example.com',
    },
    chapters: [
      { name: 'Docker Basics', duration: 80 },
      { name: 'Dockerfile Writing', duration: 95 },
      { name: 'Docker Compose', duration: 120 },
    ],
  },
  {
    id: 6,
    title: 'Advanced TypeScript Development',
    keywords: ['TypeScript', 'Types', 'Advanced', 'JavaScript'],
    author: {
      name: 'Alex Chen',
      email: 'alex@example.com',
    },
    chapters: [
      { name: 'Type System', duration: 110 },
      { name: 'Generic Programming', duration: 140 },
      { name: 'Decorator Pattern', duration: 90 },
    ],
  },
  {
    id: 7,
    title: 'Swift iOS App Development',
    keywords: ['Swift', 'iOS', 'Mobile App', 'UIKit'],
    author: {
      name: 'Lisa Garcia',
      email: 'lisa@example.com',
    },
    chapters: [
      { name: 'Swift Syntax', duration: 160 },
      { name: 'UIKit Components', duration: 180 },
      { name: 'Data Persistence', duration: 120 },
    ],
  },
  {
    id: 8,
    title: 'Kubernetes Cluster Management',
    keywords: ['Kubernetes', 'K8s', 'Orchestration', 'DevOps'],
    author: {
      name: 'Robert Martinez',
      email: 'robert@example.com',
    },
    chapters: [
      { name: 'Basic Concepts', duration: 100 },
      { name: 'Pods and Services', duration: 150 },
      { name: 'Deployment Strategies', duration: 170 },
    ],
  },
  {
    id: 9,
    title: 'Machine Learning Algorithms',
    keywords: ['AI', 'Machine Learning', 'Algorithms', 'TensorFlow'],
    author: {
      name: 'Amy Zhang',
      email: 'amy@example.com',
    },
    chapters: [
      { name: 'Supervised Learning', duration: 240 },
      { name: 'Neural Networks', duration: 200 },
      { name: 'Deep Learning', duration: 280 },
    ],
  },
  {
    id: 10,
    title: 'Web Security Protection',
    keywords: ['Security', 'HTTPS', 'XSS', 'CSRF'],
    author: {
      name: 'Kevin Anderson',
      email: 'kevin@example.com',
    },
    chapters: [
      { name: 'Common Attack Methods', duration: 130 },
      { name: 'Defense Mechanisms', duration: 150 },
      { name: 'Security Testing', duration: 110 },
    ],
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
