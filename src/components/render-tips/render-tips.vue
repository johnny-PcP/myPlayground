<template>
  <section
    class="fixed bottom-[72px] right-3 z-[99] flex h-[40vh] w-[200px] flex-col-reverse items-end gap-y-3 overflow-y-auto md:bottom-3 md:w-[400px]"
    style="pointer-events: none"
  >
    <!-- 訊息 -->
    <transition-group appear name="tip-fade">
      <div
        v-for="tip in tips"
        :key="tip.id"
        :class="tip.textColor || 'text-black'"
        class="flexCenter h-auto w-full rounded-md bg-themeOrange/70 p-2"
        style="pointer-events: auto"
      >
        <div
          class="relative flex min-h-[75px] flex-1 items-start justify-start break-all rounded-md bg-white/70 pb-2 pl-1.5 pr-8 pt-4 font-bold"
        >
          <p>{{ tip.content }}</p>
          <button
            class="absolute right-1 top-0.5 font-bold text-black hover:text-red-500 transition-colors"
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
})

defineEmits(['removeTip'])
</script>

<style scoped>
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
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
