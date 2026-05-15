<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const scope = 'AccessRestricted'

onMounted(() => {
  logger.error(scope, '비인가 구역 접근 시도 감지')
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark flex items-center justify-center p-lg">
    <div class="max-w-md w-full glass-panel p-xl rounded-[32px] text-center border border-security-alert/30">
      <div class="mb-xl">
        <div class="w-24 h-24 bg-security-alert/20 rounded-full flex items-center justify-center mx-auto border border-security-alert/40 shadow-[0_0_40px_rgba(255,0,51,0.2)]">
          <span class="material-symbols-outlined text-5xl text-security-alert animate-pulse">lock_person</span>
        </div>
      </div>

      <h1 class="font-display-lg text-display-lg text-security-alert mb-md">{{ t('errors.restricted.title') }}</h1>
      <p class="font-body-lg text-on-surface-variant mb-xl leading-relaxed" v-html="t('errors.restricted.desc', { level: 'L2', gate: 'Gate 1' })">
      </p>

      <div class="space-y-sm">
        <router-link 
          to="/map"
          class="block w-full bg-security-alert text-white py-lg rounded-2xl font-bold text-label-lg shadow-lg hover:scale-[0.98] transition-all"
        >
          {{ t('errors.restricted.bypass') }}
        </router-link>
        <button class="w-full bg-white/5 text-on-surface py-lg rounded-2xl font-bold text-label-lg border border-white/10 hover:bg-white/10 transition-all">
          {{ t('errors.restricted.callSecurity') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}
</style>
