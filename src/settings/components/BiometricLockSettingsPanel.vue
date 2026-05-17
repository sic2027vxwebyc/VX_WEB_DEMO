<script setup>
import { useI18n } from 'vue-i18n'
import { useBiometricLock } from '../composables/useBiometricLock'

const { t } = useI18n()
const { biometric, toggleLock } = useBiometricLock()
</script>

<template>
  <section class="space-y-md">
    <div class="flex items-center gap-md mb-md">
      <span class="material-symbols-outlined text-primary">fingerprint</span>
      <h2 class="font-headline-md text-headline-md">{{ t('settings.device.biometric.title') }}</h2>
    </div>

    <div class="glass-panel rounded-2xl p-lg space-y-lg">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-label-lg">{{ t('settings.device.biometric.enable') }}</p>
          <p class="text-sm text-on-surface-variant mt-xs">
            {{ t('settings.device.biometric.description') }}
          </p>
        </div>
        <div 
          @click="toggleLock(!biometric.biometricLockEnabled)"
          class="w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0"
          :class="biometric.biometricLockEnabled ? 'bg-primary' : 'bg-white/10'"
        >
          <div 
            class="absolute top-1 w-4 h-4 rounded-full transition-all shadow-sm"
            :class="biometric.biometricLockEnabled ? 'right-1 bg-on-primary' : 'left-1 bg-on-surface-variant'"
          ></div>
        </div>
      </div>

      <div v-if="!biometric.webAuthnSupported" class="flex items-start gap-sm p-md bg-status-moderate/10 rounded-xl border border-status-moderate/20">
        <span class="material-symbols-outlined text-status-moderate text-xl">info</span>
        <p class="text-xs text-status-moderate">
          {{ t('settings.device.biometric.unsupportedNote') }}
        </p>
      </div>

      <div v-else-if="biometric.biometricLockEnabled" class="flex items-center gap-sm text-status-low text-xs bg-status-low/10 p-md rounded-xl border border-status-low/20">
        <span class="material-symbols-outlined text-sm">verified_user</span>
        <span>{{ t('settings.device.biometric.active') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
