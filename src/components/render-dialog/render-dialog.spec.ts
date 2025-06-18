import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import RenderDialog from './render-dialog.vue'
import { useDialog } from './useRenderDialog'

// 測試對話框組件的基本渲染和按鈕配置
it('應該正確渲染對話框的基本內容和按鈕', async () => {
  // 測試有取消按鈕的配置
  const dialogOptionWithCancel = {
    title: '測試標題',
    content: ['測試內容第一行', '測試內容第二行'],
    confirm: { btnName: '確認' },
    cancel: { btnName: '取消' },
  }

  const wrapperWithCancel = mount(RenderDialog, {
    props: { dialogOption: dialogOptionWithCancel },
  })

  // 檢查標題和內容
  expect(wrapperWithCancel.find('.dialog-title').text()).toBe('測試標題')
  const contentItems = wrapperWithCancel.findAll('.dialog-content > div')
  expect(contentItems).toHaveLength(2)
  expect(contentItems[0].text()).toBe('測試內容第一行')
  expect(contentItems[1].text()).toBe('測試內容第二行')

  // 檢查按鈕
  expect(wrapperWithCancel.find('.btn-confirm').exists()).toBe(true)
  expect(wrapperWithCancel.find('.btn-confirm').text()).toBe('確認')
  expect(wrapperWithCancel.find('.btn-cancel').exists()).toBe(true)
  expect(wrapperWithCancel.find('.btn-cancel').text()).toBe('取消')

  // 測試沒有取消按鈕的配置
  const dialogOptionWithoutCancel = {
    title: '測試標題',
    content: ['測試內容'],
    confirm: { btnName: '確認' },
  }

  const wrapperWithoutCancel = mount(RenderDialog, {
    props: { dialogOption: dialogOptionWithoutCancel },
  })

  expect(wrapperWithoutCancel.find('.btn-cancel').exists()).toBe(false)
})

// 測試按鈕事件和佈局樣式
it('應該正確觸發事件和設定按鈕佈局', async () => {
  const dialogWithCancel = {
    title: '測試標題',
    content: ['測試內容'],
    confirm: { btnName: '確認' },
    cancel: { btnName: '取消' },
  }

  const wrapperWithCancel = mount(RenderDialog, {
    props: { dialogOption: dialogWithCancel },
  })

  // 測試事件觸發
  await wrapperWithCancel.find('.btn-confirm').trigger('click')
  expect(wrapperWithCancel.emitted()).toHaveProperty('confirm')

  await wrapperWithCancel.find('.btn-cancel').trigger('click')
  expect(wrapperWithCancel.emitted()).toHaveProperty('cancel')

  // 測試有取消按鈕時的佈局
  expect(wrapperWithCancel.find('.dialog-buttons').classes()).toContain('buttons-around')
  expect(wrapperWithCancel.find('.btn-confirm').classes()).toContain('btn-narrow')

  // 測試沒有取消按鈕時的佈局
  const dialogWithoutCancel = {
    title: '測試標題',
    content: ['測試內容'],
    confirm: { btnName: '確認' },
  }

  const wrapperWithoutCancel = mount(RenderDialog, {
    props: { dialogOption: dialogWithoutCancel },
  })

  expect(wrapperWithoutCancel.find('.dialog-buttons').classes()).toContain('buttons-center')
  expect(wrapperWithoutCancel.find('.btn-confirm').classes()).toContain('btn-wide')
})

