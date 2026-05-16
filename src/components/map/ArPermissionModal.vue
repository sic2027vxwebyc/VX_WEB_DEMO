<script setup>
/**
 * [ AR 권한 확인 모달 컴포넌트 ]
 * AR 내비게이션 진입 전 카메라 및 위치 권한 동의를 받습니다.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'confirm', 'deny'])
const { t } = useI18n({ useScope: 'global' })

const scope = 'ArPermissionModal'

const currentStep = ref(1) // 1: 권한 안내, 2: 카메라 요청 중, 3: 위치 요청 중

const handleConfirm = () => {
  logger.info(scope, '사용자가 AR 권한 동의 절차를 시작했습니다.')
  emit('confirm')
}

const handleDeny = () => {
  logger.info(scope, '사용자가 AR 권한 동의를 거절했습니다.')
  emit('deny')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/60 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-sm rounded-[32px] p-lg shadow-2xl border border-primary/20 overflow-hidden relative">
        <!-- 배경 장식 -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex flex-col items-center text-center mb-lg">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-md shadow-[0_0_30px_rgba(0,219,233,0.2)]">
              <span class="material-symbols-outlined text-primary text-4xl animate-pulse">view_in_ar</span>
            </div>
            <h2 class="font-headline-md text-surface-dark dark:text-on-surface mb-xs">{{ t('ar.permissions.title') }}</h2>
            <p class="text-on-surface-variant font-body-md">{{ t('ar.permissions.desc') }}</p>
          </div>

          <div class="space-y-md mb-xl">
            <div class="flex items-start gap-md p-md rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span class="material-symbols-outlined text-primary">videocam</span>
              <div class="text-left">
                <p class="font-label-lg text-surface-dark dark:text-on-surface">{{ t('ar.permissions.camera') }}</p>
                <p class="text-[12px] text-on-surface-variant leading-tight">{{ t('ar.permissions.cameraDesc') }}</p>
              </div>
            </div>
            
            <div class="flex items-start gap-md p-md rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span class="material-symbols-outlined text-primary">location_on</span>
              <div class="text-left">
                <p class="font-label-lg text-surface-dark dark:text-on-surface">{{ t('ar.permissions.location') }}</p>
                <p class="text-[12px] text-on-surface-variant leading-tight">{{ t('ar.permissions.locationDesc') }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-sm">
            <button 
              @click="handleConfirm"
              class="w-full bg-primary text-on-primary py-lg rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-md"
            >
              <span class="material-symbols-outlined">check_circle</span>
              {{ t('ar.permissions.confirm') }}
            </button>
            <button 
              @click="handleDeny"
              class="w-full py-md rounded-2xl font-bold text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-[0.98]"
            >
              {{ t('ar.permissions.deny') }}
            </button>
          </div>

          <p class="text-[11px] text-on-surface-variant opacity-60 text-center mt-lg">
            {{ t('ar.permissions.safety') }}
          </p>
        </div>

        <button @click="handleClose" class="absolute top-md right-md p-2 text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
