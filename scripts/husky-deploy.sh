#!/bin/bash
# =============================================================================
# 智能部署腳本 (整合 Husky)
# =============================================================================
# 此腳本會利用 Husky hooks 來確保程式碼品質，並自動化部署流程
# 適用於從 dev 分支部署到 main 分支的工作流程

# 設定錯誤處理：遇到任何錯誤立即退出腳本
set -e

# 顯示腳本開始訊息
echo "🚀 啟動 Husky 整合智能部署..."

# 獲取當前 Git 分支名稱
# git branch --show-current 會回傳目前所在的分支名稱
current_branch=$(git branch --show-current)

# 檢查是否在正確的分支（dev）執行此腳本
if [ "$current_branch" != "dev" ]; then
    # 如果不在 dev 分支，顯示錯誤訊息並退出
    echo "❌ 請在 'dev' 分支執行此腳本"
    echo "目前分支：$current_branch"
    exit 1
fi

# 檢查工作目錄是否乾淨（沒有未提交的變更）
# git status --porcelain 會列出工作區的變更，如果有內容表示工作區不乾淨
if [ -n "$(git status --porcelain)" ]; then
    # 如果工作區不乾淨，顯示錯誤訊息並列出變更檔案
    echo "❌ 工作目錄不乾淨，請先提交您的變更。"
    git status --short
    exit 1
fi

# 工作區乾淨，可以繼續
echo "✅ 工作目錄乾淨"

# 在 dev 分支執行快速 lint 檢查
# 不執行完整的 build，因為 pre-push hook 會在推送到 main 時處理
echo "🔍 正在對 dev 分支執行快速程式碼檢查..."
npm run lint

# 檢查 lint 是否通過
if [ $? -ne 0 ]; then
    # 如果 lint 失敗，顯示錯誤訊息並退出
    echo "❌ dev 分支程式碼檢查失敗！"
    echo "💡 請修正程式碼風格問題後再部署"
    exit 1
fi

# lint 檢查通過
echo "✅ dev 分支程式碼檢查通過"

# 切換到 main 分支進行部署
echo "🔄 正在切換至 main 分支..."
git checkout main

# 將 dev 分支的變更合併到 main 分支
# --no-edit 參數表示不編輯合併提交訊息，使用預設訊息
echo "🔀 正在將 dev 合併至 main..."
git merge dev --no-edit

# 推送到遠端的 main 分支
# 這裡會自動觸發 Husky 的 pre-push hook 進行完整檢查
echo "📤 正在推送至 main 分支..."
echo "💡 Husky pre-push hook 將自動執行建置驗證"
git push origin main

# 檢查推送是否成功
if [ $? -eq 0 ]; then
    # 推送成功
    echo "✅ 成功部署至 main 分支！"
    echo "🌐 GitHub Actions 現在將建置並部署至 GitHub Pages"
else
    # 推送失敗
    echo "❌ 推送至 main 分支失敗！"
    exit 1
fi

# 回到 dev 分支繼續開發
echo "🔄 正在返回 dev 分支..."
git checkout dev

# 將 main 分支的變更同步回 dev 分支
# 這確保 dev 分支與 main 分支保持同步
echo "🔄 正在同步 main 分支變更至 dev..."
git merge main --no-edit

# 顯示部署完成訊息
echo "🎉 部署流程完成！"
echo "📱 請檢查 GitHub Actions 的部署狀態"
echo "🔗 您的網站將在此網址可用：https://yourusername.github.io/myPlayground/"
