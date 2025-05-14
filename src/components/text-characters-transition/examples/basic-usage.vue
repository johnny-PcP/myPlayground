<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <label class="flex items-center border p-4 rounded">
      <input v-model="visible" type="checkbox" />
      <span class="ml-2"> 顯示文字 </span>
    </label>

    <text-characters-transition :visible label="文字具有動畫效果" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TextCharactersTransition from "../text-characters-transition.vue";

const visible = ref(true);
</script>
