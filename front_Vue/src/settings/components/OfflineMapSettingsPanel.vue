<script setup>
import { useI18n } from 'vue-i18n'
import { useOfflineMapCache } from '../composables/useOfflineMapCache'

const { t } = useI18n()
const { offlineMap, startDownload, clearCache } = useOfflineMapCache()

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}
</script>

<template>
  <section class="space-y-md">
    <div class="flex items-center gap-md mb-md">
      <span class="material-symbols-outlined text-primary">download_for_offline</span>
      <h2 class="font-headline-md text-headline-md">{{ t('settings.device.offlineMap.title') }}</h2>
    </div>

    <div class="glass-panel rounded-2xl p-lg space-y-lg">
      <p class="text-sm text-on-surface-variant leading-relaxed">
        {{ t('settings.device.offlineMap.description') }}
      </p>

      <!-- 상태 요약 -->
      <div class="grid grid-cols-2 gap-md">
        <div class="p-md bg-white/5 rounded-xl border border-white/10">
          <p class="text-[10px] uppercase tracking-wider text-on-surface-variant opacity-70">{{ t('settings.device.offlineMap.cachedSize') }}</p>
          <p class="text-lg font-display-sm text-primary">{{ offlineMap.cachedSizeMb.toFixed(1) }} MB</p>
        </div>
        <div class="p-md bg-white/5 rounded-xl border border-white/10">
          <p class="text-[10px] uppercase tracking-wider text-on-surface-variant opacity-70">{{ t('settings.device.offlineMap.lastUpdate') }}</p>
          <p class="text-sm font-medium text-on-surface truncate">{{ formatDate(offlineMap.lastDownloadedAt) }}</p>
        </div>
      </div>

      <!-- 다운로드 진행바 -->
      <div v-if="offlineMap.isDownloading" class="space-y-sm">
        <div class="flex justify-between text-xs">
          <span class="text-primary font-medium">{{ t('settings.device.offlineMap.downloading') }}</span>
          <span class="text-on-surface-variant">{{ offlineMap.progress }}%</span>
        </div>
        <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" :style="{ width: `${offlineMap.progress}%` }"></div>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div class="flex flex-col sm:flex-row gap-md">
        <button 
          @click="startDownload"
          :disabled="offlineMap.isDownloading"
          class="flex-1 px-lg py-3 rounded-xl bg-primary text-on-primary font-label-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-sm shadow-lg shadow-primary/20"
        >
          <span class="material-symbols-outlined text-xl">{{ offlineMap.status === 'ready' ? 'sync' : 'cloud_download' }}</span>
          {{ offlineMap.status === 'ready' ? t('settings.device.offlineMap.update') : t('settings.device.offlineMap.download') }}
        </button>
        
        <button 
          v-if="offlineMap.status === 'ready'"
          @click="clearCache"
          class="px-lg py-3 rounded-xl border border-status-high/30 text-status-high font-label-lg hover:bg-status-high/10 transition-all flex items-center justify-center gap-sm"
        >
          <span class="material-symbols-outlined text-xl">delete</span>
          {{ t('settings.device.offlineMap.clear') }}
        </button>
      </div>

      <div v-if="offlineMap.status === 'ready'" class="flex items-center gap-sm text-status-low text-xs">
        <span class="material-symbols-outlined text-sm">check_circle</span>
        <span>{{ t('settings.device.offlineMap.ready') }} ({{ offlineMap.cachedAssetCount }} items)</span>
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
