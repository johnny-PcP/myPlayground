<template>
  <component :is="props.tag" :aria-label="labelText">
    <span
      v-for="(char, i) in chars"
      :id="char.id"
      :key="i"
      :class="id"
      aria-hidden
      class="inline-block"
    >
      {{ char.value }}
    </span>
  </component>
</template>

<script setup lang="ts">
import anime from 'animejs'
import { join, map, pipe } from 'remeda'

import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

import { transitionProvider } from './transition-provider'

// #region Props
interface Props {
  /** 是否顯示 */
  visible?: boolean;
  /** 文字內容，也可接收已經分割好的陣列 */
  label?: string | string[];

  /** html tag
   * @default 'p'
   */
  tag?: string;

  /** 文字切割邏輯
   * 會設定為只有 label 為 string 時有效
   * @default /.*?/u
   */
  splitter?: RegExp | ((label: string) => string[]);

  /** 套用的動畫名稱
   * @default 'fade'
   */
  name?: string;
}
// #endregion Props
const props = withDefaults(defineProps<Props>(), {
  visible: true,
  label: '',
  tag: 'p',
  splitter: undefined,
  name: 'fade',
})

// #region Emits
const emit = defineEmits<{
  beforeEnter: [];
  afterEnter: [];
  beforeLeave: [];
  afterLeave: [];
}>()
// #endregion Emits

const id = crypto.randomUUID()

/** 拆分文字為多個字元 */
const chars = computed(() =>
  pipe(
    props.label,
    (data) => {
      if (Array.isArray(data)) {
        return data
      }

      if (typeof props.splitter === 'function') {
        return props.splitter(data)
      }

      /** Regex 加上 u 才不會導致 emoji 被拆分成亂碼 */
      return data.split(props.splitter ?? /.*?/u)
    },
    map((data, i, array) => {
      const elId = `${id}-${i}`
      const animate = transitionProvider[props.name]
      return {
        value: data,
        id: elId,
        i,
        enter: () => animate.enter(i, array.length),
        leave: () => animate.leave(i, array.length),
      }
    }),
  ),
)

/** 組合完整文字 */
const labelText = computed(() =>
  pipe(
    chars.value.map((char) => char.value),
    join(''),
  ),
)

/** 進入動畫
 *
 * @param end 用於初始化時，立即完成動畫
 */
async function startEnter(end = false) {
  /** 移除所有現有動畫 */
  anime.remove(`.${id}`)
  emit('beforeEnter')

  const tasks = chars.value.map((char) => {
    const data = char.enter()

    if (end) {
      data.duration = 0
      data.delay = 0
    }

    /** 使用 animejs 自身的 CSS selector 不穩定，有時候會無法初始化，改用 js 原生語法 */
    const targets = document.getElementById(char.id)
    return anime({
      ...data,
      targets,
    }).finished
  })

  await Promise.allSettled(tasks)

  emit('afterEnter')
}

/** 離開動畫
 *
 * @param end 用於初始化時，立即完成動畫
 */
async function startLeave(end = false) {
  anime.remove(`.${id}`)

  emit('beforeLeave')

  const tasks = chars.value.map((char) => {
    const data = char.leave()

    if (end) {
      data.duration = 0
      data.delay = 0
    }

    const targets = document.getElementById(char.id)
    return anime({
      ...data,
      targets,
    }).finished
  })
  await Promise.allSettled(tasks)

  emit('afterLeave')
}

/** visible 變更時自動執行動畫 */
watch(
  () => props.visible,
  (visible) => {
    visible ? startEnter() : startLeave()
  },
)

/** DOM 綁定完成後立即完成對應動畫 */
onMounted(() => {
  props.visible ? startEnter(true) : startLeave(true)
})

/** 元件解除前刪除所有動畫 */
onBeforeUnmount(() => {
  anime.remove(`.${id}`)
})

// #region Methods
defineExpose({})
// #endregion Methods
</script>

<style scoped></style>
