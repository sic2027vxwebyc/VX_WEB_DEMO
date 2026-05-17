<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'

const { t } = useI18n()
const store = useOperationalIntelligenceStore()

const selectedSpaceId = ref('')
const selectedStatus = ref('open')
const reason = ref('')
const expectedTime = ref('')

const applyRestriction = () => {
  if (!selectedSpaceId.value) return
  if (selectedStatus.value === 'open') {
    store.clearRestrictedArea(selectedSpaceId.value)
  } else {
    store.setRestrictedArea(selectedSpaceId.value, selectedStatus.value, reason.value, expectedTime.value)
  }
  // 폼 초기화
  reason.value = ''
  expectedTime.value = ''
}
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10">
    <div class="flex items-center gap-sm mb-md">
      <span class="material-symbols-outlined text-security-alert">lock</span>
      <h3 class="font-label-md text-on-surface">{{ t('admin.operations.restrictedAreas') }}</h3>
    </div>

    <div class="space-y-md">
      <!-- 공간 선택 -->
      <div class="space-y-xs">
        <label class="text-[10px] text-on-surface-variant uppercase tracking-wider">{{ t('admin.operations.controls.selectSpace') }}</label>
        <select v-model="selectedSpaceId" class="w-full bg-surface-dark border border-white/10 rounded-lg px-md py-sm text-sm text-on-surface focus:border-security-alert outline-none appearance-none">
          <option value="">-- Restricted Zone --</option>
          <option v-for="zone in store.zones" :key="zone.id" :value="zone.id">
            {{ t(zone.nameKey) }}
          </option>
        </select>
      </div>

      <!-- 상태 선택 -->
      <div class="space-y-xs">
        <div class="grid grid-cols-4 gap-xs">
          <button v-for="status in ['open', 'limited', 'restricted', 'closed']" :key="status"
                  @click="selectedStatus = status"
                  class="px-xs py-sm rounded border text-[10px] transition-all capitalize"
                  :class="selectedStatus === status ? 'bg-security-alert/20 border-security-alert text-security-alert' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'">
            {{ t('admin.operations.access.' + status) }}
          </button>
        </div>
      </div>

      <!-- 사유 및 시간 -->
      <div v-if="selectedStatus !== 'open'" class="grid grid-cols-2 gap-sm animate-in fade-in slide-in-from-top-2">
        <div class="space-y-xs">
          <label class="text-[9px] text-on-surface-variant uppercase tracking-wider">{{ t('admin.operations.controls.reason') }}</label>
          <input v-model="reason" type="text" placeholder="Reason" class="w-full bg-white/5 border border-white/10 rounded px-sm py-xs text-[10px] outline-none focus:border-security-alert" />
        </div>
        <div class="space-y-xs">
          <label class="text-[9px] text-on-surface-variant uppercase tracking-wider">{{ t('admin.operations.controls.expectedTime') }}</label>
          <input v-model="expectedTime" type="text" placeholder="14:00" class="w-full bg-white/5 border border-white/10 rounded px-sm py-xs text-[10px] outline-none focus:border-security-alert" />
        </div>
      </div>

      <button @click="applyRestriction" :disabled="!selectedSpaceId"
              class="w-full bg-security-alert text-white py-sm rounded-lg font-label-md shadow-[0_4px_15px_rgba(255,0,51,0.2)] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all">
        {{ t('admin.operations.controls.apply') }}
      </button>
    </div>
  </div>
</template>
