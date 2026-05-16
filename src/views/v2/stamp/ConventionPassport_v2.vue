<script setup>
/**
 * [ 컨벤션 패스포트 ]
 * 사용자의 탐험 기록과 획득한 스탬프, 배지 현황을 여행 패스포트 스타일로 보여줍니다.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useStampStore } from '@/stores/stamp'
import { useBadgeStore } from '@/stores/badge'
import { usePassportStore } from '@/stores/passport'
import { stampSpots } from '@/data/mockGamification'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const stampStore = useStampStore()
const badgeStore = useBadgeStore()
const passportStore = usePassportStore()
const scope = 'ConventionPassport_v2'

onMounted(() => {
  logger.info(scope, '패스포트 화면 진입')
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-margin-mobile md:px-lg pt-12 relative z-10">
      <header class="mb-12 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-secondary/20 rounded-lg text-[10px] font-black text-secondary uppercase tracking-[0.2em] border border-secondary/30">{{ t('common.digitalPassport') }}</span>
          </div>
          <h1 class="text-display-lg font-display-lg leading-tight text-on-surface">{{ t('passport.subtitle') }}</h1>
        </div>
        <button @click="router.back()" class="p-3 bg-white/5 rounded-2xl border border-white/10">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- 패스포트 메인 카드 -->
      <section class="glass-panel p-10 rounded-[3rem] border border-white/10 bg-surface-container-high/40 mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <!-- 배경 문양 -->
        <div class="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none">
           <span class="material-symbols-outlined text-[30rem]">public</span>
        </div>

        <div class="flex flex-col md:flex-row gap-12 relative z-10">
          <!-- 사용자 프로필 요약 -->
          <div class="flex flex-col items-center gap-6 md:border-r md:border-white/10 md:pr-12">
            <div class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center p-1 border-2 border-white/10">
               <img src="/src/assets/IMG_2798.jpg" class="w-full h-full object-cover rounded-[2.2rem] opacity-80" />
            </div>
            <div class="text-center">
              <h2 class="text-2xl font-black mb-1 text-on-surface">{{ t('passport.mockUser') }}</h2>
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{{ t('passport.userId') }}</p>
            </div>
          </div>

          <!-- 스탬프 그리드 현황 -->
          <div class="flex-1">
            <h3 class="text-sm font-black text-primary uppercase tracking-[0.3em] mb-8">{{ t('passport.stampCollection') }}</h3>
            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4">
               <div v-for="spot in stampSpots" :key="spot.id"
                    class="aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all border"
                    :class="stampStore.isStampCollected(spot.id) ? 'bg-primary/20 border-primary/40 text-on-surface' : 'bg-white/5 border-white/5 opacity-20 grayscale'">
                 {{ spot.stampIcon }}
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 여정 타임라인 & 배지 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 타임라인 -->
        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
          <h3 class="text-lg font-bold mb-8 flex items-center gap-3 text-on-surface">
            <span class="material-symbols-outlined text-secondary">history</span>
            {{ t('passport.todayFootprint') }}
          </h3>
          <div v-if="passportStore.journeyTimeline.length > 0" class="space-y-6 relative ml-2">
            <div class="absolute left-[13px] top-4 bottom-4 w-[2px] bg-white/5"></div>
            <div v-for="item in passportStore.journeyTimeline" :key="item.id" class="flex gap-6 relative">
              <div class="w-7 h-7 rounded-full bg-surface-dark border-2 border-primary z-10 flex items-center justify-center">
                 <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div>
                <p class="font-bold text-sm text-on-surface">{{ t('passport.visitRecord', { name: t(item.nameKey) }) }}</p>
                <p class="text-[10px] text-on-surface-variant uppercase mt-1">{{ item.time }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-center py-12 text-on-surface-variant text-sm font-medium">{{ t('passport.noVisitsYet') }}</p>
        </div>

        <!-- 획득 배지 요약 -->
        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
          <div class="flex justify-between items-center mb-8">
             <h3 class="text-lg font-bold flex items-center gap-3 text-on-surface">
               <span class="material-symbols-outlined text-tertiary">military_tech</span>
               {{ t('passport.earnedBadges') }}
             </h3>
             <button @click="navigateTo('/v2/badges')" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{{ t('common.viewAll') }}</button>
          </div>
          <div class="grid grid-cols-3 gap-4">
             <div v-for="badge in badgeStore.unlockedBadges.slice(0, 6)" :key="badge.id"
                  class="aspect-square rounded-3xl bg-white/5 flex flex-col items-center justify-center gap-2 border border-white/5">
               <span class="text-3xl">{{ badge.icon }}</span>
               <span class="text-[9px] font-bold text-on-surface-variant text-center px-2 line-clamp-1">{{ t(badge.nameKey) }}</span>
             </div>
             <!-- 잠긴 슬롯 표시 -->
             <div v-for="i in Math.max(0, 3 - badgeStore.unlockedBadges.length)" :key="i"
                  class="aspect-square rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white/10">lock</span>
             </div>
          </div>
        </div>
      </div>

      <!-- 보상 안내 배너 -->
      <section v-if="stampStore.isCompletedAll" class="mt-12">
         <div class="p-8 rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="flex items-center gap-6">
               <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-2xl">🎁</div>
               <div>
                  <h3 class="text-2xl font-black text-on-surface">{{ t('passport.challengeComplete') }}</h3>
                  <p class="text-on-surface-variant font-medium mt-1">{{ t('passport.challengeCompleteDesc') }}</p>
               </div>
            </div>
            <button @click="router.push('/v2/reward')"
                    class="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">{{ t('passport.claimReward') }}</button>
         </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
