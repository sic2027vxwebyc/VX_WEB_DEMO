<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 공간 상세 정보 뷰
 * 특정 공간의 상세 사양, 접근성 정보, 360 뷰어 진입점 등을 제공합니다.
 */
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'SpaceDetail'

// 공간 데이터 상태
const spaceData = computed(() => {
  const data = spacesStore.getSpaceById(route.params.id)
  if (!data) return null
  
  // 기본값 보완 (상세 페이지 전용 필드)
  return {
    ...data,
    stats: {
      capacity: Math.floor(Math.random() * 60) + 10, // 시뮬레이션 데이터
      airQuality: t('home.stats.qualityOptimal'),
      temperature: 21,
      humidity: 45
    },
    accessibility: [
      { name: 'brailleGuide', icon: 'braille', supported: true },
      { name: 'inductionLoop', icon: 'hearing', supported: true },
      { name: 'wheelchairAccess', icon: 'accessible', supported: true }
    ],
    nearbySpaces: spacesStore.spaces
      .filter(s => s.id !== route.params.id && s.category === data.category)
      .slice(0, 2)
  }
})

/**
 * 컴포넌트 마운트 시 로그 기록 및 데이터 로딩
 */
onMounted(() => {
  if (spaceData.value) {
    logger.info(scope, `공간 상세 정보(${spaceData.value.name}) 페이지가 마운트되었습니다.`)
    logger.info(scope, '공간 상세 데이터를 로딩했습니다.', { id: route.params.id })
  } else {
    logger.warn(scope, '공간 정보를 찾을 수 없습니다.', { id: route.params.id })
    router.replace('/directory')
  }
})

/**
 * 컴포넌트 언마운트 시 로그 기록
 */
onUnmounted(() => {
  logger.info(scope, '공간 상세 정보 페이지가 언마운트되었습니다.')
})

/**
 * 360 뷰어 열기
 */
const openViewer = () => {
  logger.info(scope, '360 뷰어 페이지로 이동합니다.')
  router.push(`/viewer-360/${spaceData.value.id}`)
}

/**
 * 경로 안내 시작
 */
const startRoute = () => {
  logger.info(scope, '이 공간으로의 경로 안내를 요청했습니다.')
  router.push(`/route-guide/${spaceData.value.id}`)
}
</script>

<template>
  <div v-if="spaceData" class="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
    <!-- 뒤로가기 버튼 -->
    <button 
      @click="router.back()"
      class="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-lg transition-colors group"
    >
      <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
      <span class="font-label-lg">{{ t('common.back') }}</span>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <!-- 왼쪽: 시네마틱 이미지 및 360 진입 -->
      <div class="lg:col-span-7 space-y-lg">
        <div class="relative rounded-[2rem] overflow-hidden h-[400px] md:h-[500px] group shadow-2xl">
          <img 
            :src="spaceData.image" 
            :alt="spaceData.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-surface-dark/60 to-transparent"></div>
          
          <!-- 360 뷰어 퀵 버튼 -->
          <button 
            @click="openViewer"
            class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-4 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full text-primary hover:bg-primary/30 transition-all shadow-[0_8px_32px_rgba(0,219,233,0.3)] group/btn"
          >
            <span class="material-symbols-outlined text-2xl group-hover/btn:rotate-12 transition-transform">360</span>
            <span class="font-headline-md font-bold">{{ t('spaceDetail.actions.open360') }}</span>
          </button>
        </div>

        <!-- 공간 설명 -->
        <div class="glass-card rounded-[2rem] p-lg">
          <h2 class="font-headline-md text-primary mb-4">{{ t('spaceDetail.intro') }}</h2>
          <p class="font-body-lg text-on-surface-variant leading-relaxed">
            {{ spaceData.description }}
          </p>
          <div v-if="spaceData.area" class="mt-4 flex items-center gap-2 text-surface-tint">
            <span class="material-symbols-outlined">straighten</span>
            <span class="font-label-lg">{{ t('spaceDetail.area', { value: spaceData.area }) }}</span>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 상세 정보 및 액션 -->
      <div class="lg:col-span-5 space-y-lg">
        <!-- 타이틀 구역 -->
        <div>
          <h1 class="font-display-lg text-primary mb-2">{{ spaceData.name }}</h1>
          <p class="font-headline-md text-on-surface-variant mb-6">{{ spaceData.zone }}</p>
          
          <div class="flex flex-col gap-4">
            <button 
              @click="startRoute"
              class="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_8px_24px_rgba(0,219,233,0.2)]"
            >
              <span class="material-symbols-outlined">directions_walk</span>
              {{ t('spaceDetail.actions.startRoute') }}
            </button>
            <button class="w-full py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all">
              {{ t('spaceDetail.actions.share') }}
            </button>
          </div>
        </div>

        <!-- 실시간 지표 -->
        <div class="bg-surface-container-high rounded-[2rem] p-lg border border-white/5">
          <h3 class="font-label-lg text-surface-tint uppercase tracking-widest mb-6">{{ t('spaceDetail.stats.title') }}</h3>
          <div class="grid grid-cols-2 gap-md">
            <div class="bg-surface-dark/50 p-4 rounded-2xl border border-white/5">
              <p class="text-on-surface-variant text-label-sm mb-1">{{ t('spaceDetail.stats.occupancy') }}</p>
              <p class="text-headline-md font-bold text-primary">{{ spaceData.stats.capacity }}%</p>
              <div class="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div class="h-full bg-primary" :style="{ width: `${spaceData.stats.capacity}%` }"></div>
              </div>
            </div>
            <div class="bg-surface-dark/50 p-4 rounded-2xl border border-white/5">
              <p class="text-on-surface-variant text-label-sm mb-1">{{ t('spaceDetail.stats.airQuality') }}</p>
              <p class="text-headline-md font-bold text-status-low">{{ spaceData.stats.airQuality }}</p>
              <p class="text-[10px] text-on-surface-variant mt-2 italic">{{ t('spaceDetail.stats.airQualityNormal') }}</p>
            </div>
          </div>
        </div>

        <!-- 접근성 정보 -->
        <div class="glass-card rounded-[2rem] p-lg">
          <h3 class="font-label-lg text-surface-tint uppercase tracking-widest mb-6">{{ t('spaceDetail.accessibility.title') }}</h3>
          <div class="grid grid-cols-1 gap-sm">
            <div 
              v-for="item in spaceData.accessibility" 
              :key="item.name"
              class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary-fixed-dim">{{ item.icon }}</span>
                <span class="font-body-md text-on-surface">{{ t(`common.accessibility.${item.name}`) }}</span>
              </div>
              <span class="text-status-low material-symbols-outlined">check_circle</span>
            </div>
          </div>
        </div>

        <!-- 주변 추천 공간 -->
        <div v-if="spaceData.nearbySpaces.length" class="space-y-md">
          <h3 class="font-label-lg text-on-surface-variant uppercase tracking-widest ml-2">{{ t('spaceDetail.nearby') }}</h3>
          <div class="grid grid-cols-1 gap-sm">
            <div 
              v-for="nearby in spaceData.nearbySpaces" 
              :key="nearby.id"
              class="flex items-center justify-between p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer border border-white/5 group"
              @click="router.push(`/space/${nearby.id}`)"
            >
              <div>
                <p class="font-label-lg text-on-surface group-hover:text-primary transition-colors">{{ nearby.name }}</p>
                <p class="text-xs text-on-surface-variant">{{ nearby.zone }}</p>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-all">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
