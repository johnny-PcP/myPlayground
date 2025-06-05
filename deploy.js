const { execSync } = require('node:child_process')
const process = require('node:process')

// 顏色輸出函數
const colors = {
  green: '\x1B[32m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  reset: '\x1B[0m',
}

function log(message, color = 'reset') {
  // eslint-disable-next-line no-console
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, description) {
  log(`🔄 ${description}...`, 'blue')
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  }
  catch {
    log(`❌ ${description} 失敗！`, 'red')
    return false
  }
}

async function deploy() {
  log('🚀 開始部署流程...', 'green')

  // 1. 檢查當前分支
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()

  if (currentBranch !== 'dev') {
    log(`❌ 請在 'dev' 分支執行此腳本。目前分支：${currentBranch}`, 'red')
    process.exit(1)
  }

  // 2. 檢查工作區是否乾淨
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' })
  if (gitStatus.trim()) {
    log('❌ 工作目錄不乾淨，請先提交您的變更。', 'red')
    // eslint-disable-next-line no-console
    console.log(gitStatus)
    process.exit(1)
  }

  // 3. 執行檢查
  log('🔍 執行部署前檢查...', 'yellow')
  if (!exec('npm run check', '程式碼檢查與建置測試')) {
    process.exit(1)
  }

  // 4. 清理 dist
  log('🧹 清理 dist 檔案...', 'yellow')
  exec('npm run clean:dist', '清理 dist')

  // 5. 切換到 main 分支
  if (!exec('git checkout main', '切換到 main 分支')) {
    process.exit(1)
  }

  // 6. 合併 dev 分支
  if (!exec('git merge dev --no-edit', '合併 dev 到 main')) {
    process.exit(1)
  }

  // 7. 推送到 main
  if (!exec('git push origin main', '推送到 main 分支')) {
    process.exit(1)
  }

  // 8. 回到 dev 分支
  if (!exec('git checkout dev', '切換回 dev 分支')) {
    process.exit(1)
  }

  // 9. 同步 main 的變更
  if (!exec('git merge main --no-edit', '同步 main 變更到 dev')) {
    process.exit(1)
  }

  log('🎉 部署完成！', 'green')
  log('🌐 請檢查 GitHub Actions 建置狀態', 'blue')
}

deploy().catch((error) => {
  log(`❌ 部署失敗：${error.message}`, 'red')
  process.exit(1)
})
