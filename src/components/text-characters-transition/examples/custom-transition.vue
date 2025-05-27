<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex-1 flex flex-col justify-around items-center gap-6 text-xl">
      <div
        v-for="(item, i) in list"
        :key="i"
        class=" clickable-box border px-9 py-6"
        :class="{ 'border-x-4': item.visible }"
        @click="toggleVisible(item)"
      >
        <text-characters-transition v-bind="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentProps } from 'vue-component-type-helpers'
import anime from 'animejs'
import { sample } from 'remeda'
import { ref } from 'vue'

import TextCharactersTransition from '../text-characters-transition.vue'

type Param = ComponentProps<typeof TextCharactersTransition>
type Item = Pick<Param, 'label' | 'enter' | 'leave' | 'visible'> & {
  class?: string;
}

const negativeList = [1, -1] as const
/** 隨機正負 */
const randomNegative = () => sample(negativeList, 1)[0]

const list = ref<Item[]>([
  {
    visible: false,
    label: '程式如詩寫，美到無人解',
    class: 'font-wenkai tracking-[0.2rem]',
    enter: (i) => ({
      opacity: [0, 1],
      filter: ['blur(20px)', 'blur(0px)'],
      translateX: () => [
        anime.random(40, 60) * randomNegative(),
        0,
      ],
      translateY: () => [
        anime.random(50, 60) * randomNegative(),
        0,
      ],
      delay: i * 100,
      duration: 1600,
      easing: 'easeOutCirc',
    }),
    leave: (i) => ({
      opacity: 0,
      filter: 'blur(20px)',
      delay: i * 50,
      duration: 900,
      easing: 'easeInCirc',
    }),
  },
  {
    visible: false,
    class: 'tracking-[0.2rem] perspective',
    label: ['人', '和', '程式', '，', '一個', '能跑', '就行'],
    enter: (i) => ({
      opacity: [0, 1],
      rotateX: [anime.random(180, 90), 0],
      rotateY: [270, 0],
      rotateZ: [anime.random(-90, 90), 0],
      scaleX: [0.5, 1],
      easing: 'easeOutCirc',
      duration: 1000,
      delay: i * 300,
    }),
    leave: (i) => ({
      opacity: 0,
      rotateX: anime.random(-180, -90),
      rotateY: anime.random(-90, 90),
      rotateZ: anime.random(-90, 90),
      scaleX: 0.5,
      easing: 'easeInExpo',
      duration: 1400,
      delay: i * 100,
    }),
  },
])

function toggleVisible(item: Pick<Param, 'visible'>) {
  item.visible = !item.visible
}
</script>

<style scoped>
.font-wenkai{
  font-family: "LXGW WenKai Mono TC", monospace;
  font-weight: 400;
  font-style: normal;
  text-shadow: 0 0 10px rgba(#111, 0.1);
}

.perspectiveP{
  perspective: 100px;
  transform-style: preserve-3d;
}

.clickable-box{

  cursor: pointer;
  transition-duration: 0.4s;

}

  .clickable-box:active{

    transition-duration: 0.1s;
    scale: 0.98;
  }
</style>
