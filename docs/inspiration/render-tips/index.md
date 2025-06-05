---
description: 動態渲染提示訊息的 Composable 函式，無需手動在模板中放置組件。
---

<script setup>
import BasicUsage from '../../../src/components/render-tips/examples/basic-usage.vue'
import ComprehensiveDemo from '../../../src/components/render-tips/examples/comprehensive-demo.vue'
</script>

# 即時渲染提示訊息 <Badge type="info" text="composable" />

Tips（提示訊息）是網頁中常見的用戶反饋機制，用於顯示操作結果、警告訊息或通知。這個組件參考了 render-dialog 的設計理念，通過 Composable 函式配合渲染函式實現動態提示訊息系統。

## 元件簡介

- 無需在模板中預先放置組件，將 Composable 引入即可使用。
- 支援自動定時消失，可自定義持續時間。
- 可選的 Teleport 功能，解決 z-index 層級衝突。
- 支援多種樣式和顏色配置。
- 提供手動關閉和批量清除功能。

::: details 元件原始碼
<<< ../../../src/components/render-tips/render-tips.vue
:::
::: details Composable 原始碼
<<< ../../../src/components/render-tips/useRenderTips.ts
:::

## 基礎範例

<BasicUsage title="basic-usage"/>

::: details 基礎範例原始碼
<<< ../../../src/components/render-tips/examples/basic-usage.vue
:::

## 元件參數

### useRenderTips(options?)

#### 參數

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `teleport` | `boolean \| string` | `undefined` | 預設的 Teleport 設定，`true` 表示傳送到 body，字串表示自定義 CSS 選擇器 |
| `defaultDuration` | `number` | `5000` | 預設持續時間（毫秒） |

#### 返回值

| 方法 | 類型 | 說明 |
|------|------|------|
| `pushTip` | `(tip: Tip) => void` | 新增提示訊息 |
| `removeTip` | `(id: number) => void` | 移除指定 ID 的提示訊息 |
| `removeAllTips` | `() => void` | 清除所有提示訊息 |
| `tips` | `Tip[]` | 當前顯示的提示訊息陣列 |

### 配置選項

#### Tip 介面

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `content` | `string` | ✓ | 提示訊息內容 |
| `textColor` | `string` | - | 文字顏色 CSS 類別，如 `'text-red-700'` |
| `duration` | `number` | - | 顯示持續時間（毫秒），覆蓋預設設定 |
| `id` | `number` | - | 提示訊息唯一識別符，系統自動生成 |

## 進階範例

<ComprehensiveDemo title="comprehensive-demo"/>

::: details 查看範例原始碼
<<< ../../../src/components/render-tips/examples/comprehensive-demo.vue
:::

## 使用技巧

### 基本用法

```javascript
import { useRenderTips } from '@/components/render-tips/useRenderTips'

const tips = useRenderTips()

// 顯示成功訊息
tips.pushTip({
  content: '操作成功！',
  textColor: 'text-green-700',
  duration: 3000
})
```

### 配置 Teleport

```javascript
// Teleport 到 body
const _tips1 = useRenderTips({
  teleport: true
})

// Teleport 到自定義元素
const _tips2 = useRenderTips({
  teleport: '#tips-container'
})
```

### 自定義預設持續時間

```javascript
const _tips3 = useRenderTips({
  defaultDuration: 8000 // 8秒後自動消失
})
```

## 與原版本的差異

| 項目 | 原版本 | 新版本 |
|------|--------|--------|
| 使用方式 | 需要在 App.vue 中放置組件 | 只需引入 Composable |
| 狀態管理 | 使用 nanostores | 使用 Vue 響應式系統 |
| 渲染方式 | 模板渲染 | 動態渲染函式 |
| Teleport | 不支援 | 完整支援 |
| 記憶體管理 | 手動管理 | 自動清理 |

## 注意事項

- 如果指定了不存在的 Teleport 目標，會拋出錯誤
- 系統會自動為每個提示訊息生成唯一 ID
- 當所有提示訊息都被移除時，容器會自動銷毀
- 支援同時顯示多個不同類型的提示訊息
