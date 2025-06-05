import { h, ref, render, Teleport, watchEffect } from 'vue'
import TipsComponent from './render-tips.vue'

export interface Tip {
  id?: number;
  content: string;
  textColor?: string;
  duration?: number; // 持續時間，單位毫秒，默認 5000ms
}

export interface UseRenderTipsOptions {
  /** 預設的 Teleport 設定，true 表示傳送到 body，string 表示自定義 CSS 選擇器 */
  teleport?: boolean | string;
  /** 預設持續時間，單位毫秒 */
  defaultDuration?: number;
}

export function useRenderTips(options: UseRenderTipsOptions = {}) {
  let container: HTMLElement | null = null
  let stopWatcher: (() => void) | null = null
  const tips = ref<Tip[]>([])
  const timers = new Map<number, NodeJS.Timeout>()

  function checkPortalContainer(target: string): HTMLElement {
    // 如果是 body，直接返回
    if (target === 'body') {
      return document.body
    }

    // 嘗試找到指定的元素，找不到就拋出錯誤
    const existing = document.querySelector(target) as HTMLElement
    if (existing) {
      return existing
    }

    // 找不到就拋出錯誤，讓用戶知道
    throw new Error(`Teleport target "${target}" not found`)
  }

  function createContainer() {
    if (container)
      return

    container = document.createElement('div')
    const containerId = `tips-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    container.id = containerId
    document.body.appendChild(container)

    // 使用 watchEffect 監聽 tips 變化並重新渲染
    stopWatcher = watchEffect(() => {
      if (!container)
        return

      const teleportTarget = options.teleport
      let vNode

      if (teleportTarget) {
        // 確定傳送目標
        const target = teleportTarget === true ? 'body' : teleportTarget as string
        const portalElement = target === 'body' ? document.body : checkPortalContainer(target)

        // 使用 Teleport 包裝組件
        vNode = h(Teleport, {
          to: portalElement,
        }, [
          h(TipsComponent, {
            tips: tips.value,
            onRemoveTip: removeTip,
          }),
        ])
      }
      else {
        // 不使用 Teleport，直接渲染
        vNode = h(TipsComponent, {
          tips: tips.value,
          onRemoveTip: removeTip,
        })
      }

      render(vNode, container)
    })
  }

  function pushTip(tip: Tip) {
    const thisId = Date.now() + Math.floor(Math.random() * 1000)
    const duration = tip.duration ?? options.defaultDuration ?? 5000

    const newTip = { id: thisId, ...tip }
    tips.value.push(newTip)

    // 如果還沒有容器，創建一個
    if (!container) {
      createContainer()
    }

    // 設置自動移除計時器
    const timer = setTimeout(() => {
      removeTip(thisId)
    }, duration)

    timers.set(thisId, timer)
  }

  function removeTip(id: number) {
    const index = tips.value.findIndex((tip) => tip.id === id)
    if (index !== -1) {
      tips.value.splice(index, 1)

      // 清除對應的計時器
      const timer = timers.get(id)
      if (timer) {
        clearTimeout(timer)
        timers.delete(id)
      }

      // 如果沒有 tip 了，銷毀容器
      if (tips.value.length === 0) {
        destroy()
      }
    }
  }

  function removeAllTips() {
    // 清除所有計時器
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()

    tips.value = []
    destroy()
  }

  function destroy() {
    if (stopWatcher) {
      stopWatcher()
      stopWatcher = null
    }

    if (container) {
      render(null, container)
      document.body.removeChild(container)
      container = null
    }
  }

  return {
    pushTip,
    removeTip,
    removeAllTips,
    tips: tips.value, // 返回響應式引用，供外部訪問
  }
}
