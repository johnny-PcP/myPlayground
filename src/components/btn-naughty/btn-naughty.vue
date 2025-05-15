<template>
  <!-- 容器 -->
  <div class="relative-container">
    <!-- 拓印容器 -->
    <div class="absolute-container">
      <slot name="rubbing">
        <!-- 拓印 -->
        <div class="btn-rubbing" />
      </slot>
    </div>

    <!-- 按鈕 -->
    <div
      @click="handleTrigger"
      @mouseenter="handleTrigger"
      @keydown.enter="handleTrigger"
      class="carrier"
      ref="carrierRef"
      :style="carrierStyle"
    >
      <slot v-bind="attrs">
        <button class="btn">{{ props.label }}</button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, useAttrs, computed, watch } from "vue";
import {
  throttleFilter,
  useMouseInElement,
  useIntersectionObserver
} from "@vueuse/core";
// #region CSSProperties
import type { CSSProperties } from "vue";
// #endregion CSSProperties

// #region Slots
defineSlots<{
  /** 按鈕 */
  default?: () => unknown;
  /** 拓印 */
  rubbing?: () => unknown;
}>();
// #endregion Slots

const attrs = useAttrs();

// #region Props
interface Props {
  /** 按鈕內文字 */
  label?: string;
  /** 是否停用 */
  disabled?: boolean;
  /** 同 CSS z-index */
  zIndex?: number | string;
  /** 最大移動距離，為按鈕尺寸倍數 */
  maxDistanceMultiple?: number;
  /** 同 html tabindex */
  tabindex?: number | string;
}

// #endregion Props
const props = withDefaults(defineProps<Props>(), {
  label: "按鈕預設文字",
  disabled: false,
  zIndex: undefined,
  maxDistanceMultiple: 5,
  tabindex: undefined
});

// #region Emits
const emit = defineEmits<{
  (e: "click"): void;
  (e: "run"): void;
  (e: "back"): void;
}>();
// #endregion Emits

// defineOptions({
//   inheritAttrs: false
// })

const carrierRef = ref<HTMLDivElement>();

/** throttleFilter 用來降低偵測滑鼠變化的更新速度，可以提升效能
 *
 */
// #region throttleFilter
const mouseInElement = reactive(
  useMouseInElement(carrierRef, {
    /** 單位是 ms，35大概是 30fps。 */
    eventFilter: throttleFilter(35)
  })
);
// #endregion throttleFilter

/** 以按鈕中心為 0 點的滑鼠位置 */
const mousePosition = computed(() => ({
  x: mouseInElement.elementX - mouseInElement.elementWidth / 2,
  y: mouseInElement.elementY - mouseInElement.elementHeight / 2
}));

/** 按鈕容器偏移量 */
const carrierOffset = ref({ x: 0, y: 0 });

// #region carrierStyle
/** 利用 style 產生偏移效果 */
const carrierStyle = computed<CSSProperties>(() => {
  const { x, y } = carrierOffset.value;

  const cursor = props.disabled ? "not-allowed" : "pointer";

  return {
    zIndex: props.zIndex,
    transform: `translate(${x}px, ${y}px)`,
    cursor
  };
});
// #endregion carrierStyle

/** 計算向量長度 */
function getVectorLength({
  x,
  y,
  z = 0
}: {
  x: number;
  y: number;
  z?: number;
}) {
  return Math.sqrt(x * x + y * y + z * z);
}

/** 計算單位向量 */
// #region getUnitVector1
function getUnitVector({ x, y, z = 0 }: { x: number; y: number; z?: number }) {
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  return {
    x: x / magnitude,
    y: y / magnitude,
    z: z / magnitude
  };
}
// #endregion getUnitVector1

function back() {
  carrierOffset.value.x = 0;
  carrierOffset.value.y = 0;

  emit("back");
}

// #region getUnitVector2
function run() {
  /** 取得按鈕中心到滑鼠的單位方向 */
  const direction = getUnitVector(mousePosition.value);

  /** 往遠離滑鼠的方向移動一個按鈕的距離 */
  carrierOffset.value.x -= direction.x * mouseInElement.elementWidth;
  carrierOffset.value.y -= direction.y * mouseInElement.elementHeight;

  // 讓元素離開 focus 狀態
  carrierRef.value?.blur();

  /** 判斷是否超出限制距離 */
  const maxDistance = getVectorLength({
    x: mouseInElement.elementWidth * Number(props.maxDistanceMultiple),
    y: mouseInElement.elementHeight * Number(props.maxDistanceMultiple)
  });
  const distance = getVectorLength(carrierOffset.value);
  const outOfRange = distance > maxDistance;

  if (outOfRange) {
    back();
  } else {
    emit("run");
  }
}

// #endregion getUnitVector2

function handleTrigger() {
  emit("click");

  if (!props.disabled) return;
  run();
}

/** 滑鼠移動到按鈕上時 */
watch(
  () => mouseInElement.isOutside,
  (value) => {
    if (value || !props.disabled) return;
    run();
  }
);

/** 按鈕被遮擋時回歸原位 */
useIntersectionObserver(carrierRef, (value) => {
  console.log(value[0]?.isIntersecting);

  if (value[0]?.isIntersecting) return;
  back();
});

/** disabled 解除時，回歸原位 */
watch(
  () => props.disabled,
  (value) => {
    if (props.disabled) return;
    back();
  }
);

// #region defineExpose
defineExpose({
  /** 按鈕目前偏移量 */
  offset: carrierOffset
});
// #endregion defineExpose
</script>

<style scoped>
.relative-container {
  position: relative;
}

.absolute-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.btn-rubbing {
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

.btn {
  width: 100%;
  height: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #444;
  border-radius: 0.25rem;
  background: #fefefe;
  transition-duration: 0.2s;
  color: #444;
}

.btn:active {
  transition-duration: 0.1s;
  transform: scale(0.98);
}

.carrier {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
}
</style>
