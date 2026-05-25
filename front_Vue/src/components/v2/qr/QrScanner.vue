<template>
  <div class="qr-scanner-container bg-surface-container rounded-lg p-md">
    <h2 class="text-headline-md text-on-surface">{{ t('qr.scannerTitle') }}</h2>
    <div class="scanner-viewport bg-black aspect-square rounded-md overflow-hidden mt-md">
      <!-- Mock Scanner UI -->
      <div class="absolute inset-0 flex items-center justify-center text-primary/50">
        <span class="material-symbols-outlined text-6xl">qr_code_scanner</span>
      </div>
    </div>
    <button @click="handleMockScan" class="mt-md w-full py-sm bg-primary text-on-primary rounded-lg">
      {{ t('qr.scanButton') }}
    </button>
  </div>
</template>

<script setup>
import { useQuestStore } from '@/stores/quest';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const questStore = useQuestStore();

const handleMockScan = async () => {
  // Mock Token and GPS
  const token = 'valid-token-' + Date.now();
  const gps = { lat: 37.0, lng: 127.0 };
  
  await questStore.scanQr(token, gps);
};
</script>
