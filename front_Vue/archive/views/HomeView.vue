<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 홈 대시보드 뷰
 * 주요 공간 정보, 실시간 데이터, 공간 그리드 가이드 등을 제공합니다.
 */
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'

const scope = 'HomeView'
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const spacesStore = useSpacesStore()

// 메인 하이라이트 공간 (1홀)
const highlightSpace = computed(() => {
  return spacesStore.getSpaceById('hall-1')
})

// 실시간 혼잡 구역 (스토어 데이터를 가공)
const congestedZones = computed(() => {
  return spacesStore.spaces
    .filter(s => s.congestionType === 'high' || s.congestionType === 'moderate')
    .slice(0, 3)
    .map(s => ({
      id: s.id,
      name: s.name,
      status: s.congestion,
      density: s.congestionType === 'high' ? 85 : 45,
      type: s.congestionType
    }))
})

// 실시간 데이터 시뮬레이션
const liveStats = computed(() => ({
  occupancy: Math.floor(Math.random() * 30) + 60,
  climate: 21.5,
  waitTime: highlightSpace.value?.congestionType === 'high' ? 15 : 5,
  quality: t('home.stats.qualityOptimal')
}))

/**
 * 그리드 마스터 버튼 클릭 핸들러
 */
const handleMasterGrid = () => {
  logger.info(scope, '공간 그리드 마스터 버튼이 클릭되었습니다.')
  router.push('/map')
}

onMounted(() => {
  logger.info(scope, '홈 대시보드 페이지가 마운트되었습니다.')
})

