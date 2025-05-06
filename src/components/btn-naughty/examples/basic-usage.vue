<template>
  <div class="container">
    <div class="component-area">
      <BtnNaughty />
    </div>
  </div>
</template>

<script setup lang="ts">
import BtnNaughty from "../btn-naughty.vue";
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
