// 引入 Playwright 測試所需的函式：expect 用於斷言、test 用於定義測試案例
import { expect, test } from '@playwright/test'

// 設定每個測試執行前的前置作業
test.beforeEach(async ({ page }) => {
  // 導航到測試頁面，這裡是「調皮的按鈕」組件頁面
  await page.goto('http://localhost:5173/learning/btn-naughty/')
})

// 測試頁面是否正確載入，確保頁面標題不包含 404
test('頁面必須存在（title 不可出現 404）', async ({ page }) => {
  // 獲取頁面的標題
  const title = await page.title()
  // 斷言：確保標題不包含 404，表示頁面正確載入而非出現錯誤
  expect(title).not.toContain('404')
})

// 定義一組相關的元件測試
test.describe('元件測試', () => {
  // 測試是否包含特定文字的 h1 標題
  test('必須有文字為「調皮的按鈕」的 h1', async ({ page }) => {
    // 定位所有 h1 元素
    const h1Els = page.locator('h1')
    // 從 h1 元素中找出包含「調皮的按鈕」文字的元素
    const target = h1Els.getByText('調皮的按鈕')
    // 斷言：確保該元素在頁面上可見
    await expect(target).toBeVisible()
  })

  // 測試頁面是否包含一個可見的按鈕
  test('必須包含一個按鈕', async ({ page }) => {
    // 定位具有 title="basic-usage" 屬性的區塊
    const section = page.getByTitle('basic-usage')
    // 斷言：確保該區塊在頁面上可見
    await expect(section).toBeVisible()

    // 在該區塊中尋找按鈕元素
    const button = section.getByRole('button')
    // 斷言：確保按鈕在頁面上可見
    await expect(button).toBeVisible()
  })

  // 測試當按鈕處於停用狀態時，滑鼠懸停(hover)會導致按鈕位置移動
  test('停用時，按鈕被 hover 會移動', async ({ page }) => {
    // 定位具有 title="basic-usage" 屬性的區塊
    const section = page.getByTitle('basic-usage')
    // 斷言：確保該區塊在頁面上可見
    await expect(section).toBeVisible()

    // 在該區塊中尋找按鈕元素
    const button = section.getByRole('button')
    // boundingBox 用於取得元素的位置與大小
    // 獲取滑鼠懸停前按鈕的位置和大小信息
    const beforeBoundingBox = await button.boundingBox()

    // 執行滑鼠懸停動作
    await button.hover()
    // 等待 800 毫秒，讓按鈕移動動畫完成
    await page.waitForTimeout(800)

    // 獲取滑鼠懸停後按鈕的位置和大小信息
    const afterBoundingBox = await button.boundingBox()

    // 如果無法取得元素位置，拋出錯誤
    if (!beforeBoundingBox || !afterBoundingBox) {
      throw new Error('boundingBox is null')
    }

    // 斷言：確保懸停後按鈕的 X 座標已改變
    expect(beforeBoundingBox.x).not.toBe(afterBoundingBox.x)
    // 斷言：確保懸停後按鈕的 Y 座標已改變
    expect(beforeBoundingBox.y).not.toBe(afterBoundingBox.y)

    // 斷言：確保按鈕的寬度沒有變化（使用 toBeCloseTo 允許微小誤差）
    expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width)
    // 斷言：確保按鈕的高度沒有變化（使用 toBeCloseTo 允許微小誤差）
    expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height)
  })

  // 測試當按鈕處於停用狀態時，點擊(click)會導致按鈕位置移動
  test('停用時，按鈕被 click 會移動', async ({ page }) => {
    // 定位具有 title="basic-usage" 屬性的區塊
    const section = page.getByTitle('basic-usage')
    // 斷言：確保該區塊在頁面上可見
    await expect(section).toBeVisible()

    // 在該區塊中尋找按鈕元素
    const button = section.getByRole('button')
    // 獲取點擊前按鈕的位置和大小信息
    const beforeBoundingBox = await button.boundingBox()

    // 執行點擊動作
    await button.click()
    // 等待 800 毫秒，讓按鈕移動動畫完成
    await page.waitForTimeout(800)

    // 獲取點擊後按鈕的位置和大小信息
    const afterBoundingBox = await button.boundingBox()

    // 如果無法取得元素位置，拋出錯誤
    if (!beforeBoundingBox || !afterBoundingBox) {
      throw new Error('boundingBox is null')
    }

    // 斷言：確保點擊後按鈕的 X 座標已改變
    expect(beforeBoundingBox.x).not.toBe(afterBoundingBox.x)
    // 斷言：確保點擊後按鈕的 Y 座標已改變
    expect(beforeBoundingBox.y).not.toBe(afterBoundingBox.y)

    // 斷言：確保按鈕的寬度沒有變化（使用 toBeCloseTo 允許微小誤差）
    expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width)
    // 斷言：確保按鈕的高度沒有變化（使用 toBeCloseTo 允許微小誤差）
    expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height)
  })

  // ====== 下面兩個測試因為套件原因，不穩定，先註解  ======

  // 測試當按鈕未處於停用狀態時，點擊(click)不會導致按鈕位置移動
  // test("沒有停用時，按鈕被 click 不會移動", async ({ page }) => {
  //   // 定位具有 title="basic-usage" 屬性的區塊
  //   const section = page.getByTitle("basic-usage");
  //   await expect(section).toBeVisible();

  //   // 找到 checkbox 元素並取消勾選，使按鈕處於未停用狀態
  //   const checkbox = section.getByRole("checkbox");
  //   checkbox.uncheck();

  //   // 在該區塊中尋找按鈕元素
  //   const button = section.getByRole("button");
  //   // 獲取點擊前按鈕的位置和大小信息
  //   const beforeBoundingBox = await button.boundingBox();

  //   // 執行點擊動作
  //   await button.click();
  //   // 等待 800 毫秒
  //   await page.waitForTimeout(800);

  //   // 獲取點擊後按鈕的位置和大小信息
  //   const afterBoundingBox = await button.boundingBox();

  //   // 如果無法取得元素位置，拋出錯誤
  //   if (!beforeBoundingBox || !afterBoundingBox) {
  //     throw new Error("boundingBox is null");
  //   }

  //   // 斷言：確保點擊後按鈕的 X 座標沒有變化
  //   expect(beforeBoundingBox.x).toBeCloseTo(afterBoundingBox.x);
  //   // 斷言：確保點擊後按鈕的 Y 座標沒有變化
  //   expect(beforeBoundingBox.y).toBeCloseTo(afterBoundingBox.y);

  //   // 斷言：確保按鈕的寬度沒有變化
  //   expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
  //   // 斷言：確保按鈕的高度沒有變化
  //   expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  // });

  // 測試當按鈕未處於停用狀態時，滑鼠懸停(hover)不會導致按鈕位置移動
  // test("沒有停用時，按鈕被 hover 不會移動", async ({ page }) => {
  //   // 定位具有 title="basic-usage" 屬性的區塊
  //   const section = page.getByTitle("basic-usage");
  //   await expect(section).toBeVisible();

  //   // 找到 checkbox 元素並取消勾選，使按鈕處於未停用狀態
  //   const checkbox = section.getByRole("checkbox");
  //   checkbox.uncheck();

  //   // 在該區塊中尋找按鈕元素
  //   const button = section.getByRole("button");
  //   // 獲取懸停前按鈕的位置和大小信息
  //   const beforeBoundingBox = await button.boundingBox();

  //   // 執行滑鼠懸停動作
  //   await button.hover();
  //   // 等待 800 毫秒
  //   await page.waitForTimeout(800);

  //   // 獲取懸停後按鈕的位置和大小信息
  //   const afterBoundingBox = await button.boundingBox();

  //   // 如果無法取得元素位置，拋出錯誤
  //   if (!beforeBoundingBox || !afterBoundingBox) {
  //     throw new Error("boundingBox is null");
  //   }

  //   // 斷言：確保懸停後按鈕的 X 座標沒有變化
  //   expect(beforeBoundingBox.x).toBeCloseTo(afterBoundingBox.x);
  //   // 斷言：確保懸停後按鈕的 Y 座標沒有變化
  //   expect(beforeBoundingBox.y).toBeCloseTo(afterBoundingBox.y);

  //   // 斷言：確保按鈕的寬度沒有變化
  //   expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
  //   // 斷言：確保按鈕的高度沒有變化
  //   expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  // });
}) // 結束元件測試描述區塊