onUnmounted(() => {
  logger.info(scope, '홈 대시보드 페이지가 언마운트되었습니다.')
})
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-xl">
    <!-- 히어로 섹션: 공간 허브 하이라이트 -->
    <section class="relative rounded-[2rem] overflow-hidden mb-lg h-[500px] flex items-end p-xl lg:p-24 mt-4">
      <div class="absolute inset-0 z-0">
        <img 
          :alt="t('home.hero.altText')" 
          class="w-full h-full object-cover opacity-60 scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuClGMS9kFaDATN5N1I4m9bpbgU4tGNMOjf4gObkPmrAHE-3T1WracOCGYFnVz5mQNtgHnIxcWFi5xy3fXiklj3lD8uKFwGlpTFzQZKtki-lxRVozzgILaaeyJp7PHE7Kv0r9evDoZEKZ631df-0BHkT96luXkmyCf0yVe2aZ37FzubgjJn8vEBTOhV_XI8_OdAYzhHKZVAh5NzRDghAlSTfuybjtAEV6kt3DixA4Ynl6GfiY7c3-asrMmnhrzB9VjQJNxvmjVzHPDsn"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>
      
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full mb-6 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-surface-tint shadow-[0_0_8px_#00dbe9]"></span>
          <span class="text-primary font-label-lg text-label-sm uppercase tracking-widest">{{ t('home.hero.active') }}</span>
        </div>
        <h1 class="font-display-lg text-display-lg text-primary mb-4 leading-tight">
          <span v-html="t('home.hero.title', { center: '<span class=\'text-surface-tint\'>KINTEX</span>' })"></span>
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-md">
          <button 
            @click="handleMasterGrid"
            class="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-bold font-headline-md flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,219,233,0.2)]"
          >
            {{ t('home.hero.masterMap') }}
            <span class="material-symbols-outlined">north_east</span>
          </button>
          <button 
            @click="router.push('/directory')"
            class="bg-white/5 border border-white/10 text-on-surface px-8 py-4 rounded-xl font-bold font-headline-md backdrop-blur-xl hover:bg-white/10 transition-all"
          >
            {{ t('home.hero.viewAllFacilities') }}
          </button>
        </div>
      </div>
    </section>

    <!-- 벤토 그리드: 실시간 위젯 및 원격 측정 -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-lg">
      <!-- 전시장 상태 - 글래스모픽 카드 -->
      <div class="md:col-span-8 glass-card rounded-[2rem] p-lg flex flex-col justify-between min-h-[320px]">
        <div class="flex justify-between items-start mb-lg">
          <div>
            <p class="font-label-lg text-label-sm text-surface-tint uppercase tracking-tighter mb-1">{{ t('home.stats.liveData') }}</p>
            <h3 class="font-headline-md text-headline-md text-on-surface">{{ highlightSpace?.name || 'Space' }} {{ t('common.status') }}</h3>
          </div>
          <div class="bg-status-low/20 text-status-low px-4 py-1.5 rounded-full border border-status-low/30 font-label-lg flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-low opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-status-low"></span>
            </span>
            {{ t('home.stats.eventInProgress') }}
          </div>
        </div>
        
        <div class="flex-1 flex items-center justify-center py-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-xl w-full">
            <div class="text-center">
              <p class="text-display-lg font-display-lg text-primary">{{ liveStats.occupancy }}<span class="text-headline-md">%</span></p>
              <p class="text-on-surface-variant font-label-lg">{{ t('home.stats.occupancy') }}</p>
            </div>
            <div class="text-center">
              <p class="text-display-lg font-display-lg text-primary">{{ liveStats.climate }}<span class="text-headline-md">°C</span></p>
              <p class="text-on-surface-variant font-label-lg">{{ t('home.stats.climate') }}</p>
            </div>
            <div class="text-center">
              <p class="text-display-lg font-display-lg text-primary">{{ liveStats.waitTime }}<span class="text-headline-md">{{ t('common.minutes') }}</span></p>
              <p class="text-on-surface-variant font-label-lg">{{ t('home.stats.waitTime') }}</p>
            </div>
            <div class="text-center">
              <p class="text-display-lg font-display-lg text-primary">{{ liveStats.quality }}</p>
              <p class="text-on-surface-variant font-label-lg">{{ t('home.stats.airQuality') }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-lg pt-lg border-t border-white/5 flex items-center justify-between">
          <p class="font-body-md text-on-surface-variant italic">{{ t('home.stats.mainEvent', { event: highlightSpace?.tags[0] }) }}</p>
          <button @click="router.push(`/space/${highlightSpace?.id}`)" class="text-primary font-bold flex items-center gap-1 group">
            {{ t('common.viewDetails') }} <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- 라운지 점유율 - 보조 카드 -->
      <div class="md:col-span-4 bg-surface-container-high rounded-[2rem] p-lg flex flex-col border border-white/5">
        <h3 class="font-headline-md text-headline-md text-on-surface mb-md">{{ t('home.congestedZones.title') }}</h3>
        <p class="text-on-surface-variant mb-lg">{{ t('home.congestedZones.desc') }}</p>
        <div class="space-y-md flex-1">
          <div v-for="lounge in congestedZones" :key="lounge.name" class="bg-surface-dark/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:bg-surface-dark transition-colors" @click="router.push(`/space/${lounge.id}`)">
            <div class="flex justify-between items-center mb-2">
              <span class="text-label-lg">{{ lounge.name }}</span>
              <span 
                class="font-bold"
                :class="{
                  'text-status-high': lounge.type === 'high',
                  'text-status-low': lounge.type === 'low',
                  'text-status-moderate': lounge.type === 'moderate'
                }"
              >{{ lounge.status }}</span>
            </div>
            <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                class="h-full"
                :class="{
                  'bg-status-high': lounge.type === 'high',
                  'bg-status-low': lounge.type === 'low',
                  'bg-status-moderate': lounge.type === 'moderate'
                }"
                :style="{ width: `${lounge.density}%` }"
              ></div>
            </div>
          </div>
        </div>
        <button @click="router.push('/directory')" class="mt-lg w-full py-3 rounded-xl border border-primary/30 text-primary font-bold hover:bg-primary/5 transition-all">
          {{ t('home.congestedZones.findEmptySpace') }}
        </button>
      </div>

      <!-- 미니 맵 / 위치 카드 -->
      <div class="md:col-span-4 glass-card rounded-[2rem] overflow-hidden flex flex-col min-h-[300px]">
        <div class="p-lg pb-0">
          <h4 class="font-headline-md text-headline-md">{{ t('home.location.title') }}</h4>
          <p class="text-on-surface-variant text-label-sm">{{ t('home.location.accuracy', { accuracy: '0.5m' }) }}</p>
        </div>
        <div class="flex-1 relative mt-md grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-crosshair">
          <img 
            class="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoSol4VnIzzrNwe3oTrcN1NuYhYaih2j54yoQjrZY7OoIESaKVXxdB3DQkt-vrZkzXvqG3IKYA0z-8Q67oLMRDzzrldV5IyQD87tMTGt09ArBd9aYB34-ZQ6sOGo1kX6SQTkmY2ogOYD9Zs2S55Cx6SSYMI9jbNMBjCCBZ-z1p2rnen4kFJdHpl_zGeoskoDB4anYyz7j9Soi-x3Us8WRmqNnLimyryAlx-HlyTK2jCQjOosblVoWW2Kqij36LlxFP4e8uBGR7r6m0"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-6 bg-primary rounded-full animate-pulse shadow-[0_0_20px_#dbfcff]"></div>
          </div>
        </div>
        <div class="p-4 flex items-center justify-between bg-surface-container-lowest/80">
          <span class="text-label-lg">{{ t('home.location.current') }}</span>
          <button @click="router.push('/map')" class="material-symbols-outlined text-primary">fullscreen</button>
        </div>
      </div>

      <!-- 시스템 노드 상태 -->
      <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div class="bg-surface-container rounded-[2rem] p-lg border border-white/5 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-surface-tint text-4xl mb-4">router</span>
          <h5 class="font-headline-md text-headline-md">1,204</h5>
          <p class="text-on-surface-variant text-label-sm uppercase tracking-widest">{{ t('home.system.activeBeacons') }}</p>
        </div>
        <div class="bg-surface-container rounded-[2rem] p-lg border border-white/5 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-surface-tint text-4xl mb-4">wifi_protected_setup</span>
          <h5 class="font-headline-md text-headline-md">99.9%</h5>
          <p class="text-on-surface-variant text-label-sm uppercase tracking-widest">{{ t('home.system.networkStatus') }}</p>
        </div>
        <div class="bg-surface-container rounded-[2rem] p-lg border border-white/5 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-surface-tint text-4xl mb-4">group</span>
          <h5 class="font-headline-md text-headline-md">14.2k</h5>
          <p class="text-on-surface-variant text-label-sm uppercase tracking-widest">{{ t('home.system.liveUsers') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
