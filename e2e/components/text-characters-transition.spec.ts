// 引入 Playwright 測試所需的函式
import { expect, test } from '@playwright/test'

// 在每個測試之前執行的設定
test.beforeEach(async ({ page }) => {
  // 前往指定的測試頁面 URL
  await page.goto('http://localhost:5173/learning/text-characters-transition/')
})

// 測試頁面是否正確載入（檢查標題不包含 404）
test('頁面必須存在（title 不可出現 404）', async ({ page }) => {
  // 獲取頁面標題
  const title = await page.title()
  // 確保頁面標題不包含 404 字樣
  expect(title).not.toContain('404')
})

// 定義基本用法測試的描述區塊
test.describe('基本用法', () => {
  // 測試是否包含「基本用法」的 h3 標題
  test('必須有文字為「基本用法」的 h3', async ({ page }) => {
    // 尋找所有 h3 元素
    const h3Els = page.locator('h3')
    // 從中找出文字為「基本用法」的元素
    const target = h3Els.getByText('基本用法')
    // 確認該元素可見
    await expect(target).toBeVisible()
  })

  // 測試是否包含一個 checkbox
  test('必須包含一個 checkbox', async ({ page }) => {
    // 尋找 title 為 'basic-usage' 的區塊
    const section = page.getByTitle('basic-usage')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 在該區塊中尋找 checkbox 角色的元素
    const checkbox = section.getByRole('checkbox')
    // 確認該 checkbox 可見
    await expect(checkbox).toBeVisible()
  })

  // 測試是否包含兩段文字
  test('必須包含兩段文字', async ({ page }) => {
    // 尋找 title 為 'basic-usage' 的區塊
    const section = page.getByTitle('basic-usage')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 尋找區塊中的 p 元素（段落）
    const paragraphs = section.locator('p')
    // 確認有兩個段落
    await expect(paragraphs).toHaveCount(2)
  })

  // 測試切換 checkbox 後文字過場效果
  test('切換 checkbox 會讓文字開始過場', async ({ page }) => {
    // 尋找 title 為 'basic-usage' 的區塊
    const section = page.getByTitle('basic-usage')
    // 確認區塊可見
    await expect(section).toBeVisible()

    /** 所有的 p 內的 span 的 opacity 都該為 0 */
    // 尋找所有段落中的 span 元素
    const spans = section.locator('p span')

    // 獲取所有 span 元素的計算樣式
    let spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都是 0
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('0')
    })

    /** 切換 checkbox */
    // 尋找 checkbox 元素
    const checkbox = section.getByRole('checkbox')
    // 勾選 checkbox
    await checkbox.check()
    // 等待 2 秒讓過場效果完成
    await page.waitForTimeout(2000)

    /** 現在應該要變為 1 */
    // 再次獲取所有 span 元素的計算樣式
    spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都變為 1
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('1')
    })
  })
}) // 結束「基本用法」測試描述區塊

// 定義切分文字測試的描述區塊
test.describe('切分文字', () => {
  // 測試是否包含「切分文字」的 h3 標題
  test('必須有文字為「切分文字」的 h3', async ({ page }) => {
    // 尋找所有 h3 元素
    const h3Els = page.locator('h3')
    // 從中找出文字為「切分文字」的元素
    const target = h3Els.getByText('切分文字')
    // 確認該元素可見
    await expect(target).toBeVisible()
  })

  // 測試是否包含一個 checkbox
  test('必須包含一個 checkbox', async ({ page }) => {
    // 尋找 title 為 'custom-splitter' 的區塊
    const section = page.getByTitle('custom-splitter')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 在該區塊中尋找 checkbox 角色的元素
    const checkbox = section.getByRole('checkbox')
    // 確認該 checkbox 可見
    await expect(checkbox).toBeVisible()
  })

  // 測試第一段和第二段文字包含特定數量的 span 元素
  test('第一段文字有 5 個 span，第二段文字有 6 個 span', async ({ page }) => {
    // 尋找 title 為 'custom-splitter' 的區塊
    const section = page.getByTitle('custom-splitter')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 獲取第一個段落
    const firstP = section.locator('p').first()
    // 獲取第二個段落
    const secondP = section.locator('p').nth(1)

    // 獲取第一段中的所有 span 元素
    const firstSpans = firstP.locator('span')
    // 獲取第二段中的所有 span 元素
    const secondSpans = secondP.locator('span')

    // 確認第一段有 5 個 span
    await expect(firstSpans).toHaveCount(5)
    // 確認第二段有 6 個 span
    await expect(secondSpans).toHaveCount(6)
  })
}) // 結束「切分文字」測試描述區塊

