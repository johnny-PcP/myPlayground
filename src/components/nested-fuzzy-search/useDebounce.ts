import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay: number) {
  const debouncedValue = ref<T>(source.value) as Ref<T>

  let timeoutId: ReturnType<typeof setTimeout>

  watch(
    source,
    (newValue) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
  )

  return debouncedValue
}
