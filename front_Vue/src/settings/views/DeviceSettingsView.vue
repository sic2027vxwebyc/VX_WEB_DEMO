<script setup>
import { useI18n } from 'vue-i18n'
import OfflineMapSettingsPanel from '../components/OfflineMapSettingsPanel.vue'
import BiometricLockSettingsPanel from '../components/BiometricLockSettingsPanel.vue'
import DevicePermissionSettingsPanel from '../components/DevicePermissionSettingsPanel.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-surface-light dark:bg-surface-dark text-surface-dark dark:text-on-surface p-safe-top pb-32 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-lg pt-xl">
      <!-- 헤더 -->
      <header class="mb-xl px-lg">
        <router-link to="/settings" class="inline-flex items-center gap-xs text-primary mb-md hover:underline">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span class="text-label-md">{{ t('settings.title') }}</span>
        </router-link>
        <h1 class="font-display-lg text-display-lg text-primary">{{ t('settings.device.title') }}</h1>
        <p class="font-body-lg text-on-surface-variant">{{ t('settings.device.subtitle') }}</p>
      </header>

      <div class="space-y-2xl pb-24">
        <!-- 1. 오프라인 지도 -->
        <div class="px-lg">
          <OfflineMapSettingsPanel />
        </div>

        <!-- 2. 생체 인식 -->
        <div class="px-lg">
          <BiometricLockSettingsPanel />
        </div>

        <!-- 3. 권한 설정 -->
        <div class="px-lg">
          <DevicePermissionSettingsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
