<template>
  <!-- 使用動態組件來支援不同的 HTML 標籤，並設置 aria-label 屬性 -->
  <component :is="props.tag" :aria-label="labelText">
    <!-- 遍歷字符陣列並為每個字符創建 span 元素 -->
    <span
      v-for="(char, i) in chars"
      :id="char.id"
      :key="i"
      :class="id"
      aria-hidden
      class="inline-block"
    >
      <!-- 顯示字符值 -->
      {{ char.value }}
    </span>
  </component>
</template>

<script setup lang="ts">
// 引入動畫函數參數和過渡名稱類型
import type { AnimeFuncParam, TransitionName } from './transition-provider'
// 引入 anime.js 動畫庫
import anime from 'animejs'
// 引入 remeda 工具函數
import { join, map, pipe } from 'remeda'

// 引入 Vue 組合式 API 函數
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

// 引入過渡效果提供者
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
  /** 進入動畫設定 */
  enter?: AnimeFuncParam;
  /** 離開動畫設定 */
  leave?: AnimeFuncParam;
}
// #endregion Props
// 定義 props 並設置默認值
const props = withDefaults(defineProps<Props>(), {
  visible: true,
  label: '',
  tag: 'p',
  splitter: undefined,
  name: 'fade',
})

// #region Emits
// 定義事件發射器
const emit = defineEmits<{
  beforeEnter: []; // 進入動畫開始前觸發
  afterEnter: []; // 進入動畫結束後觸發
  beforeLeave: []; // 離開動畫開始前觸發
  afterLeave: []; // 離開動畫結束後觸發
}>()
// #endregion Emits

// 生成唯一 ID，用於標識組件實例
const id = crypto.randomUUID()

/** 拆分文字為多個字元 */
const chars = computed(() =>
  pipe(
    props.label,
    (data) => {
      // 如果是陣列直接返回
      if (Array.isArray(data)) {
        return data
      }

      // 如果提供了自定義拆分函數則使用它
      if (typeof props.splitter === 'function') {
        return props.splitter(data)
      }

      /** Regex 加上 u 才不會導致 emoji 被拆分成亂碼 */
      return data.split(props.splitter ?? /.*?/u)
    },
    map((data, i, array) => {
      // 為每個字符生成唯一 ID
      const elId = `${id}-${i}`
      // 獲取指定名稱的動畫
      const animate = transitionProvider[props.name]
      return {
        value: data, // 字符值
        id: elId, // 唯一 ID
        i, // 索引
        // 進入動畫函數，合併預設和自定義配置
        enter: () => ({
          ...animate.enter(i, array.length),
          ...props.enter?.(i, array.length),
        }),
        // 離開動畫函數，合併預設和自定義配置
        leave: () => ({
          ...animate.leave(i, array.length),
          ...props.leave?.(i, array.length),
        }),
      }
    }),
  ),
)

/** 組合完整文字，用於 aria-label */
const labelText = computed(() =>
  pipe(
    chars.value.map((char) => char.value), // 提取所有字符值
    join(''), // 合併為一個字符串
  ),
)

/** 進入動畫
 *
 * @param end 用於初始化時，立即完成動畫
 */
async function startEnter(end = false) {
  /** 移除所有現有動畫，避免衝突 */
  anime.remove(`.${id}`)
  // 觸發進入前事件
  emit('beforeEnter')

  // 為每個字符建立動畫任務
  const tasks = chars.value.map((char) => {
    // 獲取動畫配置
    const data = char.enter()

    // 如果需要立即結束，設置動畫時長和延遲為0
    if (end) {
      data.duration = 0
      data.delay = 0
    }

    /** 使用 animejs 自身的 CSS selector 不穩定，有時候會無法初始化，改用 js 原生語法 */
    const targets = document.getElementById(char.id)
    // 創建並啟動動畫，並返回 Promise
    return anime({
      ...data,
      targets,
    }).finished
  })

  // 等待所有動畫完成
  await Promise.allSettled(tasks)

  // 觸發進入後事件
  emit('afterEnter')
}

/** 離開動畫
 *
 * @param end 用於初始化時，立即完成動畫
 */
async function startLeave(end = false) {
  // 移除所有現有動畫
  anime.remove(`.${id}`)

  // 觸發離開前事件
  emit('beforeLeave')

  // 為每個字符建立動畫任務
  const tasks = chars.value.map((char) => {
    // 獲取動畫配置
    const data = char.leave()

    // 如果需要立即結束，設置動畫時長和延遲為0
    if (end) {
      data.duration = 0
      data.delay = 0
    }

    // 獲取目標元素
    const targets = document.getElementById(char.id)
    // 創建並啟動動畫，並返回 Promise
    return anime({
      ...data,
      targets,
    }).finished
  })
  // 等待所有動畫完成
  await Promise.allSettled(tasks)

  // 觸發離開後事件
  emit('afterLeave')
}

/** visible 變更時自動執行動畫 */
watch(
  () => props.visible, // 監聽 visible 屬性
  (visible) => {
    // 根據可見性執行對應動畫
    visible ? startEnter() : startLeave()
  },
)

/** DOM 綁定完成後立即完成對應動畫 */
onMounted(() => {
  // 根據初始可見性立即完成對應動畫
  props.visible ? startEnter(true) : startLeave(true)
})

/** 元件解除前刪除所有動畫 */
onBeforeUnmount(() => {
  // 確保組件卸載時清理所有動畫
  anime.remove(`.${id}`)
})
</script>

<!-- 組件樣式（當前沒有樣式定義） -->
<style scoped></style>
