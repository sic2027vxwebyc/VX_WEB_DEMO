<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useBiometricLock } from '../composables/useBiometricLock'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { verifyAndUnlock } = useBiometricLock()

const isVerifying = ref(false)
const error = ref(null)

const handleUnlock = async () => {
  isVerifying.value = true
  error.value = null
  
  try {
    const success = await verifyAndUnlock()
    if (success) {
      const redirectPath = route.query.redirect || '/admin'
      logger.info('AdminUnlockView', `인증 성공 - ${redirectPath}로 이동`)
      router.replace(redirectPath)
    } else {
      error.value = t('settings.device.biometric.fail')
    }
  } catch (e) {
    logger.error('AdminUnlockView', '잠금 해제 중 오류', e)
    error.value = t('settings.device.biometric.error')
  } finally {
    isVerifying.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] bg-surface-dark flex flex-col items-center justify-center p-xl text-center">
    <div class="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-xl animate-pulse">
      <span class="material-symbols-outlined text-5xl">lock</span>
    </div>

    <h1 class="font-display-lg text-display-lg text-on-surface mb-md">
      {{ t('settings.device.biometric.lockedTitle') }}
    </h1>
    <p class="text-on-surface-variant mb-xl max-w-xs">
      {{ t('settings.device.biometric.lockedSubtitle') }}
    </p>

    <div v-if="error" class="mb-lg p-md bg-status-high/20 text-status-high rounded-xl border border-status-high/30 text-sm">
      {{ error }}
    </div>

    <button 
      @click="handleUnlock"
      :disabled="isVerifying"
      class="w-full max-w-xs px-lg py-4 rounded-2xl bg-primary text-on-primary font-label-lg flex items-center justify-center gap-md hover:brightness-110 disabled:opacity-50 transition-all shadow-xl shadow-primary/30"
    >
      <span v-if="isVerifying" class="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
      <span v-else class="material-symbols-outlined">fingerprint</span>
      {{ isVerifying ? t('common.processing') : t('settings.device.biometric.unlock') }}
    </button>
    
    <router-link to="/" class="mt-xl text-on-surface-variant hover:text-primary transition-colors text-label-md underline underline-offset-4">
      {{ t('navigation.home') }}
    </router-link>
  </div>
</template>

<style scoped>
</style>
