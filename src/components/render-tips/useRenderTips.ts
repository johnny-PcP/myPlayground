import type { App } from 'vue'
import { createApp, ref, watchEffect } from 'vue'

import RenderTips from './render-tips.vue'

// 類型定義
export interface Tip {
  id?: number;
  content: string;
  duration?: number;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface RenderTipsConfig {
  defaultDuration?: number;
  maxTips?: number;
  // 只保留位置相關的容器樣式配置
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// 全域管理器類別
class TipsManager {
  private tips = ref<(Tip & { id: number })[]>([])
  private container: HTMLElement | null = null
  private app: App | null = null
  private timers = new Map<number, NodeJS.Timeout>()
  private nextId = 1
  private config: Required<RenderTipsConfig>

  constructor(config: RenderTipsConfig = {}) {
    this.config = {
      defaultDuration: 3000,
      maxTips: 10,
      position: 'bottom-right',
      ...config,
    }

    this.initializeContainer()
  }

  private initializeContainer() {
    // 清理舊容器
    this.cleanup()

    // 創建新容器
    this.container = document.createElement('div')
    document.body.appendChild(this.container)

    // 根據配置設置容器位置
    const getPositionStyle = () => {
      switch (this.config.position) {
        case 'top-left':
          return { top: '20px', left: '20px' }
        case 'top-right':
          return { top: '20px', right: '20px' }
        case 'bottom-left':
          return { bottom: '20px', left: '20px' }
        case 'bottom-right':
        default:
          return { bottom: '20px', right: '20px' }
      }
    }

    // 創建 Vue 應用
    this.app = createApp(RenderTips, {
      tips: this.tips.value,
      containerStyle: {
        position: 'fixed',
        zIndex: 99999,
        pointerEvents: 'none',
        ...getPositionStyle(),
      },
      onRemoveTip: this.removeTip.bind(this),
    })

    // 掛載應用
    this.app.mount(this.container)

    // 監聽 tips 變化來更新組件
    watchEffect(() => {
      if (this.app) {
        // 更新組件的 props
        const instance = this.app._instance
        if (instance) {
          instance.props.tips = this.tips.value
        }
      }
    })
  }

  addTip(tip: Tip): number {
    // 生成唯一 ID
    const id = this.nextId++

    // 創建新的 tip 對象
    const newTip: Tip & { id: number } = {
      duration: this.config.defaultDuration,
      ...tip,
      id,
    }

    // 添加到列表
    this.tips.value.push(newTip)

    // 限制最大數量
    if (this.tips.value.length > this.config.maxTips) {
      const removedTip = this.tips.value.shift()
      if (removedTip) {
        this.clearTimer(removedTip.id)
      }
    }

    // 設置自動移除計時器
    if (newTip.duration && newTip.duration > 0) {
      const timer = setTimeout(() => {
        this.removeTip(id)
      }, newTip.duration)

      this.timers.set(id, timer)
    }

    return id
  }

  removeTip = (id: number): void => {
    const index = this.tips.value.findIndex((tip) => tip.id === id)
    if (index !== -1) {
      this.tips.value.splice(index, 1)
      this.clearTimer(id)
    }
  }

  removeAllTips(): void {
    // 清理所有計時器
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()

    // 清空 tips
    this.tips.value = []
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(id)
    }
  }

  cleanup(): void {
    // 清理計時器
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()

    // 卸載 Vue 應用
    if (this.app) {
      this.app.unmount()
      this.app = null
    }

    // 移除 DOM 容器
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }

    // 清空 tips
    this.tips.value = []
  }

  getTips() {
    return this.tips
  }

  updateConfig(newConfig: Partial<RenderTipsConfig>): void {
    this.config = { ...this.config, ...newConfig }
    // 重新初始化以應用新配置
    this.initializeContainer()
  }
}

// 全域管理器實例
let globalManager: TipsManager | null = null

// 清理函數（用於測試）
export function __cleanup() {
  if (globalManager) {
    globalManager.cleanup()
    globalManager = null
  }
}

/**
 * useRenderTips composable
 * 提供提示訊息的管理功能
 */
export function useRenderTips(config?: RenderTipsConfig) {
  // 如果沒有全域管理器或者需要新配置，則創建新的
  if (!globalManager || config) {
    if (globalManager) {
      globalManager.cleanup()
    }
    globalManager = new TipsManager(config)
  }

  return {
    // 響應式的 tips 數據
    tips: globalManager.getTips(),

    // 添加提示
    pushTip: (tip: Tip) => globalManager!.addTip(tip),

    // 移除指定提示
    removeTip: (id: number) => globalManager!.removeTip(id),

    // 移除所有提示
    removeAllTips: () => globalManager!.removeAllTips(),

    // 更新配置
    updateConfig: (newConfig: Partial<RenderTipsConfig>) => globalManager!.updateConfig(newConfig),

    // 清理資源
    cleanup: () => {
      if (globalManager) {
        globalManager.cleanup()
        globalManager = null
      }
    },
  }
}

// 預設導出
export default useRenderTips
