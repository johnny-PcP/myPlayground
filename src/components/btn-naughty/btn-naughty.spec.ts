import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

import BtnNaughty from './btn-naughty.vue'

// 測試按鈕的 label 是否正確設定
it('應該正確設定按鈕的 label', async () => {
  const wrapper = mount(BtnNaughty)

  const label = 'label測試！！'

  // 確保初始狀態下按鈕的文字不等於測試的 label
  expect(wrapper.text()).not.toBe(label)

  // 設定 label 後，檢查按鈕的文字是否正確更新
  await wrapper.setProps({ label })
  expect(wrapper.text()).toBe(label)
})

// 測試 zIndex 屬性是否正確應用
it('應該正確設定 zIndex', async () => {
  const zIndex = 9999
  const wrapper = mount(BtnNaughty, {
    props: { zIndex },
  })

  const carrierEl = wrapper.find('.carrier').element

  // 確保 carrierEl 是 HTMLElement，
  if (!(carrierEl instanceof HTMLElement)) {
    throw new TypeError('carrierEl 不是 HTMLElement')
  }
  // 檢查 zIndex 是否正確應用
  expect(carrierEl.style.zIndex).toBe(zIndex.toString())
})

// 測試 maxDistanceMultiple 屬性是否正確影響按鈕行為
it('應該正確設定 maxDistanceMultiple', async () => {
  const wrapper = mount(BtnNaughty, {
    props: { maxDistanceMultiple: 1 },
  })

  // 觸發兩次點擊，檢查按鈕是否返回原點
  await wrapper.find('button').trigger('click')
  await wrapper.find('button').trigger('click')

  expect(wrapper.vm.offset.x).toBe(0)
  expect(wrapper.vm.offset.y).toBe(0)
})

// 測試 disabled 屬性是否正確影響按鈕行為
it('當按鈕被 disabled 時，應該觸發 run 事件並移動', async () => {
  const wrapper = mount(BtnNaughty)

  // 未 disabled 時，應該觸發 click 事件，且按鈕不會移動
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('click')
  expect(wrapper.vm.offset.x).toBe(0)
  expect(wrapper.vm.offset.y).toBe(0)

  // 設定 disabled 後，應該觸發 run 事件，且按鈕會移動
  await wrapper.setProps({ disabled: true })
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('run')
  expect(wrapper.vm.offset.x).not.toBe(0)
  expect(wrapper.vm.offset.y).not.toBe(0)
})

// 測試 default slot 是否正確渲染按鈕內容
it('應該正確渲染 default slot 的按鈕內容', async () => {
  const wrapper = mount(BtnNaughty, {
    slots: {
      default: '<span class="btn">按我</span>',
    },
  })

  // 預設的 button 不應該存在
  expect(wrapper.find('button').exists()).toBe(false)

  // 檢查 slot 的內容是否正確渲染
  const target = wrapper.find('span')
  expect(target.exists()).toBe(true)
  expect(target.classes()).toContain('btn')
})

// 測試 rubbing slot 是否正確渲染拓印內容
it('應該正確渲染 rubbing slot 的拓印內容', async () => {
  const wrapper = mount(BtnNaughty, {
    slots: {
      rubbing: '<span class="rubbing">拓印</span>',
    },
  })

  // 預設的 button 應該存在
  expect(wrapper.find('button').exists()).toBe(true)

  // 檢查 slot 的內容是否正確渲染
  const target = wrapper.find('span')
  expect(target.exists()).toBe(true)
  expect(target.classes()).toContain('rubbing')
})
