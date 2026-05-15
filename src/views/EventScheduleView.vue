<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 대회 일정(Events) 뷰
 * 대회 프로그램 일정을 요일별, 카테고리별로 필터링하여 보여줍니다.
 * 현재 시간 기준 진행 상태를 실시간으로 표시하며, PC/모바일 모두에서 드래그 스크롤을 지원합니다.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/events/EventCard.vue'
import EventFilters from '@/components/events/EventFilters.vue'

const { t, tm } = useI18n()
const eventsStore = useEventsStore()
const scope = 'EventSchedule'

// 필터 상태
const activeDay = ref('all')
const activeCategory = ref('all')

let timer = null

/**
 * 필터링된 이벤트 목록
 */
const filteredEvents = computed(() => {
  return eventsStore.processedEvents.filter(item => {
    const dayMatch = activeDay.value === 'all' || item.day === activeDay.value
    const categoryMatch = activeCategory.value === 'all' || item.category === activeCategory.value
    return dayMatch && categoryMatch
  })
})

/**
 * 요일 필터 옵션
 */
const dayFilters = computed(() => [
  { value: 'all', label: t('events.filters.all') },
  { value: 'friday', label: t('events.days.friday.label') },
  { value: 'saturday', label: t('events.days.saturday.label') },
  { value: 'sunday', label: t('events.days.sunday.label') }
])

/**
 * 카테고리 필터 옵션
 */
const categoryFilters = computed(() => {
  const filters = tm('events.filters')
  if (!filters || typeof filters !== 'object') return []
  
  return Object.entries(filters).map(([key, label]) => ({
    value: key,
    label
  }))
})

const handleAddSchedule = (event) => {
  logger.info(scope, `일정 추가 요청: ${event.title}`)
  // TODO: 실제 일정 추가 로직 구현
}

onMounted(() => {
  logger.info(scope, '이벤트 일정 화면 진입')
  
  timer = setInterval(() => {
    eventsStore.updateCurrentTime()
  }, 60000)
})

onUnmounted(() => {
  logger.info(scope, '이벤트 일정 화면 이탈')
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-lg pt-xl">
      <header class="mb-xl">
        <h1 class="font-display-lg text-display-lg text-primary">{{ t('events.title') }}</h1>
        <p class="font-body-lg text-on-surface-variant">{{ t('events.subtitle') }}</p>
        <p v-if="eventsStore.currentDay" class="mt-2 text-label-sm text-surface-tint opacity-80 italic">
          현재: {{ t(`events.days.${eventsStore.currentDay}.label`) }}
        </p>
      </header>

      <!-- 필터 컴포넌트 -->
      <EventFilters 
        v-model:activeDay="activeDay"
        v-model:activeCategory="activeCategory"
        :dayFilters="dayFilters"
        :categoryFilters="categoryFilters"
      />

      <!-- 타임라인 -->
      <div v-if="filteredEvents.length > 0" class="relative pl-8 space-y-lg border-l border-white/10 ml-4">
        <EventCard 
          v-for="(item, index) in filteredEvents" 
          :key="item.id"
          :item="item"
          :showDayDivider="activeDay === 'all' && (index === 0 || filteredEvents[index-1].day !== item.day)"
          @add-schedule="handleAddSchedule"
        />
      </div>

      <!-- 검색 결과 없음 -->
      <div v-else class="flex flex-col items-center justify-center py-32 text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-20 mb-4">calendar_today</span>
        <p class="text-on-surface-variant font-body-lg">{{ t('events.noResults') || '해당 조건에 맞는 일정이 없습니다.' }}</p>
        <button @click="activeDay = 'all'; activeCategory = 'all'" class="mt-4 text-primary font-bold hover:underline">
          {{ t('events.filters.reset') || '필터 초기화' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 페이지 전용 스타일이 필요한 경우 여기에 작성 */
</style>
