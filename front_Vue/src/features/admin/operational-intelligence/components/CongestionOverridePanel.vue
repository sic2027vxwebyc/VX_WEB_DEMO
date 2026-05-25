<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'

const { t } = useI18n()
const store = useOperationalIntelligenceStore()

const selectedSpaceId = ref('')
const selectedLevel = ref('auto')

const applyOverride = () => {
  if (!selectedSpaceId.value) return
  if (selectedLevel.value === 'auto') {
    store.clearCongestionOverride(selectedSpaceId.value)
  } else {
    store.setCongestionOverride(selectedSpaceId.value, selectedLevel.value)
  }
}
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10">
    <div class="flex items-center gap-sm mb-md">
      <span class="material-symbols-outlined text-primary">tune</span>
      <h3 class="font-label-md text-on-surface">{{ t('admin.operations.manualOverride') }}</h3>
    </div>

    <div class="space-y-md">
      <!-- 공간 선택 -->
      <div class="space-y-xs">
        <label class="text-[10px] text-on-surface-variant uppercase tracking-wider">{{ t('admin.operations.controls.selectSpace') }}</label>
        <select v-model="selectedSpaceId" class="w-full bg-surface-dark border border-white/10 rounded-lg px-md py-sm text-sm text-on-surface focus:border-primary outline-none appearance-none">
          <option value="">-- Space --</option>
          <option v-for="zone in store.zones" :key="zone.id" :value="zone.id">
            {{ t(zone.nameKey) }}
          </option>
        </select>
      </div>

      <!-- 혼잡도 선택 -->
      <div class="space-y-xs">
        <label class="text-[10px] text-on-surface-variant uppercase tracking-wider">{{ t('admin.operations.controls.currentStatus') }}</label>
        <div class="grid grid-cols-3 gap-xs">
          <button v-for="level in ['auto', 'low', 'moderate', 'high', 'critical']" :key="level"
                  @click="selectedLevel = level"
                  class="px-xs py-sm rounded border text-[10px] transition-all capitalize"
                  :class="selectedLevel === level ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'">
            {{ t('admin.operations.congestion.' + level) }}
          </button>
        </div>
      </div>

      <button @click="applyOverride" :disabled="!selectedSpaceId"
              class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md shadow-[0_4px_15px_rgba(0,219,233,0.3)] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all">
        {{ t('admin.operations.controls.apply') }}
      </button>
    </div>
  </div>
</template>
