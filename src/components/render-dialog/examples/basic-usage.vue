<template>
  <div class="basic-usage-demo">
    <h3>基本對話框範例</h3>
    <p class="demo-description">
      點擊按鈕開啟一個包含標題、內容和確認/取消按鈕的基本對話框。預設情況下，點擊背景無法關閉對話框。
    </p>

    <div class="demo-buttons">
      <button class="demo-btn" @click="openBasicDialog">
        開啟基本對話框
      </button>

      <button class="demo-btn test-btn" @click="openClickableDialog">
        🧪 測試點擊背景關閉
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDialog } from '../useRenderDialog'

const dialog = useDialog()

function openBasicDialog() {
  dialog.open({
    title: '確認操作',
    content: ['確定要執行此操作嗎？'],
    confirm: {
      btnName: '確認',
      onComplete: () => {
        console.warn('已執行確認操作')
      },
    },
    cancel: {
      btnName: '取消',
      onComplete: () => {
        console.warn('已取消操作')
      },
    },
  })
}

function openClickableDialog() {
  console.warn('🧪 開始測試點擊背景關閉功能')

  dialog.open({
    title: '🧪 背景點擊測試',
    content: [
      '這是一個測試對話框',
      '背景設定為可點擊關閉',
      '請點擊背景遮罩區域測試',
      '查看 Console 輸出以確認功能',
    ],
    confirm: {
      btnName: '確認',
      onComplete: () => {
        console.warn('✅ 透過確認按鈕關閉')
      },
    },
    cancel: {
      btnName: '取消',
      onComplete: () => {
        console.warn('✅ 透過取消按鈕關閉')
      },
    },
    backdrop: {
      color: 'rgba(239, 68, 68, 0.5)',
      blur: '8px',
      closeOnClick: true,
      onBackdropClick: () => {
        console.warn('🎯 背景點擊回調被執行了！')
      },
    },
  })
}
</script>

<style scoped>
.basic-usage-demo {
  margin-bottom: 32px;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
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

.test-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  position: relative;
}

.test-btn::before {
  content: '🧪 ';
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
</style>
