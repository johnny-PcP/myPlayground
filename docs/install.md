# 安裝

簡單介紹本站有使用到的套件，並提供安裝指令。

## 測試工具

### 單元測試

使用 [Vitest](https://vitest.dev/) 作為單元測試框架，並搭配 [Vue Test Utils](https://test-utils.vuejs.org/) 來測試 Vue 元件。

:::details 安裝提示

執行以下指令安裝：

```bash
npm install --save-dev @vue/test-utils @vitest/ui
```

安裝後在 `package.json` 中加入：

```json{3,4,5}
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

然後在 `vitest.config.js` 中加入以下設定：

```javascript{6,8,9,10}
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [vue()],
    test: {
      globals: true,
      environment: "happy-dom",
      reporter: ["default"], // 需求可再加入html以產生報告
    },
  };
});
```

:::

### e2e 測試

使用 [Playwright](https://playwright.dev/) 作為 e2e 測試框架來測試 Vue 元件。

:::details 安裝提示

執行以下指令安裝：

```bash
npm init playwright@latest

```

過程的選項

```bash
✔ Do you want to use TypeScript or JavaScript? · TypeScript
✔ Where to put your end-to-end tests? · e2e
✔ Add a GitHub Actions workflow? (y/N) · true
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
```

安裝後在 `package.json` 中加入：

```json{3,4,5}
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

然後在 `playwright.config.ts` 中加入以下設定：
