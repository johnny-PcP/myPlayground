import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RenderTips from './render-tips.vue'

describe('renderTips', () => {
  // 測試基本渲染
  it('應該正確渲染空的提示容器', () => {
    const wrapper = mount(RenderTips)

    expect(wrapper.find('.tips-container').exists()).toBe(true)
    expect(wrapper.findAll('.tip-item')).toHaveLength(0)
  })

  // 測試提示項目渲染
  it('應該正確渲染提示項目及樣式', async () => {
    const tips = [
      {
        id: 1,
        content: '測試提示 1',
        textColor: '#333333',
        backgroundColor: '#ffffff',
        borderColor: '#e5e5e5',
      },
      {
        id: 2,
        content: '測試提示 2',
        textColor: '#b91c1c',
        backgroundColor: '#fef2f2',
      },
    ]

    const wrapper = mount(RenderTips, {
      props: { tips },
    })

    const tipItems = wrapper.findAll('.tip-item')
    expect(tipItems).toHaveLength(2)

    // 測試內容和樣式
    expect(tipItems[0].find('p').text()).toBe('測試提示 1')
    expect(tipItems[0].find('p').element.style.color).toBe('#333333')
    expect(tipItems[1].find('p').text()).toBe('測試提示 2')
    expect(tipItems[1].find('p').element.style.color).toBe('#b91c1c')
  })

  // 測試容器樣式
  it('應該正確應用容器樣式', async () => {
    const containerStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
    }

    const wrapper = mount(RenderTips, {
      props: { containerStyle },
    })

    const container = wrapper.find('.tips-container')
    const element = container.element as HTMLElement

    expect(element.style.position).toBe('fixed')
    expect(element.style.top).toBe('20px')
    expect(element.style.right).toBe('20px')
    expect(element.style.zIndex).toBe('99999')
  })

  // 測試關閉按鈕功能
  it('應該在點擊關閉按鈕時觸發 removeTip 事件', async () => {
    const tips = [
      { id: 1, content: '可關閉的提示' },
      { id: 2, content: '另一個提示' },
    ]

    const wrapper = mount(RenderTips, {
      props: { tips },
    })

    const closeButtons = wrapper.findAll('.close-button')
    expect(closeButtons).toHaveLength(2)

    // 點擊第一個關閉按鈕
    await closeButtons[0].trigger('click')

    expect(wrapper.emitted()).toHaveProperty('removeTip')
    expect(wrapper.emitted('removeTip')).toHaveLength(1)
    expect(wrapper.emitted('removeTip')[0]).toEqual([1])

    // 點擊第二個關閉按鈕
    await closeButtons[1].trigger('click')

    expect(wrapper.emitted('removeTip')).toHaveLength(2)
    expect(wrapper.emitted('removeTip')[1]).toEqual([2])
  })

  // 測試預設值
  it('應該使用正確的預設值', async () => {
    const wrapper = mount(RenderTips)

    expect(wrapper.props('tips')).toEqual([])
    expect(wrapper.props('containerStyle')).toEqual({})

    // 測試預設文字顏色
    const tipsWithDefaults = [{ id: 1, content: '預設顏色提示' }]
    await wrapper.setProps({ tips: tipsWithDefaults })

    const paragraph = wrapper.find('p')
    expect(paragraph.element.style.color).toBe('#333333')
  })
})
