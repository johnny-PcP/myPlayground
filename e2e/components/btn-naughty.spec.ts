import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/learning/btn-naughty/");
});

test("頁面必須存在（title 不可出現 404）", async ({ page }) => {
  const title = await page.title();
  expect(title).not.toContain("404");
});

test.describe("元件測試", () => {
  test("必須有文字為「調皮的按鈕」的 h1", async ({ page }) => {
    const h1Els = page.locator("h1");
    const target = h1Els.getByText("調皮的按鈕");
    await expect(target).toBeVisible();
  });

  test("必須包含一個按鈕", async ({ page }) => {
    const section = page.getByTitle("basic-usage");
    await expect(section).toBeVisible();

    const button = section.getByRole("button");
    await expect(button).toBeVisible();
  });

  test("停用時，按鈕被 hover 會移動", async ({ page }) => {
    const section = page.getByTitle("basic-usage");
    await expect(section).toBeVisible();

    const button = section.getByRole("button");
    // boundingBox 用於取得元素的位置與大小
    const beforeBoundingBox = await button.boundingBox();

    await button.hover();
    await page.waitForTimeout(800);

    const afterBoundingBox = await button.boundingBox();

    if (!beforeBoundingBox || !afterBoundingBox) {
      throw new Error("boundingBox is null");
    }

    expect(beforeBoundingBox.x).not.toBe(afterBoundingBox.x);
    expect(beforeBoundingBox.y).not.toBe(afterBoundingBox.y);

    expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
    expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  });

  test("停用時，按鈕被 click 會移動", async ({ page }) => {
    const section = page.getByTitle("basic-usage");
    await expect(section).toBeVisible();

    const button = section.getByRole("button");
    const beforeBoundingBox = await button.boundingBox();

    await button.click();
    await page.waitForTimeout(800);

    const afterBoundingBox = await button.boundingBox();

    if (!beforeBoundingBox || !afterBoundingBox) {
      throw new Error("boundingBox is null");
    }

    expect(beforeBoundingBox.x).not.toBe(afterBoundingBox.x);
    expect(beforeBoundingBox.y).not.toBe(afterBoundingBox.y);

    expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
    expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  });

  // ====== 下面兩個測試因為套件原因，不穩定，先註解  ======

  // test("沒有停用時，按鈕被 click 不會移動", async ({ page }) => {
  //   const section = page.getByTitle("basic-usage");
  //   await expect(section).toBeVisible();

  //   const checkbox = section.getByRole("checkbox");
  //   checkbox.uncheck();

  //   const button = section.getByRole("button");
  //   const beforeBoundingBox = await button.boundingBox();

  //   await button.click();
  //   await page.waitForTimeout(800);

  //   const afterBoundingBox = await button.boundingBox();

  //   if (!beforeBoundingBox || !afterBoundingBox) {
  //     throw new Error("boundingBox is null");
  //   }

  //   expect(beforeBoundingBox.x).toBeCloseTo(afterBoundingBox.x);
  //   expect(beforeBoundingBox.y).toBeCloseTo(afterBoundingBox.y);

  //   expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
  //   expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  // });

  // test("沒有停用時，按鈕被 hover 不會移動", async ({ page }) => {
  //   const section = page.getByTitle("basic-usage");
  //   await expect(section).toBeVisible();

  //   const checkbox = section.getByRole("checkbox");
  //   checkbox.uncheck();

  //   const button = section.getByRole("button");
  //   const beforeBoundingBox = await button.boundingBox();

  //   await button.hover();
  //   await page.waitForTimeout(800);

  //   const afterBoundingBox = await button.boundingBox();

  //   if (!beforeBoundingBox || !afterBoundingBox) {
  //     throw new Error("boundingBox is null");
  //   }

  //   expect(beforeBoundingBox.x).toBeCloseTo(afterBoundingBox.x);
  //   expect(beforeBoundingBox.y).toBeCloseTo(afterBoundingBox.y);

  //   expect(beforeBoundingBox.width).toBeCloseTo(afterBoundingBox.width);
  //   expect(beforeBoundingBox.height).toBeCloseTo(afterBoundingBox.height);
  // });
});
