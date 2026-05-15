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

const { t, tm } = useI18n()
const scope = 'EventSchedule'

// 필터 상태
const activeDay = ref('all')
const activeCategory = ref('all')

// DOM 참조 (드래그 스크롤용)
const dayFilterRef = ref(null)
const categoryFilterRef = ref(null)

// 시간 업데이트를 위한 타이머
const currentTime = ref(new Date())
let timer = null

// 드래그 상태 관리 (클릭과 드래그 구분용)
const dragMoved = ref(false)

/**
 * 드래그 투 스크롤 초기화 (PC용)
 */
const initDragScroll = (el) => {
  if (!el) return
  
  let startX
  let scrollLeft
  let isDown = false

  const handleMouseDown = (e) => {
    isDown = true
    dragMoved.value = false
    el.classList.add('grabbing')
    startX = e.pageX - el.offsetLeft
    scrollLeft = el.scrollLeft
  }

  const handleMouseLeave = () => {
    if (!isDown) return
    isDown = false
    el.classList.remove('grabbing')
  }

  const handleMouseUp = () => {
    if (!isDown) return
    isDown = false
    el.classList.remove('grabbing')
  }

  const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 배율
    
    // 미세한 움직임이 아닌 경우 드래그로 판정하여 클릭 이벤트 방지
    if (Math.abs(x - startX) > 5) {
      dragMoved.value = true
    }
    
    el.scrollLeft = scrollLeft - walk
  }

  el.addEventListener('mousedown', handleMouseDown)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('mouseup', handleMouseUp)
  el.addEventListener('mousemove', handleMouseMove)

  return () => {
    el.removeEventListener('mousedown', handleMouseDown)
    el.removeEventListener('mouseleave', handleMouseLeave)
    el.removeEventListener('mouseup', handleMouseUp)
    el.removeEventListener('mousemove', handleMouseMove)
  }
}

/**
 * 필터 클릭 핸들러 (드래그 중일 때는 무시)
 */
const handleFilterClick = (type, value) => {
  if (dragMoved.value) {
    logger.debug(scope, '드래그로 인해 필터 클릭 무시됨')
    return
  }
  
  if (type === 'day') activeDay.value = value
  else if (type === 'category') activeCategory.value = value
  
  logger.info(scope, `필터 변경: ${type} -> ${value}`)
}

/**
 * 시간 정규화 유틸리티
 */
const normalizeEventTime = (event) => {
  if (event.time === '00:10' && event.displayTime === '12:10') {
    return '12:10'
  }
  return event.time
}

/**
 * HH:mm 형식을 분 단위로 변환
 */
const toMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

/**
 * 현재 모의(Mock) 시간 또는 실제 시간을 분 단위로 반환
 */
const getNowMinutes = () => {
  const mockTime = localStorage.getItem('EVENTS_MOCK_NOW_TIME') || import.meta.env.VITE_EVENTS_MOCK_NOW_TIME
  if (mockTime) {
    return toMinutes(mockTime)
  }
  return currentTime.value.getHours() * 60 + currentTime.value.getMinutes()
}

/**
 * 현재 모의(Mock) 요일 또는 실제 요일을 반환
 */
const getNowDay = () => {
  const mockDay = localStorage.getItem('EVENTS_MOCK_NOW_DAY') || import.meta.env.VITE_EVENTS_MOCK_NOW_DAY
  if (mockDay) return mockDay
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[currentTime.value.getDay()]
}

/**
 * 요일 순서 정의
 */
const DAY_ORDER = {
  friday: 1,
  saturday: 2,
  sunday: 3
}

/**
 * 전체 이벤트 목록
 */
const allEvents = computed(() => {
  const items = tm('events.items')
  if (!items || typeof items !== 'object') return []

  const events = Object.entries(items).map(([id, item]) => ({
    id,
    ...item,
    normalizedTime: normalizeEventTime(item)
  }))

  return events.sort((a, b) => {
    if (a.day !== b.day) {
      return (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99)
    }
    return toMinutes(a.normalizedTime) - toMinutes(b.normalizedTime)
  })
})

