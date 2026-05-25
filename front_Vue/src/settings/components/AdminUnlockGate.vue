<script setup>
import { useBiometricLock } from '../composables/useBiometricLock'
import AdminUnlockView from '../views/AdminUnlockView.vue'

const { biometric, isAdminLocked } = useBiometricLock()
</script>

<template>
  <template v-if="biometric.biometricLockEnabled && isAdminLocked">
    <AdminUnlockView />
  </template>
  <template v-else>
    <slot />
  </template>
</template>
