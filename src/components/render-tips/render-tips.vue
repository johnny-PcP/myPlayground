<template>
  <section
    class="tips-container"
    :style="containerStyle"
    style="pointer-events: none"
  >
    <!-- 訊息 -->
    <transition-group appear name="tip-fade">
      <div
        v-for="tip in tips"
        :key="tip.id"
        class="tip-item"
        :style="getTipItemStyle(tip)"
        style="pointer-events: auto"
      >
        <div class="tip-content">
          <p :style="{ color: tip.textColor || '#333333' }">
            {{ tip.content }}
          </p>
          <button
            class="close-button"
            :style="{ color: tip.textColor || '#666' }"
            @click.prevent="$emit('removeTip', tip.id)"
          >
            ×
          </button>
        </div>
      </div>
    </transition-group>
  </section>
</template>

<script setup>
defineProps({
  tips: {
    type: Array,
    default: () => [],
  },
  containerStyle: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['removeTip'])

// 計算提示項目的樣式
function getTipItemStyle(tip) {
  const style = {}

  if (tip.backgroundColor) {
    style.backgroundColor = tip.backgroundColor
  }

  if (tip.borderColor) {
    style.borderColor = tip.borderColor
  }

  return style
}
</script>

<style scoped>
.tips-container {
  display: flex;
  max-height: 50vh;
  width: 320px;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 8px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .tips-container {
    width: calc(100vw - 40px);
  }
}

.tip-item {
  width: 100%;
  /* 固定的基本樣式 */
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  padding: 16px 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.tip-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.tip-content {
  position: relative;
  padding-right: 28px;
}

.tip-content p {
  margin: 0;
  /* 固定的文字樣式 */
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  word-break: break-word;
}

.close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  /* 固定的按鈕樣式 */
  font-size: 20px;
  font-weight: bold;
  color: #666;
  transition: all 0.2s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: translateY(-50%) scale(1.1);
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: all 0.3s ease;
}

.tip-fade-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.tip-fade-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.tip-fade-move {
  transition: transform 0.3s ease;
}
</style>
