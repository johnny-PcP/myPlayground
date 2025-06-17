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
        :style="{ ...tipItemStyle, ...tip.itemStyle }"
        style="pointer-events: auto"
      >
        <div class="tip-content" :style="{ ...tipContentStyle, ...tip.contentStyle }">
          <p :style="{ color: tip.textColor || '#333333', ...tip.textStyle }">
            {{ tip.content }}
          </p>
          <button
            class="close-button"
            :style="{ ...closeButtonStyle, ...tip.closeButtonStyle }"
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
  tipItemStyle: {
    type: Object,
    default: () => ({}),
  },
  tipContentStyle: {
    type: Object,
    default: () => ({}),
  },
  closeButtonStyle: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['removeTip'])
</script>

<style scoped>
.tips-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
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
    right: 20px;
  }
}

.tip-item {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tip-content {
  position: relative;
  padding-right: 24px;
}

.tip-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  transition: color 0.2s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #ef4444;
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: all 0.3s ease;
}

.tip-fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.tip-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.tip-fade-move {
  transition: transform 0.3s ease;
}
</style>
