<script setup>
/**
 * [ AR 폴백 패널 컴포넌트 ]
 * AR 기능을 사용할 수 없는 환경(권한 거부, 기기 미지원 등)에서
 * 사용자에게 대체 안내 수단(2D 지도, QR 등)을 제안합니다.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const props = defineProps({
  reason: {
    type: String,
    default: 'unsupported' // 'denied', 'unsupported', 'error'
  }
})

const emit = defineEmits(['useMap', 'useQr'])
const { t } = useI18n()

const scope = 'ArFallback'

const message = computed(() => {
  switch (props.reason) {
    case 'denied':
      return {
        title: t('map.fallback.cameraDenied'),
        desc: t('map.fallback.cameraDeniedDesc'),
        icon: 'no_photography'
      }
    case 'unsupported':
      return {
        title: t('map.fallback.unsupported'),
        desc: t('map.fallback.unsupportedDesc'),
        icon: 'browser_not_supported'
      }
    default:
      return {
        title: t('map.fallback.error'),
        desc: t('map.fallback.errorDesc'),
        icon: 'error'
      }
  }
})

const handleUseMap = () => {
  logger.info(scope, '사용자가 폴백 수단으로 일반 지도를 선택했습니다.')
  emit('useMap')
}

const handleUseQr = () => {
  logger.info(scope, '사용자가 폴백 수단으로 QR 위치 인식을 선택했습니다.')
  emit('useQr')
}
</script>

<template>
  <div class="glass-panel p-lg rounded-3xl border border-status-moderate/30 bg-status-moderate/5 shadow-xl">
    <div class="flex items-start gap-lg">
      <div class="w-14 h-14 rounded-2xl bg-status-moderate/10 flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-status-moderate text-3xl">{{ message.icon }}</span>
      </div>
      <div class="flex-grow">
        <h3 class="font-headline-sm text-surface-dark dark:text-on-surface mb-xs">{{ message.title }}</h3>
        <p class="text-on-surface-variant font-body-md leading-relaxed mb-lg">
          {{ message.desc }}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-md">
          <button 
            @click="handleUseMap"
            class="flex-1 bg-surface-dark dark:bg-on-surface text-on-primary dark:text-surface-dark py-md rounded-xl font-bold flex items-center justify-center gap-sm active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined">map</span>
            {{ t('map.fallback.useMap') }}
          </button>
          <button 
            @click="handleUseQr"
            class="flex-1 border border-outline py-md rounded-xl font-bold text-on-surface-variant flex items-center justify-center gap-sm hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined">qr_code_scanner</span>
            {{ t('map.fallback.useQr') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
