import { h, ref, render, watchEffect } from 'vue'
import TipsComponent from './render-tips.vue'

export interface Tip {
  id?: number;
  content: string;
  textColor?: string; // CSS 顏色值，如 '#ff0000', 'red', 'rgb(255, 0, 0)'，預設為 '#333333'
  duration?: number; // 持續時間，單位毫秒，默認 5000ms
  // 樣式配置
  itemStyle?: Record<string, string | number>; // tip-item 的自定義樣式
  contentStyle?: Record<string, string | number>; // tip-content 的自定義樣式
  textStyle?: Record<string, string | number>; // 文字的自定義樣式
  closeButtonStyle?: Record<string, string | number>; // 關閉按鈕的自定義樣式
}

export interface UseRenderTipsOptions {
  /** 預設持續時間，單位毫秒 */
  defaultDuration?: number;
  /** 容器銷毀延遲時間，單位毫秒 */
  destroyDelay?: number;
  /** 容器樣式配置 */
  containerStyle?: Record<string, string | number>;
  /** tip-item 的預設樣式 */
  tipItemStyle?: Record<string, string | number>;
  /** tip-content 的預設樣式 */
  tipContentStyle?: Record<string, string | number>;
  /** 關閉按鈕的預設樣式 */
  closeButtonStyle?: Record<string, string | number>;
}

// 全域容器管理
let globalContainer: HTMLElement | null = null
let globalStopWatcher: (() => void) | null = null
let globalDestroyTimer: NodeJS.Timeout | null = null
const globalTips = ref<Tip[]>([])

export function useRenderTips(options: UseRenderTipsOptions = {}) {
  const timers = new Map<number, NodeJS.Timeout>()

  function ensureContainer() {
    if (globalContainer) {
      return
    }

    globalContainer = document.createElement('div')
    document.body.appendChild(globalContainer)

    // 使用 watchEffect 監聽 tips 變化並重新渲染
    globalStopWatcher = watchEffect(() => {
      if (!globalContainer)
        return

      const vNode = h(TipsComponent, {
        tips: globalTips.value,
        containerStyle: options.containerStyle || {},
        tipItemStyle: { borderRadius: '4px', ...options.tipItemStyle },
        tipContentStyle: options.tipContentStyle || {},
        closeButtonStyle: options.closeButtonStyle || {},
        onRemoveTip: removeTip,
      })

      render(vNode, globalContainer)
    })
  }

  function pushTip(tip: Tip) {
    const thisId = Date.now() + Math.floor(Math.random() * 1000)
    const duration = tip.duration ?? options.defaultDuration ?? 5000

    const newTip = { id: thisId, ...tip }
    globalTips.value.push(newTip)

    // 確保容器存在
    ensureContainer()

    // 取消之前的銷毀計時器
    if (globalDestroyTimer) {
      clearTimeout(globalDestroyTimer)
      globalDestroyTimer = null
    }

    // 設置自動移除計時器
    const timer = setTimeout(() => {
      removeTip(thisId)
    }, duration)

    timers.set(thisId, timer)
  }

  function removeTip(id: number) {
    const index = globalTips.value.findIndex((tip) => tip.id === id)
    if (index !== -1) {
      globalTips.value.splice(index, 1)

      // 清除對應的計時器
      const timer = timers.get(id)
      if (timer) {
        clearTimeout(timer)
        timers.delete(id)
      }

      // 如果沒有 tip 了，延遲銷毀容器等待動畫完成
      if (globalTips.value.length === 0) {
        scheduleDestroy()
      }
    }
  }

  function removeAllTips() {
    // 清除所有計時器
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()

    globalTips.value = []
    scheduleDestroy()
  }

  function scheduleDestroy() {
    // 取消之前的銷毀計時器
    if (globalDestroyTimer) {
      clearTimeout(globalDestroyTimer)
    }

    // 延遲銷毀，等待動畫完成
    const delay = options.destroyDelay ?? 300
    globalDestroyTimer = setTimeout(() => {
      destroy()
    }, delay)
  }

  function destroy() {
    if (globalDestroyTimer) {
      clearTimeout(globalDestroyTimer)
      globalDestroyTimer = null
    }

    if (globalStopWatcher) {
      globalStopWatcher()
      globalStopWatcher = null
    }

    if (globalContainer) {
      render(null, globalContainer)
      document.body.removeChild(globalContainer)
      globalContainer = null
    }
  }

  return {
    pushTip,
    removeTip,
    removeAllTips,
    tips: globalTips.value,
  }
}
