<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 도착 성공 알림 뷰
 * AR 내비게이션을 통해 목적지에 도착했을 때 사용자에게 성공 메시지를 표시합니다.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const scope = 'ArrivalSuccess'

onMounted(() => {
  logger.info(scope, '목적지 도착 화면 표시')
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-surface-dark flex items-center justify-center p-lg">
    <div class="max-w-md w-full glass-panel p-xl rounded-[32px] text-center relative overflow-hidden">
      <!-- 배경 장식 -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10"></div>
      
      <div class="mb-xl relative inline-block">
        <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,219,233,0.6)]">
          <span class="material-symbols-outlined text-5xl text-on-primary">check_circle</span>
        </div>
        <div class="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
      </div>

      <h1 class="font-display-lg text-display-lg text-on-surface mb-md">{{ t('ar.success.title') }}</h1>
      <p class="font-body-lg text-on-surface-variant mb-xl leading-relaxed" v-html="t('ar.success.desc', { name: t('ar.success.mockName'), event: t('ar.success.mockEvent') })">
      </p>

      <div class="space-y-sm">
        <button 
          @click="goHome"
          class="w-full bg-primary text-on-primary py-lg rounded-2xl font-bold text-label-lg shadow-lg hover:scale-[0.98] transition-all"
        >
          {{ t('ar.success.goHome') }}
        </button>
        <button class="w-full bg-white/5 text-on-surface py-lg rounded-2xl font-bold text-label-lg border border-white/10 hover:bg-white/10 transition-all">
          {{ t('ar.success.viewNearby') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
