<script setup>
/**
 * [ 스탬프 진행률 링 ]
 * 대형 원형 프로그레스 바를 통해 스탬프 수집 현황을 시각화합니다.
 */
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 20 },
  size: { type: Number, default: 200 },
  stroke: { type: Number, default: 12 }
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (props.current / props.total) * circumference.value)
const percent = computed(() => Math.round((props.current / props.total) * 100))
</script>

<template>
  <div class="relative flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="transform -rotate-90">
      <!-- Background Circle -->
      <circle
        class="text-white/5"
        stroke="currentColor"
        :stroke-width="stroke"
        fill="transparent"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
      />
      <!-- Progress Circle -->
      <circle
        class="text-primary transition-all duration-1000 ease-out"
        stroke="currentColor"
        :stroke-width="stroke"
        stroke-linecap="round"
        fill="transparent"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-4xl font-black text-on-surface tabular-nums">{{ current }}</span>
      <div class="h-[1px] w-8 bg-white/10 my-1"></div>
      <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{{ total }} Spots</span>
      <span class="text-[10px] text-primary font-black mt-1">{{ percent }}%</span>
    </div>
  </div>
</template>
