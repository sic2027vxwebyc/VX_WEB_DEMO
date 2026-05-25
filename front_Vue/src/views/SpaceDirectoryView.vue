<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 공간 디렉토리 뷰
 * 컨벤션 내 모든 공간의 목록과 실시간 상태를 브라우징할 수 있습니다.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'

const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'SpaceDirectory'

// 검색어 및 필터 상태 (reactive state)
const searchKeyword = ref('')
const selectedCategory = ref('all')

/**
 * 컴포넌트 마운트 시 로그 기록 및 데이터 로딩 시뮬레이션
 */
onMounted(() => {
  logger.info(scope, '공간 디렉토리 페이지가 마운트되었습니다.')
})

/**
 * 컴포넌트 언마운트 시 로그 기록
 */
onUnmounted(() => {
  logger.info(scope, '공간 디렉토리 페이지가 언마운트되었습니다.')
})

// 카테고리 옵션 (i18n 키로 관리)
const categories = ['all', 'exhibition', 'dining', 'amenities', 'hotels']

// 필터링된 공간 데이터
const filteredSpaces = computed(() => {
  return spacesStore.spaces.filter(space => {
    const matchesCategory = selectedCategory.value === 'all' || space.category === selectedCategory.value
    const matchesSearch = space.name.includes(searchKeyword.value) || space.zone.includes(searchKeyword.value)
    return matchesCategory && matchesSearch
  })
})

/**
 * 카테고리 변경 시 로그 기록 (watch 대용)
 */
const updateCategory = (cat) => {
  selectedCategory.value = cat
  logger.debug(scope, '필터 조건이 변경되었습니다.', {
    selectedCategory: selectedCategory.value,
    keyword: searchKeyword.value
  })
}

/**
 * 경로 안내 버튼 클릭 핸들러
 */
const handleRoute = (space) => {
  logger.info(scope, `${space.name} 공간으로의 경로 안내를 시작합니다.`)
  router.push(`/route-guide/${space.id}`)
}
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-20">
    <div class="max-w-7xl mx-auto">
      <!-- 헤더 섹션 -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl pt-8">
        <div>
          <h1 class="font-display-lg text-display-lg text-primary mb-2">{{ t('directory.title') }}</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {{ t('directory.subtitle') }}
          </p>
        </div>
        
        <!-- 검색 및 필터 -->
        <div class="flex flex-col sm:flex-row items-center gap-md">
          <div class="relative group w-full sm:w-64">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              v-model="searchKeyword"
              class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-surface-tint focus:border-transparent outline-none transition-all font-body-md text-on-surface" 
              :placeholder="t('directory.searchPlaceholder')" 
              type="text"
            />
          </div>
          
          <div class="flex flex-wrap bg-surface-container-low rounded-lg p-1 border border-white/5">
            <button 
              v-for="cat in categories"
              :key="cat"
              @click="updateCategory(cat)"
              class="px-4 py-2 rounded-md font-label-lg transition-all"
              :class="selectedCategory === cat ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'"
            >
              {{ t(`directory.categories.${cat}`) }}
            </button>
          </div>
        </div>
      </div>

      <!-- 디렉토리 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        <!-- 공간 카드 -->
        <div 
          v-for="space in filteredSpaces"
          :key="space.id"
          class="group relative bg-surface-container-lowest/40 backdrop-blur-[30px] rounded-xl border border-white/10 overflow-hidden hover:border-surface-tint/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,219,233,0.1)]"
        >
          <div class="h-48 relative overflow-hidden">
            <img 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              :src="space.image"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent"></div>
            <div 
              class="absolute top-4 right-4 backdrop-blur-md border px-3 py-1 rounded-full flex items-center gap-2"
              :class="{
                'bg-status-low/20 border-status-low/50': space.congestionType === 'low',
                'bg-status-moderate/20 border-status-moderate/50': space.congestionType === 'moderate',
                'bg-status-high/20 border-status-high/50': space.congestionType === 'high'
              }"
            >
              <span 
                class="w-2 h-2 rounded-full shadow-[0_0_8px]"
                :class="{
                  'bg-status-low shadow-[#00C853]': space.congestionType === 'low',
                  'bg-status-moderate shadow-[#FFD600]': space.congestionType === 'moderate',
                  'bg-status-high shadow-[#FF3D00]': space.congestionType === 'high'
                }"
              ></span>
              <span 
                class="font-label-sm text-xs uppercase tracking-wider"
                :class="{
                  'text-status-low': space.congestionType === 'low',
                  'text-status-moderate': space.congestionType === 'moderate',
                  'text-status-high': space.congestionType === 'high'
                }"
              >{{ t('directory.congestion', { status: space.congestion }) }}</span>
            </div>
          </div>
          
          <div 
            class="p-6 cursor-pointer"
            @click="router.push(`/space/${space.id}`)"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{{ space.name }}</h3>
                <p class="font-label-sm text-label-sm text-on-surface-variant">{{ space.zone }}</p>
              </div>
              <div class="flex items-center gap-1 text-surface-tint">
                <span class="material-symbols-outlined text-[18px]">near_me</span>
                <span class="font-label-lg text-label-lg">{{ space.distance }}m</span>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in space.tags" :key="tag" class="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-on-surface-variant uppercase font-bold">
                {{ tag }}
              </span>
            </div>
            
            <button 
              @click.stop="handleRoute(space)"
              class="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-3 rounded-lg hover:bg-surface-tint hover:text-surface-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{{ t('directory.startNavigation') }}</span>
              <span class="material-symbols-outlined">directions_walk</span>
            </button>
          </div>
        </div>

        <!-- 새 공간 제안 (관리자 전용 패턴) -->
        <div 
          @click="logger.info(scope, '새 공간 제안 모달을 오픈합니다.')"
          class="group relative bg-surface-container/20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-12 hover:border-surface-tint/40 hover:bg-surface-container/30 transition-all cursor-pointer"
        >
          <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
            <span class="material-symbols-outlined text-primary text-3xl">add</span>
          </div>
          <span class="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface">{{ t('directory.proposeNew.title') }}</span>
          <p class="font-label-sm text-label-sm text-on-surface-variant text-center mt-2">{{ t('directory.proposeNew.desc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
