---
description: 被啟用停用時，使用者點不到的按鈕
---

<script setup>
import BasicUsage from '../../../src/components/btn-naughty/examples/basic-usage.vue'
</script>

# 調皮的按鈕 <Badge type="info" text="button" />

停用時會越跑越遠的按鈕。

## 使用範例

### 基本用法

當按鈕狀態為 disabled 並觸發 hover、click、key enter 事件時，按鈕會開始亂跑

<basic-usage/>

::: details 查看範例原始碼
<<< ../../../src/components/btn-naughty/examples/basic-usage.vue
:::

## 核心思路

計算觸發事件的瞬間，使用者滑鼠當前位置到按鈕中心的方向距離。

## 專案亮點

1. Props 的設計，考慮到了 zIndex 跟 tabindex。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#Props

2. 使用 VueUse 的 useMouseInElement 取得滑鼠位置座標外，還使用 VueUse 的 throttleFilter 來降低偵測滑鼠變化的更新率，避免過多的事件觸發導致性能問題。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#throttleFilter

3. 使用 Computed 返回 Css 的樣式，並且整合了 Props 的值，讓使用者可以自定義按鈕的樣式。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#carrierStyle

記得引入 " CSSProperties " from Vue， 友善 Ts。

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#CSSProperties

4. 使用向量的手段來處理按鈕的移動。

藉由 Math.sqrt 取得的平方根，可以確保 x 跟 y 的值保持在-1 到 1 之間。

取得向量

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#getUnitVector1

使用向量

<<< ../../../src/components/btn-naughty/btn-naughty.vue/#getUnitVector2
