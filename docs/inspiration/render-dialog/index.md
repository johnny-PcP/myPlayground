---
description: 動態渲染對話框的 Composable 函式，無需手動在模板中放置組件。
---

<script setup>
import BasicUsage from '../../../src/components/render-dialog/examples/basic-usage.vue'
import ComprehensiveDemo from '../../../src/components/render-dialog/examples/comprehensive-demo.vue'
</script>

# 即時渲染對話框 <Badge type="info" text="composable" />

Dialog是網頁很常見的需求，常出現在用戶有重要決策時使用，且在整個網頁會一再出現。這個組件歷經了自己幾個專案，基底是使用HTML原生的 `<Dialog>`，改到目前的v3版本，從本來需要先將組件放在App.vue，到現在藉由 Composable 函式配合Vue的渲染函式，實現無需放置組件就能使用。

## 元件簡介

- 無需在模板中預先放置組件，將 Composable 引入即可使用。
- 每個動作都可以綁定回調函式（甚至背景點擊也可配置）。
- 當嘗試開啟新 Dialog 時，如果當下已經有 Dialog 打開，會自動關閉現有的 Dialog。
- 下面是元件渲染的簡易原理：

**開啟**
```mermaid
graph LR
    A[ open() ] --> B[創建 DOM 容器<br/>• 使用 createElement 創建容器 <br/>• 將容器掛載至 body<br/> &nbsp;] --> C[創建並渲染對話框<br/>• 使用 render 函式創建組件<br/>• 將組件渲染到容器上<br/> &nbsp;] --> D[顯示對話框]
```

**關閉流程**
```mermaid
graph LR
    E[ close() ] --> F[清理資源<br/>• 移除 DOM 元素<br/>• 清理 Vue 實例<br/> &nbsp;] --> G[關閉對話框]
```

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

### useDialog

| 方法 | 類型 | 說明 |
|------|------|------|
| `open` | `(options: DialogOptions) => void` | 開啟對話框 |
| `close` | `() => void` | 關閉對話框 |
| `isOpen` | `() => boolean` | 檢查當前是否有對話框打開 |

#### DialogOptions

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | `string` | - | 對話框標題，不提供則不顯示標題區域 |
| `content` | `string[]` | ✓ | 對話框內容，支援多行文字陣列 |
| `confirm` | `ButtonConfig` | ✓ | 確認按鈕配置 |
| `cancel` | `ButtonConfig` | - | 取消按鈕配置 |
| `backdrop` | `false \| BackdropOptions` | `{}` | 背景遮罩配置，設為 `false` 則不顯示背景 |

#### ButtonConfig

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `btnName` | `string` | ✓ | 按鈕顯示文字 |
| `onComplete` | `() => void` | - | 按鈕點擊後的回調函數 |

### BackdropOptions

| 參數 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `color` | `string` | `'rgba(0, 0, 0, 0.5)'` | 背景遮罩顏色 |
| `blur` | `string` | `'4px'` | 背景模糊程度 |
| `closeOnClick` | `boolean` | `false` | 點擊背景是否關閉對話框 |
| `onBackdropClick` | `() => void` | - | 點擊背景時的回調函式，只有在 closeOnClick 為 true 時有效 |

## 客製範例
<ComprehensiveDemo title="comprehensive-demo"/>

::: details 查看範例原始碼
<<< ../../../src/components/render-dialog/examples/comprehensive-demo.vue
:::
