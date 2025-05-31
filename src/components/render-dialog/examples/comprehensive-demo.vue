<template>
  <div class="comprehensive-demo">
    <h3>進階功能範例</h3>
    <p class="demo-description">
      展示背景遮罩客製化、Teleport 功能等進階特性。包含多種背景點擊行為和 z-index 解決方案。
    </p>

    <div class="demo-buttons">
      <button class="demo-btn" @click="showDefaultBackdrop">
        預設背景（不可點擊關閉）
      </button>

      <button class="demo-btn" @click="showClickableBackdrop">
        可點擊背景關閉
      </button>

      <button class="demo-btn" @click="showBackdropWithCallback">
        背景點擊有回調
      </button>

      <button class="demo-btn" @click="showNoBackdrop">
        無背景遮罩
      </button>

      <button class="demo-btn teleport-btn" @click="showTeleportToBody">
        🚀 Teleport 到 body
      </button>
    </div>

    <div class="teleport-info">
      <h4>Teleport 功能說明</h4>
      <p>
        Teleport 功能可以將對話框渲染到指定的 DOM 容器中，有效解決 z-index 層級衝突問題。
        除了 <code>body</code> 外，也可以使用 CSS 選擇器指定其他容器，例如：
      </p>
      <ul>
        <li><code>teleport: "#app"</code> - 渲染到 id 為 app 的元素</li>
        <li><code>teleport: ".modal-container"</code> - 渲染到 class 為 modal-container 的元素</li>
        <li><code>teleport: "body"</code> 或 <code>teleport: true</code> - 渲染到 body（推薦）</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 使用 composable 函數
import { useDialog } from '../useRenderDialog'

const _dialog = useDialog()

// 預設背景遮罩（不可點擊關閉）
function showDefaultBackdrop() {
  _dialog.open({
    title: '預設背景（不可點擊關閉）',
    content: [
      '這是使用預設背景遮罩的對話框',
      '背景為半透明黑色，模糊程度 4px',
      '預設情況下點擊背景無法關閉對話框',
      '需要點擊按鈕才能關閉',
    ],
    confirm: {
      btnName: '確定',
      onComplete: () => {
        console.warn('預設背景對話框已關閉')
      },
    },
    cancel: {
      btnName: '取消',
    },
    // 預設背景設定（closeOnClick 預設為 false）
  })
}

// 可點擊背景關閉的對話框
function showClickableBackdrop() {
  _dialog.open({
    title: '可點擊背景關閉',
    content: [
      '這個對話框允許點擊背景關閉',
      '試試看點擊背景遮罩區域',
      '背景為淡藍色，模糊程度 6px',
    ],
    confirm: {
      btnName: '確定',
      onComplete: () => {
        console.warn('可點擊背景對話框已關閉')
      },
    },
    cancel: {
      btnName: '取消',
    },
    backdrop: {
      color: 'rgba(59, 130, 246, 0.4)', // 淡藍色
      blur: '6px',
      closeOnClick: true, // 允許點擊背景關閉
    },
  })
}

// 背景點擊有回調函數
function showBackdropWithCallback() {
  _dialog.open({
    title: '背景點擊有回調',
    content: [
      '這個對話框在點擊背景時會執行回調函數',
      '點擊背景看看控制台的輸出',
      '背景為淡紅色，模糊程度 8px',
    ],
    confirm: {
      btnName: '確定',
      onComplete: () => {
        console.warn('背景回調對話框已關閉')
      },
    },
    cancel: {
      btnName: '取消',
    },
    backdrop: {
      color: 'rgba(239, 68, 68, 0.3)', // 淡紅色
      blur: '8px',
      closeOnClick: true, // 允許點擊背景關閉
      onBackdropClick: () => {
        console.warn('🎯 背景被點擊了！執行自定義回調函數')
        console.warn('✅ 背景點擊回調執行成功！')
      },
    },
  })
}

// 無背景遮罩
function showNoBackdrop() {
  _dialog.open({
    title: '無背景遮罩',
    content: [
      '這個對話框沒有背景遮罩',
      '可以看到後面的內容不會被遮擋',
    ],
    confirm: {
      btnName: '確定',
      onComplete: () => {
        console.warn('無背景對話框已關閉')
      },
    },
    backdrop: false,
  })
}

// Teleport 到 body 範例
function showTeleportToBody() {
  _dialog.open({
    title: '🚀 Teleport 到 body',
    content: [
      '這個對話框使用 Teleport 傳送到 document.body',
      '可以有效避免 z-index 層級衝突',
      '對話框會脫離原本的 DOM 層級結構',
      '',
      '💡 提示：也可以指定其他標籤作為傳送目標',
      '例如：teleport: "#modal-container"',
      '或：teleport: ".dialog-wrapper"',
    ],
    confirm: {
      btnName: '了解了',
      onComplete: () => {
        console.warn('🚀 Teleport 對話框已關閉')
      },
    },
    cancel: {
      btnName: '取消',
    },
    backdrop: {
      color: 'rgba(16, 185, 129, 0.4)', // 淡綠色
      blur: '5px',
      closeOnClick: true,
      onBackdropClick: () => {
        console.warn('🚀 Teleport 對話框背景被點擊')
      },
    },
    teleport: true, // 傳送到 body
  })
}
</script>

<style scoped>
.comprehensive-demo {
  margin-bottom: 32px;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.demo-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.demo-btn:active {
  transform: translateY(0);
}

.teleport-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  position: relative;
}

.teleport-btn::before {
  content: '🚀 ';
  margin-right: 2px;
}

.demo-description {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

h3 {
  color: #2d3748;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.teleport-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.teleport-info h4 {
  color: #2d3748;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.teleport-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.teleport-info ul {
  margin: 0;
  padding-left: 20px;
}

.teleport-info li {
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.teleport-info code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #2d3748;
}
</style>
