<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 연결 오류 안내 뷰
 * 네트워크 불안정 또는 서버 연결 실패 시 사용자에게 재시도 옵션과 함께 안내합니다.
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n({ useScope: 'global' })
const scope = 'ConnectionError'

const retry = () => {
  logger.info(scope, '연결 재시도')
  location.reload()
}

onMounted(() => {
  logger.warn(scope, '네트워크 끊김 감지')
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark flex items-center justify-center p-lg text-center">
    <div class="max-w-md w-full space-y-xl">
      <div class="relative inline-block">
        <span class="material-symbols-outlined text-[120px] text-on-surface-variant opacity-20">cloud_off</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="material-symbols-outlined text-4xl text-status-moderate animate-bounce">satellite_alt</span>
        </div>
      </div>

      <div>
        <h1 class="font-display-lg text-display-lg text-on-surface mb-md">{{ t('errors.connection.title') }}</h1>
        <p class="font-body-lg text-on-surface-variant leading-relaxed">
          {{ t('errors.connection.desc') }}
        </p>
      </div>

      <div class="flex flex-col gap-sm">
        <button 
          @click="retry"
          class="w-full bg-primary text-on-primary py-lg rounded-2xl font-bold text-label-lg flex items-center justify-center gap-md"
        >
          <span class="material-symbols-outlined">refresh</span>
          {{ t('errors.connection.retry') }}
        </button>
        <button class="w-full bg-white/5 text-on-surface py-lg rounded-2xl font-bold text-label-lg border border-white/10">
          {{ t('errors.connection.offlineMap') }}
        </button>
      </div>
      
      <p class="text-label-sm text-on-surface-variant opacity-50">{{ t('errors.connection.errorCode', { code: 'ERR_VX_NODE_TIMEOUT' }) }}</p>
    </div>
  </div>
</template>
