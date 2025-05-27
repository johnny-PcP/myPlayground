---
description: 具有進入進出動畫的文字。
---

<script setup>
import BasicUsage from '../../../src/components/text-characters-transition/examples/basic-usage.vue'
import CustomSplitter from '../../../src/components/text-characters-transition/examples/custom-splitter.vue'
import TransitionType from '../../../src/components/text-characters-transition/examples/transition-type.vue'
import CustomTransition from '../../../src/components/text-characters-transition/examples/custom-transition.vue'
</script>

# 逐字轉場

讓每個文字都有進入進出動畫。

:::tip 使用本元件必須安裝：

- [Remeda](https://remeda.dev/)
- [animejs](https://animejs.com/v3/documentation/) ( v3 版本)

:::

## 使用範例

### 基本用法

預設為陽春的淡入淡出。

<BasicUsage title="basic-usage"/>

::: details 查看範例原始碼
<<< ../../../src/components/text-characters-transition/examples/basic-usage.vue
:::
<custom-splitter title="custom-splitter"/>

::: details 查看範例原始碼
<<< ../../../src/components/text-characters-transition/examples/custom-splitter.vue
:::

### 轉場類型

元件的簡易內建效果（點擊以下任一方塊，開始切換）

<transition-type title="transition-type"/>

::: details 查看範例原始碼
<<< ../../../src/components/text-characters-transition/examples/transition-type.vue
:::

### 自定義轉場

也可以自定義效果，寫法詳見 [anime.js 文件](https://animejs.com/v3/documentation/)

（點擊以下任一方塊，開始切換）

<custom-transition title="custom-transition" />

::: details 查看範例原始碼
<<< ../../../src/components/text-characters-transition/examples/custom-transition.vue
:::

## 原理

生成類似：下面的結構

```html
<template>
  <p>
    <span>使</span>
    <span>用</span>
    <span>者</span>
    <span>文</span>
    <span>字</span>
  </p>
</template>
```

1. 使用 Vue.js 的 [:is](https://hromium.com/javascript-visualized-event-loop) 語法，能夠依據使用者的需求動態生成 DOM 元素。

```vue
<template>
  <component :is="props.tag" />
</template>
```

2.

## API

### Props

<<< ../../../src/components/text-characters-transition/text-characters-transition.vue/#Props

### Emits

<<< ../../../src/components/text-characters-transition/text-characters-transition.vue/#Emits

### Methods

<<< ../../../src/components/text-characters-transition/text-characters-transition.vue/#Methods

```

```