/**
 * 상태가 계산된 이벤트 목록
 */
const processedEvents = computed(() => {
  const nowMin = getNowMinutes()
  const nowDay = getNowDay()
  
  return allEvents.value.map((event, index, array) => {
    const nextEvent = array.slice(index + 1).find(e => e.day === event.day)
    const start = toMinutes(event.normalizedTime)
    const end = nextEvent ? toMinutes(nextEvent.normalizedTime) : start + 30
    
    let status = 'upcoming'
    if (nowDay === event.day) {
      if (nowMin >= start && nowMin < end) status = 'ongoing'
      else if (nowMin >= end) status = 'completed'
    } else if (DAY_ORDER[nowDay] > DAY_ORDER[event.day]) {
      status = 'completed'
    }

    return { ...event, runtimeStatus: status }
  })
})

/**
 * 필터링된 이벤트 목록
 */
const filteredEvents = computed(() => {
  return processedEvents.value.filter(item => {
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

let cleanDayScroll = null
let cleanCatScroll = null

onMounted(() => {
  logger.info(scope, '이벤트 일정 화면 진입')
  
  // 드래그 스크롤 초기화
  cleanDayScroll = initDragScroll(dayFilterRef.value)
  cleanCatScroll = initDragScroll(categoryFilterRef.value)

  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  logger.info(scope, '이벤트 일정 화면 이탈')
  if (timer) clearInterval(timer)
  if (cleanDayScroll) cleanDayScroll()
  if (cleanCatScroll) cleanCatScroll()
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-lg pt-xl">
      <header class="mb-xl">
        <h1 class="font-display-lg text-display-lg text-primary">{{ t('events.title') }}</h1>
        <p class="font-body-lg text-on-surface-variant">{{ t('events.subtitle') }}</p>
        <p v-if="getNowDay()" class="mt-2 text-label-sm text-surface-tint opacity-80 italic">
          현재: {{ t(`events.days.${getNowDay()}.label`) }}
        </p>
      </header>

      <!-- 요일 필터 -->
      <div 
        ref="dayFilterRef"
        class="flex gap-sm mb-md overflow-x-auto pb-2 no-scrollbar drag-scroll-container"
      >
        <button 
          v-for="day in dayFilters" 
          :key="day.value"
          @click="handleFilterClick('day', day.value)"
          class="px-lg py-2 rounded-full border whitespace-nowrap transition-all font-label-md select-none"
          :class="activeDay === day.value ? 'bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(0,219,233,0.3)]' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'"
        >
          {{ day.label }}
        </button>
      </div>

      <!-- 카테고리 필터 -->
      <div 
        ref="categoryFilterRef"
        class="flex gap-sm mb-xl overflow-x-auto pb-2 no-scrollbar drag-scroll-container"
      >
        <button 
          v-for="cat in categoryFilters" 
          :key="cat.value"
          @click="handleFilterClick('category', cat.value)"
          class="px-lg py-2 rounded-full border whitespace-nowrap transition-all font-label-md select-none"
          :class="activeCategory === cat.value ? 'bg-secondary text-on-secondary border-secondary shadow-[0_0_15px_rgba(255,184,0,0.2)]' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- 타임라인 -->
      <div v-if="filteredEvents.length > 0" class="relative pl-8 space-y-lg border-l border-white/10 ml-4">
        <div 
          v-for="item in filteredEvents" 
          :key="item.id"
          class="relative group"
        >
          <!-- 요일 구분선 -->
          <div v-if="activeDay === 'all' && (filteredEvents.indexOf(item) === 0 || filteredEvents[filteredEvents.indexOf(item)-1].day !== item.day)" 
               class="absolute -left-[41px] -top-8 w-max px-3 py-1 bg-surface-container rounded-full border border-white/10 text-[10px] font-bold text-primary mb-4">
            {{ item.dayLabel }}
          </div>

          <!-- 타임라인 포인트 -->
          <div 
            class="absolute -left-[41px] top-6 w-4 h-4 rounded-full border-2 border-surface-dark z-10 transition-all duration-500"
            :class="{
              'bg-on-surface-variant opacity-30 scale-75': item.runtimeStatus === 'completed',
              'bg-primary shadow-[0_0_15px_#00dbe9] animate-pulse scale-110': item.runtimeStatus === 'ongoing',
              'bg-white/20': item.runtimeStatus === 'upcoming'
            }"
          ></div>

          <!-- 이벤트 카드 -->
          <div 
            class="glass-panel p-lg rounded-3xl transition-all duration-300 hover:translate-x-2"
            :class="[
              item.runtimeStatus === 'ongoing' ? 'bg-primary/10 border-primary/30 shadow-[0_8px_32px_rgba(0,219,233,0.1)]' : 'opacity-80',
              item.runtimeStatus === 'completed' ? 'grayscale-[0.5] opacity-50' : ''
            ]"
            :data-status="item.runtimeStatus"
          >
            <div class="flex flex-col md:flex-row justify-between md:items-start gap-md mb-sm">
              <div class="flex flex-col">
                <span class="font-display-md text-display-md leading-none" :class="item.runtimeStatus === 'ongoing' ? 'text-primary' : 'text-on-surface'">
                  {{ item.displayTime }}
                </span>
                <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">{{ item.period }}</span>
              </div>
              
              <div class="flex flex-wrap items-center gap-sm">
                <span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-on-surface-variant uppercase">
                  {{ t(`events.filters.${item.category}`) }}
                </span>
                <span 
                  class="flex items-center gap-xs px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors"
                  :class="{
                    'text-status-low bg-status-low/10': item.runtimeStatus === 'ongoing',
                    'text-on-surface-variant bg-white/5': item.runtimeStatus === 'completed',
                    'text-primary bg-primary/10': item.runtimeStatus === 'upcoming'
                  }"
                >
                  <span v-if="item.runtimeStatus === 'ongoing'" class="w-1.5 h-1.5 rounded-full bg-status-low animate-ping"></span>
                  {{ t(`events.status.${item.runtimeStatus}`) }}
                </span>
              </div>
            </div>
            
            <h3 class="font-headline-md text-headline-md mb-sm leading-snug group-hover:text-primary transition-colors">{{ item.title }}</h3>
            
            <ul v-if="item.subItems && item.subItems.length > 0" class="mb-md space-y-1.5 pl-1">
              <li v-for="(sub, idx) in item.subItems" :key="idx" class="flex items-start gap-2 text-body-sm text-on-surface-variant">
                <span class="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0"></span>
                <span class="leading-relaxed">{{ sub }}</span>
              </li>
            </ul>

            <p class="font-label-md text-on-surface-variant mb-lg flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">person</span>
              {{ item.speaker }}
            </p>
            
            <div class="flex items-center justify-between pt-md border-t border-white/5">
              <div class="flex items-center gap-xs text-label-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">location_on</span>
                <span>{{ item.location }}</span>
              </div>
              <button class="flex items-center gap-xs text-primary font-bold text-label-sm hover:scale-105 transition-transform active:scale-95">
                <span class="material-symbols-outlined text-sm">calendar_add_on</span>
                {{ t('events.actions.addToMySchedule') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-32 text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-20 mb-4">calendar_today</span>
        <p class="text-on-surface-variant font-body-lg">해당 조건에 맞는 일정이 없습니다.</p>
        <button @click="handleFilterClick('day', 'all'); handleFilterClick('category', 'all')" class="mt-4 text-primary font-bold hover:underline">필터 초기화</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

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

.drag-scroll-container:active {
  cursor: grabbing;
}
</style>
