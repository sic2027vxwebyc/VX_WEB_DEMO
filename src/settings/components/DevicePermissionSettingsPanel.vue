<script setup>
import { useI18n } from 'vue-i18n'
import { useDevicePermissions } from '../composables/useDevicePermissions'
import PermissionStatusCard from './PermissionStatusCard.vue'

const { t } = useI18n()
const { permissions, requestPermission } = useDevicePermissions()
</script>

<template>
  <section class="space-y-md">
    <div class="flex items-center gap-md mb-md">
      <span class="material-symbols-outlined text-primary">settings_applications</span>
      <h2 class="font-headline-md text-headline-md">{{ t('settings.device.permissions.title') }}</h2>
    </div>

    <div class="glass-panel rounded-2xl p-lg space-y-md">
      <p class="text-sm text-on-surface-variant leading-relaxed mb-md">
        {{ t('settings.device.permissions.description') }}
      </p>

      <div class="space-y-md">
        <PermissionStatusCard 
          type="camera" 
          :status="permissions.camera" 
          @request="requestPermission"
        />
        <PermissionStatusCard 
          type="location" 
          :status="permissions.location" 
          @request="requestPermission"
        />
        <PermissionStatusCard 
          type="push" 
          :status="permissions.push" 
          @request="requestPermission"
        />
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
