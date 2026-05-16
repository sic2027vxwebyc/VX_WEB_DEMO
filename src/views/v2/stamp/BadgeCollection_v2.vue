<script setup>
/**
 * [ 배지 컬렉션 ]
 * 사용자가 획득한 배지와 잠긴 배지 목록을 보여주며, 획득 조건을 안내합니다.
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useBadgeStore } from '@/stores/badge'
import { resolveI18nText } from '@/utils/i18nResolver'

const router = useRouter()
const { t, te } = useI18n({ useScope: 'global' })
const badgeStore = useBadgeStore()
const scope = 'BadgeCollection_v2'

const selectedBadge = ref(null)

onMounted(() => {
  logger.info(scope, '배지 컬렉션 진입')
  badgeStore.checkBadgeUnlocks()
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-margin-mobile md:px-lg pt-12 relative z-10">
      <header class="mb-12 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-tertiary/20 rounded-lg text-[10px] font-black text-tertiary uppercase tracking-[0.2em] border border-tertiary/30">{{ t('common.digitalAchievements') }}</span>
          </div>
          <h1 class="text-display-lg font-display-lg leading-tight">{{ t('badges.title') }}</h1>
        </div>
        <button @click="router.back()" class="p-3 bg-white/5 rounded-2xl border border-white/10">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- 요약 정보 -->
      <div class="flex items-center gap-8 mb-16 p-8 bg-white/5 rounded-[2rem] border border-white/5">
         <div class="text-center border-r border-white/10 pr-8">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{{ t('gamification.completed') }}</span>
            <p class="text-4xl font-black text-primary">{{ badgeStore.unlockedBadges.length }}</p>
         </div>
         <div class="text-center">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{{ t('gamification.remaining') }}</span>
            <p class="text-4xl font-black text-white/20">{{ badgeStore.lockedBadges.length }}</p>
         </div>
      </div>

      <!-- 배지 그리드 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
         <div v-for="badge in badgeStore.processedBadges" :key="badge.id"
              @click="selectedBadge = badge"
              class="flex flex-col items-center group cursor-pointer transition-all">
            <div :class="['w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-5xl mb-4 transition-all duration-500 ', 
                          badge.isUnlocked ? 'bg-gradient-to-br from-primary/20 to-tertiary/20 border-2 border-primary/40 shadow-[0_20px_50px_rgba(0,219,233,0.3)] group-hover:scale-110' : 'bg-white/5 border-2 border-white/5 grayscale opacity-30']">
               {{ badge.icon }}
            </div>
            <span :class="['font-bold text-sm ', badge.isUnlocked ? 'text-on-surface' : 'text-on-surface-variant']">{{ t(badge.nameKey) }}</span>
            <div v-if="badge.isUnlocked" class="mt-1 flex items-center gap-1">
               <span class="w-1 h-1 rounded-full bg-primary"></span>
               <span class="text-[9px] font-black text-primary uppercase">{{ t('gamification.completed') }}</span>
            </div>
         </div>
      </div>

      <!-- 상세 모달 -->
      <Transition name="fade">
         <div v-if="selectedBadge" 
              class="fixed inset-0 z-[100] flex items-center justify-center p-lg bg-surface-dark/90 backdrop-blur-xl">
            <div class="max-w-md w-full glass-panel p-10 rounded-[3rem] border border-white/10 text-center relative scale-in shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
               <button @click="selectedBadge = null" class="absolute top-8 right-8 text-on-surface-variant">
                  <span class="material-symbols-outlined">close</span>
               </button>
               
               <div :class="['w-32 h-32 rounded-[3rem] flex items-center justify-center text-6xl mx-auto mb-8 ', 
                             selectedBadge.isUnlocked ? 'bg-primary/20 shadow-2xl' : 'bg-white/5 grayscale opacity-30']">
                  {{ selectedBadge.icon }}
               </div>
               
               <h3 class="text-3xl font-black mb-4">{{ resolveI18nText({ key: selectedBadge.nameKey, t, te, context: `badge:${selectedBadge.id}:name` }) }}</h3>
               <p class="text-on-surface-variant font-medium leading-relaxed mb-8">{{ resolveI18nText({ key: selectedBadge.descriptionKey, t, te, context: `badge:${selectedBadge.id}:desc` }) }}</p>
               <div class="p-6 bg-white/5 rounded-2xl border border-white/10 mb-10">
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">{{ t('badges.unlockCondition') }}</p>
                  <p class="text-sm font-bold">{{ resolveI18nText({ key: selectedBadge.unlockConditionKey, t, te, context: `badge:${selectedBadge.id}:cond` }) }}</p>
               </div>

               <button @click="selectedBadge = null" 
                       class="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black transition-all">{{ t('common.cancel').toUpperCase() }}</button>
            </div>
         </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
