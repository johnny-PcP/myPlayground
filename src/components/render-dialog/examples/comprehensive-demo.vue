<template>
  <div class="comprehensive-demo">
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
        console.warn('背景被點擊了！執行自定義回調函數')
        console.warn('背景點擊回調執行成功！')
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
</style>
