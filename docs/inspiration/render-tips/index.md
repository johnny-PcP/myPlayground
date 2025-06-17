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

#### 參數 (UseRenderTipsOptions)

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `defaultDuration` | `number` | `5000` | 預設持續時間（毫秒） |
| `destroyDelay` | `number` | `300` | 容器銷毀延遲時間（毫秒） |
| `containerStyle` | `Record<string, string \| number>` | `{}` | 容器樣式配置 |
| `tipItemStyle` | `Record<string, string \| number>` | `{}` | 提示項目的預設樣式 |
| `tipContentStyle` | `Record<string, string \| number>` | `{}` | 內容區域的預設樣式 |
| `closeButtonStyle` | `Record<string, string \| number>` | `{}` | 關閉按鈕的預設樣式 |

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
| `duration` | `number` | - | 顯示持續時間（毫秒） |
| `itemStyle` | `Record<string, string \| number>` | - | 提示項目的自定義樣式 |
| `contentStyle` | `Record<string, string \| number>` | - | 內容區域的自定義樣式 |
| `textStyle` | `Record<string, string \| number>` | - | 文字的自定義樣式 |
| `closeButtonStyle` | `Record<string, string \| number>` | - | 關閉按鈕的自定義樣式 |

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
  duration: 3000,
  itemStyle: {
    backgroundColor: '#f0fdf4'
  }
})
```

### 自定義配置

```javascript
const tips = useRenderTips({
  defaultDuration: 8000,
  tipItemStyle: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }
})

// 自定義樣式提示
tips.pushTip({
  content: '具有漸層背景的提示',
  itemStyle: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }
})
```

## 注意事項

- 無需在模板中預先放置組件，系統會自動管理容器
- 支援同時顯示多個提示訊息
- 樣式配置會與預設樣式合併
- 預設圓角 4px，可透過 `borderRadius` 自定義

::: details 查看原始碼
<<< ../../../src/components/render-tips/render-tips.vue
:::

::: details 查看 Composable 原始碼
<<< ../../../src/components/render-tips/useRenderTips.ts
:::
