<script setup>
/**
 * [ 스탬프 이벤트 홈 ]
 * 스탬프 수집 현황, 최근 획득 스탬프, 다음 추천 장소를 요약하여 보여줍니다.
 */
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useStampStore } from '@/stores/stamp'
import { useQuestStore } from '@/stores/quest'
import { useBadgeStore } from '@/stores/badge'
import StampProgressRing from '@/components/v2/stamp/StampProgressRing.vue'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const stampStore = useStampStore()
const questStore = useQuestStore()
const badgeStore = useBadgeStore()
const scope = 'StampEvent_v2'

const navigateTo = (path) => {
  router.push(path)
}

onMounted(() => {
  logger.info(scope, '스탬프 이벤트 홈 진입')
  // 퀘스트 및 배지 업데이트 체크
  questStore.updateQuestProgress()
  badgeStore.checkBadgeUnlocks()
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <!-- 배경 효과 -->
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
      <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-4xl mx-auto px-margin-mobile md:px-lg pt-12 relative z-10">
      <header class="mb-12">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/30">{{ t('common.conventionChallenge') }}</span>
        </div>
        <h1 class="text-display-lg font-display-lg leading-tight">{{ t('gamification.stampTour') }}</h1>
        <p class="text-on-surface-variant font-medium mt-2">{{ t('gamification.challengeDesc') }}</p>
      </header>

      <!-- 진행률 섹션 -->
      <section class="glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/5 mb-8 flex flex-col md:flex-row items-center gap-12">
        <StampProgressRing :current="stampStore.collectedStampCount" :total="stampStore.totalStampCount" :size="240" />
        
        <div class="flex-1 space-y-8 w-full">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
              <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">{{ t('gamification.completed') }}</span>
              <span class="text-3xl font-black text-on-surface">{{ stampStore.collectedStampCount }}</span>
            </div>
            <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
              <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">{{ t('gamification.remaining') }}</span>
              <span class="text-3xl font-black text-primary">{{ stampStore.totalStampCount - stampStore.collectedStampCount }}</span>
            </div>
          </div>

          <button @click="navigateTo('/v2/stamp-event/scan')"
                  class="w-full py-6 bg-primary text-on-primary rounded-3xl font-black text-xl shadow-[0_20px_50px_rgba(0,219,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
            <span class="material-symbols-outlined text-3xl">qr_code_scanner</span>
            {{ t('gamification.scanQr') }}
          </button>
        </div>
      </section>

      <!-- 다음 추천 장소 & 퀵 메뉴 -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <!-- 추천 장소 -->
        <div class="md:col-span-7 glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-primary/5 flex flex-col justify-between min-h-[240px]">
          <div>
            <span class="text-[10px] font-black text-primary uppercase tracking-widest block mb-4">{{ t('gamification.nextRecommended') }}</span>
            <h3 class="text-2xl font-bold mb-2">{{ t(stampStore.nextRecommendedSpot.nameKey) }}</h3>
            <p class="text-sm text-on-surface-variant">{{ t(stampStore.nextRecommendedSpot.descriptionKey) }}</p>
          </div>
          <div class="flex gap-3">
             <button @click="navigateTo(`/route-guide/${stampStore.nextRecommendedSpot.routeDestinationId}`)"
                     class="px-6 py-3 bg-white/10 rounded-2xl font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-2">
               {{ t('common.routing') }} <span class="material-symbols-outlined text-sm">near_me</span>
             </button>
             <button @click="navigateTo(`/viewer-360/${stampStore.nextRecommendedSpot.viewerSpaceId}`)"
                     class="px-6 py-3 bg-white/10 rounded-2xl font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-2">
               {{ t('common.viewer360') }} <span class="material-symbols-outlined text-sm">view_in_ar</span>
             </button>
          </div>
        </div>

        <!-- 퀵 메뉴 -->
        <div class="md:col-span-5 grid grid-cols-1 gap-4">
           <button @click="navigateTo('/v2/passport')"
                   class="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-6 group">
             <div class="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
               <span class="material-symbols-outlined text-3xl font-black">menu_book</span>
             </div>
             <div class="flex flex-col items-start">
               <span class="font-bold text-lg">{{ t('gamification.viewPassport') }}</span>
               <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{{ t('passport.journeyHistory') }}</span>
             </div>
           </button>

           <button @click="navigateTo('/v2/badges')"
                   class="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-6 group">
             <div class="w-14 h-14 rounded-2xl bg-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
               <span class="material-symbols-outlined text-3xl font-black">military_tech</span>
             </div>
             <div class="flex flex-col items-start">
               <span class="font-bold text-lg">{{ t('gamification.viewBadges') }}</span>
               <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{{ badgeStore.unlockedBadgeIds.length }} {{ t('common.unlocked') }}</span>
             </div>
           </button>
        </div>
      </div>

      <!-- 최근 획득 스탬프 -->
      <section v-if="stampStore.recentlyCollectedStamps.length > 0">
        <div class="flex items-center justify-between px-2 mb-6">
          <h3 class="text-xl font-bold">{{ t('gamification.recentStamps') }}</h3>
          <button @click="navigateTo('/v2/passport')" class="text-xs font-bold text-primary hover:underline">{{ t('common.viewAll') }}</button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="s in stampStore.recentlyCollectedStamps" :key="s.id"
               class="glass-panel p-6 rounded-3xl border border-white/5 bg-white/5 flex flex-col items-center text-center">
            <span class="text-4xl mb-4">{{ s.stampIcon }}</span>
            <span class="font-bold text-sm">{{ t(s.nameKey) }}</span>
            <span class="text-[10px] text-on-surface-variant mt-1 uppercase tracking-tighter">{{ t('gamification.collectedToday') }}</span>
          </div>
        </div>
      </section>

      <!-- 데모 전용 컨트롤 (Bottom) -->
      <div class="mt-24 pt-12 border-t border-white/5 flex flex-col items-center gap-4 opacity-40">
         <p class="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Demo Operations</p>
         <button @click="stampStore.resetProgress(); router.go(0)" 
                 class="px-8 py-3 rounded-full border border-white/10 text-xs font-bold hover:bg-error hover:text-white transition-all">
           {{ t('gamification.resetProgress') }}
         </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}
</style>
