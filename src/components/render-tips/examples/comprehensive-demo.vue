<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <div class="demo-buttons">
      <button class="demo-btn" @click="showCustomDuration">
        自定義持續時間（10秒）
      </button>

      <button class="demo-btn" @click="showStyledTips">
        顏色主題提示
      </button>

      <button class="demo-btn" @click="showMultipleTips">
        一次顯示多個提示
      </button>

      <button class="demo-btn" @click="showColorThemes">
        不同顏色主題
      </button>

      <button class="demo-btn clear-btn" @click="clearAllTips">
        清除所有提示
      </button>
    </div>

    <div class="info-section">
      <div>
        🎨 簡化後的樣式配置
      </div>
      <p>render-tips 現在提供簡化的顏色配置選項：</p>
      <ul>
        <li><code>textColor</code> - 自定義文字顏色</li>
        <li><code>backgroundColor</code> - 自定義背景顏色</li>
        <li><code>borderColor</code> - 自定義邊框顏色（可選）</li>
        <li><code>position</code> - 容器位置（top-left, top-right, bottom-left, bottom-right）</li>
        <li>基本樣式（圓角、文字大小、陰影等）已固定在組件中</li>
        <li>只保留可能因提示類型而不同的顏色相關配置</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRenderTips } from '../useRenderTips'

// 普通的 tips 實例
const tips = useRenderTips({
  defaultDuration: 4000,
  position: 'bottom-right',
})

function showCustomDuration() {
  tips.pushTip({
    content: '這個提示會顯示 10 秒鐘，比一般提示更久',
    textColor: '#1d4ed8',
    backgroundColor: '#eff6ff',
    duration: 10000,
  })
}

function showStyledTips() {
  tips.pushTip({
    content: '這是一個具有紫色主題的提示訊息',
    textColor: '#ffffff',
    backgroundColor: '#7c3aed',
    borderColor: '#5b21b6',
    duration: 5000,
  })
}

function showMultipleTips() {
  const messages = [
    {
      content: '第一個提示訊息',
      textColor: '#15803d',
      backgroundColor: '#f0fdf4',
    },
    {
      content: '第二個提示訊息',
      textColor: '#1d4ed8',
      backgroundColor: '#eff6ff',
    },
    {
      content: '第三個提示訊息',
      textColor: '#7c3aed',
      backgroundColor: '#faf5ff',
    },
  ]

  messages.forEach((msg, index) => {
    setTimeout(() => {
      tips.pushTip(msg)
    }, index * 500) // 每 500ms 顯示一個
  })
}

function showColorThemes() {
  // 顯示不同顏色主題的提示
  tips.pushTip({
    content: '灰色主題提示訊息',
    textColor: '#475569',
    backgroundColor: '#f8fafc',
    duration: 5000,
  })

  setTimeout(() => {
    tips.pushTip({
      content: '藍色主題提示訊息',
      textColor: '#0369a1',
      backgroundColor: '#e0f2fe',
      duration: 5000,
    })
  }, 500)

  setTimeout(() => {
    tips.pushTip({
      content: '橙色主題提示訊息',
      textColor: '#c2410c',
      backgroundColor: '#fff7ed',
      duration: 5000,
    })
  }, 1000)
}

function clearAllTips() {
  tips.removeAllTips()
}
</script>

<style scoped>
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

.clear-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
}

.info-section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.info-section p {
  line-height: 1.6;
  margin-bottom: 12px;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
}

.info-section li {
  line-height: 1.6;
  margin-bottom: 8px;
}

.info-section code {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
