<template>
  <div class="comprehensive-demo">
    <div class="demo-buttons">
      <button class="demo-btn" @click="showCustomDuration">
        自定義持續時間（10秒）
      </button>

      <button class="demo-btn teleport-btn" @click="showTeleportTips">
        Teleport 到 body
      </button>

      <button class="demo-btn" @click="showMultipleTips">
        一次顯示多個提示
      </button>

      <button class="demo-btn auto-btn" @click="startAutoTips">
        自動生成提示（每2秒）
      </button>

      <button class="demo-btn stop-btn" @click="stopAutoTips">
        停止自動生成
      </button>
    </div>

    <div class="teleport-info">
      <h4>🚀 Teleport 功能說明</h4>
      <p>與 render-dialog 類似，render-tips 也支援 Teleport 功能：</p>
      <ul>
        <li><code>teleport: true</code> - 傳送到 document.body</li>
        <li><code>teleport: "#tips-container"</code> - 傳送到指定元素</li>
        <li>可以有效避免 z-index 層級衝突</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRenderTips } from '../useRenderTips'

// 普通的 tips 實例
const normalTips = useRenderTips()

// 帶 teleport 的 tips 實例
const teleportTips = useRenderTips({
  teleport: true,
  defaultDuration: 4000,
})

const autoInterval = ref(null)

function showCustomDuration() {
  normalTips.pushTip({
    content: '這個提示會顯示 10 秒鐘，比一般提示更久',
    textColor: 'text-blue-700',
    duration: 10000,
  })
}

function showTeleportTips() {
  teleportTips.pushTip({
    content: '🚀 這個提示使用 Teleport 傳送到 body',
    textColor: 'text-purple-700',
    duration: 5000,
  })
}

function showMultipleTips() {
  const messages = [
    { content: '第一個提示訊息', textColor: 'text-green-700' },
    { content: '第二個提示訊息', textColor: 'text-blue-700' },
    { content: '第三個提示訊息', textColor: 'text-purple-700' },
  ]

  messages.forEach((msg, index) => {
    setTimeout(() => {
      normalTips.pushTip(msg)
    }, index * 500) // 每 500ms 顯示一個
  })
}

function startAutoTips() {
  if (autoInterval.value)
    return

  let count = 1
  autoInterval.value = setInterval(() => {
    normalTips.pushTip({
      content: `自動生成的提示 #${count}`,
      textColor: count % 2 === 0 ? 'text-indigo-700' : 'text-emerald-700',
      duration: 3000,
    })
    count++
  }, 2000)
}

function stopAutoTips() {
  if (autoInterval.value) {
    clearInterval(autoInterval.value)
    autoInterval.value = null
  }
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
}

.auto-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
}

.stop-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
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
