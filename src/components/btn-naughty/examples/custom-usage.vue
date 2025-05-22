<template>
  <div class="container">
    <div class="setting flex justify-start items-center gap-3">
      <label class="flex items-center border p-4 rounded cursor-pointer">
        <input v-model="disabled" type="checkbox">
        <span class="ml-2"> 停用按鈕 </span>
      </label>
      <div
        class="btn-click border border-gray-300 p-4 rounded cursor-pointer"
        @click="maxDistanceMultiple++"
      >
        移動距離限定：
        <span class="text-blue-500 font-bold">{{ maxDistanceMultiple }}</span>
        倍
      </div>
    </div>

    <div class="component-area">
      <btn-naughty :disabled :max-distance-multiple>
        <template #default>
          <!-- slot1:內部預設為自定義按鈕樣式 -->
          <div class="custom-button">
            custom-button
          </div>
        </template>

        <template #rubbing>
          <!-- slot2:可另外指定底部拓印樣式 -->
          <div class="rubbing">
            rubbing
          </div>
        </template>
      </btn-naughty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import BtnNaughty from '../btn-naughty.vue'

const disabled = ref(true)
const maxDistanceMultiple = ref(1)

watch(maxDistanceMultiple, (newVal) => {
  if (newVal > 5) {
    maxDistanceMultiple.value = 1
  }
})
</script>

<style scoped>
.container {
  @apply flex flex-col gap-4 w-full border border-gray-300 p-6;
}

/* 內部容器 */
.component-area {
  @apply flex justify-center;
}

.custom-button {
  background: #d8a818;
  padding: 10px 20px;
  color: white;
  border-radius: 100px;
  border: 3px solid #dad1d1;
}

.rubbing {
  background: #fefefe;
  padding: 10px 20px;
  border-radius: 15px;
  border: 3px dashed #dad1d1;
  text-align: center;
}
</style>
