---
description: 被啟用停用時，使用者點不到的按鈕
---

<script setup>
import BasicUsage from '../../../src/components/btn-naughty/examples/basic-usage.vue'
import CustomUsage from '../../../src/components/btn-naughty/examples/custom-usage.vue'
</script>

# 調皮的按鈕 <Badge type="info" text="button" />

停用時會越跑越遠的按鈕。
:::tip 使用本元件必須安裝：

- [VueUse](https://vueuse.org/core/useMouseInElement/)

:::

## 元件簡介

- 當按鈕狀態為 disabled 並觸發 hover、click、key enter 事件時，按鈕會開始亂跑。
- 可客製按鈕與按鈕底部的拓印容器樣式。
- 其他參數詳見 Props 表。

::: details 元件原始碼
<<< ../../../src/components/btn-naughty/btn-naughty.vue
:::

## 基礎範例

<BasicUsage title="basic-usage"/>

::: details 基礎範例原始碼
<<< ../../../src/components/btn-naughty/examples/basic-usage.vue
:::

## 元件參數

### Props

| 名稱                  | 類型               | 預設值         | 說明                           |
| --------------------- | ------------------ | -------------- | ------------------------------ |
| `label`               | `string`           | `按鈕預設文字` | 按鈕內的文字內容               |
| `disabled`            | `boolean`          | `false`        | 是否停用按鈕                   |
| `zIndex`              | `number \| string` | `undefined`    | 按鈕的 z-index 屬性            |
| `maxDistanceMultiple` | `number`           | `5`            | 最大移動距離，為按鈕尺寸的倍數 |
| `tabindex`            | `number \| string` | `undefined`    | 按鈕的 tabindex 屬性           |

---

### Emits

| 事件名稱 | 說明                         |
| -------- | ---------------------------- |
| `click`  | 當按鈕被點擊時觸發           |
| `run`    | 當按鈕因滑鼠移動而逃跑時觸發 |
| `back`   | 當按鈕回到原位時觸發         |

---

### Slots

| 名稱      | 說明                               |
| --------- | ---------------------------------- |
| `default` | 按鈕的主要內容                     |
| `rubbing` | 拓印容器的內容，默認為虛線框的樣式 |

## 客製範例

<CustomUsage title="custom-usage"/>

::: details 客製範例原始碼
<<< ../../../src/components/btn-naughty/examples/basic-usage.vue
:::

## 元件亮點

核心作動原理是在按鈕被觸發事件的瞬間，偵測使用者滑鼠當前位置與按鈕中心點的向量，並基於此來做後續的處理。

### 1. Props 的設計，考慮到了 z-index 跟 tabindex。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#Props

### 2. 使用 VueUse 的 useMouseInElement 取得滑鼠位置座標外，還使用 VueUse 的 throttleFilter 來降低偵測滑鼠變化的更新率，避免過多的事件觸發導致性能問題。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#throttleFilter

### 3. 使用 Computed 返回 Css 的樣式，並且整合了 Props 的值，讓使用者可以自定義按鈕的樣式。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#carrierStyle

::: tip 記得引入 " CSSProperties " from Vue， 友善 Ts。

```javascript{2}
import type { CSSProperties } from "vue";
```

:::

### 4. 使用向量的手段來處理按鈕的移動角度。

簡單來說，getUnitVector 就是計算出如果 「 只移動 1 個單位 」 ， X 與 Y 要各自移動多少單位才能重現這個角度（原理上各不應大於 1）。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#getUnitVector1

::: tip 然後如何移動？

將想移動的距離（本案是原本按鈕的長寬）分別乘上這個單位向量(direction)，就可以移動到指定的位置。

```javascript
/** 取得按鈕中心到滑鼠的單位方向 */
const direction = getUnitVector(mousePosition.value)

/** 往遠離滑鼠的方向移動一個按鈕的距離 */
carrierOffset.value.x -= direction.x * mouseInElement.elementWidth
carrierOffset.value.y -= direction.y * mouseInElement.elementHeight
```

:::

### 5. 重點功能都會發出 emit 事件。

即便本元件沒有對外部 emit 的需求，但依然會發出 emit，這是我之前沒有的習慣，但如果這樣設計，使用者就能自定義更多的 v-on 來增加元件的使用彈性。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#Emits

## 單元測試

詳細可以觀看測試原始碼；值得一提的是元件有 defineExpose 出 offset，這樣就可以在測試中取得元件的當前位置。

```javascript{2}
/** btn-naughty.vue */
defineExpose({
  offset: carrierOffset,
});
```

::: details 查看測試原始碼
<<< ../../../src/components/btn-naughty/btn-naughty.spec.ts
