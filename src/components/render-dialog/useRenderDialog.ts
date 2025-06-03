import { h, nextTick, render } from 'vue'
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
}

export function useDialog() {
  let container: HTMLElement | null = null
  let isOpen = false

  function createDialogComponent(dialogOptions: DialogOptions) {
    return h(DialogComponent, {
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

  function open(dialogOptions: DialogOptions) {
    // 如果已經有 dialog 打開，先關閉它
    if (isOpen) {
      close()
    }

    isOpen = true

    // 創建容器
    container = document.createElement('div')
    document.body.appendChild(container)

    // 創建 VNode
    const dialogComponent = createDialogComponent(dialogOptions)

    // 渲染到容器
    render(dialogComponent, container)

    // 顯示對話框 - 使用 nextTick 確保 DOM 更新完成
    nextTick(() => {
      const dialogElement = container?.querySelector('dialog') as HTMLDialogElement

      if (dialogElement) {
        dialogElement.style.display = 'block'
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
    isOpen = false
  }

  return {
    open,
    close,
    isOpen: () => isOpen,
  }
}
