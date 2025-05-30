import { h, nextTick, render, Teleport } from 'vue'
import DialogComponent from './render-dialog.vue'

export interface ButtonConfig {
  btnName: string;
  onComplete?: () => void;
}

export interface BackdropOptions {
  /** 背景遮罩顏色 */
  color?: string;
  /** 背景模糊程度 */
  blur?: string;
  /** 點擊背景是否關閉對話框，預設為 false */
  closeOnClick?: boolean;
  /** 點擊背景時的回調函式，只有在 closeOnClick 為 true 時有效 */
  onBackdropClick?: () => void;
}

export interface DialogOptions {
  title?: string;
  content: string[];
  confirm: ButtonConfig;
  cancel?: ButtonConfig;
  /** 背景遮罩配置，設為 false 則不顯示背景 */
  backdrop?: false | BackdropOptions;
  /** Teleport 目標，true 表示傳送到 body，string 表示自定義 CSS 選擇器 */
  teleport?: boolean | string;
}

export interface UseDialogOptions {
  /** 預設的 Teleport 設定，true 表示傳送到 body，string 表示自定義 CSS 選擇器 */
  teleport?: boolean | string;
}

export function useDialog(options: UseDialogOptions = {}) {
  let container: HTMLElement | null = null

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

  function open(dialogOptions: DialogOptions) {
    // 決定 Teleport 目標：單次設定 > 全域設定 > 關閉
    const teleportTarget = dialogOptions.teleport ?? options.teleport

    // 創建容器
    container = document.createElement('div')
    document.body.appendChild(container)

    let vNode

    if (teleportTarget) {
      // 確定傳送目標
      const target = teleportTarget === true ? 'body' : teleportTarget as string
      const portalElement = target === 'body' ? document.body : checkPortalContainer(target)

      // 使用 Teleport 包裝組件
      vNode = h(Teleport, {
        to: portalElement,
      }, [
        h(DialogComponent, {
          dialogOption: dialogOptions,
          onConfirm: () => {
            dialogOptions.confirm?.onComplete?.()
            close()
          },
          onCancel: () => {
            dialogOptions.cancel?.onComplete?.()
            close()
          },
        }),
      ])
    }
    else {
      // 不使用 Teleport，直接渲染
      vNode = h(DialogComponent, {
        dialogOption: dialogOptions,
        onConfirm: () => {
          dialogOptions.confirm?.onComplete?.()
          close()
        },
        onCancel: () => {
          dialogOptions.cancel?.onComplete?.()
          close()
        },
      })
    }

    // 渲染到容器
    render(vNode, container)

    // 顯示對話框 - 使用 nextTick 確保 DOM 更新完成
    nextTick(() => {
      let dialogEl: HTMLDialogElement | null = null

      if (teleportTarget) {
        // 使用 Teleport 時，dialog 會被移動到目標容器
        const targetContainer = teleportTarget === true ? document.body : checkPortalContainer(teleportTarget as string)
        dialogEl = targetContainer.querySelector('dialog:last-of-type')
      }
      else {
        // 不使用 Teleport 時，dialog 在原始容器中
        dialogEl = container?.querySelector('dialog') || null
      }

      if (dialogEl) {
        dialogEl.style.display = 'block'
      }
    })
  }

  function close() {
    if (container) {
      // 銷毀組件
      render(null, container)
      document.body.removeChild(container)
      container = null
    }
  }

  return {
    open,
    close,
  }
}