// 測試背景遮罩和內容樣式
it('應該正確設定背景遮罩和內容樣式', async () => {
  // 測試背景遮罩配置
  const dialogOptionWithBackdrop = {
    title: '測試標題',
    content: ['內容1', '內容2', '內容3', '內容4', '內容5', '內容6'], // 長內容
    confirm: { btnName: '確認' },
    backdrop: {
      color: 'rgba(255, 0, 0, 0.5)',
      blur: '10px',
      closeOnClick: true,
    },
  }

  const wrapperWithBackdrop = mount(RenderDialog, {
    props: { dialogOption: dialogOptionWithBackdrop },
  })

  const backdrop = wrapperWithBackdrop.find('.dialog-backdrop')
  expect(backdrop.exists()).toBe(true)

  // 檢查背景樣式
  const backdropEl = backdrop.element as HTMLElement
  expect(backdropEl.style.backgroundColor).toBe('rgba(255, 0, 0, 0.5)')
  expect(backdropEl.style.backdropFilter).toBe('blur(10px)')

  // 檢查長內容的樣式類別
  expect(wrapperWithBackdrop.find('.dialog-content').classes()).toContain('content-start')

  // 測試背景點擊事件
  await backdrop.trigger('click')
  expect(wrapperWithBackdrop.emitted()).toHaveProperty('cancel')

  // 測試無背景遮罩配置
  const dialogOptionWithoutBackdrop = {
    title: '測試標題',
    content: ['短內容'],
    confirm: { btnName: '確認' },
    backdrop: false,
  }

  const wrapperWithoutBackdrop = mount(RenderDialog, {
    props: { dialogOption: dialogOptionWithoutBackdrop },
  })

  // 檢查背景遮罩不存在
  expect(wrapperWithoutBackdrop.find('.dialog-backdrop').exists()).toBe(false)
  // 檢查短內容的樣式類別
  expect(wrapperWithoutBackdrop.find('.dialog-content').classes()).toContain('content-center')
})

// 測試 useDialog composable 函式
it('useDialog 應該正確管理對話框狀態', async () => {
  const dialog = useDialog()

  // 初始狀態
  expect(dialog.isOpen()).toBe(false)

  // 模擬開啟對話框
  const dialogOption = {
    title: '測試標題',
    content: ['測試內容'],
    confirm: {
      btnName: '確認',
      onComplete: vi.fn(),
    },
  }

  dialog.open(dialogOption)
  await nextTick()

  // 檢查是否創建了 DOM 元素
  const dialogElement = document.querySelector('dialog')
  expect(dialogElement).toBeTruthy()

  // 關閉對話框
  dialog.close()
  await nextTick()

  // 檢查 DOM 元素是否被清理
  const dialogElementAfterClose = document.querySelector('dialog')
  expect(dialogElementAfterClose).toBeFalsy()
})

// 測試多次開啟對話框時的行為
it('當嘗試開啟新對話框時，應該自動關閉現有對話框', async () => {
  const dialog = useDialog()

  const firstDialogOption = {
    title: '第一個對話框',
    content: ['第一個內容'],
    confirm: { btnName: '確認' },
  }

  const secondDialogOption = {
    title: '第二個對話框',
    content: ['第二個內容'],
    confirm: { btnName: '確認' },
  }

  // 開啟第一個對話框
  dialog.open(firstDialogOption)
  await nextTick()

  // 檢查第一個對話框是否存在
  let dialogElements = document.querySelectorAll('dialog')
  expect(dialogElements).toHaveLength(1)

  // 開啟第二個對話框
  dialog.open(secondDialogOption)
  await nextTick()

  // 檢查只有一個對話框存在，且為第二個對話框
  dialogElements = document.querySelectorAll('dialog')
  expect(dialogElements).toHaveLength(1)
  expect(document.querySelector('.dialog-title')?.textContent).toBe('第二個對話框')

  // 清理
  dialog.close()
})

// 清理測試環境
beforeEach(() => {
  // 清理任何可能存在的對話框 DOM 元素
  const existingDialogs = document.querySelectorAll('dialog')
  existingDialogs.forEach((dialog) => dialog.remove())

  const existingContainers = document.querySelectorAll('body > div')
  existingContainers.forEach((container) => {
    if (container.querySelector('dialog')) {
      container.remove()
    }
  })
})

afterEach(() => {
  // 測試後清理
  const existingDialogs = document.querySelectorAll('dialog')
  existingDialogs.forEach((dialog) => dialog.remove())

  const existingContainers = document.querySelectorAll('body > div')
  existingContainers.forEach((container) => {
    if (container.querySelector('dialog')) {
      container.remove()
    }
  })
})
