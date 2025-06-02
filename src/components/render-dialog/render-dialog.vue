<template>
  <div
    v-if="dialogOption.backdrop !== false"
    class="dialog-backdrop"
    :style="backdropStyle"
    @click="handleBackdropClick"
  />

  <dialog
    :id="dialogId"
    class="dialog"
    @click.stop
  >
    <!-- 標題 -->
    <div class="dialog-title">
      {{ dialogOption.title }}
    </div>

    <!-- 內文 -->
    <div
      class="dialog-content"
      :class="{
        'content-start': dialogOption.content.length > 5,
        'content-center': dialogOption.content.length <= 5,
      }"
    >
      <div v-for="(item, index) in dialogOption.content" :key="index">
        {{ item }}
      </div>
    </div>

    <!-- 按鈕群組 -->
    <div
      class="dialog-buttons"
      :class="{
        'buttons-around': dialogOption.cancel,
        'buttons-center': !dialogOption.cancel,
      }"
    >
      <!-- 取消按鈕 (可選) -->
      <button
        v-if="dialogOption.cancel"
        class="btn btn-cancel"
        :class="{ 'btn-narrow': dialogOption.cancel }"
        @click="$emit('cancel')"
      >
        {{ dialogOption.cancel.btnName }}
      </button>

      <!-- 確認按鈕 -->
      <button
        class="btn btn-confirm"
        :class="{
          'btn-narrow': dialogOption.cancel,
          'btn-wide': !dialogOption.cancel,
        }"
        @click="$emit('confirm')"
      >
        {{ dialogOption.confirm.btnName }}
      </button>
    </div>
  </dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['dialogOption', 'dialogId'])
const emit = defineEmits(['confirm', 'cancel'])

// 計算背景樣式
const backdropStyle = computed(() => {
  const backdrop = props.dialogOption.backdrop || {}
  const color = backdrop.color || 'rgba(0, 0, 0, 0.5)'
  const blur = backdrop.blur || '4px'

  return {
    backgroundColor: color,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
  }
})

// 處理背景點擊事件
function handleBackdropClick() {
  // 預設 closeOnClick 為 false，只有明確設為 true 才允許點擊背景關閉
  if (props.dialogOption.backdrop?.closeOnClick === true) {
    // 執行背景點擊回調函式（如果有提供）
    props.dialogOption.backdrop?.onBackdropClick?.()
    emit('cancel')
  }
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  cursor: pointer;
  /* 確保能接收點擊事件 */
  pointer-events: all;
}

.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: 0;
  height: 250px;
  width: 400px;
  transform: translate(-50%, -66.66%);
  border-radius: 12px;
  border: none;
  background-color: white;
  padding: 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  color: black;
  z-index: 1001;
}

.dialog-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 100%;
  font-weight: bold;
}

.dialog-content {
  display: flex;
  height: 50%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 18px;
}

.content-start {
  justify-content: flex-start;
}

.content-center {
  justify-content: center;
}

.dialog-buttons {
  position: absolute;
  bottom: 0;
  display: flex;
  height: 75px;
  width: 100%;
  align-items: center;
}

.buttons-around {
  justify-content: space-around;
}

.buttons-center {
  justify-content: center;
}

.btn {
  margin-top: 6px;
  margin-bottom: 6px;
  height: 32px;
  cursor: pointer;
  border-radius: 16px;
  outline: none;
  color: white;
  border: none;
}

.btn-cancel {
  background-color: #c12133;
}

.btn-confirm {
  background-color: #12357b;
}

.btn-narrow {
  width: 40%;
}

.btn-wide {
  width: 60%;
}

.btn:hover {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.btn:active {
  transform: scale(0.98);
}
</style>
