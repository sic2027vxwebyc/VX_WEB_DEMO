<script setup>
import { ref, watch } from 'vue'
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { selectedSecurityLog, handleUpdateLogStatus } = useSecurityTelemetry()

const statusOptions = ['new', 'reviewing', 'resolved', 'ignored']
const status = ref('new')
const memo = ref('')

watch(selectedSecurityLog, (newVal) => {
  if (newVal) {
    status.value = newVal.status
    memo.value = newVal.memo || ''
  }
}, { immediate: true })

const isUpdating = ref(false)

const updateStatus = async () => {
  if (!selectedSecurityLog.value) return
  isUpdating.value = true
  try {
    await handleUpdateLogStatus(selectedSecurityLog.value.id, status.value, memo.value)
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full flex flex-col">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.security.eventDetailTitle') }}</h3>
    </div>

    <div v-if="!selectedSecurityLog" class="flex-1 flex flex-col items-center justify-center text-white/20 space-y-4">
      <svg class="w-16 h-16 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <p class="text-sm">{{ $t('admin.security.selectLogToView') }}</p>
    </div>

    <div v-else class="flex-1 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <p class="text-[10px] text-white/30 uppercase mb-1">{{ $t('admin.security.fields.deviceId') }}</p>
          <p class="text-white text-sm font-mono">{{ selectedSecurityLog.deviceId }}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <p class="text-[10px] text-white/30 uppercase mb-1">{{ $t('admin.security.fields.space') }}</p>
          <p class="text-white text-sm">{{ selectedSecurityLog.spaceId }}</p>
        </div>
      </div>

      <div>
        <label class="block text-xs text-white/40 mb-2 uppercase font-bold">{{ $t('admin.security.eventStatusTitle') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="opt in statusOptions" 
            :key="opt"
            @click="status = opt"
            :class="[
              'px-3 py-2 rounded-lg text-xs font-medium transition-all border',
              status === opt 
                ? 'bg-white text-black border-white' 
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
            ]"
          >
            {{ $t(`admin.security.eventStatus.${opt}`) }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-xs text-white/40 mb-2 uppercase font-bold">{{ $t('admin.security.fields.memo') }}</label>
        <textarea 
          v-model="memo"
          rows="4"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          :placeholder="$t('admin.security.memoPlaceholder')"
        ></textarea>
      </div>

      <button 
        @click="updateStatus"
        :disabled="isUpdating"
        class="w-full py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
      >
        <span v-if="isUpdating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ $t('admin.security.updateStatusButton') }}
      </button>
    </div>
  </div>
</template>
