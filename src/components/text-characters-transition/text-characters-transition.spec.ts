// 引入 Vue Test Utils 的 mount 方法用於掛載組件
import { mount } from '@vue/test-utils'
// 引入 Vitest 的測試函數
import { describe, expect, it } from 'vitest'

// 引入要測試的組件
import TextCharactersTransition from './text-characters-transition.vue'

// 基本測試案例，確認組件能夠被掛載
it('測試案例', () => {
  // 掛載組件
  const wrapper = mount(TextCharactersTransition)
  // 驗證組件已被定義
  expect(wrapper).toBeDefined()
})

// 測試容器可以指定不同的 HTML 標籤
it('容器可以指定 HTML tag', () => {
  // 定義要使用的標籤
  const tag = 'span'

  // 掛載組件並傳入 props
  const wrapper = mount(TextCharactersTransition, {
    props: {
      label: '文字',
      tag,
    },
  })

  // 查找有 aria-label 屬性的元素
  const container = wrapper.find('[aria-label]')
  // 驗證元素的標籤名稱是否為 SPAN
  expect(container.element.tagName).toBe('SPAN')
})

// 測試 aria-label 與 label 屬性的關係
describe('容器之 aria-label 必須等於 label', () => {
  // 測試 label 為字串的情況
  it('label 為 string', () => {
    // 定義標籤文字
    const label = '文字'

    // 掛載組件並傳入 props
    const wrapper = mount(TextCharactersTransition, {
      props: { label },
    })

    // 查找有 aria-label 屬性的元素
    const container = wrapper.find('[aria-label]')
    // 驗證元素的標籤名稱是否為 P (段落)
    expect(container.element.tagName).toBe('P')
    // 驗證 aria-label 屬性值是否與 label 相同
    expect(container.attributes('aria-label')).toBe(label)
  })

  // 測試 label 為字串陣列的情況
  it('label 為 string[]', () => {
    // 定義標籤文字陣列
    const label = ['文字文字文字', '文字文字文字']

    // 掛載組件並傳入 props
    const wrapper = mount(TextCharactersTransition, {
      props: { label },
    })

    // 查找有 aria-label 屬性的元素
    const container = wrapper.find('[aria-label]')
    // 驗證 aria-label 屬性值是否與 label 陣列連接後的結果相同
    expect(container.attributes('aria-label')).toBe(label.join(''))

    // 查找所有 span 元素
    const list = wrapper.findAll('span')
    // 驗證 span 元素數量是否與 label 陣列長度相同
    expect(list).toHaveLength(label.length)
  })
})

// 測試拆分的 span 元素數量是否與 label 字數相同
it('被拆分的 span 數量必須等於 label 字數', () => {
  // 定義標籤文字
  const label = '文字文字文字文字文字'

  // 掛載組件並傳入 props
  const wrapper = mount(TextCharactersTransition, {
    props: { label },
  })

  // 查找所有 span 元素
  const list = wrapper.findAll('span')
  // 驗證 span 元素數量是否與 label 字數相同
  expect(list).toHaveLength(label.length)
})

// 測試 splitter 功能
describe('splitter 指定拆分方式', () => {
  // 測試根據標點符號「，」拆分
  it('根據「，」拆分', () => {
    // 定義拆分正則表達式
    const splitter = /(，)/

    // 定義含有逗號的標籤文字
    const label = '文字文字，文字文字，文字'

    // 掛載組件並傳入 props
    const wrapper = mount(TextCharactersTransition, {
      props: { label, splitter },
    })

    // 查找所有 span 元素
    const list = wrapper.findAll('span')
    // 驗證 span 元素數量是否與拆分後的數組長度相同
    expect(list).toHaveLength(
      label.split(splitter).length,
    )
  })

  // 測試自定義拆分函數
  it('自定義拆分 function', async () => {
    // 定義標籤文字
    const label = '文字文字文字文字文字'

    // 定義自定義拆分函數
    const splitter = (text: string) => {
      // 如果包含「鱈魚」則按「鱈魚」拆分
      if (text.includes('鱈魚')) {
        return text.split('鱈魚')
      }

      // 否則按字符拆分
      return text.split('')
    }

    // 掛載組件並傳入 props
    const wrapper = mount(TextCharactersTransition, {
      props: { label, splitter },
    })

    // 查找所有 span 元素
    const list = wrapper.findAll('span')
    // 驗證 span 元素數量是否與 label 字數相同
    expect(list).toHaveLength(label.length)

    // 更新 props 中的 label 屬性
    const newLabel = '文字文字鱈魚文字文字'
    await wrapper.setProps({ label: newLabel })

    // 查找所有 span 元素
    const newList = wrapper.findAll('span')
    // 驗證 span 元素數量是否與拆分後的數組長度相同
    expect(newList).toHaveLength(
      splitter(newLabel).length,
    )
  })
})

// 測試 visible 屬性和相關事件
it('切換 visible 會觸發對應事件', async () => {
  // 掛載組件並設置初始 props
  const wrapper = mount(TextCharactersTransition, {
    props: {
      visible: false,
      label: '文字文字',
    },
  })

  // 驗證初始狀態下沒有觸發事件
  expect(wrapper.emitted()).not.toHaveProperty('beforeEnter')
  expect(wrapper.emitted()).not.toHaveProperty('afterEnter')

  // 更新 visible 屬性為 true
  await wrapper.setProps({ visible: true })
  // 等待過渡完成
  await promiseTimeout(2000)

  // 驗證事件已被觸發
  expect(wrapper.emitted()).toHaveProperty('beforeEnter')
  expect(wrapper.emitted()).toHaveProperty('afterEnter')
})

// 定義一個等待指定毫秒數的 Promise 函數
function promiseTimeout(ms: number): Promise<void> {
  // 返回一個在指定時間後解析的 Promise
  return new Promise((resolve) => setTimeout(resolve, ms))
}
