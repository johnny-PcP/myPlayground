<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col items-center gap-2 text-3xl font-bold tracking-wider">
      <div
        v-for="(item, i) in list"
        :key="i"
        class="clickable-box relative border px-10 py-4"
        :class="{ 'border-x-4': item.visible }"
        @click="toggleVisible(item)"
      >
        <text-characters-transition
          label="一段展示用的文字"
          v-bind="item"
          class=" pointer-events-none"
        />

        <div class=" absolute left-0 bottom-0 p-2 px-3 text-sm font-normal tracking-normal opacity-20">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentProps } from 'vue-component-type-helpers'
import { ref } from 'vue'

import TextCharactersTransition from '../text-characters-transition.vue'

type Param = ComponentProps<typeof TextCharactersTransition>
// type Param = ExtractComponentProps<typeof TextCharactersTransition>
type Item = Pick<Param, 'name' | 'visible'>

const list = ref<Item[]>([
  {
    visible: false,
    name: 'blur',
  },
  {
    visible: false,
    name: 'clip-right',
  },
])

function toggleVisible(item: Pick<Param, 'visible'>) {
  item.visible = !item.visible
}
</script>

<style scoped>
.clickable-box{
  cursor: pointer;
  transition-duration: 0.4s;
}
.clickable-box:active{
  transition-duration: 0.1s;
  scale: 0.98;
}
</style>
