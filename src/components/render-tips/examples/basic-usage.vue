<template>
  <div class="basic-usage-demo">
    <div class="demo-buttons">
      <button class="demo-btn" @click="showSuccessTip">
        成功提示
      </button>

      <button class="demo-btn warning-btn" @click="showWarningTip">
        警告提示
      </button>

      <button class="demo-btn error-btn" @click="showErrorTip">
        錯誤提示
      </button>

      <button class="demo-btn clear-btn" @click="clearAllTips">
        清除所有提示
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRenderTips } from '../useRenderTips'

const tips = useRenderTips()

function showSuccessTip() {
  tips.pushTip({
    content: '操作成功！資料已儲存',
    textColor: 'text-green-700',
    duration: 3000,
  })
}

function showWarningTip() {
  tips.pushTip({
    content: '請注意：這個操作可能需要一些時間',
    textColor: 'text-yellow-700',
    duration: 4000,
  })
}

function showErrorTip() {
  tips.pushTip({
    content: '錯誤：無法連接到伺服器，請檢查網路連線',
    textColor: 'text-red-700',
    duration: 6000,
  })
}

function clearAllTips() {
  tips.removeAllTips()
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

.warning-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
}

.error-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
}

.clear-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
}
</style>
