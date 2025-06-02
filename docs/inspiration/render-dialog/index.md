---
description: 動態渲染對話框的 Composable 函式，無需手動在模板中放置組件。
---

<script setup>
import BasicUsage from '../../../src/components/render-dialog/examples/basic-usage.vue'
import ComprehensiveDemo from '../../../src/components/render-dialog/examples/comprehensive-demo.vue'
</script>

# 即時渲染對話框 <Badge type="info" text="composable" />

歷經幾個自己專案，改到v3版本。
藉由 Composable 函式，就能實現顯示HTML原生的 `<Dialog>` ，並能執行 JavaScript 回調函式的組件。

## 元件簡介

- 無需在模板中預先放置組件，將 Composable 引入即可使用。
- 每個動作都可以綁定回調函式（甚至背景點擊也可配置）。
- 可選的 Teleport 功能，解決 z-index 層級衝突。

::: details 元件原始碼
<<< ../../../src/components/render-dialog/render-dialog.vue
:::
::: details Composable 原始碼
<<< ../../../src/components/render-dialog/useRenderDialog.ts
:::

## 基礎範例

<BasicUsage title="basic-usage"/>

::: details 基礎範例原始碼
<<< ../../../src/components/render-dialog/examples/basic-usage.vue
:::

## 元件參數

### useDialog(options?)

#### 參數

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `teleport` | `boolean \| string` | `undefined` | 預設的 Teleport 設定，`true` 表示傳送到 body，字串表示自定義 CSS 選擇器 |

#### 返回值

| 方法 | 類型 | 說明 |
|------|------|------|
| `open` | `(options: DialogOptions) => void` | 開啟對話框 |
| `close` | `() => void` | 關閉對話框 |

### 配置選項

#### DialogOptions

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | `string` | - | 對話框標題，不提供則不顯示標題區域 |
| `content` | `string[]` | ✓ | 對話框內容，支援多行文字陣列 |
| `confirm` | `ButtonConfig` | ✓ | 確認按鈕配置 |
| `cancel` | `ButtonConfig` | - | 取消按鈕配置 |
| `backdrop` | `false \| BackdropOptions` | `{}` | 背景遮罩配置，設為 `false` 則不顯示背景 |
| `teleport` | `boolean \| string` | - | 單次 Teleport 設定，覆蓋全域設定 |

#### ButtonConfig

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `btnName` | `string` | ✓ | 按鈕顯示文字 |
| `onComplete` | `() => void` | - | 按鈕點擊後的回調函數 |

### 背景遮罩配置

| 參數 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `backdrop` | `false \| BackdropOptions` | `{}` | 背景遮罩配置，設為 `false` 則不顯示背景 |
| `backdrop.color` | `string` | `'rgba(0, 0, 0, 0.5)'` | 背景遮罩顏色 |
| `backdrop.blur` | `string` | `'4px'` | 背景模糊程度 |
| `backdrop.closeOnClick` | `boolean` | `false` | 點擊背景是否關閉對話框 |
| `backdrop.onBackdropClick` | `() => void` | - | 點擊背景時的回調函式，只有在 closeOnClick 為 true 時有效 |

## 進階功能範例
<ComprehensiveDemo title="comprehensive-demo"/>

::: details 查看範例原始碼
<<< ../../../src/components/render-dialog/examples/comprehensive-demo.vue
:::
