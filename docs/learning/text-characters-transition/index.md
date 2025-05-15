---
description: 具有進入進出動畫的文字。
---

<script setup>
import BasicUsage from '../../../src/components/text-characters-transition/examples/basic-usage.vue'
</script>

# 逐字轉場

讓每個文字都有進入進出動畫。

:::tip 使用本元件必須安裝：

- [Remeda](https://remeda.dev/)
- [animejs](https://animejs.com/v3/documentation/) ( v3 )

:::

## 使用範例

### 基本用法

預設就是經典的淡入淡出。

<BasicUsage />

::: details 查看範例原始碼
<<< ../../../src/components/text-characters-transition/examples/basic-usage.vue
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

</template>

1. 使用 Vue.js 的 [:is](https://hromium.com/javascript-visualized-event-loop) 語法，能夠依據使用者的需求動態生成 DOM 元素。

```javascript
  <component :is="props.tag" ></component>
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
