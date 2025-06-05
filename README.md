# My Playground

## 專案簡介
1. 整合自動化部署流程和程式碼品質檢查機制。
2. 重構看過的文章或做過的功能幫助自己在需要時能快速回憶。

## 部署方式比較

### 1. 手動部署 (`npm run deploy`)

**執行指令：**
```bash
npm run deploy
```

**流程說明：**
- 執行 [`deploy.js`](deploy.js) 腳本

**詳細步驟：**
1. 檢查當前分支（必須在 `dev` 分支）
2. 檢查工作區是否乾淨
3. 執行 `npm run check`（Lint + Build 檢查）
4. 清理 `docs/.vitepress/dist` 檔案
5. 切換到 `main` 分支
6. 合併 `dev` 分支
7. 推送到遠端 `main` 分支
8. 回到 `dev` 分支並同步變更

---

### 2. Husky 智能部署 (`npm run deploy:husky`)

**執行指令：**
```bash
npm run deploy:husky
```
**流程說明：**
- 執行 [`scripts/husky-deploy.sh`](scripts/husky-deploy.sh) 腳本

**詳細步驟：**
1. 檢查當前分支（必須在 `dev` 分支）
2. 檢查工作區是否乾淨
3. 執行快速 Lint 檢查（dev 分支）
4. 切換到 `main` 分支
5. 合併 `dev` 分支
6. 推送到 `main` 分支
   - **觸發 Husky Pre-push Hook**
   - 自動執行完整檢查（Lint + Build）
   - 自動清理 dist 檔案
7. 回到 `dev` 分支並同步變更

**Husky Hook 保護機制：**
- **Pre-commit Hook**: 每次 commit 前執行 Lint 檢查
- **Pre-push Hook**:
  - `main` 分支：完整檢查 + 自動清理
  - `dev` 分支：基本 Lint 檢查

---

### 3. 完全手動 Git 操作

**執行指令：**
```bash
# 切換並合併
git checkout main
git merge dev
git push origin main  # 會觸發 Husky pre-push hook

# 回到開發分支
git checkout dev
git merge main
```

## 相關檔案

- [`package.json`](package.json) - NPM 腳本定義
- [`deploy.js`](deploy.js) - 手動部署腳本
- [`scripts/husky-deploy.sh`](scripts/husky-deploy.sh) - Husky 智能部署腳本
- [`.husky/pre-commit`](.husky/pre-commit) - 提交前 Hook
- [`.husky/pre-push`](.husky/pre-push) - 推送前 Hook
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) - GitHub Actions 部署流程

---

## 部署結果

無論使用哪種方式部署，成功推送到 `main` 分支後：

1. **GitHub Actions** 會自動觸發
2. 執行 Lint 和 Build 檢查
3. 建置 VitePress 靜態網站
4. 部署到 GitHub Pages
5. 網站更新完成

**網站網址：** `https://yourusername.github.io/myPlayground/`

---

## 最佳實踐

1. **日常開發**：在 `dev` 分支進行開發
2. **提交頻繁**：經常提交小的變更，讓 pre-commit hook 發揮作用
3. **定期同步**：定期將 `main` 分支的變更同步回 `dev`
4. **測試優先**：在 `dev` 分支充分測試後再部署到 `main`
5. **緊急修復**：直接在 `main` 分支修復，但要立即同步回 `dev`

---