// 定義轉場類型測試的描述區塊
test.describe('轉場類型', () => {
  // 測試是否包含「轉場類型」的 h3 標題
  test('必須有文字為「轉場類型」的 h3', async ({ page }) => {
    // 尋找所有 h3 元素
    const h3Els = page.locator('h3')
    // 從中找出文字為「轉場類型」的元素
    const target = h3Els.getByText('轉場類型')
    // 確認該元素可見
    await expect(target).toBeVisible()
  })

  // 測試是否包含 2 個 clickable-box
  test('必須包含 2 個 clickable-box', async ({ page }) => {
    // 尋找 title 為 'transition-type' 的區塊
    const section = page.getByTitle('transition-type')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 尋找區塊中的 .clickable-box 元素
    const list = section.locator('.clickable-box')
    // 確認有 2 個 clickable-box
    await expect(list).toHaveCount(2)
  })

  // 測試 blur 過場效果
  test('測試 blur 過場', async ({ page }) => {
    // 尋找 title 為 'transition-type' 的區塊
    const section = page.getByTitle('transition-type')
    // 確認區塊可見
    await expect(section).toBeVisible()

    /** 取得包含 blur 文字的 .clickable-box */
    // 尋找包含 blur 文字的點擊框
    const box = page.locator('.clickable-box:has-text("blur")')

    /**  一開始所有的 p 內的 span 的 opacity 都該為 0 */
    // 尋找點擊框內所有段落中的 span 元素
    const spans = box.locator('p span')

    // 獲取所有 span 元素的計算樣式
    let spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都是 0
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('0')
    })

    // 點擊該元素
    await box.click()
    // 等待 2 秒讓過場效果完成
    await page.waitForTimeout(2000)

    /** 現在應該要變為 1 */
    // 再次獲取所有 span 元素的計算樣式
    spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都變為 1
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('1')
    })
  }) // 結束 blur 過場測試

  // 測試 clip-right 過場效果
  test('測試 clip-right 過場', async ({ page }) => {
    // 尋找 title 為 'transition-type' 的區塊
    const section = page.getByTitle('transition-type')
    // 確認區塊可見
    await expect(section).toBeVisible()

    /** 取得包含 clip-right 文字的 .clickable-box */
    // 尋找包含 clip-right 文字的點擊框
    const box = page.locator('.clickable-box:has-text("clip-right")')

    /** 所有的 span 的 clipPath 都該為 polygon(100% 0px, 100% 0px, 100% 100%, 100% 100%) */
    // 尋找點擊框內所有段落中的 span 元素
    const spans = box.locator('p span')

    // 獲取所有 span 元素的計算樣式
    let spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的 clipPath 都是預期的初始值
    spanStyles.forEach((style) => {
      expect(style.clipPath).toBe('polygon(100% 0px, 100% 0px, 100% 100%, 100% 100%)')
    })

    // 點擊該元素
    await box.click()
    // 等待 2 秒讓過場效果完成
    await page.waitForTimeout(2000)

    /** 現在應該要變為 polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%) */
    // 再次獲取所有 span 元素的計算樣式
    spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的 clipPath 都變為預期的結束值
    spanStyles.forEach((style) => {
      expect(style.clipPath).toBe('polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%)')
    })
  }) // 結束 clip-right 過場測試
}) // 結束「轉場類型」測試描述區塊

// 定義自定義轉場測試的描述區塊
test.describe('自定義轉場', () => {
  // 測試是否包含「自定義轉場」的 h3 標題
  test('必須有文字為「自定義轉場」的 h3', async ({ page }) => {
    // 尋找所有 h3 元素
    const h3Els = page.locator('h3')
    // 從中找出文字為「自定義轉場」的元素
    const target = h3Els.getByText('自定義轉場')
    // 確認該元素可見
    await expect(target).toBeVisible()
  })

  // 測試確認所有轉場效果
  test('確認所有轉場', async ({ page }) => {
    // 尋找 title 為 'custom-transition' 的區塊
    const section = page.getByTitle('custom-transition')
    // 確認區塊可見
    await expect(section).toBeVisible()

    // 獲取所有 .clickable-box 元素
    const boxes = await page.locator('.clickable-box').all()

    /** 所有的 p 內的 span 的 opacity 都該為 0 */
    // 尋找區塊中所有段落的 span 元素
    const spans = section.locator('p span')

    // 獲取所有 span 元素的計算樣式
    let spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都是 0
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('0')
    })

    /** 切換 */
    // 依次點擊每個 clickable-box
    for (const box of boxes) {
      await box.click()
    }
    // 等待 3 秒讓所有過場效果完成
    await page.waitForTimeout(3000)

    /** 現在應該要變為 1 */
    // 再次獲取所有 span 元素的計算樣式
    spanStyles = await spans.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el)),
    )
    // 確認每個 span 的透明度都變為 1
    spanStyles.forEach((style) => {
      expect(style.opacity).toBe('1')
    })
  }) // 結束確認所有轉場測試
}) // 結束「自定義轉場」測試描述區塊
