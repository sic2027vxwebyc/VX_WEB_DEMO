<script setup>
/**
 * [ 보상 수령 안내 ]
 * 챌린지를 완료한 사용자가 기념품을 수령할 수 있도록 안내합니다.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useStampStore } from '@/stores/stamp'
import { usePassportStore } from '@/stores/passport'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const stampStore = useStampStore()
const passportStore = usePassportStore()
const scope = 'RewardClaim_v2'

onMounted(() => {
  logger.info(scope, '보상 안내 화면 진입')
})

const handleClaim = () => {
  if (passportStore.markRewardClaimed()) {
    logger.info(scope, '보상 수령 처리 완료')
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-4xl mx-auto px-margin-mobile md:px-lg pt-12 relative z-10">
      <header class="mb-12 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/30">{{ t('common.rewardCenter') }}</span>
          </div>
          <h1 class="text-display-lg font-display-lg leading-tight">{{ t('reward.title') }}</h1>
        </div>
        <button @click="router.back()" class="p-3 bg-white/5 rounded-2xl border border-white/10">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- 수령 가능 상태 -->
      <div v-if="stampStore.isCompletedAll" class="space-y-8">
        <section class="glass-panel p-10 rounded-[3rem] border border-primary/30 bg-primary/5 text-center">
           <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-5xl mx-auto mb-8 shadow-[0_0_50px_rgba(0,219,233,0.5)]">
              🎁
           </div>
           <h2 class="text-3xl font-black mb-4">{{ t('reward.congratulations') }}</h2>
           <p class="text-lg text-on-surface-variant font-medium leading-relaxed mb-12" v-html="t('reward.rewardGuide')"></p>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
              <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
                 <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">{{ t('reward.claimLocation') }}</span>
                 <p class="font-bold">{{ t('reward.locationDetail') }}</p>
                 <p class="text-xs text-on-surface-variant mt-1">{{ t('reward.locationSubDetail') }}</p>
              </div>
              <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
                 <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">{{ t('reward.operatingHours') }}</span>
                 <p class="font-bold">09:00 - 18:00</p>
                 <p class="text-xs text-on-surface-variant mt-1">{{ t('reward.hoursDetail') }}</p>
              </div>
           </div>

           <div class="space-y-4">
              <button @click="router.push('/route-guide/gift-zone')"
                      class="w-full py-6 bg-primary text-on-primary rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all">{{ t('reward.goToGiftZone') }}</button>
              
              <button v-if="!passportStore.rewardClaimed"
                      @click="handleClaim"
                      class="w-full py-5 bg-white/5 border border-white/10 text-on-surface rounded-3xl font-bold hover:bg-white/10 transition-all">
                {{ t('reward.demoClaimAction') }}
              </button>
              <div v-else class="p-5 bg-status-low/20 border border-status-low/30 rounded-3xl text-status-low font-bold">
                 {{ t('reward.alreadyClaimed') }}
              </div>
           </div>
        </section>
      </div>

      <!-- 수령 불가능 상태 -->
      <div v-else class="text-center py-32 glass-panel rounded-[3rem] border border-white/5 bg-white/5">
         <span class="material-symbols-outlined text-8xl text-white/10 mb-8">lock</span>
         <h2 class="text-2xl font-bold mb-4">{{ t('reward.notCompleteYet') }}</h2>
         <p class="text-on-surface-variant font-medium mb-12" v-html="t('reward.notCompleteDesc', { current: stampStore.collectedStampCount, total: 20 })"></p>
         <button @click="router.push('/v2/stamp-event')"
                 class="px-12 py-5 bg-white text-surface-dark rounded-2xl font-black shadow-xl hover:scale-105 transition-all">{{ t('reward.continueChallenge') }}</button>
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
