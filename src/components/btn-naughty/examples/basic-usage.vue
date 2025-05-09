<template>
  <div class="container">
    <label class="flex items-center border p-4 rounded">
      <input v-model="disabled" type="checkbox" />
      <span class="ml-2"> 停用按鈕 </span>
    </label>
    <div class="component-area">
      <BtnNaughty :disabled :maxDistanceMultiple="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import BtnNaughty from "../btn-naughty.vue";

const disabled = ref(true);
</script>

<style scoped>
.container {
  @apply flex flex-col gap-4 w-full border border-gray-300 p-6;
}

/* 內部容器 */
.component-area {
  @apply flex justify-center;
}
</style>
