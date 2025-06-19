---
description: 動態渲染提示訊息的 Composable 函式，無需手動在模板中放置組件。
---

<script setup>
import BasicUsage from '../../../src/components/render-tips/examples/basic-usage.vue'
import ComprehensiveDemo from '../../../src/components/render-tips/examples/comprehensive-demo.vue'
</script>

# 即時渲染提示訊息 <Badge type="info" text="composable" />

動態渲染提示訊息的 Composable 函式，無需在模板中預先放置組件。

## 特色

- 無需在模板中預先放置組件
- 支援自動定時消失
- 支援自定義樣式配置
- 提供手動關閉和批量清除功能
- 自動管理容器生命週期

## 基礎範例

<BasicUsage title="basic-usage"/>

::: details 基礎範例原始碼
<<< ../../../src/components/render-tips/examples/basic-usage.vue
:::

## API 參考

### useRenderTips(options?)

#### 參數 (RenderTipsConfig)

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `defaultDuration` | `number` | `3000` | 預設持續時間（毫秒） |
| `maxTips` | `number` | `10` | 最大提示數量 |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | 容器位置 |

#### 返回值

| 方法 | 類型 | 說明 |
|------|------|------|
| `pushTip` | `(tip: Tip) => void` | 新增提示訊息 |
| `removeTip` | `(id: number) => void` | 移除指定 ID 的提示訊息 |
| `removeAllTips` | `() => void` | 清除所有提示訊息 |
| `tips` | `Tip[]` | 當前顯示的提示訊息陣列 |

### Tip 介面

| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `content` | `string` | ✓ | 提示訊息內容 |
| `textColor` | `string` | - | 文字顏色，預設 `'#333333'` |
| `backgroundColor` | `string` | - | 背景顏色 |
| `borderColor` | `string` | - | 邊框顏色 |
| `duration` | `number` | - | 顯示持續時間（毫秒） |

## 進階範例

<ComprehensiveDemo title="comprehensive-demo"/>

::: details 查看範例原始碼
<<< ../../../src/components/render-tips/examples/comprehensive-demo.vue
:::

## 使用方式

### 基本使用

```javascript
import { useRenderTips } from '@/components/render-tips/useRenderTips'

const tips = useRenderTips()

// 顯示提示
tips.pushTip({
  content: '操作成功！',
  textColor: '#15803d',
  backgroundColor: '#f0fdf4',
  duration: 3000,
})
```

### 自定義配置

```javascript
const tips = useRenderTips({
  defaultDuration: 8000,
  position: 'top-right',
  maxTips: 5,
})

// 顏色主題提示
tips.pushTip({
  content: '具有紫色主題的提示',
  textColor: '#ffffff',
  backgroundColor: '#7c3aed',
  borderColor: '#5b21b6',
})
```

## 注意事項

- 無需在模板中預先放置組件，系統會自動管理容器
- 支援同時顯示多個提示訊息
- 基本樣式（圓角、文字大小、陰影等）已固定在組件中
- 只保留顏色相關的配置選項，簡化使用方式
- 預設圓角 8px，陰影效果和動畫已優化

::: details 查看原始碼
<<< ../../../src/components/render-tips/render-tips.vue
:::

::: details 查看 Composable 原始碼
<<< ../../../src/components/render-tips/useRenderTips.ts
:::
