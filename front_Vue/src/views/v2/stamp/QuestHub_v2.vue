<script setup>
/**
 * [ 퀘스트 허브 ]
 * 사용자가 현재 수행할 수 있는 미션 목록과 진행 상황을 보여줍니다.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useQuestStore } from '@/stores/quest'
import { useBadgeStore } from '@/stores/badge'

const router = useRouter()
const { t, te } = useI18n({ useScope: 'global' })
const questStore = useQuestStore()
const badgeStore = useBadgeStore()
import { resolveI18nText } from '@/utils/i18nResolver'
const scope = 'QuestHub_v2'

const navigateTo = (path) => {
  router.push(path)
}

onMounted(() => {
  logger.info(scope, '퀘스트 허브 진입')
  questStore.updateQuestProgress()
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-margin-mobile md:px-lg pt-12 relative z-10">
      <header class="mb-12 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/30">{{ t('common.activeMissions') }}</span>
          </div>
          <h1 class="text-display-lg font-display-lg leading-tight">{{ t('quests.todayMission') }}</h1>
        </div>
        <button @click="router.back()" class="p-3 bg-white/5 rounded-2xl border border-white/10">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- 퀘스트 목록 -->
      <div class="space-y-8">
        <div v-for="quest in questStore.processedQuests" :key="quest.id"
             class="glass-panel p-8 rounded-[2.5rem] border transition-all"
             :class="quest.isCompleted ? 'border-primary/40 bg-primary/5 shadow-2xl' : 'border-white/10 bg-white/5'">
          
          <div class="flex justify-between items-start mb-8">
             <div class="flex items-center gap-4">
                <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl ', 
                              quest.isCompleted ? 'bg-primary text-on-primary' : 'bg-white/10 text-on-surface-variant']">
                   <span class="material-symbols-outlined text-3xl">{{ quest.isCompleted ? 'task_alt' : 'assignment' }}</span>
                </div>
                <div>
                   <h3 class="text-xl font-bold">{{ resolveI18nText({ key: `quests.items.${quest.id}.title`, t, te, context: `quest:${quest.id}:title` }) }}</h3>
                   <p class="text-xs text-on-surface-variant mt-1">{{ resolveI18nText({ key: `quests.items.${quest.id}.description`, t, te, context: `quest:${quest.id}:desc` }) }}</p>
                </div>
             </div>
             <div v-if="quest.isCompleted" class="px-4 py-1.5 bg-primary text-on-primary text-[10px] font-black rounded-xl uppercase tracking-widest">{{ t('gamification.completed') }}</div>
             <div v-else class="text-right">
                <span class="text-2xl font-black text-primary">{{ quest.progress }}%</span>
             </div>
          </div>

          <!-- 진행도 바 -->
          <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
             <div class="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_#00f0ff]" :style="{ width: quest.progress + '%' }"></div>
          </div>

          <!-- 보상 정보 -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
             <div class="flex items-center gap-4">
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{{ t('quests.rewardBadge') }}:</span>
                <div class="flex items-center gap-2">
                   <span class="text-2xl">{{ badgeStore.processedBadges.find(b => b.id === quest.rewardBadgeId)?.icon }}</span>
                   <span class="font-bold text-sm">{{ resolveI18nText({ key: `badges.items.${quest.rewardBadgeId}.name`, t, te, context: `badge:${quest.rewardBadgeId}:name` }) }}</span>
                </div>
             </div>
             <button v-if="!quest.isCompleted" 
                     @click="navigateTo('/v2/map')"
                     class="px-8 py-3 bg-white/5 border border-white/10 text-on-surface rounded-xl font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2">
                {{ t('quests.goToMap') }} <span class="material-symbols-outlined text-sm">map</span>
             </button>
          </div>
        </div>
      </div>

      <!-- 보상 수령 안내 -->
      <section v-if="questStore.completedQuests.length > 0" class="mt-16 text-center py-12 border-t border-white/5">
         <p class="text-on-surface-variant font-medium mb-6">{{ t('quests.missionSuccessDesc') }}</p>
         <button @click="navigateTo('/v2/badges')"
                 class="px-10 py-5 bg-secondary text-on-secondary rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">{{ t('quests.viewBadgeBox') }}</button>
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
