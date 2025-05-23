<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <label class=" flex items-center border p-4 rounded">
      <input
        v-model="visible"
        type="checkbox"
      >
      <span class="ml-2">
        顯示文字
      </span>
    </label>

    <div class="flex flex-col gap-2">
      <text-characters-transition
        :enter="(i) => ({ delay: i * 5 })"
        :leave="(i) => ({ delay: i * 5 })"
        :visible label="出現速度較慢效果"
      />
      <text-characters-transition
        :visible="visible"
        label="使用逗點，區分文字，的效果展現。"
        :splitter="/(，)/"
        :enter="(i) => ({ delay: i * 500 })"
      />
      <text-characters-transition
        :visible="visible"
        :label="[
          '使用', '陣列', '達到', '一樣的', '效果展現', '。',
        ]"
        :enter="(i) => ({ delay: i * 500 })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import TextCharactersTransition from '../text-characters-transition.vue'

const visible = ref(false)
</script>
