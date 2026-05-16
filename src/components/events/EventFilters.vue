<script setup>
/**
 * [ 컴포넌트 상단 ]
 * 이벤트 필터 컴포넌트
 * 요일별, 카테고리별 필터링 기능을 제공하며 수평 스크롤을 지원합니다.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDragScroll } from '@/composables/ui/useDragScroll'

const props = defineProps({
  activeDay: String,
  activeCategory: String,
  dayFilters: Array,
  categoryFilters: Array
})

const emit = defineEmits(['update:activeDay', 'update:activeCategory'])

const { t } = useI18n({ useScope: 'global' })
const dayFilterRef = ref(null)
const categoryFilterRef = ref(null)

const { dragMoved: dayDragMoved } = useDragScroll(dayFilterRef)
const { dragMoved: catDragMoved } = useDragScroll(categoryFilterRef)

const handleDayClick = (val) => {
  if (dayDragMoved.value) return
  emit('update:activeDay', val)
}

const handleCategoryClick = (val) => {
  if (catDragMoved.value) return
  emit('update:activeCategory', val)
}
</script>

<template>
  <div class="space-y-md mb-xl">
    <!-- 요일 필터 -->
    <div 
      ref="dayFilterRef"
      class="flex gap-sm overflow-x-auto pb-2 no-scrollbar drag-scroll-container"
    >
      <button 
        v-for="day in dayFilters" 
        :key="day.value"
        @click="handleDayClick(day.value)"
        class="px-lg py-2 rounded-full border whitespace-nowrap transition-all font-label-md select-none"
        :class="activeDay === day.value ? 'bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(0,219,233,0.3)]' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'"
      >
        {{ day.label }}
      </button>
    </div>

    <!-- 카테고리 필터 -->
    <div 
      ref="categoryFilterRef"
      class="flex gap-sm overflow-x-auto pb-2 no-scrollbar drag-scroll-container"
    >
      <button 
        v-for="cat in categoryFilters" 
        :key="cat.value"
        @click="handleCategoryClick(cat.value)"
        class="px-lg py-2 rounded-full border whitespace-nowrap transition-all font-label-md select-none"
        :class="activeCategory === cat.value ? 'bg-secondary text-on-secondary border-secondary shadow-[0_0_15px_rgba(255,184,0,0.2)]' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'"
      >
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.drag-scroll-container {
  cursor: grab;
  user-select: none;
  -webkit-user-drag: none;
}

.drag-scroll-container.grabbing {
  cursor: grabbing;
}
</style>
