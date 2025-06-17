<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <div class="demo-buttons">
      <button class="demo-btn" @click="showCustomDuration">
        自定義持續時間（10秒）
      </button>

      <button class="demo-btn" @click="showStyledTips">
        自定義樣式提示
      </button>

      <button class="demo-btn" @click="showMultipleTips">
        一次顯示多個提示
      </button>

      <button class="demo-btn" @click="showRoundedTips">
        不同圓角設計
      </button>

      <button class="demo-btn clear-btn" @click="clearAllTips">
        清除所有提示
      </button>
    </div>

    <div class="info-section">
      <div>
        🎨 樣式配置功能說明
      </div>
      <p>render-tips 提供了靈活的樣式配置選項：</p>
      <ul>
        <li><code>itemStyle</code> - 自定義提示框外觀（包含圓角設計）</li>
        <li><code>contentStyle</code> - 自定義內容區域樣式</li>
        <li><code>textStyle</code> - 自定義文字樣式</li>
        <li><code>closeButtonStyle</code> - 自定義關閉按鈕樣式</li>
        <li>預設提供 4px 輕微圓角，可透過 borderRadius 自定義</li>
        <li>支援容器銷毀延遲，確保動畫效果完整</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRenderTips } from '../useRenderTips'

// 普通的 tips 實例
const tips = useRenderTips({
  defaultDuration: 4000,
  destroyDelay: 400, // 延遲銷毀時間
})

function showCustomDuration() {
  tips.pushTip({
    content: '這個提示會顯示 10 秒鐘，比一般提示更久',
    textColor: '#1d4ed8', // blue-700
    duration: 10000,
  })
}

function showStyledTips() {
  tips.pushTip({
    content: '這是一個具有自定義樣式的提示訊息',
    textColor: '#7c3aed', // purple-700
    duration: 5000,
    itemStyle: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      transform: 'scale(1.02)',
    },
    contentStyle: {
      padding: '16px 24px',
    },
    textStyle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
    },
    closeButtonStyle: {
      color: 'white',
      fontSize: '20px',
    },
  })
}

function showMultipleTips() {
  const messages = [
    {
      content: '第一個提示訊息',
      textColor: '#15803d',
      itemStyle: { backgroundColor: '#f0fdf4' },
    },
    {
      content: '第二個提示訊息',
      textColor: '#1d4ed8',
      itemStyle: { backgroundColor: '#eff6ff' },
    },
    {
      content: '第三個提示訊息',
      textColor: '#7c3aed',
      itemStyle: { backgroundColor: '#faf5ff' },
    },
  ]

  messages.forEach((msg, index) => {
    setTimeout(() => {
      tips.pushTip(msg)
    }, index * 500) // 每 500ms 顯示一個
  })
}

function showRoundedTips() {
  // 無圓角設計
  tips.pushTip({
    content: '無圓角設計 (borderRadius: 0)',
    textColor: '#475569',
    duration: 5000,
    itemStyle: {
      backgroundColor: '#f8fafc',
      borderRadius: '0',
    },
  })

  // 中等圓角設計
  setTimeout(() => {
    tips.pushTip({
      content: '中等圓角設計 (borderRadius: 8px)',
      textColor: '#0369a1',
      duration: 5000,
      itemStyle: {
        backgroundColor: '#e0f2fe',
        borderRadius: '8px',
      },
    })
  }, 500)

  // 大圓角設計
  setTimeout(() => {
    tips.pushTip({
      content: '大圓角設計 (borderRadius: 16px)',
      textColor: '#c2410c',
      duration: 5000,
      itemStyle: {
        backgroundColor: '#fff7ed',
        borderRadius: '16px',
      },
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
